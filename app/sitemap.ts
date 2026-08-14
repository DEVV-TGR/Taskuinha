import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales, linguas, caminho, defaultLocale } from "@/lib/i18n";

/*
  Oito moradas: as duas páginas vezes as quatro línguas.

  Fica na raiz de `app/` e não dentro do `[lang]`. O sitemap é do sítio
  inteiro e tem um endereço só — `/sitemap.xml` — por isso não pertence a
  nenhuma língua em particular. O mesmo vale para o `robots.ts` e para o
  `icon.svg`.

  Cada entrada leva o bloco `alternates.languages` com as quatro moradas da
  mesma página. É o que diz ao motor de busca que `/en/ementa` e `/ementa`
  são a mesma coisa em línguas diferentes, e não conteúdo duplicado.

  A morada portuguesa é a nua, sem `/pt` — é o `caminho()` que trata disso,
  e é preciso que assim seja: `/pt` redirecciona para `/` e um sitemap cheio
  de redireccionamentos é um sitemap mal feito.
*/
const paginas = [
  { rota: "/", prioridade: 1 },
  { rota: "/ementa", prioridade: 0.8 },
];

function morada(lang: (typeof locales)[number], rota: string) {
  return `${site.url}${caminho(lang, rota)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return paginas.flatMap(({ rota, prioridade }) =>
    locales.map((lang) => ({
      url: morada(lang, rota),
      changeFrequency: "monthly" as const,
      priority: prioridade,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((outra) => [
              linguas[outra].htmlLang,
              morada(outra, rota),
            ]),
          ),
          /* O mesmo `x-default` que vai no `<head>`, pela mesma razão. */
          "x-default": morada(defaultLocale, rota),
        },
      },
    })),
  );
}
