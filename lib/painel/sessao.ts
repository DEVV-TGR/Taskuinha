import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { chave } from "./chaves";

/*
  Os dois cookies assinados do painel.

  | cookie | diz | dura |
  |---|---|---|
  | `taskuinha_sessao` | "esta pessoa entrou" | 8 horas |
  | `taskuinha_aparelho` | "este aparelho já passou pelo código do email" | 30 dias |

  O terceiro cookie do painel, o do desafio, não vive aqui — esse é **cifrado**
  e não apenas assinado, e mora no `lib/painel/codigo.ts` com a explicação da
  diferença.

  Os dois daqui são, na prática, JWTs HS256 sem a papelada: `v.corpo.assinatura`,
  onde o corpo é JSON em base64url.

  ## Porque é que não se usa o `jose`

  A documentação do Next sugere-o, e essa sugestão tem uma razão histórica: o
  middleware corria em Edge runtime, onde o `node:crypto` não existe, e um HMAC
  tinha de vir de uma biblioteca. No Next 16 deixou de ser verdade — os próprios
  docs de autenticação dizem que *"Proxy uses the Node.js runtime"*.

  O risco também não está no algoritmo — está no envelope à volta dele, e é o
  envelope que os quatro cuidados abaixo tratam.

  ## Os quatro cuidados

  1. **A assinatura verifica-se antes de o JSON ser lido.** Um `JSON.parse` sobre
     bytes que ainda não se sabe se são nossos é superfície de ataque de graça.
  2. **A validade vai dentro do corpo assinado, e é verificada.** Confiar no
     `Max-Age` do cookie não vale nada: o cookie está na máquina de quem o quiser
     reenviar para sempre.
  3. **`timingSafeEqual` com guarda de comprimento** — atira se os buffers
     tiverem tamanhos diferentes, e comparar com `===` deixava passar informação
     pelo tempo.
  4. **O rótulo do cookie entra dentro do HMAC.** Sem isso, um selo de sessão
     podia ser apresentado como selo de aparelho, ou o de um formato futuro ser
     reinterpretado como um deste.
*/

export const NOME_DO_COOKIE = "taskuinha_sessao";
export const NOME_DO_APARELHO = "taskuinha_aparelho";

/* Oito horas — um turno. Quem fecha a casa não fica com sessão aberta. */
export const VALIDADE_MS = 8 * 60 * 60 * 1000;

/*
  Trinta dias, e é uma escolha de conforto assumida: a alternativa era pedir o
  código do email de cada vez, e quem tem de ir ao email para corrigir um preço
  acaba por não corrigir o preço. É o que os bancos fazem.

  Este cookie é um cartão de acesso: quem o roubar salta o segundo passo. É a
  natureza do "lembrar este aparelho". O `httpOnly` impede que JavaScript lhe
  toque e o `secure` que viaje fora de HTTPS; o resto é o mesmo risco que ter o
  telemóvel desbloqueado no balcão.
*/
export const VALIDADE_APARELHO_MS = 30 * 24 * 60 * 60 * 1000;

type Rotulo = "sessao" | "aparelho";

const VERSAO = "s1";

/*
  A chave vem do `lib/painel/chaves.ts`, que a deriva das próprias credenciais —
  não há uma variável de ambiente para gerar com o `openssl`, e mudar a password
  revoga sessões e aparelhos de uma vez.

  Chamada dentro da função e não no topo do ficheiro: o `next build` da CI corre
  sem variáveis nenhumas e um `throw` em module scope rebentava-o. Aqui só
  rebenta quando alguém tenta mesmo selar ou abrir — que em CI não acontece,
  porque o caminho de quem não tem sessão nunca chega cá (ver `proxy.ts`).
*/
function assinar(rotulo: Rotulo, corpo: string): string {
  return createHmac("sha256", chave(rotulo))
    .update(`${VERSAO}.${rotulo}.${corpo}`)
    .digest("base64url");
}

function selarComo(rotulo: Rotulo, utilizador: string, validade: number): string {
  const corpo = Buffer.from(
    JSON.stringify({ u: utilizador, exp: Date.now() + validade }),
  ).toString("base64url");

  return `${VERSAO}.${corpo}.${assinar(rotulo, corpo)}`;
}

function abrirComo(
  rotulo: Rotulo,
  valor: string | undefined,
): { utilizador: string } | null {
  if (!valor) return null;

  const partes = valor.split(".");
  if (partes.length !== 3 || partes[0] !== VERSAO) return null;
  const [, corpo, selo] = partes;

  const esperado = Buffer.from(assinar(rotulo, corpo));
  const recebido = Buffer.from(selo);
  if (esperado.length !== recebido.length) return null;
  if (!timingSafeEqual(esperado, recebido)) return null;

  /* Só a partir daqui é que estes bytes são de confiança. */
  try {
    const lido: unknown = JSON.parse(
      Buffer.from(corpo, "base64url").toString("utf8"),
    );
    if (typeof lido !== "object" || lido === null) return null;

    const { u, exp } = lido as Record<string, unknown>;
    if (typeof u !== "string" || typeof exp !== "number") return null;
    if (exp < Date.now()) return null;

    return { utilizador: u };
  } catch {
    return null;
  }
}

export function selar(utilizador: string): string {
  return selarComo("sessao", utilizador, VALIDADE_MS);
}

/** Quem está do outro lado, se o selo for nosso e ainda estiver dentro da validade. */
export function abrir(valor: string | undefined): { utilizador: string } | null {
  return abrirComo("sessao", valor);
}

export function selarAparelho(utilizador: string): string {
  return selarComo("aparelho", utilizador, VALIDADE_APARELHO_MS);
}

/*
  Este aparelho já passou pelo código do email, e foi **este** utilizador a
  passar por ele.

  A comparação do nome não é decorativa: sem ela, um aparelho lembrado para o
  Gonçalo deixava o Tomás entrar sem código, e o segundo passo passava a valer
  apenas para quem entrasse primeiro em cada telemóvel.
*/
export function aparelhoConhecido(
  valor: string | undefined,
  utilizador: string,
): boolean {
  return abrirComo("aparelho", valor)?.utilizador === utilizador;
}

/*
  As opções dos cookies.

  `path: "/painel"` e não `/`: assim nenhum deles viaja nos pedidos às oito
  páginas públicas, que são servidas do CDN e não têm nada que ver com sessões.
  Menos bytes em cada pedido, e menos uma coisa a andar por aí.

  `secure` fica desligado em desenvolvimento, senão o browser recusa o cookie em
  `http://localhost` e não há forma de entrar na própria máquina.
*/
export function opcoesDoCookie(validadeMs = VALIDADE_MS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/painel",
    maxAge: Math.floor(validadeMs / 1000),
  };
}
