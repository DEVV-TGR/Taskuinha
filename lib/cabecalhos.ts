/*
  Os cabeçalhos de segurança, num sítio só.

  Vivem aqui, e não no `next.config.ts`, porque passaram a ter dois leitores: o
  `next.config.ts`, que os põe nas respostas do site, e o `proxy.ts`, que emite
  a variante do painel — a única que leva nonce. Ter a lista escrita duas vezes
  era a forma garantida de uma das duas ficar para trás.

  Este ficheiro não importa `server-only`, e não é esquecimento: o
  `next.config.ts` é carregado pelo Next fora do grafo da aplicação, e um
  `server-only` aqui rebentava o arranque. Também não lê nada de fora além do
  `NODE_ENV` — não há segredos nenhuns nestas linhas.
*/

const desenvolvimento = process.env.NODE_ENV === "development";

/*
  ## Porquê duas políticas e não uma

  ### As oito páginas públicas ficam com `'unsafe-inline'`

  Porque a alternativa é pior. Tirá-lo exige nonces, e a documentação do Next 16
  é explícita: um nonce tem de ser gerado por pedido, o que obriga **todas** as
  páginas a render dinâmico e acaba com a geração estática e com o cache de CDN
  das oito. Para um site onde não há conteúdo dinâmico nenhum para injectar, era
  pagar o site inteiro por um ganho teórico.

  O que o `'unsafe-inline'` cobre aqui: os scripts de hidratação que o Next
  injecta (`self.__next_f.push`), diferentes em cada página, e o bloco de JSON-LD
  do `app/[lang]/layout.tsx`.

  ### O painel leva nonce

  E leva-o de graça: o `/painel` já é dinâmico — tem sessão em cookie, portanto
  nunca foi estático — e já passa pelo `proxy.ts` a cada pedido. O custo que
  torna o nonce má ideia nas oito páginas simplesmente não existe aqui, e é aqui
  que há uma sessão autenticada do outro lado.

  Com `'nonce-…'` presente, o `'unsafe-inline'` é **ignorado** pelo browser — daí
  não vir nesta variante. O `'strict-dynamic'` é o que deixa os scripts com nonce
  carregar os pedaços que o Next vai buscando à medida que navega.

  ## O `style-src` mantém `'unsafe-inline'` nas duas

  O Motion escreve `style=` directamente nos elementos, frame a frame, e o
  `lib/texturas.ts` passa os data-URI de SVG por estilo inline — é assim que
  nasce toda a madeira, incluindo a `Tabua` de cada cartão do painel. Um nonce no
  `style-src` não os cobre (o React não põe nonce em atributos `style`), e o
  painel abria sem uma única textura.

  ## O `connect-src 'self'` e o GitHub

  O painel grava por HTTP na API do GitHub, e mesmo assim o `connect-src`
  continua a ser só `'self'`. Não é esquecimento: a chamada é feita **no
  servidor**, dentro de uma server action, e o browser nunca fala com o
  `api.github.com`. A CSP só governa o browser. O mesmo vale para o Resend e para
  o Upstash.

  Se alguém alguma vez precisar de acrescentar um destes domínios aqui, é sinal
  de que o desenho se partiu e de que um segredo está a passar pelo cliente. Não
  acrescentar — corrigir.

  ## O resto, linha a linha

  `img-src data:` são as texturas de `lib/texturas.ts`; `blob:` é o `next/image`.
  `font-src 'self'` chega porque o `next/font` descarrega as quatro fontes no
  build e serve-as da nossa origem — não há pedido à Google em execução.
  `frame-src` tem uma origem só, a da `mapEmbedUrl` em `lib/site.ts`: **se o mapa
  mudar de fornecedor, muda aqui também**, senão a moldura fica vazia sem dizer
  porquê.

  Não há HSTS nesta lista de propósito: a Vercel aplica-o sozinha nos domínios
  personalizados, e duplicá-lo era criar duas fontes de verdade para o mesmo
  valor.

  ## Os ramos de desenvolvimento

  Em `next dev` o React usa `eval` para reconstruir os stacks de erro do servidor
  no browser, e o HMR fala por websocket. Sem estas duas excepções o ambiente de
  trabalho parte — e só ele: em produção nenhuma delas é emitida. O
  `scripts/fumo.mjs` confirma que não escaparam.
*/
export function politicaDeConteudo(nonce?: string): string {
  const scripts = nonce
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "'self' 'unsafe-inline'";

  return [
    "default-src 'self'",
    `script-src ${scripts}${desenvolvimento ? " 'unsafe-eval'" : ""}`,
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
}

/*
  Os que não dependem do caminho nem do pedido, e por isso são iguais em todo o
  lado — site e painel.

  O que fecha a sério é o `frame-ancestors` da CSP, que impede que alguém ponha a
  Taskuinha dentro de um iframe e receba os cliques no botão do telefone. Desde
  que há painel, fecha mais do que isso: clickjacking sobre um painel autenticado
  é outra conversa que clickjacking sobre um botão de telefone.
*/
export const cabecalhosComuns = [
  /*
    `strict-origin-when-cross-origin`: quem sai daqui para o Instagram, o
    TripAdvisor ou a OpenStreetMap leva `https://www.taskuinhapirata.pt` e mais
    nada — não leva a página exacta em que estava.
  */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* Sem isto o browser pode adivinhar o tipo dos SVG servidos de /public. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Diz o mesmo que o `frame-ancestors`, para os browsers que não lêem o segundo. */
  { key: "X-Frame-Options", value: "DENY" },
  /*
    O site não pede câmara, microfone, localização, pagamento nem USB. Negar de
    antemão fecha a porta a um iframe que os pedisse por nós.
  */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/*
  Os dois que só o painel precisa.

  `no-store` porque um painel autenticado não se guarda em lado nenhum: nem no
  CDN da Vercel, nem no disco do browser, nem no botão "voltar" — que é o caso
  que se esquece e o que faria aparecer a ementa de outra pessoa depois de sair.

  `X-Robots-Tag` é a terceira camada do "isto não se indexa", ao lado do
  `app/robots.ts` e da metadata do `app/painel/layout.tsx`. É a única das três
  que vale numa resposta que não é HTML.
*/
export const cabecalhosDoPainel = [
  { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];
