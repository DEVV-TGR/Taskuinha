import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as esperar } from "node:timers/promises";

/*
  Gera o PDF da ementa impressa com o mesmo motor que fez o ficheiro bom:
  Chrome for Testing 151, o que está em cache do Puppeteer.

  Sem dependências: o Node 26 traz WebSocket nativo, e o DevTools Protocol
  chega-se por aí. As definições são as do ementa-impressa/LEIA-ME.md —
  A4, margens 0 (estão no próprio ficheiro) e fundos ligados, que é o que
  faz o papel sair em pergaminho em vez de branco.
*/

const CHROME = process.argv[2];
const ENTRADA = process.argv[3];
const SAIDA = process.argv[4];
const PORTA = 9333;

/*
  Opcionais: a largura e a altura da folha, **em milímetros**.

      node gerar.mjs CHROME entrada.html saida.pdf 74 105

  Sem eles, manda o `@page` do próprio ficheiro (`preferCSSPageSize`), que é o
  que a ementa faz e sempre fez.

  Com eles, o `@page` é ignorado e o tamanho vai cravado. **A diferença não é
  cosmética.** Com `preferCSSPageSize`, o Chrome lê o `@page` e alinha a folha a
  píxeis do dispositivo, sempre para cima: um cartão de 74 × 105 mm saía numa
  folha de 74,08 × 105,15, e o conteúdo — que o Chrome desenha nos 105 mm que a
  CSS pediu — deixava 0,12 mm de papel branco por pintar numa aresta. Numa
  ementa com 3 mm de sangria isso desaparece no corte; num autocolante sem
  sangria, fica lá.

  Declarar a página em pontos em vez de milímetros não resolve — o
  arredondamento é do Chrome e vem depois da conversão. Passar as medidas por
  aqui resolve.
*/
const LARG_MM = process.argv[5] ? Number(process.argv[5]) : null;
const ALT_MM = process.argv[6] ? Number(process.argv[6]) : null;
const MEDIDAS = LARG_MM && ALT_MM;
if ((process.argv[5] || process.argv[6]) && !MEDIDAS) {
  throw new Error("as medidas vêm aos pares, em mm: … saida.pdf 74 105");
}

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORTA}`,
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  "--user-data-dir=" + process.env.TMPDIR + "chrome-ementa",
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

const { data } = await enviar("Page.printToPDF", {
  printBackground: true,      // sem isto sai branco, sem pergaminho
  paperWidth: MEDIDAS ? LARG_MM / 25.4 : 8.2677,     // por omissão, A4
  paperHeight: MEDIDAS ? ALT_MM / 25.4 : 11.6929,
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  preferCSSPageSize: !MEDIDAS,
  displayHeaderFooter: false,
  transferMode: "ReturnAsBase64",
}, sessionId);

writeFileSync(SAIDA, Buffer.from(data, "base64"));
console.log("escrito:", SAIDA);

ws.close();
chrome.kill();
process.exit(0);
