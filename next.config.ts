import type { NextConfig } from "next";

/*
  Sem `images.remotePatterns`: toda a fotografia é local, em /public/images.
  Se alguma vez voltar a haver imagem remota, é sinal de que algo correu mal —
  ver lib/images.ts.

  ## O português sem prefixo

  As oito páginas são geradas debaixo de `app/[lang]/`, incluindo as
  portuguesas em `/pt`. Mas o português é a língua da casa e a morada dele
  é a morada nua: `taskuinha.pt/` e `taskuinha.pt/ementa`. Quem faz essa
  excepção acontecer é este ficheiro.

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

  O site não tem autenticação, nem API, nem base de dados, nem um único
  campo de formulário: todo o texto que chega ao browser são constantes
  deste repositório. Não há por onde entrar um XSS. Estes cabeçalhos são
  portanto defesa em profundidade, e o que fecham a sério é outra coisa —
  o `frame-ancestors`, que impede que alguém ponha a Taskuinha dentro de
  um iframe e receba os cliques no botão do telefone.

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
    TripAdvisor ou a OpenStreetMap leva `https://taskuinha.pt` e mais
    nada — não leva a página exacta em que estava.
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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: cabecalhosDeSeguranca }];
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
