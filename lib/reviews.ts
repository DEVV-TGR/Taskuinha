/*
  Avaliações agregadas e citações recolhidas em Agosto de 2026.
  As notas e contagens são verificáveis nas plataformas.
  As citações são literais, tal como apareciam nas páginas públicas.
  ANTES DE PUBLICAR: confirmar a autoria de cada citação com a plataforma
  de origem, porque parte delas foi lida através de agregadores.
*/

export type Rating = {
  platform: string;
  score: string;
  outOf: string;
  count: string;
  note: string;
  href: string;
  /* slug da Simple Icons, para o logótipo */
  icon: string;
};

export const ratings: Rating[] = [
  {
    platform: "Google",
    score: "4,6",
    outOf: "5",
    count: "cerca de 1350 avaliações",
    note: "",
    href: "https://pt.restaurantguru.com/Taskuinha-Vila-Cha",
    icon: "google",
  },
  {
    platform: "TripAdvisor",
    score: "4,4",
    outOf: "5",
    count: "96 avaliações",
    note: "30.º de 182 restaurantes em Vila do Conde",
    href: "https://www.tripadvisor.pt/Restaurant_Review-g189186-d6874259-Reviews-Rumoceano_Taskuinha-Vila_do_Conde_Porto_District_Northern_Portugal.html",
    icon: "tripadvisor",
  },
];

export type Quote = {
  text: string;
  lang: "pt" | "en" | "fr";
  source: string;
};

export const quotes: Quote[] = [
  {
    text: "Bar super agradável!",
    lang: "pt",
    source: "Avaliação no Google",
  },
  {
    text: "A very charming fisherman's pub with a lot of character and very friendly staff.",
    lang: "en",
    source: "Avaliação no Restaurant Guru",
  },
  {
    text: "Bon manger frais près de la mer. Service impeccable.",
    lang: "fr",
    source: "Avaliação no TripAdvisor",
  },
];
