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
        name: "Lulas grelhadas",
        description: "Grelhadas na hora, com alho. Limão ao lado.",
        price: 11,
      },
      {
        name: "Percebes",
        description: "Só quando o mar deixa apanhar.",
        price: 19,
        note: "época",
      },
      {
        name: "Lapas ao alho",
        description: "Grelhadas com alho e coentros, sobre pão torrado.",
        price: 9,
      },
      {
        name: "Sardinhas no pão",
        description: "Assadas na hora, sobre uma fatia de pão torrado.",
        price: 7.5,
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
  Cinco pratos-âncora para a página inicial: os que as avaliações mais citam.
  São cinco porque são cinco os que têm fotografia real, servida à mesa
  (amêijoas, lapas, lulas, sardinhas, percebes) — não há uma sexta, e não há
  sapateira nenhuma, ao contrário do que a primeira versão do plano supunha
  (ver public/images/README.md).

  Eram seis. O Bacalhau à Brás ocupava o sexto lugar sem fotografia, para
  fechar a grelha do bento sem sobras. O bento saiu — a grelha passou a
  células todas iguais, a pedido do Gonçalo — e um prato que só lá estava para
  encher um buraco que já não existe não tinha razão para ficar. A grelha de
  três colunas fica com uma folga na segunda linha, e foi decisão dele.

  `photo` continua opcional no tipo `Highlight`, mesmo com os cinco a terem
  fotografia. Apertar o tipo ao conteúdo de hoje era obrigar a alargá-lo outra
  vez no dia em que entre um prato sem foto.
*/
export const highlights: Highlight[] = [
  {
    name: "Amêijoas ao alho",
    description:
      "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
    price: 12.5,
    photo: photos.petiscoAmeijoas,
  },
  {
    name: "Lapas ao alho",
    description: "Grelhadas com alho e coentros, sobre pão torrado.",
    price: 9,
    photo: photos.petiscoLapas,
  },
  {
    name: "Lulas grelhadas",
    description:
      "Grelhadas na hora, com alho. Sabem melhor na esplanada, com uma imperial.",
    price: 11,
    photo: photos.petiscoLulas,
  },
  {
    name: "Sardinhas no pão",
    description: "Assadas na hora, sobre uma fatia de pão torrado.",
    price: 7.5,
    photo: photos.petiscoSardinhas,
  },
  {
    name: "Percebes",
    description: "Só há quando o mar deixa apanhar. Quando há, acabam cedo.",
    price: 19,
    photo: photos.petiscoPercebes,
  },
];

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
