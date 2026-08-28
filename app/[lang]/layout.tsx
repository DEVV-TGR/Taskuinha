import type { Metadata } from "next";
import { fontes } from "../fontes";
import { site } from "@/lib/site";
import { locales, linguas, caminho, alternativas } from "@/lib/i18n";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";
import { Tralha } from "@/components/decor/Tralha";
import { Chegada } from "@/components/Chegada";
import { Travessia } from "@/components/Travessia";
import { Musica } from "@/components/Musica";
import "../globals.css";

/*
  As quatro línguas, geradas no build.

  O `dynamicParams = false` fecha a porta ao resto: `/xx` com um xx que não
  seja língua nossa dá 404 sem chegar a renderizar. Sem ele, o
  `notFound()` do `linguaActual()` ainda apanhava o caso, mas só depois de
  o servidor tentar desenhar a página.
*/
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await linguaActual();
  const dic = await dicionario();
  const titulo = `${site.fullName} · ${dic.meta.titulo}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: titulo, template: `%s · ${site.fullName}` },
    description: dic.meta.descricao,
    keywords: dic.meta.palavras,
    alternates: {
      canonical: caminho(lang, "/"),
      languages: alternativas("/"),
    },
    openGraph: {
      type: "website",
      locale: linguas[lang].ogLocale,
      siteName: site.fullName,
      title: titulo,
      description: dic.meta.descricao,
      url: caminho(lang, "/"),
    },
    robots: { index: true, follow: true },
  };
}

function StructuredData({ descricao }: { descricao: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.fullName,
    alternateName: site.legalName,
    /*
      A única linha traduzida do bloco. O resto — morada, coordenadas,
      horários, `sameAs` — são dados, iguais em qualquer língua, e o
      `servesCuisine` usa os termos do schema.org, que são fixos.
    */
    description: descricao,
    url: site.url,
    telephone: site.phone.tel,
    priceRange: "€€",
    servesCuisine: ["Portuguesa", "Marisco", "Petiscos"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: site.openingHoursSpec.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.days,
      opens: spec.opens,
      closes: spec.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.6,
      bestRating: 5,
      // Tem de bater certo com lib/reviews.ts — verificado em Agosto de 2026.
      ratingCount: 1348,
    },
    sameAs: [
      site.links.instagram,
      site.links.facebook,
      site.links.tripadvisor,
      site.links.restaurantGuru,
    ],
    hasMenu: `${site.url}/ementa`,
  };

  return (
    <script
      type="application/ld+json"
      /*
        O conteúdo é estático e definido neste ficheiro — nenhum destes
        valores vem de fora. O escape do `<` é na mesma: um `</script>`
        dentro de uma string JSON fecha a etiqueta e o resto passa a
        marcação, e a única coisa que separa isto de acontecer é a
        descrição continuar a não vir de lado nenhum. Custa uma linha.
      */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await linguaActual();
  const dic = await dicionario();

  return (
    <html
      lang={linguas[lang].htmlLang}
      className={`${fontes} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#080B0D" />
        {/*
          As secções entram com uma revelação em scroll; a tralha decorativa
          balança ou fica dependurada. Sem JavaScript nada disso corre, por
          isso repomos o estado final de todas as marcas que dependem dele.
        */}
        {/*
          O `[data-chegada]` é o portão da entrada, servido **fechado** no
          HTML. Quem abre as folhas é o JavaScript; sem ele ficavam fechadas
          para sempre e o site era duas tábuas. Aqui desaparece de todo.
        */}
        <noscript>
          <style>{`[data-reveal],[data-pendurado],[data-tralha]{opacity:1!important;transform:none!important;animation:none!important}[data-tralha-movel],[data-chegada]{display:none!important}`}</style>
        </noscript>
        <StructuredData descricao={dic.meta.descricao} />
      </head>
      <body className="min-h-full flex flex-col bg-breu text-osso">
        {/*
          z-[70]: acima da <Tralha /> (z-60), senão o skip link fica
          escondido atrás dela para quem navega só por teclado — §11.10.
        */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[var(--radius-card)] focus:bg-lanterna focus:px-5 focus:py-3 focus:text-sobre-acento focus:font-medium"
        >
          {dic.geral.saltar}
        </a>
        {/*
          O portão à chegada: as folhas vêm fechadas no HTML e o cliente
          abre-as. Monta uma vez — o layout persiste entre navegações de
          cliente, por isso não reaparece a cada página.
        */}
        <Chegada />
        {/*
          As mesmas folhas, outro movimento: transição entre páginas.
          Intersectam os cliques em ligações internas — por isso montam-se
          aqui, ao lado do {children}, e não dentro de nenhuma página: têm de
          apanhar a Nav também.
        */}
        <Travessia />
        {children}
        {/*
          A música da casa e o botão para a calar. Aqui, no layout, pelo mesmo
          motivo da <Chegada />: o layout persiste entre navegações de cliente,
          por isso a faixa não reinicia quando se vai à ementa e se volta.
        */}
        <Musica texto={dic.som} />
        {/*
          Camada de tralha decorativa: aranha e rede. Uma vez, aqui, depois
          de {children} — fixed inset-0, por isso a ordem no DOM não afecta
          o layout, só o empilhamento.
        */}
        <Tralha />
      </body>
    </html>
  );
}
