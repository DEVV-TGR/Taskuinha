import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as esperar } from "node:timers/promises";

const [CHROME, ENTRADA, SAIDA, N] = process.argv.slice(2);
const PORTA = 9344;
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORTA}`,
  "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
  "--user-data-dir=" + process.env.TMPDIR + "chrome-foto"], { stdio: "ignore" });

async function versao() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`); if (r.ok) return r.json(); } catch {}
    await esperar(250);
  }
  throw new Error("Chrome não abriu");
}
const { webSocketDebuggerUrl } = await versao();
const ws = new WebSocket(webSocketDebuggerUrl);
await new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = mal; });
let id = 0; const pend = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { const { ok, mal } = pend.get(m.id); pend.delete(m.id);
    m.error ? mal(new Error(JSON.stringify(m.error))) : ok(m.result); } };
const cmd = (method, params = {}, sessionId) => new Promise((ok, mal) => {
  const n = ++id; pend.set(n, { ok, mal }); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });

const { targetId } = await cmd("Target.createTarget", { url: "about:blank" });
const { sessionId } = await cmd("Target.attachToTarget", { targetId, flatten: true });
await cmd("Page.enable", {}, sessionId);
/* 210mm a 96dpi = 793,7 px. ×2 para ver o detalhe. */
await cmd("Emulation.setDeviceMetricsOverride",
  { width: 794, height: 1123, deviceScaleFactor: 2, mobile: false }, sessionId);
await cmd("Page.navigate", { url: ENTRADA }, sessionId);
await esperar(2000);
await cmd("Runtime.evaluate", { expression: "document.fonts.ready.then(()=>1)", awaitPromise: true }, sessionId);
/* posição da folha pedida */
const { result } = await cmd("Runtime.evaluate", { expression:
  `(() => { const s = document.querySelectorAll('.folha')[${Number(N) - 1}];
     const r = s.getBoundingClientRect();
     return JSON.stringify({x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height}); })()`,
  returnByValue: true }, sessionId);
const c = JSON.parse(result.value);
const { data } = await cmd("Page.captureScreenshot",
  { format: "png", clip: { x: c.x, y: c.y, width: c.w, height: c.h, scale: 1 },
    captureBeyondViewport: true }, sessionId);
writeFileSync(SAIDA, Buffer.from(data, "base64"));
console.log("foto:", SAIDA);
ws.close(); chrome.kill(); process.exit(0);
