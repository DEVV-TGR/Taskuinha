import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales, linguas, caminho, defaultLocale } from "@/lib/i18n";
import ementa from "@/data/ementa.json";
import casa from "@/data/casa.json";

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

  ## O que não está aqui: `changefreq` e `priority`

  Estiveram, com `monthly` e `1` / `0.8`. O Google disse publicamente que não
  olha para nenhum dos dois, e o `priority` ainda tem outro problema: é
  relativo às moradas do próprio sítio, e com oito não há a quem dizer o que é
  mais importante — só existem estas. Saíram os dois; ficou o `lastmod`, que
  é o único que o Google usa.

  ## Cada página com a sua própria data

  A data sai do `actualizado` do ficheiro de dados que faz a página, e é lá
  escrita pelo painel de cada vez que se grava — ver o `carimbar()` em
  `lib/painel/github.ts`. A `/ementa` só muda de data quando a ementa muda
  mesmo; a página inicial, quando mudam os contactos ou o horário.

  Uma data que não se consiga ler não vira `Invalid Date` no XML: fica sem
  `lastmod`, que é o que o sitemap tinha até aqui e continua a ser válido.
  Nenhuma data é melhor do que uma data errada.
*/
const paginas = [
  { rota: "/", quando: casa.actualizado },
  { rota: "/ementa", quando: ementa.actualizado },
];

function morada(lang: (typeof locales)[number], rota: string) {
  return `${site.url}${caminho(lang, rota)}`;
}

function data(quando: string | undefined): Date | undefined {
  if (!quando) return undefined;
  const lida = new Date(quando);
  return Number.isNaN(lida.getTime()) ? undefined : lida;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return paginas.flatMap(({ rota, quando }) =>
    locales.map((lang) => ({
      url: morada(lang, rota),
      lastModified: data(quando),
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
