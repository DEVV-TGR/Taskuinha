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
const nextConfig: NextConfig = {
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
