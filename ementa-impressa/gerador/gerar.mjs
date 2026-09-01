import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as esperar } from "node:timers/promises";

/*
  Gera o PDF da ementa impressa com o mesmo motor que fez o ficheiro bom:
  Chrome for Testing 151, o que está em cache do Puppeteer.

  Sem dependências: o Node 26 traz WebSocket nativo, e o DevTools Protocol
  chega-se por aí. As definições são as do ementa-impressa/LEIA-ME.md —
  216 x 303 mm, margens 0 (estão no próprio ficheiro) e fundos ligados, que é o que
  faz o papel sair em pergaminho em vez de branco.
*/

const CHROME = process.argv[2];
const ENTRADA = process.argv[3];
const SAIDA = process.argv[4];
const PORTA = 9333;

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORTA}`,
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  "--user-data-dir=" + mkdtempSync(join(tmpdir(), "chrome-ementa-")),
  "--no-first-run",
  "--no-default-browser-check",
], { stdio: "ignore" });

async function versao() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
      if (r.ok) return await r.json();
    } catch {}
    await esperar(250);
  }
  throw new Error("o Chrome não abriu a porta de depuração");
}

const { webSocketDebuggerUrl } = await versao();
const ws = new WebSocket(webSocketDebuggerUrl);
await new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = mal; });

let id = 0;
const pendentes = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pendentes.has(m.id)) {
    const { ok, mal } = pendentes.get(m.id);
    pendentes.delete(m.id);
    m.error ? mal(new Error(JSON.stringify(m.error))) : ok(m.result);
  }
};
const enviar = (method, params = {}, sessionId) =>
  new Promise((ok, mal) => {
    const n = ++id;
    pendentes.set(n, { ok, mal });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });

const { targetId } = await enviar("Target.createTarget", { url: "about:blank" });
const { sessionId } = await enviar("Target.attachToTarget", { targetId, flatten: true });

await enviar("Page.enable", {}, sessionId);
await enviar("Page.navigate", { url: ENTRADA }, sessionId);

/* As fontes vão embebidas em base64; mesmo assim espera-se que estejam prontas. */
await esperar(1500);
await enviar("Runtime.evaluate", {
  expression: "document.fonts.ready.then(() => true)",
  awaitPromise: true,
}, sessionId);
await esperar(500);

/*
  O PDF vem **por fluxo**, e não numa trama única.

  Com `ReturnAsBase64` a resposta são vinte e tal megabytes de base64 numa só
  mensagem de WebSocket, e o `WebSocket` nativo do Node fica lá — sem erro,
  sem nada, com o processo a 0% e o ficheiro por escrever. Aos pedaços de
  256 KB não há trama grande nenhuma.
*/
const { stream } = await enviar("Page.printToPDF", {
  printBackground: true,      // sem isto sai branco, sem pergaminho
  paperWidth: 8.5039,         // 216mm — A4 mais 3mm de sangria de cada lado
  paperHeight: 11.9291,       // 303mm
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
  transferMode: "ReturnAsStream",
}, sessionId);

const pedacos = [];
for (;;) {
  const r = await enviar("IO.read", { handle: stream, size: 262144 }, sessionId);
  if (r.data) pedacos.push(Buffer.from(r.data, r.base64Encoded ? "base64" : "utf8"));
  if (r.eof) break;
}
await enviar("IO.close", { handle: stream }, sessionId);

writeFileSync(SAIDA, Buffer.concat(pedacos));
console.log("escrito:", SAIDA);

ws.close();
chrome.kill();
process.exit(0);
