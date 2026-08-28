import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { setTimeout as esperar } from "node:timers/promises";

/*
  Teste de fumo. Arranca o site compilado e pergunta-lhe três coisas:
  se as páginas todas respondem, se os cabeçalhos de segurança lá estão,
  e se um endereço inventado dá 404 com o ecrã da casa em vez do ecrã de
  fábrica do Next.

  ## Porquê isto e não uma suite de testes

  Porque não há lógica para testar. O site são oito páginas de conteúdo
  fixo: não há cálculo, não há estado, não há pedido a servidor nenhum.
  Um teste unitário aqui estaria a verificar que uma constante continua
  igual a si própria.

  O que **pode** partir sem ninguém dar por isso é outra coisa: alguém
  mexe no `next.config.ts` — para acrescentar um rewrite de uma página
  nova, digamos — e leva os cabeçalhos de segurança à frente. O site
  continua a abrir, continua bonito, e fica sem CSP durante meses. É
  exactamente esse o buraco que este ficheiro tapa.

  ## Como correr

      npm run build && npm run fumo

  Sai com código 1 à primeira falha que interesse, para a CI parar.
*/

const PORTA = 3210;
const BASE = `http://localhost:${PORTA}`;

/* As oito moradas do sitemap. O português é sem prefixo — ver lib/i18n.ts. */
const PAGINAS = [
  "/",
  "/ementa",
  "/en",
  "/en/ementa",
  "/fr",
  "/fr/ementa",
  "/es",
  "/es/ementa",
];

/*
  Os cabeçalhos que têm de vir em todas as respostas, e o que se exige de
  cada um. Não se compara a string inteira de propósito: o valor da CSP
  há-de crescer, e um teste que quebra sempre que se acrescenta uma
  directiva legítima é um teste que se acaba por apagar. O que se exige é
  o que não pode desaparecer.
*/
const CABECALHOS = [
  {
    nome: "content-security-policy",
    exige: [
      "default-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ],
  },
  { nome: "x-frame-options", exige: ["DENY"] },
  { nome: "x-content-type-options", exige: ["nosniff"] },
  { nome: "referrer-policy", exige: ["strict-origin"] },
  { nome: "permissions-policy", exige: ["geolocation=()"] },
];

const falhas = [];

function verificar(condicao, mensagem) {
  if (condicao) {
    console.log(`  ok    ${mensagem}`);
  } else {
    console.log(`  FALHA ${mensagem}`);
    falhas.push(mensagem);
  }
}

async function esperarPeloServidor() {
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    try {
      await fetch(BASE, { signal: AbortSignal.timeout(1000) });
      return true;
    } catch {
      await esperar(500);
    }
  }
  return false;
}

/* O binário do Next chamado directamente, e não através do `npx`. O `npx`
   arranca o `next start` como um filho seu, e no Linux não lhe passa os
   sinais à frente: o SIGTERM lá em baixo matava o intermediário e deixava
   o servidor vivo, agarrado a estes canos, com o Node à espera deles para
   sempre. No macOS o `npx` substitui-se a si próprio, por isso a diferença
   só aparecia na CI. Sem intermediário não há sinal por entregar. */
const servidor = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORTA)],
  { stdio: ["ignore", "pipe", "pipe"] },
);

/* Sem isto, um `next start` que rebenta no arranque deixa-nos a olhar
   para um timeout sem saber porquê. */
let ruidoDoServidor = "";
servidor.stdout.on("data", (d) => (ruidoDoServidor += d));
servidor.stderr.on("data", (d) => (ruidoDoServidor += d));

