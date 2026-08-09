import type { Metadata } from "next";
import {
  Rye,
  Alegreya_Sans,
  Special_Elite,
  IM_Fell_English_SC,
} from "next/font/google";
import { site } from "@/lib/site";
import { Tralha } from "@/components/decor/Tralha";
import { Entrada } from "@/components/Entrada";
import { Travessia } from "@/components/Travessia";
import "./globals.css";

/*
  Títulos e wordmark. Wood-type de tabuleta de doca. Só tem peso 400.
  É a única fonte com `preload`: aparece no hero e é o maior candidato a LCP.
*/
const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/*
  Corpo. Humanista, boa em pt-PT, tem acentuação completa.
  `preload: false` — o `next/font` faz preload por omissão em todas as
  fontes; o comentário da Rye já dizia "só ela leva preload" mas isso nunca
  tinha sido desligado nas outras três. Verificado com Lighthouse: quatro
  fontes a competir pela mesma ligação no arranque empurra o LCP para bem
  longe dos 2,5s do plano.
*/
const alegreya = Alegreya_Sans({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

/* Preços, horas e números fora do pergaminho. Máquina de escrever gasta. */
const elite = Special_Elite({
  variable: "--font-elite",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/* Só dentro do pergaminho da ementa. Prensa inglesa do séc. XVII. */
const imfell = IM_Fell_English_SC({
  variable: "--font-imfell",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} · Taberna à beira-mar em Vila Chã`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  keywords: [
    "restaurante Vila Chã",
    "petiscos Vila do Conde",
    "marisco à beira-mar",
    "Taskuinha",
    "Caminho de Santiago",
  ],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: site.fullName,
    title: `${site.fullName} · Taberna à beira-mar em Vila Chã`,
    description: site.description,
    url: site.url,
  },
  robots: { index: true, follow: true },
};

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.fullName,
    alternateName: site.legalName,
    description: site.description,
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
      // O conteúdo é estático e definido neste ficheiro.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${rye.variable} ${alegreya.variable} ${elite.variable} ${imfell.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#080B0D" />
        {/*
          As secções entram com uma revelação em scroll; a tralha decorativa
          balança ou fica dependurada. Sem JavaScript nada disso corre, por
          isso repomos o estado final de todas as marcas que dependem dele.
        */}
        <noscript>
          <style>{`[data-reveal],[data-pendurado],[data-tralha]{opacity:1!important;transform:none!important;animation:none!important}[data-tralha-movel]{display:none!important}`}</style>
        </noscript>
        <StructuredData />
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
          Saltar para o conteúdo
        </a>
        <Entrada />
        {/*
          Portadas de transição entre páginas. Intersectam os cliques em
          ligações internas — por isso montam-se aqui, ao lado do {children},
          e não dentro de nenhuma página: têm de apanhar a Nav também.
        */}
        <Travessia />
        {children}
        {/*
          Camada de tralha decorativa: aranha, rede, bandeirinhas,
          sardaniscas. Uma vez, aqui, depois de {children} — fixed inset-0,
          por isso a ordem no DOM não afecta o layout, só o empilhamento.
        */}
        <Tralha />
      </body>
    </html>
  );
}
