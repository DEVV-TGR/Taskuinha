import { NextResponse, type NextRequest } from "next/server";
import { politicaDeConteudo } from "./lib/cabecalhos";

/*
  O que noutras versões do Next se chamava `middleware.ts`.

  Mudou de nome no Next 16 — ver
  `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`. A função
  é a mesma; o ficheiro é que passou a ser `proxy.ts`, na raiz, e só pode haver
  um por projecto.

  ## O que isto faz, e sobretudo o que não faz

  Olha se o cookie de sessão **existe**. Não o abre, não verifica a assinatura,
  não sabe quem está do outro lado, e não toca no `PAINEL_SESSAO_SEGREDO`.

  É o que a documentação de autenticação do Next chama uma *verificação
  optimista*, e serve duas coisas: poupar um render a quem chega sem sessão
  nenhuma, e garantir que nenhuma rota do painel fica por cobrir por
  esquecimento de quem a acrescentar amanhã.

  **Isto não é a fechadura.** A fechadura é o `exigirSessao()` do
  `lib/painel/porta.ts`, chamado dentro de cada `page.tsx` e à cabeça de cada
  server action — o mais perto possível dos dados, como os docs mandam. Um
  cookie com o nome certo e conteúdo inventado passa por aqui e morre lá.

  Não abrir o selo aqui tem uma segunda vantagem, prática: sem tocar em
  segredos, o caminho de quem não tem sessão funciona num ambiente onde não há
  variáveis de ambiente nenhumas — que é exactamente o do `npm run fumo` no CI.

  ## A segunda coisa que isto faz: a CSP do painel

  O painel é a única parte deste site com uma sessão autenticada do outro lado, e
  é a única que pode ter CSP com nonce sem pagar nada por isso — já é dinâmica, e
  já passa por aqui a cada pedido. As oito páginas públicas continuam a ser
  servidas do CDN, com a política sem nonce que o `next.config.ts` lhes põe. Ver
  o comentário longo do `lib/cabecalhos.ts`.

  O `next.config.ts` **não** emite CSP nenhuma para `/painel`, de propósito: duas
  linhas `Content-Security-Policy` na mesma resposta resolvem-se pela intersecção
  das duas, que é a maneira mais cara que há de ninguém perceber porque é que um
  script deixou de correr.
*/

const NOME_DO_COOKIE = "taskuinha_sessao";

/*
  Um nonce por pedido, e tem mesmo de ser por pedido: um nonce reutilizado é o
  mesmo que não haver nenhum, porque quem conseguisse injectar um script uma vez
  passava a poder assiná-lo para sempre.

  `randomUUID` porque a Web Crypto existe em qualquer runtime onde o proxy corra
  e não obriga a importar `node:crypto` aqui. São 122 bits de aleatoriedade
  criptográfica, a mesma ordem de grandeza dos 128 que a recomendação pede — e o
  que interessa a um nonce é ser impossível de adivinhar dentro da vida de **um**
  pedido, não resistir a análise offline. Os hífenes saem para o valor caber nos
  caracteres que uma directiva de CSP aceita sem aspas a mais.

  O nonce viaja em dois sítios, e os dois são precisos: no cabeçalho da resposta,
  que é o que o browser lê, e no `x-nonce` dos cabeçalhos do **pedido**, que é
  onde o Next o vai buscar para o pôr nas suas etiquetas `<script>`. Sem o
  segundo, o painel abre em branco — a política bloqueia os próprios scripts de
  hidratação do Next.
*/
function comCabecalhosDoPainel(request: NextRequest): NextResponse {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const politica = politicaDeConteudo(nonce);

  const cabecalhos = new Headers(request.headers);
  cabecalhos.set("x-nonce", nonce);
  cabecalhos.set("Content-Security-Policy", politica);

  const resposta = NextResponse.next({ request: { headers: cabecalhos } });
  resposta.headers.set("Content-Security-Policy", politica);

  return resposta;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
    Os ecrãs de entrada têm de ser alcançáveis por quem ainda não entrou — os
    **dois**, que o `startsWith` já cobre: `/painel/entrar` (a password) e
    `/painel/entrar/codigo` (o código do email). Quem estiver a meio do segundo
    passo ainda não tem cookie de sessão, e mandá-lo daqui para trás era um
    ciclo.
  */
  if (pathname.startsWith("/painel/entrar")) {
    return comCabecalhosDoPainel(request);
  }

  /*
    Um redireccionamento não tem corpo e não corre script nenhum — não leva CSP,
    leva a resposta que a seguir a levará.
  */
  if (!request.cookies.has(NOME_DO_COOKIE)) {
    return NextResponse.redirect(new URL("/painel/entrar", request.nextUrl));
  }

  return comCabecalhosDoPainel(request);
}

/*
  Só o painel.

  Os docs recomendam correr o proxy em todas as rotas quando ele **é** a
  autenticação do site inteiro. Aqui não é: protege uma secção isolada, e o
  resto do site não tem sessão nenhuma para ler.

  E há um custo concreto em alargá-lo. O matcher genérico dos exemplos
  (`/((?!api|_next/static|…).*)`) faria com que cada pedido a `/`, a `/ementa` e
  às outras seis passasse por uma função antes de chegar ao CDN. As oito páginas
  continuariam a ser geradas no build — um proxy não torna nada dinâmico — mas
  passavam a pagar uma invocação por visita, para responder sempre a mesma coisa.

  O `npm run fumo` lê o `.next/prerender-manifest.json` para isto não regredir
  em silêncio.
*/
export const config = {
  matcher: ["/painel", "/painel/:path*"],
};
