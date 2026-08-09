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
  O preço de um prato, ido buscar à ementa.

  Os destaques tinham o preço escrito outra vez, à mão. Duas fontes de
  verdade para o mesmo número, e o momento em que isso rebenta é
  exactamente o que aí vem: chegam os preços reais do Anselmo, alguém
  actualiza a ementa, e a página inicial fica a anunciar os de
  demonstração. Agora há um sítio só.

  Leva o `id` da categoria porque o nome sozinho não chega — "Lulas
  grelhadas" está em duas, com preços diferentes de propósito (petisco em
  `do-mar`, prato em `pratos`). Deixar isso à sorte da primeira ocorrência
  era um erro à espera de acontecer.

  Rebenta em tempo de compilação se o par não existir: um destaque a
  apontar para um prato que foi renomeado ou removido tem de parar o
  `next build`, não de aparecer sem preço na página.
*/
function precoDe(categoriaId: string, nome: string): number {
  const categoria = menu.find((c) => c.id === categoriaId);
  if (!categoria) {
    throw new Error(`Categoria "${categoriaId}" não existe na ementa.`);
  }
  const prato = categoria.dishes.find((d) => d.name === nome);
  if (!prato) {
    throw new Error(`"${nome}" não existe na categoria "${categoriaId}".`);
  }
  return prato.price;
}

/*
  Seis pratos-âncora para a página inicial: os que as avaliações mais citam.
  Seis, e não mais, porque é o número que fecha a grelha do bento sem sobras.

  Cinco têm fotografia real, servida à mesa (amêijoas, lapas, lulas,
  sardinhas, percebes) — não há uma sexta, e não há sapateira nenhuma,
  ao contrário do que a primeira versão do plano supunha (ver
  public/images/README.md). O sexto lugar fica com o Bacalhau à Brás, sem
  foto, o que mantém viva a célula "sem fotografia" do componente
  `Petiscos.tsx` — a Fase 1 já tinha corrigido a expectativa de que esse
  ramo fosse desaparecer.
*/
export const highlights: Highlight[] = [
  {
    name: "Amêijoas ao alho",
    description:
      "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
    price: precoDe("do-mar", "Amêijoas ao alho"),
    photo: photos.petiscoAmeijoas,
  },
  {
    name: "Lapas ao alho",
    description: "Grelhadas com alho e coentros, sobre pão torrado.",
    price: precoDe("do-mar", "Lapas ao alho"),
    photo: photos.petiscoLapas,
  },
  {
    name: "Lulas grelhadas",
    description:
      "Grelhadas na hora, com alho. Sabem melhor na esplanada, com uma imperial.",
    price: precoDe("do-mar", "Lulas grelhadas"),
    photo: photos.petiscoLulas,
  },
  {
    name: "Sardinhas no pão",
    description: "Assadas na hora, sobre uma fatia de pão torrado.",
    price: precoDe("do-mar", "Sardinhas no pão"),
    photo: photos.petiscoSardinhas,
  },
  {
    name: "Percebes",
    description: "Só há quando o mar deixa apanhar. Quando há, acabam cedo.",
    price: precoDe("do-mar", "Percebes"),
    photo: photos.petiscoPercebes,
  },
  {
    name: "Bacalhau à Brás",
    description: "Lascas desfiadas, batata palha e azeitona preta. Para quem chega com fome a sério.",
    price: precoDe("pratos", "Bacalhau à Brás"),
  },
];

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
