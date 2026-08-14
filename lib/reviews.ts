/*
  Avaliações agregadas e citações recolhidas em Agosto de 2026.
  As notas e contagens são verificáveis nas plataformas.
  As citações são literais, tal como apareciam nas páginas públicas.
  Parte delas tinha sido lida através de agregadores, e por isso a autoria
  de cada uma foi revista antes de o site ir para o ar.
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

/* `as const satisfies` pelo mesmo motivo do `lib/menu.ts`: as traduções do
   `lib/reviews-linguas.ts` são indexadas por estes literais. */
export const ratings = [
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
] as const satisfies readonly Rating[];

export type Quote = {
  /* Chave curta, para o `lib/reviews-linguas.ts` não ter de se indexar pelo
     texto inteiro da citação. Não aparece em lado nenhum da página. */
  id: string;
  text: string;
  /** A língua em que a citação foi **escrita**. Não é a da página. */
  lang: "pt" | "en" | "fr";
  source: string;
};

/*
  Quatro, e fecham a grelha de duas colunas em duas linhas certas. Eram sete e
  sobrava uma célula vazia; o Gonçalo pediu quatro e deixou a escolha comigo.

  ## Porque estas

  Havia sete candidatas. As quatro que ficam cobrem coisas diferentes — comida,
  serviço, casa, sítio — em vez de repetirem "muito bom" de maneiras
  diferentes, e duas delas trazem autor.

  | Fica | Porquê |
  |---|---|
  | Sherpa58221185901 | A mais completa das sete: cliente repetente, comida, gente e decoração numa só. |
  | Paradise43784871060 | A única que fala do **sítio** — praia, pôr do sol — que é a promessa do cabeçalho da página. |
  | Restaurant Guru (en) | "Fisherman's pub with a lot of character": descreve o que a casa é, não só se gostou. |
  | TripAdvisor (fr) | Marisco fresco e o mar, em três palavras. |

  **As duas de fora são de propósito.** O parágrafo de entrada da secção diz
  que "chegam avaliações em várias línguas" — ficar só com portuguesas
  transformava uma frase verdadeira numa frase por provar. É a razão de as duas
  sem autor terem sobrevivido a duas que o têm.

  ## E as três que saíram

  - *"Bar super agradável!"* — três palavras que não dizem nada de concreto.
  - **veram916** — boa, mas diz o mesmo que a da Sherpa, com menos, e é a mais
    antiga das quatro do Gonçalo (2020).
  - **Journey42940693153** — é a mais recente (2025), e traz *"a sangria podiam
    melhorar"*. Não a cortei a meio: ou se cita inteira, ou não se cita, e
    havia quatro melhores para o lugar. Se ele a quiser de volta, volta
    **inteira**.

  ## Proveniência

  As duas estrangeiras vieram da recolha de Agosto de 2026, parte dela lida
  através de agregadores — é a elas que o aviso do topo do ficheiro se aplica,
  e não têm autor porque a recolha não o guardou. As duas portuguesas foram
  passadas pelo Gonçalo, tiradas da página do TripAdvisor da casa; o nome de
  utilizador e o mês estão no `source` porque são públicos e é o que torna a
  citação verificável.
*/
export const quotes = [
  {
    id: "sherpa",
    text: "Vou imensas vezes por ano! Recomendo! É uma experiência que não pode perder! Comida muito bem confeccionada, gente super atenciosa, e a casa em si, a decoração é espetacular!",
    lang: "pt",
    source: "Sherpa58221185901, TripAdvisor, janeiro de 2024",
  },
  {
    id: "guru",
    text: "A very charming fisherman's pub with a lot of character and very friendly staff.",
    lang: "en",
    source: "Avaliação no Restaurant Guru",
  },
  {
    id: "paradise",
    text: "Ambiente relaxado, boa música, vinho engarrafado bonzinho, junto à praia, Sunset, tudo somado, é o ideal para estar com amigos.",
    lang: "pt",
    source: "Paradise43784871060, TripAdvisor, abril de 2023",
  },
  {
    id: "tripadvisor-fr",
    text: "Bon manger frais près de la mer. Service impeccable.",
    lang: "fr",
    source: "Avaliação no TripAdvisor",
  },
] as const satisfies readonly Quote[];
