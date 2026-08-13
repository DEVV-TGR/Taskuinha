/*
  Gera `public/ementa-taskuinha.pdf` a partir da rota `/ementa/imprimir`.

  Corre-se à mão, quando a ementa mudar:

      npm run build && npm run pdf-ementa

  Não está pendurado no build. O PDF vai commitado no repositório porque muda
  ao ritmo dos preços da casa — não ao ritmo dos deploys — e porque assim o
  ficheiro que se serve é exactamente o que foi visto e aprovado.

  Imprime com o Chrome que está instalado na máquina, em vez de trazer um
  Puppeteer para o projecto: são 300 MB de browser descarregado para uma
  tarefa que se corre de meio em meio ano.
*/
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_PAGINA = "http://localhost:3210/ementa/imprimir";
const DESTINO = "public/ementa-taskuinha.pdf";

const CHROMES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const chrome = CHROMES.find((c) => existsSync(c));
if (!chrome) {
  console.error(
    "Não encontrei o Chrome. Instala-o, ou acrescenta o caminho à lista no topo deste ficheiro.",
  );
  process.exit(1);
}

/** Espera que o servidor responda, ou desiste ao fim de `tentativas`. */
async function esperarServidor(tentativas = 40) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(URL_PAGINA);
      if (res.ok) return;
    } catch {
      // ainda a arrancar
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`O servidor não respondeu em ${URL_PAGINA}`);
}

/*
  Se a porta já estiver ocupada, o `next start` novo morre em silêncio e o
  Chrome imprime o que lá estiver — que pode ser um build antigo. Foi o que
  aconteceu à primeira: o PDF saía sempre igual por mais que se mexesse na
  página, e nada no ecrã dizia porquê.
*/
try {
  await fetch(URL_PAGINA, { signal: AbortSignal.timeout(1500) });
  console.error(
    `Já há alguém a responder em ${URL_PAGINA}. Fecha esse servidor primeiro — ` +
      "senão o PDF sai do build que estiver lá, não deste.",
  );
  process.exit(1);
} catch {
  // porta livre, como se quer
}

/*
  O binário directo, e não `npx next`: com o npx pelo meio, o `kill` do fim
  matava o npx e deixava o servidor a segurar a porta — o script nunca
  chegava a terminar.
*/
const servidor = spawn(join("node_modules", ".bin", "next"), ["start", "--port", "3210"], {
  stdio: "ignore",
  /*
    Grupo de processos próprio. O `next start` arranca um servidor filho, e
    matar só o pai deixava-o vivo a segurar a porta — o script terminava e a
    corrida seguinte ia parar à guarda acima.
  */
  detached: true,
});

const perfil = await mkdtemp(join(tmpdir(), "chrome-ementa-"));

try {
  await esperarServidor();

  const antes = existsSync(DESTINO) ? statSync(DESTINO).mtimeMs : 0;

  /*
    O Chrome escreve o PDF e depois fica pendurado — não devolve o processo.
    Por isso não se espera pela saída dele, espera-se pelo ficheiro: assim que
    o PDF aparecer com data nova, mata-se o browser e segue-se.
  */
  const p = spawn(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // Sem isto o Chrome espera indefinidamente por temporizadores da página.
    "--virtual-time-budget=10000",
    `--user-data-dir=${perfil}`,
    `--print-to-pdf=${DESTINO}`,
    URL_PAGINA,
  ]);
  p.on("error", (erro) => {
    throw erro;
  });

  const LIMITE_MS = 90_000;
  const inicio = Date.now();
  let pronto = false;

  while (Date.now() - inicio < LIMITE_MS) {
    if (existsSync(DESTINO) && statSync(DESTINO).mtimeMs > antes) {
      // Dá-lhe um instante para acabar de escrever antes de o matar.
      await new Promise((r) => setTimeout(r, 1500));
      pronto = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  p.kill("SIGKILL");

  if (!pronto) throw new Error(`O Chrome não escreveu ${DESTINO} a tempo.`);
  console.log(`${DESTINO} gerado.`);
} finally {
  // O sinal vai para o grupo todo — daí o pid negativo.
  try {
    process.kill(-servidor.pid, "SIGTERM");
  } catch {
    // já morreu sozinho
  }
  await rm(perfil, { recursive: true, force: true });
}
