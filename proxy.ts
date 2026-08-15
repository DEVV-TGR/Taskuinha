import { NextResponse, type NextRequest } from "next/server";

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
*/

const NOME_DO_COOKIE = "taskuinha_sessao";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* O ecrã de entrada tem de ser alcançável por quem ainda não entrou. */
  if (pathname.startsWith("/painel/entrar")) return NextResponse.next();

  if (!request.cookies.has(NOME_DO_COOKIE)) {
    return NextResponse.redirect(new URL("/painel/entrar", request.nextUrl));
  }

  return NextResponse.next();
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
