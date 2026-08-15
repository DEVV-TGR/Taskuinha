import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/*
  O `disallow` do painel é uma de três camadas, e a mais fraca das três — um
  robots.txt é um pedido, não uma fechadura, e há quem o leia ao contrário,
  como mapa do que vale a pena espreitar. Vale à mesma: o Google respeita-o, e
  o painel não tem nada que apareça numa pesquisa por "taskuinha".

  As outras duas são o `robots: { index: false }` da metadata do
  `app/painel/layout.tsx` e o cabeçalho `X-Robots-Tag` do `next.config.ts`.
  Quem fecha mesmo a porta não é nenhuma delas — é o `proxy.ts` mais o
  `exigirSessao()`.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/painel" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
