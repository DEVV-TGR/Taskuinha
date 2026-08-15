/*
  Gera o segredo de um utilizador do painel.

      npm run palavra-passe

  Imprime no fim a linha inteira do `PAINEL_UTILIZADORES`, pronta a colar nas
  variáveis de ambiente da Vercel. Nunca se edita esse JSON à mão.

  ## Porque é que a password se lê do stdin e não de um argumento

  Um argumento fica no histórico da shell e é visível no `ps` de quem estiver na
  mesma máquina. Custa duas linhas evitá-lo.

  ## Porque é que a password é gerada por omissão

  Porque é, de longe, a coisa que mais protege o painel — mais do que o scrypt,
  mais do que o firewall, mais do que tudo o resto junto. A conta é
  desconfortável mas é simples: com ~300 ms por tentativa e o Vercel Firewall a
  travar por IP, uma password como `taskuinha2026` está em qualquer lista de
  palavras e cai em segundos; 18 bytes aleatórios não caem nunca, nem com todo o
  tempo do mundo.

  O scrypt não protege uma password fraca. Protege uma password forte — e, essa
  sim, protege-a no dia em que os hashes vazarem.

  Escrever uma password gerada de cor é impossível, e é isso que se quer: ela vai
  para o gestor de passwords do telemóvel, e o telemóvel é o que está sempre lá.
*/

import { createInterface } from "node:readline/promises";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { stdin, stdout } from "node:process";
import { CUSTO, ALGORITMO } from "../lib/painel/custo.mjs";

const derivar = promisify(scrypt);

/* Duplicado do lib/painel/utilizadores.ts, e não pode divergir dele. */
async function derivarSegredo(password) {
  const sal = randomBytes(16);
  const { N, r, p, chave, maxmem } = CUSTO;
  const hash = await derivar(password.normalize("NFKC"), sal, chave, {
    N,
    r,
    p,
    maxmem,
  });

  return [ALGORITMO, N, r, p, sal.toString("base64url"), hash.toString("base64url")].join("$");
}

/*
  Duas maneiras de ler, conforme quem está do outro lado.

  **Num terminal**, pergunta-se e espera-se. A password lê-se com o `stdout`
  silenciado — o `readline` não tem modo escondido, e silenciar a saída é o que
  produz o efeito que o `sudo` e o `ssh` sempre tiveram. Sem isso, a password
  fica no ecrã e no scrollback.

  **Sem terminal** — um `printf … | npm run palavra-passe`, ou o script chamado
  de dentro de outro — lê-se tudo de uma vez para uma lista e vai-se tirando de
  lá. Misturar `readline` com um `stdout` silenciado num stream que não é
  interactivo deixa a pergunta pendurada à espera de uma linha que já passou;
  ler primeiro e perguntar depois não tem esse problema, e de caminho torna o
  script utilizável dentro de outro.
*/
const interactivo = Boolean(stdin.isTTY);

const leitor = interactivo
  ? createInterface({ input: stdin, output: stdout, terminal: true })
  : null;

const linhas = interactivo
  ? []
  : (await new Promise((resolve) => {
      let bruto = "";
      stdin.setEncoding("utf8");
      stdin.on("data", (pedaco) => (bruto += pedaco));
      stdin.on("end", () => resolve(bruto));
    }))
      .split("\n")
      .map((l) => l.replace(/\r$/, ""));

function proximaLinha() {
  return linhas.length > 0 ? linhas.shift() : "";
}

async function perguntar(pergunta) {
  if (!interactivo) {
    const valor = proximaLinha();
    stdout.write(`${pergunta}${valor}\n`);
    return valor;
  }
  return leitor.question(pergunta);
}

async function perguntarEmSilencio(pergunta) {
  if (!interactivo) {
    const valor = proximaLinha();
    /* A pergunta ecoa; a resposta não, que é o ponto. */
    stdout.write(`${pergunta}\n`);
    return valor;
  }

  const escreverOriginal = stdout.write.bind(stdout);
  stdout.write(pergunta);

  let mudo = true;
  stdout.write = (bloco, ...resto) =>
    mudo ? true : escreverOriginal(bloco, ...resto);

  try {
    return await leitor.question("");
  } finally {
    mudo = false;
    stdout.write = escreverOriginal;
    stdout.write("\n");
  }
}

try {
  console.log("\nUm utilizador novo para o painel da Taskuinha.\n");

  const utilizador = (await perguntar("Nome de utilizador: ")).trim();
  if (!utilizador) {
    console.error("\nSem nome não há utilizador.");
    process.exit(1);
  }
  if (!/^[a-z0-9._-]+$/.test(utilizador)) {
    console.error(
      "\nSó minúsculas, algarismos, ponto, traço e underscore — o nome vai para " +
        "dentro de JSON e para a mensagem de cada commit.",
    );
    process.exit(1);
  }

  console.log(
    "\nDeixa em branco para gerar uma password — é o que se recomenda, e é a\n" +
      "razão de este script existir. Guarda-a no gestor de passwords do telemóvel.\n",
  );

  let password = await perguntarEmSilencio("Password: ");
  let gerada = false;

  if (!password) {
    password = randomBytes(18).toString("base64url");
    gerada = true;
  } else {
    if (password.length < 16) {
      console.error(
        "\nMenos de 16 caracteres não passa. Volta a correr e carrega em Enter\n" +
          "para o script gerar uma.",
      );
      process.exit(1);
    }
    const outraVez = await perguntarEmSilencio("Outra vez: ");
    if (password !== outraVez) {
      console.error("\nAs duas não são iguais.");
      process.exit(1);
    }
  }

  const relogio = Date.now();
  const segredo = await derivarSegredo(password);
  const demorou = Date.now() - relogio;

  /*
    Se já houver utilizadores no ambiente, junta-se a eles em vez de os
    substituir — acrescentar o segundo utilizador não pode obrigar a reescrever
    o primeiro à mão.
  */
  let lista = [];
  try {
    const existente = JSON.parse(process.env.PAINEL_UTILIZADORES ?? "[]");
    if (Array.isArray(existente)) lista = existente;
  } catch {
    console.warn(
      "\nO PAINEL_UTILIZADORES que está no ambiente não é JSON válido — " +
        "ignorado.",
    );
  }

  lista = lista.filter((u) => u?.utilizador !== utilizador);
  lista.push({ utilizador, segredo });

  console.log(`\n${"─".repeat(72)}`);
  if (gerada) {
    console.log("\nA password, que só aparece aqui e nunca mais:\n");
    console.log(`    ${password}\n`);
    console.log("Guarda-a agora. Não há forma de a recuperar deste segredo.");
  }

  console.log("\nPara as variáveis de ambiente da Vercel (marcar como Sensitive):\n");
  console.log(`PAINEL_UTILIZADORES=${JSON.stringify(lista)}\n`);
  console.log(`${"─".repeat(72)}\n`);
  console.log(
    `A derivação demorou ${demorou} ms nesta máquina. Se na Vercel passar muito\n` +
      `dos 500 ms, baixar o N no lib/painel/custo.mjs.\n`,
  );
  console.log(
    "Lembrete: mudar uma variável de ambiente na Vercel não afecta as funções\n" +
      "já publicadas. É preciso um redeploy para esta lista valer.\n",
  );
} finally {
  leitor?.close();
}
