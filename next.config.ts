import type { NextConfig } from "next";
import {
  politicaDeConteudo,
  cabecalhosComuns,
  cabecalhosDoPainel,
} from "./lib/cabecalhos";

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

  A lista deixou de viver aqui: está em `lib/cabecalhos.ts`, porque passou a ter
  dois leitores. Este ficheiro põe-nos nas respostas do site; o `proxy.ts` emite
  a variante do painel, a única com nonce. Este ficheiro decide **onde** cada uma
  se aplica, e mais nada.

  ### Duas entradas que não se sobrepõem

  A CSP do painel é emitida pelo `proxy.ts`, e por isso o painel **não pode**
  apanhar também a genérica daqui: duas entradas a declarar a mesma chave para o
  mesmo caminho dão duas linhas `Content-Security-Policy` na resposta, e uma
  política em duplicado resolve-se pela intersecção das duas — que é uma forma
  cara de ninguém perceber, daí a meses, porque é que um script deixou de
  correr.

  Daí o `source` com a lookahead. O que ele quer dizer é "tudo menos o painel", e
  o `npm run fumo` confirma as duas metades: que as oito páginas continuam a
  trazer a CSP, e que o painel traz a dele, com nonce e sem `'unsafe-inline'`.

  Os cabeçalhos que **não** dependem do caminho — `X-Frame-Options`,
  `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` — vão nas
  duas entradas. O painel não abdica de nenhum deles só por ter entrada própria.
*/
const nextConfig: NextConfig = {
  async headers() {
    return [
      /* Sem CSP: a do painel leva nonce e é o `proxy.ts` que a emite. */
      {
        source: "/painel/:path*",
        headers: [...cabecalhosDoPainel, ...cabecalhosComuns],
      },
      { source: "/painel", headers: [...cabecalhosDoPainel, ...cabecalhosComuns] },
      {
        source: "/((?!painel).*)",
        headers: [
          { key: "Content-Security-Policy", value: politicaDeConteudo() },
          ...cabecalhosComuns,
        ],
      },
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
