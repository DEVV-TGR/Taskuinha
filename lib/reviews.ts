/*
  Avaliações agregadas e citações recolhidas em Agosto de 2026.
  As notas e contagens são verificáveis nas plataformas.
  As citações são literais, tal como apareciam nas páginas públicas.
  ANTES DE PUBLICAR: confirmar a autoria de cada citação com a plataforma
  de origem, porque parte delas foi lida através de agregadores.
*/

import { site } from "@/lib/site";

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
    count: "cerca de 1348 avaliações",
    note: "",
    // Não há uma ligação directa à ficha do Google Business verificada;
    // o Google Maps mostra as mesmas avaliações, e é uma propriedade
    // Google a sério — ao contrário do que estava aqui antes (um logótipo
    // do Google a apontar para o RestaurantGuru).
    href: site.links.directions,
    icon: "google",
  },
  {
    platform: "TripAdvisor",
    score: "4,4",
    outOf: "5",
    count: "100 avaliações",
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

/*
  As sete que aparecem na secção "O que dizem".

  ## Duas proveniências, e não são iguais

  As **três primeiras** vieram da recolha de Agosto de 2026 e parte delas foi
  lida através de agregadores — é a elas que o aviso do topo do ficheiro se
  aplica. Não têm autor porque a recolha não o guardou.

  As **quatro últimas** foram passadas pelo Gonçalo, tiradas por ele da página
  do TripAdvisor da casa. Levam o nome de utilizador e o mês no `source`: é
  público, está ao lado da avaliação na plataforma, e é o que torna a citação
  verificável — que é exactamente o que o aviso do topo pede.

  ## Literais, incluindo o que incomoda

  Vão como foram escritas, com a pontuação e as maiúsculas de cada um.
  A do "A voltar novamente" traz *"a sangria podiam melhorar"*. Cortar essa
  frase e manter o resto entre aspas era pôr na boca de alguém uma coisa que
  essa pessoa não disse — ou se cita inteira, ou não se cita. Fica inteira, e
  o Gonçalo sabe que está lá.
*/
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
  {
    text: "Vou imensas vezes por ano! Recomendo! É uma experiência que não pode perder! Comida muito bem confeccionada, gente super atenciosa, e a casa em si, a decoração é espetacular!",
    lang: "pt",
    source: "Sherpa58221185901, TripAdvisor, janeiro de 2024",
  },
  {
    text: "Ambiente relaxado, boa música, vinho engarrafado bonzinho, junto à praia, Sunset, tudo somado, é o ideal para estar com amigos.",
    lang: "pt",
    source: "Paradise43784871060, TripAdvisor, abril de 2023",
  },
  {
    text: "Empregados muito prestáveis, simpáticos. Serviço rápido! Comida ótima!! Bom preço para a qualidade. Recomendo!!",
    lang: "pt",
    source: "veram916, TripAdvisor, junho de 2020",
  },
  {
    text: "Adorei o atendimento, relação preço qualidade bom. A sangria podiam melhorar. Mas a voltar certamente. O espaço é acolhedor e diferente.",
    lang: "pt",
    source: "Journey42940693153, TripAdvisor, junho de 2025",
  },
];
