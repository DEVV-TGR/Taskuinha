import type { NextConfig } from "next";

/*
  Sem `images.remotePatterns`: toda a fotografia é local, em /public/images.
  Se alguma vez voltar a haver imagem remota, é sinal de que algo correu mal —
  ver lib/images.ts.

  ## O português sem prefixo

  As oito páginas são geradas debaixo de `app/[lang]/`, incluindo as
  portuguesas em `/pt`. Mas o português é a língua da casa e a morada dele
  é a morada nua: `taskuinhapirata.pt/` e `taskuinhapirata.pt/ementa`.
  Quem faz essa excepção acontecer é este ficheiro.

  O `rewrite` serve o conteúdo de `/pt` a quem pede `/`, sem mudar o
  endereço na barra. O `redirect` fecha a porta do outro lado: `/pt`
  existe como rota gerada, mas quem lá bata é mandado para `/`, para não
  haver duas moradas indexáveis para a mesma página.

  Não há ciclo entre os dois. Pela ordem de encaminhamento do Next, os
  redirects são verificados **antes** dos rewrites: um pedido a `/` não
  casa com nenhum redirect, é reescrito para `/pt` internamente, e o
  destino de um rewrite não volta a passar pelos redirects.

  ## Porquê uma linha por página e não `/:path*`

  Um rewrite genérico de `/:path*` para `/pt/:path*` apanhava também
  `/en/ementa`. Os rewrites `afterFiles` correm **antes** das rotas
  dinâmicas, por isso `/en/ementa` seria reescrito para `/pt/en/ementa` e
  daria 404 antes de o `[lang]` sequer ser tentado.

  Com duas páginas, a lista explícita é a segura. **Uma página nova pede
  aqui duas linhas** — uma em cada lista.
*/

/*
  ## Os cabeçalhos de segurança

  As oito páginas públicas não têm um único campo de formulário: todo o
  texto que chega ao browser sai de `data/*.json` no build. Não há por onde
  entrar um XSS, e para elas estes cabeçalhos continuam a ser defesa em
  profundidade — o que fechavam a sério era o `frame-ancestors`, que impede
  que alguém ponha a Taskuinha dentro de um iframe e receba os cliques no
  botão do telefone.

  **Isso mudou com o `/painel`.** Passou a haver autenticação, formulários e
  uma sessão em cookie, e o `frame-ancestors` deixou de ser precaução para
  passar a fechar um ataque a sério: clickjacking sobre um painel autenticado
  é outra conversa que clickjacking sobre um botão de telefone.

  ### O `connect-src 'self'` e o GitHub

  O painel grava por HTTP na API do GitHub, e mesmo assim o `connect-src`
  continua a ser só `'self'`. Não é esquecimento: a chamada é feita **no
  servidor**, dentro de uma server action, e o browser nunca fala com o
  `api.github.com`. A CSP só governa o browser.

  Se alguém alguma vez precisar de acrescentar `https://api.github.com` aqui,
  é sinal de que o desenho se partiu e de que o token do GitHub está a passar
  pelo cliente. Não acrescentar — corrigir.

  ### Porque é que há `'unsafe-inline'` no script-src

  Porque a alternativa é pior. Tirá-lo exige nonces, e a documentação do
  Next 16 é explícita: um nonce tem de ser gerado por pedido, o que
  obriga **todas** as páginas a render dinâmico e acaba com a geração
  estática e com o cache de CDN das oito. Para um site onde não há
  conteúdo dinâmico nenhum para injectar, era pagar o site inteiro por um
  ganho teórico.

  O que o `'unsafe-inline'` cobre aqui: os scripts de hidratação que o
  Next injecta (`self.__next_f.push`), diferentes em cada página, e o
  bloco de JSON-LD do `app/[lang]/layout.tsx`.

  ### E no style-src

  O Motion escreve `style=` directamente nos elementos, frame a frame, em
  toda a revelação em scroll e em toda a tralha. E o `lib/texturas.ts`
  passa os data-URI de SVG por estilo inline. Sem `'unsafe-inline'` o
  site abria sem animação nenhuma e sem uma única textura de madeira.

  ### O resto, linha a linha

  `img-src data:` são as texturas de `lib/texturas.ts`; `blob:` é o
  `next/image`. `font-src 'self'` chega porque o `next/font` descarrega as
  quatro fontes no build e serve-as da nossa origem — não há pedido à
  Google em execução. `frame-src` tem uma origem só, a da `mapEmbedUrl`
  em `lib/site.ts`: **se o mapa mudar de fornecedor, muda aqui também**,
  senão a moldura fica vazia sem dizer porquê.

  `X-Frame-Options` diz o mesmo que o `frame-ancestors` e está cá pelos
  browsers que ainda não lêem o segundo. Não há HSTS nesta lista de
  propósito: a Vercel aplica-o sozinha nos domínios personalizados, e
  duplicá-lo era criar duas fontes de verdade para o mesmo valor.

  ### Os ramos de desenvolvimento

  Em `next dev` o React usa `eval` para reconstruir os stacks de erro do
  servidor no browser, e o HMR fala por websocket. Sem estas duas
  excepções o ambiente de trabalho parte — e só ele: em produção nenhuma
  delas é emitida.
*/
const desenvolvimento = process.env.NODE_ENV === "development";

const politicaDeConteudo = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desenvolvimento ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "frame-src https://www.openstreetmap.org",
  `connect-src 'self'${desenvolvimento ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const cabecalhosDeSeguranca = [
  { key: "Content-Security-Policy", value: politicaDeConteudo },
  /*
    `strict-origin-when-cross-origin`: quem sai daqui para o Instagram, o
    TripAdvisor ou a OpenStreetMap leva `https://www.taskuinhapirata.pt`
    e mais nada — não leva a página exacta em que estava.
  */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* Sem isto o browser pode adivinhar o tipo dos SVG servidos de /public. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  /*
    O site não pede câmara, microfone, localização, pagamento nem USB.
    Negar de antemão fecha a porta a um iframe que os pedisse por nós.
  */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/*
  Os dois cabeçalhos que só o painel precisa.

  Vão numa entrada à parte, antes da genérica, e não repetem nenhuma chave
  dela — duas entradas que casam com o mesmo caminho e declaram a mesma chave
  têm uma resolução em que não vale a pena confiar.

  `no-store` porque um painel autenticado não se guarda em lado nenhum: nem no
  CDN da Vercel, nem no disco do browser, nem no botão "voltar" — que é o caso
  que se esquece e o que faria aparecer a ementa de outra pessoa depois de sair.

  `X-Robots-Tag` é a terceira camada do "isto não se indexa", ao lado do
  `app/robots.ts` e da metadata do `app/painel/layout.tsx`. É a única das três
  que vale numa resposta que não é HTML.
*/
const cabecalhosDoPainel = [
  { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/painel/:path*", headers: cabecalhosDoPainel },
      { source: "/painel", headers: cabecalhosDoPainel },
      { source: "/(.*)", headers: cabecalhosDeSeguranca },
    ];
  },


  async rewrites() {
    return [
      { source: "/", destination: "/pt" },
      { source: "/ementa", destination: "/pt/ementa" },
    ];
  },

  async redirects() {
    return [
      { source: "/pt", destination: "/", permanent: true },
      { source: "/pt/ementa", destination: "/ementa", permanent: true },
    ];
  },
};

export default nextConfig;
