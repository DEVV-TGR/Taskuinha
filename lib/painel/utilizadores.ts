import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derivar = promisify(scrypt) as (
  password: string,
  sal: string,
  chave: number,
  opcoes: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/*
  Quem pode entrar no painel.

  ## Duas variáveis de ambiente, escritas à mão

      PAINEL_UTILIZADOR=goncalo
      PAINEL_PASSWORD=a-que-ele-escolher

  E pronto. Não há script para correr, não há hash para gerar, não há JSON para
  colar. Quem quiser mudar a password vai à Vercel, escreve outra, e faz um
  redeploy.

  Para uma segunda pessoa, acrescentam-se `PAINEL_UTILIZADOR_2` e
  `PAINEL_PASSWORD_2` — e assim por diante até ao quinto. Não é preciso saber
  formato nenhum: é sempre o mesmo par com um número ao lado.

  ## A password fica em claro na Vercel. Porquê, e o que isso custa

  A alternativa era guardar um hash, e foi o que esteve aqui primeiro. Guardar
  um hash protege de uma coisa só: de quem consiga ler as variáveis de ambiente
  do projecto. E essa pessoa também lê o `PAINEL_GITHUB_TOKEN`, que está na
  mesma lista e dá acesso de escrita ao repositório — ou seja, tudo o que o
  painel faz, e mais. O hash não fechava porta nenhuma que o token não deixasse
  aberta.

  O que se perde a sério é isto: **se a password for reutilizada noutro sítio,
  quem ler as variáveis também entra nesse outro sítio.** Vale a pena que a
  password do painel não seja a password de mais nada.

  As variáveis marcam-se como *Sensitive* na Vercel, e assim não são legíveis
  de volta no dashboard depois de gravadas.

  ## O custo por tentativa não se perdeu

  A comparação continua a passar pelo `scrypt`, com um sal fixo, dos dois lados
  — o que está no ambiente e o que vem do formulário. Não é preciso guardar um
  hash para isso: derivam-se os dois na hora e comparam-se.

  São ~100 ms por tentativa, que não se notam a entrar e que tornam a força
  bruta cara. O que trava mesmo é a regra do Vercel Firewall (5 tentativas por
  minuto por IP, ver `docs/PAINEL.md`), mas isto está por baixo dela e não
  custa nada.
*/

/*
  Um degrau abaixo do mínimo da OWASP (`2^17`), e de propósito: numa função da
  Vercel, com 1 a 2 vCPU em rajada, `2^17` chega perto do segundo por tentativa
  — que se nota a entrar e que se paga em cada tentativa falhada de quem esteja
  a tentar. `maxmem` é obrigatório: o scrypt precisa de `128·N·r` = 32 MiB, que
  é exactamente o limite por omissão do Node, e ficar em cima do limite atira
  `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`.
*/
const CUSTO = { N: 1 << 15, r: 8, p: 1, maxmem: 192 * 1024 * 1024 };

/*
  O sal é fixo e está aqui à vista, o que num sistema com hashes guardados seria
  um erro — um sal serve para dois utilizadores com a mesma password não terem o
  mesmo hash, e para uma tabela pré-calculada não servir de nada.

  Aqui não há hashes guardados: os dois lados são derivados no mesmo instante e
  comparados. O sal só existe porque o scrypt pede um, e o que ele faz é separar
  este uso de qualquer outro.
*/
const SAL = "taskuinha:painel:v1";

export type Utilizador = {
  utilizador: string;
  password: string;
  /** Para onde vai o código do segundo passo. */
  email: string;
};

/*
  Lê o ambiente. Nunca em module scope: o `next build` da CI corre sem uma
  única variável definida, e ler no topo do ficheiro rebentava-o.

  Falha **fechado**. Sem variáveis, a lista fica vazia e não entra ninguém — sem
  atirar, que um ecrã de avaria diria a quem está do outro lado que há aqui
  alguma coisa mal configurada, e isso é meio caminho andado para quem procura
  por onde entrar.

  **Um utilizador sem email não conta.** Sem email não há segundo passo, e um
  utilizador que entrasse só com password seria uma porta lateral aberta ao lado
  da porta que se acabou de trancar. Falta o email, o utilizador não existe.
*/
function carregar(): Utilizador[] {
  const lista: Utilizador[] = [];

  for (const sufixo of ["", "_2", "_3", "_4", "_5"]) {
    const utilizador = process.env[`PAINEL_UTILIZADOR${sufixo}`]?.trim();
    const password = process.env[`PAINEL_PASSWORD${sufixo}`];
    const email = process.env[`PAINEL_EMAIL${sufixo}`]?.trim();

    if (utilizador && password && email) {
      lista.push({ utilizador, password, email });
    }
  }

  return lista;
}

/** O email de quem entrou, para lá mandar o código. */
export function emailDe(utilizador: string): string | null {
  return carregar().find((u) => u.utilizador === utilizador)?.email ?? null;
}

/*
  O "ã" tem duas representações em Unicode — uma letra só, ou um "a" mais um til
  por cima. Um teclado de Mac escreve uma, um de Windows pode escrever a outra,
  e as duas parecem iguais no ecrã e não são iguais em bytes. Sem esta linha,
  uma password com acentos funciona numa máquina e não noutra, e o problema é
  irreproduzível para quem o comunica.
*/
function normalizar(password: string): string {
  return password.normalize("NFKC");
}

function derivada(password: string): Promise<Buffer> {
  return derivar(normalizar(password), SAL, 32, CUSTO);
}

/** O utilizador, se as credenciais baterem certo. `null` em tudo o resto. */
export async function autenticar(
  utilizador: string,
  password: string,
): Promise<{ utilizador: string } | null> {
  const encontrado = carregar().find((u) => u.utilizador === utilizador);

  /*
    Deriva sempre, mesmo quando o utilizador não existe.

    Sem isto, um nome inventado seria recusado num milissegundo e o nome certo
    demoraria os ~100 ms da derivação — e essa diferença, medida de fora, diz a
    quem está a tentar quais os nomes que valem a pena. Derivar contra uma
    password que não é de ninguém faz o caminho mau custar o mesmo que o bom, e
    é trabalho real em vez de um atraso escolhido à sorte.
  */
  const [esperado, obtido] = await Promise.all([
    derivada(encontrado?.password ?? "não é a password de ninguém"),
    derivada(password),
  ]);

  const bate = timingSafeEqual(esperado, obtido);
  return encontrado && bate ? { utilizador: encontrado.utilizador } : null;
}

/*
  O segredo de onde saem todas as chaves do painel.

  Sai das próprias credenciais, e não de mais uma variável de ambiente que
  alguém tivesse de gerar com o `openssl`. Era mais uma coisa a montar, e o que
  ela dava consegue-se daqui.

  Tem uma propriedade que se quer: **mudar a password revoga tudo** — sessões
  abertas, desafios a meio, e aparelhos que estavam lembrados os 30 dias. É
  exactamente o que se espera de mudar uma password, e é o botão de emergência
  que de outra forma era preciso lembrar de carregar à parte.

  Isto não é uma chave; é a matéria-prima delas. Quem quer uma chave vai ao
  `lib/painel/chaves.ts`, que a estica em três — uma por uso, e nunca a mesma
  para assinar e para cifrar.

  `sha256` e não `scrypt`: corre em cada pedido ao painel, e o que está a ser
  derivado só é atacável por quem já tenha um cookie válido — ou seja, por quem
  já entrou. Não há aqui um ataque offline que valha os 50 ms.
*/
export function segredoDasCredenciais(): string {
  const credenciais = carregar()
    .map((u) => `${u.utilizador}:${normalizar(u.password)}`)
    .join("\n");

  if (credenciais === "") {
    throw new Error(
      "PAINEL_UTILIZADOR, PAINEL_PASSWORD e PAINEL_EMAIL em falta. " +
        "Ver docs/PAINEL.md.",
    );
  }

  return createHash("sha256")
    .update(`taskuinha:credenciais:v1\n${credenciais}`)
    .digest("base64");
}
