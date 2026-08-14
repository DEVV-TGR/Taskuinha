import type { Locale } from "@/lib/i18n";
import { quotes, ratings, type Quote, type Rating } from "@/lib/reviews";

/*
  As citações e as notas das plataformas, nas quatro línguas.

  ## Traduzir palavras que outra pessoa escreveu

  Isto não é como traduzir o resto do site. As citações são de gente com
  nome e mês publicados, e nenhuma delas escreveu o que aqui está em três
  das quatro línguas. Por isso a tradução **diz que é tradução**: o cartão
  mostra, por baixo da citação, "Traduzido do inglês" — a chave
  `vozes.traduzido` dos dicionários, indexada pela língua em que a pessoa
  realmente escreveu.

  A alternativa era deixar cada citação na língua original. Perdia-se o
  sentido de metade delas para metade de quem entra, que é precisamente o
  problema que este trabalho existe para resolver. Traduzir e assinalar é
  o meio-termo honesto: ninguém fica sem perceber, e ninguém fica a pensar
  que a senhora do TripAdvisor escreve espanhol.

  Note-se que o `pt` também está aqui. Não é redundância: as citações
  inglesa e francesa passam a aparecer traduzidas **também na página
  portuguesa**, com a mesma etiqueta. Antes apareciam em inglês e francês
  no meio do português.

  ## O que não se traduz

  O `source` guarda o nome de utilizador e o mês, que é o que torna a
  citação verificável — o nome de utilizador nunca muda, só o mês é que se
  escreve na língua de cada um. O `score` e o `outOf` acompanham o
  separador decimal de cada língua ("4,6" em português e francês, "4.6" em
  inglês).
*/

type IdCitacao = (typeof quotes)[number]["id"];
type Plataforma = (typeof ratings)[number]["platform"];

type CitacaoTraduzida = { text: string; source: string };
type AvaliacaoTraduzida = { score: string; count: string; note: string };

const citacoes: Record<Locale, Record<IdCitacao, CitacaoTraduzida>> = {
  pt: {
    sherpa: {
      text: "Vou imensas vezes por ano! Recomendo! É uma experiência que não pode perder! Comida muito bem confeccionada, gente super atenciosa, e a casa em si, a decoração é espetacular!",
      source: "Sherpa58221185901, TripAdvisor, janeiro de 2024",
    },
    guru: {
      text: "Uma taberna de pescadores cheia de encanto, com muito carácter e pessoal muito simpático.",
      source: "Avaliação no Restaurant Guru",
    },
    paradise: {
      text: "Ambiente relaxado, boa música, vinho engarrafado bonzinho, junto à praia, Sunset, tudo somado, é o ideal para estar com amigos.",
      source: "Paradise43784871060, TripAdvisor, abril de 2023",
    },
    "tripadvisor-fr": {
      text: "Come-se bem e fresco à beira-mar. Serviço impecável.",
      source: "Avaliação no TripAdvisor",
    },
  },

  en: {
    sherpa: {
      text: "I go loads of times a year! I recommend it! It is an experience you can't miss! Food cooked really well, super attentive people, and the house itself — the decoration is spectacular!",
      source: "Sherpa58221185901, TripAdvisor, January 2024",
    },
    guru: {
      text: "A very charming fisherman's pub with a lot of character and very friendly staff.",
      source: "Review on Restaurant Guru",
    },
    paradise: {
      text: "Relaxed atmosphere, good music, decent bottled wine, right by the beach, sunset — all of it added up, it is ideal for being with friends.",
      source: "Paradise43784871060, TripAdvisor, April 2023",
    },
    "tripadvisor-fr": {
      text: "Good fresh food by the sea. Impeccable service.",
      source: "Review on TripAdvisor",
    },
  },

  fr: {
    sherpa: {
      text: "J'y vais des tas de fois par an ! Je recommande ! C'est une expérience à ne pas manquer ! Cuisine très bien faite, personnel super attentionné, et la maison elle-même, la décoration est spectaculaire !",
      source: "Sherpa58221185901, TripAdvisor, janvier 2024",
    },
    guru: {
      text: "Un bistrot de pêcheurs plein de charme, avec beaucoup de caractère et un personnel très sympathique.",
      source: "Avis sur Restaurant Guru",
    },
    paradise: {
      text: "Ambiance détendue, bonne musique, un vin en bouteille tout à fait correct, au bord de la plage, le coucher de soleil : tout mis bout à bout, c'est l'idéal pour être entre amis.",
      source: "Paradise43784871060, TripAdvisor, avril 2023",
    },
    "tripadvisor-fr": {
      text: "Bon manger frais près de la mer. Service impeccable.",
      source: "Avis sur TripAdvisor",
    },
  },

  es: {
    sherpa: {
      text: "¡Voy montones de veces al año! ¡Lo recomiendo! ¡Es una experiencia que no te puedes perder! Comida muy bien hecha, gente súper atenta, y la casa en sí, ¡la decoración es espectacular!",
      source: "Sherpa58221185901, TripAdvisor, enero de 2024",
    },
    guru: {
      text: "Una taberna de pescadores con mucho encanto, llena de carácter y con un personal muy simpático.",
      source: "Reseña en Restaurant Guru",
    },
    paradise: {
      text: "Ambiente relajado, buena música, un vino embotellado majo, junto a la playa, la puesta de sol, todo sumado, es lo ideal para estar con amigos.",
      source: "Paradise43784871060, TripAdvisor, abril de 2023",
    },
    "tripadvisor-fr": {
      text: "Se come bien y fresco junto al mar. Servicio impecable.",
      source: "Reseña en TripAdvisor",
    },
  },
};

