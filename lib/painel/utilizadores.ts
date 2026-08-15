import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { CUSTO, ALGORITMO } from "./custo.mjs";

const derivar = promisify(scrypt) as (
  password: string | Buffer,
  sal: Buffer,
  chave: number,
  opcoes: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/*
  Quem pode entrar no painel.

  ## Onde vivem os utilizadores

  Numa variável de ambiente da Vercel, `PAINEL_UTILIZADORES`, com um array de
  JSON:

      [{"utilizador":"goncalo","segredo":"scrypt$65536$8$1$<sal>$<hash>"}]

  E **não** num ficheiro do repositório, por mais tentador que fosse — seria
  revisível num PR, versionado, e não obrigava a um redeploy para mudar uma
  password. A razão de não o fazer é uma só: um hash de scrypt de uma password
  escolhida por um humano quebra-se offline com tempo e uma placa gráfica.
  Repositórios privados ficam públicos por acidente, e um clone antigo não se
  apaga. Uma variável de ambiente não sai do runtime da Vercel.

  **Consequência a saber:** mudar esta variável na Vercel não afecta as funções
  já publicadas. É preciso um redeploy para a lista nova valer. Quem mudar uma
  password, testar, e concluir que o painel está partido, está a ver isto.

  ## Porque é que nada disto é lido no topo do ficheiro

  Porque o `next build` do CI corre sem uma única variável de ambiente definida,
  e um `JSON.parse(process.env.X!)` em module scope rebentava o build. Tudo o
  que toca no ambiente é lido dentro da função que precisa.

  E falha **fechado**: sem variável, ou com JSON estragado, a lista fica vazia e
  ninguém entra. Não se atira — um erro por atirar dava um ecrã de avaria que
  diz a quem está do outro lado que há aqui alguma coisa mal configurada, e isso
  é meio caminho andado para quem procura por onde entrar.
*/

export type Utilizador = { utilizador: string; segredo: string };

function eUtilizador(valor: unknown): valor is Utilizador {
  if (typeof valor !== "object" || valor === null) return false;
  const { utilizador, segredo } = valor as Record<string, unknown>;
  return typeof utilizador === "string" && typeof segredo === "string";
}

function carregar(): Utilizador[] {
  const bruto = process.env.PAINEL_UTILIZADORES;
  if (!bruto) return [];

  try {
    const valor: unknown = JSON.parse(bruto);
    return Array.isArray(valor) ? valor.filter(eUtilizador) : [];
  } catch {
    return [];
  }
}

/*
  O formato do segredo: `scrypt$N$r$p$<sal>$<hash>`, os dois últimos em
  base64url.

  Os parâmetros de custo vão lá dentro e não num sítio comum de propósito. É o
  que permite subir o custo no `custo.mjs` sem invalidar em silêncio tudo o que
  já foi derivado: cada segredo diz com que números foi feito, e é por esses que
  se verifica.
*/
export async function derivarSegredo(password: string): Promise<string> {
  const sal = randomBytes(16);
  const { N, r, p, chave, maxmem } = CUSTO;
  const hash = await derivar(normalizar(password), sal, chave, { N, r, p, maxmem });

  return [
    ALGORITMO,
    N,
    r,
    p,
    sal.toString("base64url"),
    hash.toString("base64url"),
  ].join("$");
}

/*
  O "ã" tem duas representações em Unicode — uma letra só, ou um "a" mais um til
  por cima. Um teclado de Mac escreve uma, um de Windows pode escrever a outra,
  e as duas parecem iguais no ecrã e não são iguais em bytes. Sem esta linha, uma
  password com acentos passa a funcionar numa máquina e não noutra, e o bug é
  irreproduzível para quem o comunica.
*/
function normalizar(password: string): string {
  return password.normalize("NFKC");
}

async function confere(segredo: string, password: string): Promise<boolean> {
  const partes = segredo.split("$");
  if (partes.length !== 6 || partes[0] !== ALGORITMO) return false;

  const [, N, r, p, salB64, hashB64] = partes;
  const sal = Buffer.from(salB64, "base64url");
  const esperado = Buffer.from(hashB64, "base64url");
  if (sal.length === 0 || esperado.length === 0) return false;

  let obtido: Buffer;
  try {
    obtido = await derivar(normalizar(password), sal, esperado.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
      maxmem: CUSTO.maxmem,
    });
  } catch {
    /* Parâmetros que o Node recusa — segredo corrompido, não password errada. */
    return false;
  }

  /* `timingSafeEqual` atira se os buffers tiverem tamanhos diferentes. */
  if (obtido.length !== esperado.length) return false;
  return timingSafeEqual(obtido, esperado);
}

/*
  Um segredo que não é de ninguém e que nenhuma password acerta.

  Serve para o caso do utilizador que não existe. Sem isto, uma tentativa com um
  nome inventado responde num milissegundo e uma tentativa com o nome certo
  demora os 300 ms da derivação — e essa diferença, medida de fora, diz a quem
  está a tentar quais os nomes que valem a pena. Derivar contra este faz o caminho
  mau custar exactamente o mesmo que o bom.

  É trabalho real, e é por isso que substitui com vantagem um `sleep`: o atraso
  é uniforme por construção, e não um número que alguém escolheu à sorte.
*/
const FANTASMA =
  "scrypt$65536$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/** O utilizador, se as credenciais baterem certo. `null` em todos os outros casos. */
export async function autenticar(
  utilizador: string,
  password: string,
): Promise<{ utilizador: string } | null> {
  const encontrado = carregar().find((u) => u.utilizador === utilizador);
  const bate = await confere(encontrado?.segredo ?? FANTASMA, password);

  return encontrado && bate ? { utilizador: encontrado.utilizador } : null;
}
