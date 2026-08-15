import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
  O cookie de sessão do painel.

  Um selo assinado, no formato `s1.<corpo>.<assinatura>`, onde o corpo é JSON em
  base64url e a assinatura é um HMAC-SHA256 do conjunto. É, na prática, um JWT
  HS256 sem a papelada.

  ## Porque é que não se usa o `jose`

  A documentação do Next sugere-o, e essa sugestão tem uma razão histórica: o
  middleware corria em Edge runtime, onde o `node:crypto` não existe, e um HMAC
  tinha de vir de uma biblioteca. No Next 16 deixou de ser verdade — os próprios
  docs de autenticação dizem que *"Proxy uses the Node.js runtime"*.

  Com o `node:crypto` disponível dos dois lados, o que sobra é três chamadas de
  biblioteca padrão contra mais uma dependência num projecto que tem cinco e
  conta-as. O risco também não está no algoritmo — está no envelope à volta
  dele, e é o envelope que os quatro cuidados abaixo tratam.

  ## Os quatro cuidados

  1. **A assinatura verifica-se antes de o JSON ser lido.** Um `JSON.parse` sobre
     bytes que ainda não se sabe se são nossos é superfície de ataque de graça.
  2. **A validade vai dentro do corpo assinado, e é verificada.** Confiar no
     `Max-Age` do cookie não vale nada: o cookie está na máquina de quem o quiser
     reenviar para sempre.
  3. **`timingSafeEqual` com guarda de comprimento** — atira se os buffers
     tiverem tamanhos diferentes, e comparar com `===` deixava passar informação
     pelo tempo.
  4. **O prefixo de versão entra dentro do HMAC.** Sem isso, um selo de um
     formato futuro podia ser reinterpretado como um deste.
*/

export const NOME_DO_COOKIE = "taskuinha_sessao";

const VERSAO = "s1";

/* Oito horas — um turno. Quem fecha a casa não fica com sessão aberta. */
export const VALIDADE_MS = 8 * 60 * 60 * 1000;

/*
  Lido dentro da função e não no topo do ficheiro: o `next build` do CI corre sem
  variáveis nenhumas, e um `throw` em module scope rebentava-o. Aqui só rebenta
  quando alguém tenta mesmo abrir ou selar uma sessão — que em CI não acontece,
  porque o caminho não autenticado nunca chega cá (ver `proxy.ts`).
*/
function segredo(): string {
  const valor = process.env.PAINEL_SESSAO_SEGREDO;
  /* 32 bytes em base64 dão 43 caracteres. Menos do que isso não é um segredo. */
  if (!valor || valor.length < 43) {
    throw new Error(
      "PAINEL_SESSAO_SEGREDO em falta ou demasiado curto. " +
        "Gera um com: openssl rand -base64 32",
    );
  }
  return valor;
}

function assinar(corpo: string): string {
  return createHmac("sha256", segredo())
    .update(`${VERSAO}.${corpo}`)
    .digest("base64url");
}

export function selar(utilizador: string): string {
  const corpo = Buffer.from(
    JSON.stringify({ u: utilizador, exp: Date.now() + VALIDADE_MS }),
  ).toString("base64url");

  return `${VERSAO}.${corpo}.${assinar(corpo)}`;
}

/** Quem está do outro lado, se o selo for nosso e ainda estiver dentro da validade. */
export function abrir(valor: string | undefined): { utilizador: string } | null {
  if (!valor) return null;

  const partes = valor.split(".");
  if (partes.length !== 3 || partes[0] !== VERSAO) return null;
  const [, corpo, selo] = partes;

  const esperado = Buffer.from(assinar(corpo));
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

/*
  As opções do cookie.

  `path: "/painel"` e não `/`: assim o selo nunca viaja nos pedidos às oito
  páginas públicas, que são servidas do CDN e não têm nada que ver com sessões.
  Menos bytes em cada pedido, e menos uma coisa a andar por aí.

  `secure` fica desligado em desenvolvimento, senão o browser recusa o cookie em
  `http://localhost` e não há forma de entrar na própria máquina.
*/
export function opcoesDoCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/painel",
    maxAge: VALIDADE_MS / 1000,
  };
}
