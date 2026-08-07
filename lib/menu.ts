import { photos, type Photo } from "@/lib/images";

/*
  Ementa de demonstração.

  Os pratos são os que aparecem repetidamente nas avaliações públicas da casa
  (Google, TripAdvisor, Restaurant Guru): amêijoas ao alho, lulas fritas,
  percebes, pataniscas, bacalhau à Brás, vieiras, francesinha, prego no pão,
  sandes de presunto e ovo, chouriço e queijada.

  OS PREÇOS SÃO INVENTADOS. Foram calibrados para o intervalo real de
  10 a 20 € por pessoa que as avaliações indicam, mas têm de ser substituídos
  pelos preços verdadeiros antes de o site ir para o ar.
*/

export const PRECOS_SAO_DEMO = true;

export type Dish = {
  name: string;
  description?: string;
  price: number;
  /** aparece na secção de destaques da página inicial */
  note?: string;
};

export type Category = {
  id: string;
  title: string;
  intro: string;
  dishes: Dish[];
};

export const menu: Category[] = [
  {
    id: "do-mar",
    title: "Do mar",
    intro: "O que vem da lota da manhã. Os percebes dependem do mar.",
    dishes: [
      {
        name: "Amêijoas ao alho",
        description: "Alho, coentros, um golpe de vinho branco e pão para o molho.",
        price: 12.5,
      },
      {
        name: "Lulas fritas",
        description: "Fritas na hora, limão ao lado.",
        price: 11,
      },
      {
        name: "Percebes",
        description: "Só quando o mar deixa apanhar.",
        price: 19,
        note: "época",
      },
      {
        name: "Pataniscas de bacalhau",
        description: "Quatro por dose, feitas à medida do pedido.",
        price: 8,
      },
      {
        name: "Vieiras gratinadas",
        description: "Duas unidades, gratinadas no forno.",
        price: 9.5,
      },
      {
        name: "Camarão cozido",
        description: "Servido morno, com sal grosso.",
        price: 10.5,
      },
    ],
  },
  {
    id: "da-terra",
    title: "Da terra",
    intro: "Para quem se senta ao balcão e ainda não decidiu.",
    dishes: [
      {
        name: "Chouriço assado",
        description: "Assado na telha, à frente de quem o pede.",
        price: 7.5,
      },
      {
        name: "Tábua de presunto e queijo",
        description: "Presunto, queijo curado, azeitonas e pão.",
        price: 13,
      },
      {
        name: "Moelas à taberna",
        description: "Estufadas devagar em vinho tinto.",
        price: 7,
      },
      {
        name: "Pica-pau",
        description: "Naco em cubos, pickles e mostarda.",
        price: 9.5,
      },
    ],
  },
  {
    id: "sandes",
    title: "Sandes e pregos",
    intro: "O almoço rápido de quem vai a caminho de Santiago.",
    dishes: [
      {
        name: "Prego no pão",
        description: "Vaca grelhada, alho, pão da padaria da terra.",
        price: 6.5,
      },
      {
        name: "Sandes de presunto e ovo",
        description: "Ovo estrelado por cima, como sempre se fez.",
        price: 6,
      },
      {
        name: "Bifana",
        description: "Estufada de véspera no seu molho.",
        price: 5.5,
      },
    ],
  },
  {
    id: "pratos",
    title: "Pratos",
    intro: "Quando a fome já não se resolve com petiscos.",
    dishes: [
      {
        name: "Bacalhau à Brás",
        description: "Lascas desfiadas, batata palha e azeitona preta.",
        price: 14,
      },
      {
        name: "Francesinha",
        description: "Com molho da casa e ovo por cima.",
        price: 12.5,
      },
      {
        name: "Lulas grelhadas",
        description: "Grelhadas inteiras, com batata a murro.",
        price: 14.5,
      },
    ],
  },
  {
    id: "doces",
    title: "Doces",
    intro: "Três, e chegam.",
    dishes: [
      {
        name: "Queijada",
        description: "Feita aqui ao lado, comprada ainda morna.",
        price: 3,
      },
      { name: "Leite-creme queimado", price: 4 },
      { name: "Bolo de bolacha", price: 3.5 },
    ],
  },
  {
    id: "bar",
    title: "Bar",
    intro: "A bebida pode sair porta fora e ir ver o mar contigo.",
    dishes: [
      { name: "Imperial", price: 1.5 },
      { name: "Caneca", price: 2.5 },
      { name: "Vinho verde, copo", price: 2 },
      { name: "Vinho verde, garrafa", price: 9 },
      { name: "Café", price: 0.9 },
      {
        name: "Gin do Pirata",
        description: "O da casa. Não perguntes o que leva.",
        price: 6.5,
      },
    ],
  },
];

export type Highlight = {
  name: string;
  description: string;
  price: number;
  photo?: Photo;
};

/*
  Seis pratos-âncora para a página inicial: os que as avaliações mais citam.
  Seis, e não mais, porque é o número que fecha a grelha do bento sem sobras.
*/
export const highlights: Highlight[] = [
  {
    name: "Amêijoas ao alho",
    description:
      "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
    price: 12.5,
    photo: photos.ameijoas,
  },
  {
    name: "Lulas fritas",
    description: "Fritas na hora. Sabem melhor na esplanada, com uma imperial.",
    price: 11,
    photo: photos.lulas,
  },
  {
    name: "Percebes",
    description: "Só há quando o mar deixa apanhar. Quando há, acabam cedo.",
    price: 19,
  },
  {
    name: "Pataniscas de bacalhau",
    description: "Quatro por dose, feitas à medida do pedido.",
    price: 8,
    photo: photos.fritura,
  },
  {
    name: "Prego no pão",
    description: "O almoço de quem vai a pé para Santiago e não quer parar muito.",
    price: 6.5,
    photo: photos.prego,
  },
  {
    name: "Bacalhau à Brás",
    description: "Lascas desfiadas, batata palha e azeitona preta. Para quem chega com fome a sério.",
    price: 14,
  },
];

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
