import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/* Grotesk larga, para títulos com peso de placa pintada de doca. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Só para preços, horas e números. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
      ratingCount: 1350,
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
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0b1214" />
        {/* As secções entram com uma revelação em scroll. Sem JavaScript
            ficariam invisíveis, por isso repomos o estado final. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-on-accent focus:font-medium"
        >
          Saltar para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