const avaliacoes: Record<Locale, Record<Plataforma, AvaliacaoTraduzida>> = {
  pt: {
    Google: { score: "4,6", count: "cerca de 1348 avaliações", note: "" },
    TripAdvisor: {
      score: "4,4",
      count: "100 avaliações",
      note: "30.º de 182 restaurantes em Vila do Conde",
    },
  },
  en: {
    Google: { score: "4.6", count: "about 1,348 reviews", note: "" },
    TripAdvisor: {
      score: "4.4",
      count: "100 reviews",
      note: "30th of 182 restaurants in Vila do Conde",
    },
  },
  fr: {
    Google: { score: "4,6", count: "environ 1348 avis", note: "" },
    TripAdvisor: {
      score: "4,4",
      count: "100 avis",
      note: "30e sur 182 restaurants à Vila do Conde",
    },
  },
  es: {
    Google: { score: "4,6", count: "unas 1348 reseñas", note: "" },
    TripAdvisor: {
      score: "4,4",
      count: "100 reseñas",
      note: "30.º de 182 restaurantes en Vila do Conde",
    },
  },
};

/*
  Uma citação como ela aparece no cartão.

  `original` é a língua em que a pessoa escreveu e não muda com a página —
  é o que escolhe a etiqueta. `traduzida` é falso só quando a página está
  na língua em que a citação foi escrita, e é aí que não se põe etiqueta
  nenhuma.
*/
export type CitacaoMostrada = {
  id: string;
  text: string;
  source: string;
  original: Quote["lang"];
  traduzida: boolean;
};

export function citacoesEm(lang: Locale): CitacaoMostrada[] {
  return quotes.map((citacao) => ({
    id: citacao.id,
    text: citacoes[lang][citacao.id].text,
    source: citacoes[lang][citacao.id].source,
    original: citacao.lang,
    traduzida: citacao.lang !== lang,
  }));
}

export function avaliacoesEm(lang: Locale): Rating[] {
  return ratings.map((avaliacao) => ({
    ...avaliacao,
    ...avaliacoes[lang][avaliacao.platform],
  }));
}