try {
  if (!(await esperarPeloServidor())) {
    console.error("O servidor não arrancou. O que ele disse:\n");
    console.error(ruidoDoServidor);
    process.exit(1);
  }

  console.log("\nAs oito páginas:");
  for (const rota of PAGINAS) {
    const resposta = await fetch(`${BASE}${rota}`);
    verificar(resposta.status === 200, `${rota} responde 200`);

    for (const { nome, exige } of CABECALHOS) {
      const valor = resposta.headers.get(nome) ?? "";
      const emFalta = exige.filter((parte) => !valor.includes(parte));
      verificar(
        valor !== "" && emFalta.length === 0,
        `${rota} traz ${nome}${emFalta.length ? ` (falta: ${emFalta.join(", ")})` : ""}`,
      );
    }
  }

  console.log("\nA CSP em produção:");
  const csp = (await fetch(BASE)).headers.get("content-security-policy") ?? "";
  /* Os ramos de desenvolvimento não podem escapar para um build de
     produção — ver o comentário no next.config.ts. */
  verificar(!csp.includes("unsafe-eval"), "não traz 'unsafe-eval'");
  verificar(!csp.includes("ws:"), "não traz 'ws:'");
  /* Se o mapa mudar de fornecedor e ninguém mexer aqui, a moldura fica
     vazia sem erro nenhum. Melhor falhar na CI. */
  verificar(
    csp.includes("https://www.openstreetmap.org"),
    "deixa passar o mapa da OpenStreetMap",
  );

  /*
    As oito páginas continuam a ser geradas no build.

    Isto lê-se do manifesto e não da resposta HTTP de propósito: uma página que
    passou a dinâmica responde 200 na mesma, com o mesmo aspecto, e só se nota
    na factura e no tempo de resposta. É o género de regressão que se descobre
    meses depois — um `await cookies()` acrescentado a um componente partilhado
    chega para a provocar.
  */
  console.log("\nAs oito continuam a ser geradas no build:");
  const manifesto = JSON.parse(
    readFileSync(new URL("../.next/prerender-manifest.json", import.meta.url), "utf8"),
  );
  const geradas = Object.keys(manifesto.routes ?? {});
  for (const rota of ["/pt", "/pt/ementa", "/en", "/en/ementa", "/fr", "/fr/ementa", "/es", "/es/ementa"]) {
    verificar(geradas.includes(rota), `${rota} está no prerender-manifest`);
  }
  verificar(
    !geradas.some((rota) => rota.startsWith("/painel")),
    "nenhuma rota do painel foi gerada no build",
  );

  /*
    O painel, visto de fora e sem sessão — que é como a CI o vê, sem uma única
    variável de ambiente definida. Se alguma destas verificações precisar de um
    segredo para passar, é sinal de que um segredo passou a ser lido cedo demais.
  */
  console.log("\nO painel:");
  const painel = await fetch(`${BASE}/painel`, { redirect: "manual" });
  verificar(
    [302, 307, 308].includes(painel.status),
    `/painel sem sessão redirecciona (${painel.status})`,
  );
  verificar(
    (painel.headers.get("location") ?? "").includes("/painel/entrar"),
    "…e é para /painel/entrar",
  );

  const entrada = await fetch(`${BASE}/painel/entrar`);
  verificar(entrada.status === 200, "/painel/entrar responde 200 sem segredos nenhuns");
  verificar(
    (entrada.headers.get("cache-control") ?? "").includes("no-store"),
    "o painel não se guarda em cache",
  );
  verificar(
    (entrada.headers.get("x-robots-tag") ?? "").includes("noindex"),
    "o painel traz x-robots-tag",
  );
  verificar(
    (entrada.headers.get("x-frame-options") ?? "") === "DENY",
    "o painel continua a trazer os cabeçalhos de segurança do site",
  );

  /*
    A CSP do painel — a única com nonce, emitida pelo `proxy.ts`.

    São quatro verificações e nenhuma delas é decorativa:

    - **Uma só.** O `next.config.ts` exclui `/painel` da entrada genérica de
      propósito. Se alguém lá voltar a pôr um `/(.*)`, a resposta passa a ter
      duas linhas `Content-Security-Policy` e o browser resolve-as pela
      intersecção. O `fetch` junta cabeçalhos repetidos com vírgulas, por isso
      duas políticas dão dois `default-src` na mesma string.
    - **Com nonce e sem `'unsafe-inline'`** — é a razão de tudo isto existir.
      Com um nonce presente, o browser ignora o `'unsafe-inline'`; deixá-lo lá
      não partia nada e escondia a regressão do dia em que o nonce
      desaparecesse.
    - **Todos os `<script>` da página com `nonce=`.** Esta é a que apanha o
      caso mau de verdade: se o `x-nonce` deixar de chegar aos cabeçalhos do
      pedido, a política continua perfeita e o painel abre em branco, porque a
      própria hidratação do Next fica bloqueada. Um cabeçalho certo com uma
      página morta é o pior dos dois mundos.
  */
  console.log("\nA CSP do painel:");
  const cspPainel = entrada.headers.get("content-security-policy") ?? "";
  const scriptSrc = cspPainel.match(/script-src ([^;]*)/)?.[1] ?? "";

  verificar(
    (cspPainel.match(/default-src/g) ?? []).length === 1,
    "o painel traz uma só política, e não duas sobrepostas",
  );
  verificar(scriptSrc.includes("'nonce-"), "o script-src do painel leva nonce");
  verificar(
    !scriptSrc.includes("unsafe-inline"),
    "…e já não leva 'unsafe-inline'",
  );

  const html = await entrada.text();
  const etiquetas = html.match(/<script[^>]*>/g) ?? [];
  verificar(etiquetas.length > 0, `a página tem scripts (${etiquetas.length})`);
  verificar(
    etiquetas.every((etiqueta) => etiqueta.includes("nonce=")),
    "e todos levam nonce — sem isto o painel abria em branco",
  );

  /*
    O segundo passo da entrada. Sem um desafio a meio — que é o que a CI tem,
    sem variável nenhuma definida — tem de mandar para o princípio, e não pode
    rebentar a tentar derivar chaves que não existem.
  */
  const segundoPasso = await fetch(`${BASE}/painel/entrar/codigo`, {
    redirect: "manual",
  });
  verificar(
    [302, 307, 308].includes(segundoPasso.status),
    `/painel/entrar/codigo sem desafio redirecciona (${segundoPasso.status})`,
  );
  verificar(
    (segundoPasso.headers.get("location") ?? "").endsWith("/painel/entrar"),
    "…e é para o princípio da entrada",
  );

  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  verificar(robots.includes("Disallow: /painel"), "o robots.txt fecha o painel");

  console.log("\nO 404:");
  const perdido = await fetch(`${BASE}/morada-que-nao-existe`);
  const corpo = await perdido.text();
  verificar(perdido.status === 404, "um endereço inventado responde 404");
  verificar(
    !corpo.includes("This page could not be found"),
    "não é o ecrã de fábrica do Next",
  );
  verificar(corpo.includes('lang="pt-PT"'), "vem com a língua declarada");

  console.log("");
  if (falhas.length > 0) {
    console.error(`${falhas.length} verificação(ões) a falhar.`);
    process.exit(1);
  }
  console.log("Fumo limpo.");
} finally {
  /* Pedir a saída não é vê-la acontecer. Esperar pelo `close` é o que
     garante que os canos fecham antes de nós, em vez de ficar um servidor
     a respirar depois de o teste dizer que acabou. */
  servidor.kill("SIGTERM");
  await new Promise((resolve) => servidor.once("close", resolve));
}
