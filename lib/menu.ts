import { photos, type Photo } from "@/lib/images";

/*
  A ementa da casa, transcrita das sete fotografias do livro da ementa que
  o dono forneceu: `public/images/Menu1.jpg` a `Menu7.jpg`.

  Regra do cliente: o que aparece sem preço no livro não vai para o site.
  Ficam de fora as etiquetas em branco (Baguete, Bacalhau c/ grão, Atum
  c/ feijão frade, Sardinhas c/ salada, Caldo verde, Sopa, Presunto e
  Queijo dos extras, Água Carvalhelhos, Irish Coffee), as linhas riscadas
  a marcador (três cervejas, os dois ice teas, o Refrigerante) e os preços
  apagados (Veros, Veros Reserva, e o terceiro vinho verde, que ficou sem
  nome nem preço).

  Seis linhas do livro estão escritas por cima de outro preço, ou
  borratadas, e não se lêem na fotografia. Cinco delas foram confirmadas
  pela casa e estão cá com o preço que ela deu: Percebes (10,50), o
  Desespero do Alentejo (33,90 — o nome impresso, Chaminé, está riscado e
  reescrito à mão), Jorna (21,00), Gin Hendricks (9,00) e Bacardi limão
  (5,90). A sexta, o Baileys, continua por responder e por isso continua
  de fora.

  Onde a linha em inglês do livro diz alguma coisa que o nome português
  não diz ("Sparkling water with fresh lemon", "Rhum, lemon and honey"),
  essa linha entra traduzida. Onde é só o nome outra vez ("Cheese and
  smoked ham board"), não entra.

  As descrições mais compridas — as que têm voz — vêm da versão anterior
  do site e foram escritas antes de haver ementa verdadeira. Continuam cá
  porque descrevem pratos que continuam na carta, mas nunca passaram pelo
  dono.
*/

export type Dish = {
  name: string;
  description?: string;
  price: number;
  /** etiqueta curta ao lado do nome — a região, nos vinhos */
  note?: string;
};

export type Category = {
  id: string;
  title: string;
  intro: string;
  dishes: readonly Dish[];
};

/*
  `as const satisfies` e não `: Category[]`.

  A anotação alargava todos os literais para `string`, e com isso o
  `lib/menu-linguas.ts` ficava sem forma nenhuma para verificar: um prato
  cujo nome mudasse aqui deixava a tradução pendurada, apontada a uma chave
  que já não existe, e o build passava na mesma. O `satisfies` guarda os
  literais e continua a garantir que a estrutura é a de `Category`.
*/
export const menu = [
  {
    id: "entradas",
    title: "Entradas",
    intro:
      "O que se põe na mesa primeiro. O marisco depende do que o mar deu de manhã.",
    dishes: [
      {
        name: "Tábua de presunto e queijo",
        description: "Presunto, queijo curado, azeitonas e pão.",
        price: 13.5,
      },
      {
        name: "Cesto de entradas",
        description: "Três patês e um queijinho. O pão não está incluído.",
        price: 4.9,
      },
      { name: "Tremoços", price: 1.8 },
      { name: "Amendoins sem casca", price: 1.2 },
      {
        name: "Chouriço assado",
        description: "Assado na telha, à frente de quem o pede.",
        price: 5.4,
      },
      { name: "Pão com chouriço", price: 5.2 },
      { name: "Pão simples", price: 2.5 },
      { name: "Pão com manteiga", price: 1.1 },
      { name: "Azeitonas", price: 1.5 },
      { name: "Patê", price: 1.0 },
      { name: "Queijinhos", price: 1.9 },
      { name: "Alheira", price: 5.2 },
      {
        name: "Percebes",
        description: "Só quando o mar deixa apanhar.",
        price: 10.5,
        note: "época",
      },
      { name: "Navalheira", price: 4.9 },
      {
        name: "Torrada de lapas",
        description: "Grelhadas com alho e coentros, sobre pão torrado.",
        price: 11.9,
      },
      {
        name: "Camarão",
        description: "Cozido, servido morno com sal grosso.",
        price: 9.0,
      },
      { name: "Amêijoa à pirata", price: 16.9 },
    ],
  },
  {
    id: "snack",
    title: "Snack",
    intro: "Quando a fome já não se resolve com um pão e uns tremoços.",
    dishes: [
      {
        name: "Francesinha",
        description: "Pão, bife, salsicha, chouriço, fiambre e queijo.",
        price: 13.4,
      },
      { name: "Meia francesinha", price: 8.9 },
      {
        name: "Francesinha com ovo e batata frita",
        description: "A mesma, com ovo estrelado por cima.",
        price: 13.9,
      },
      {
        name: "Bacalhau à Brás",
        description: "Lascas desfiadas, batata palha e azeitona preta.",
        price: 12.2,
      },
      {
        name: "Prego no prato",
        description: "Com ovo estrelado e batata frita.",
        price: 11.9,
      },
      { name: "Alheira com ovo e batata frita", price: 8.5 },
      { name: "Salsicha com ovo e batata frita", price: 6.9 },
      { name: "Bife na pedra", price: 26.9 },
      {
        name: "Lulas ao alho com batata frita",
        description: "Grelhadas na hora, com alho.",
        price: 12.4,
      },
      {
        name: "Moelas",
        description: "Estufadas devagar em vinho tinto.",
        price: 5.2,
      },
      { name: "Salada Taskuinha", price: 3.5 },
      {
        name: "Pataniscas",
        description: "De bacalhau, feitas à medida do pedido.",
        price: 5.2,
      },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    intro: "Para acrescentar ao que já vai no prato.",
    dishes: [
      { name: "Ovo estrelado", price: 1.5 },
      { name: "Prato de batata", price: 2.5 },
      { name: "Dose de batatas fritas", price: 3.5 },
    ],
  },
  {
    id: "sandes",
    title: "Sandes e tostas",
    intro: "O almoço rápido de quem vai a caminho de Santiago.",
    dishes: [
      {
        name: "Bifana",
        description: "Estufada de véspera no seu molho.",
        price: 3.2,
      },
      {
        name: "Prego no pão",
        description: "Vaca grelhada, alho, pão da padaria da terra.",
        price: 6.5,
      },
      {
        name: "Sande P.O.",
        description: "Presunto e ovo estrelado, como sempre se fez.",
        price: 3.9,
      },
      { name: "Cachorro simples", price: 4.0 },
      {
        name: "Cachorro especial",
        description: "Com queijo e molho picante.",
        price: 8.4,
      },
      { name: "Sande de presunto", price: 3.0 },
      { name: "Sandes de fiambre", price: 2.0 },
      { name: "Sandes de queijo", price: 2.0 },
      { name: "Sandes mista", price: 2.0 },
      { name: "Tosta especial", price: 7.4 },
      { name: "Tosta de fiambre", price: 2.5 },
      { name: "Tosta de queijo", price: 2.5 },
      { name: "Tosta mista", price: 2.9 },
      { name: "Torrada", price: 1.5 },
    ],
  },
  {
    id: "cafetaria",
    title: "Cafetaria",
    intro: "O balcão de sempre, antes ou depois da praia.",
    dishes: [
      { name: "Café", price: 1.0 },
      { name: "Café duplo", price: 2.0 },
      { name: "Café pingado", price: 1.0 },
      { name: "Café com natas", price: 1.4 },
      { name: "Descafeinado", price: 1.0 },
      { name: "Abatanado", price: 1.5 },
      { name: "Pingo", price: 1.0 },
      { name: "Galão", price: 1.8 },
      { name: "Meia de leite", price: 1.6 },
      { name: "Copo de leite", price: 1.2 },
      { name: "Cappuccino", price: 2.0 },
      { name: "Carioca de café", price: 1.0 },
      { name: "Carioca de limão", price: 1.0 },
      { name: "Carioca de limão duplo", price: 1.5 },
      { name: "Cevada", price: 0.9 },
      { name: "Cevada dupla", price: 1.5 },
      { name: "Chá", price: 1.3 },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    intro: "Águas e refrigerantes, para levar para a esplanada.",
    dishes: [
      { name: "Água 0,33 L", price: 1.1 },
      { name: "Água 1,5 L", price: 2.5 },
      { name: "Água das Pedras", price: 1.4 },
      { name: "Água das Pedras limão", price: 1.8 },
      { name: "Água tónica", price: 1.7 },
      {
        name: "Pneu",
        description: "Água com gás e limão fresco.",
        price: 1.6,
      },
      { name: "Coca-Cola pressão", price: 1.7 },
      { name: "Coca-Cola zero", price: 2.1 },
      { name: "Coca-Cola lata", price: 2.1 },
      { name: "Coca-Cola garrafa", price: 2.3 },
      { name: "Compal", description: "Néctar de fruta.", price: 1.9 },
      {
        name: "Snappy",
        description: "Refrigerante de lima com gás.",
        price: 1.7,
      },
      { name: "Fuze Tea", price: 2.1 },
      { name: "Sumo de laranja natural", price: 2.5 },
    ],
  },
  {
    id: "cerveja",
    title: "Cerveja",
    intro: "A bebida pode sair porta fora e ir ver o mar contigo.",
    dishes: [
      { name: "Fino", price: 1.6 },
      { name: "Fino preto", price: 1.6 },
      { name: "Caneca 0,5 L", price: 4.5 },
      { name: "Caneca super", price: 3.0 },
      { name: "Caneca de alumínio", price: 2.7 },
      { name: "Caneca de alumínio preta", price: 2.7 },
      {
        name: "Caneca de alumínio tango",
        description: "Com groselha.",
        price: 2.8,
      },
      { name: "Caneca tango", description: "Com groselha.", price: 3.0 },
      { name: "Tango", description: "Cerveja com groselha.", price: 1.6 },
      {
        name: "Panaché",
        description: "Cerveja com refrigerante de lima.",
        price: 1.6,
      },
      { name: "Super Bock lata", price: 2.0 },
      { name: "Super Bock sem álcool", price: 1.9 },
      { name: "Super Bock sem álcool preta", price: 1.9 },
      { name: "Somersby", description: "Sidra.", price: 2.5 },
    ],
  },
  {
    id: "vinho",
    title: "Vinho",
    intro: "A copo, em caneca, ou a garrafa para a mesa toda.",
    dishes: [
      { name: "Copo de vinho tinto", price: 2.0 },
      { name: "Copo de vinho branco", price: 2.0 },
      { name: "Caneca de vinho pequena", price: 3.8 },
      { name: "Copo de sangria", price: 3.0 },
      { name: "Sangria", price: 16.0 },

      { name: "Montes Ermos", price: 13.5, note: "Beira" },
      { name: "Quinta Termos", price: 13.5, note: "Beira" },
      { name: "Quinta Termos Reserva", price: 18.0, note: "Beira" },
      { name: "Quinta Termos Seleção", price: 21.0, note: "Beira" },
      { name: "Termos Touriga Nacional", price: 17.5, note: "Beira" },
      { name: "Termos Vinhas Velhas Reserva", price: 17.5, note: "Beira" },

      { name: "Diálogo tinto", price: 16.5, note: "Douro" },
      { name: "Papa Figos", price: 14.0, note: "Douro" },
      { name: "Esteva tinto", price: 13.5, note: "Douro" },
      { name: "Meia Esteva tinto", price: 6.5, note: "Douro" },

      { name: "Desespero", price: 33.9, note: "Alentejo" },
      { name: "Jorna", price: 21.0, note: "Alentejo" },
      { name: "Monte Velho", price: 13.5, note: "Alentejo" },
      { name: "Planalto", price: 13.5, note: "Alentejo" },

      { name: "Maderne", price: 12.5, note: "verde" },
      { name: "Dibino", price: 13.5, note: "verde" },

      { name: "Terras do Demo", price: 19.0, note: "espumante" },
      { name: "Murganheira", price: 19.0, note: "espumante" },
      { name: "Raposeira", price: 17.0, note: "espumante" },
    ],
  },
  {
    id: "bar",
    title: "Bar",
    intro: "Ao balcão, já com o sol posto.",
    dishes: [
      { name: "Gin Bombay", price: 8.0 },
      { name: "Gin Bulldog", price: 9.0 },
      { name: "Gin Gordon's", price: 6.0 },
      { name: "Gin Hendricks", price: 9.0 },
      { name: "Gin Tanqueray", price: 8.0 },
      { name: "Gin Vigne", price: 10.0 },
      { name: "Vodka", price: 5.0 },
      { name: "Vodka com sumo", price: 6.0 },
      { name: "Bacardi", price: 5.0 },
      { name: "Bacardi limão", price: 5.9 },
      { name: "Captain Morgan", description: "Rum.", price: 5.0 },
      {
        name: "Cuba Libre",
        description: "Rum, Coca-Cola e limão.",
        price: 5.0,
      },
      {
        name: "Caipirinha",
        description: "Cachaça, lima e açúcar.",
        price: 6.0,
      },
      {
        name: "Caipirão",
        description: "Caipirinha com licor Beirão.",
        price: 6.0,
      },
      { name: "Poncha", description: "Rum, limão e mel.", price: 5.0 },
      { name: "Ponche", price: 3.0 },
      { name: "Croft", description: "Brandy.", price: 3.0 },
      { name: "Macieira", description: "Brandy.", price: 3.0 },
      { name: "Aguardente velha", price: 4.0 },
      {
        name: "Amêndoa amarga",
        description: "Licor de amêndoa amarga.",
        price: 3.8,
      },
      { name: "Licor", price: 4.0 },
      { name: "Licor Beirão", price: 4.0 },
      { name: "Favaios", description: "Moscatel.", price: 2.0 },
      {
        name: "Favaios com cerveja",
        description: "Moscatel com cerveja.",
        price: 2.2,
      },
      { name: "Martini", price: 2.0 },
      { name: "Martini Bianco", price: 3.0 },
      { name: "Martini com cerveja", price: 2.2 },
      { name: "Porto novo", price: 2.5 },
      { name: "Porto velho", price: 4.0 },
      { name: "Porto tónico", price: 6.0 },
      { name: "Whiskey Old Parr", price: 6.0 },
      { name: "Whiskey velho", price: 6.0 },
      { name: "Whiskey novo", description: "Blended.", price: 4.0 },
      { name: "Whiskey Jameson", description: "Blended.", price: 4.5 },
      { name: "Cutty Sark", description: "Blended.", price: 4.0 },
      { name: "Whiskey com cola", price: 6.0 },
      { name: "Shot", price: 2.0 },
      { name: "Shot de whiskey", price: 2.5 },
      { name: "Shot de whiskey velho", price: 3.0 },
    ],
  },
] as const satisfies readonly Category[];

export type Highlight = {
  name: string;
  description: string;
  price: number;
  photo: Photo;
};

/*
  Os pratos-âncora da página inicial.

  Eram cinco, escolhidos por serem os cinco com fotografia real servida à
  mesa. As sardinhas saíram: existem no livro como "Sardinhas c/ salada",
  mas sem preço, e o que não tem preço não vai para o site. No lugar delas
  entraram a Francesinha e o Bacalhau à Brás, sem fotografia — e o
  `Petiscos.tsx` ganhou um ramo que desenhava o cartão só com nome,
  descrição e preço.

  O Gonçalo mandou depois as duas fotografias que faltavam, a navalheira e
  o bacalhau à Brás, e com elas a troca: fora a Francesinha, dentro a
  navalheira. Os seis voltam a ser o que a secção anuncia — pratos com
  fotografia real da casa — e o ramo sem foto foi apagado, que é o que o
  `photo` obrigatório aqui em cima garante.

  Seis fecham a grelha de três colunas em duas linhas cheias, sem a folga
  que a versão de cinco deixava em baixo à direita.
*/
export const highlights = [
  {
    name: "Amêijoa à pirata",
    description:
      "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
    /*
      Repetido de propósito a partir da ementa, e por isso a acertar sempre
      com ela: os destaques têm texto e fotografia próprios, e não se
      resolvem com uma referência ao prato lá de cima. Quem mexer no preço
      num sítio tem de mexer no outro.
    */
    price: 16.9,
    photo: photos.petiscoAmeijoas,
  },
  {
    name: "Torrada de lapas",
    description: "Grelhadas com alho e coentros, sobre pão torrado.",
    price: 11.9,
    photo: photos.petiscoLapas,
  },
  {
    name: "Lulas ao alho",
    description:
      "Grelhadas na hora, com alho e batata frita. Sabem melhor na esplanada, com um fino.",
    price: 12.4,
    photo: photos.petiscoLulas,
  },
  {
    name: "Percebes",
    description: "Só há quando o mar deixa apanhar. Quando há, acabam cedo.",
    price: 10.5,
    photo: photos.petiscoPercebes,
  },
  {
    name: "Navalheira",
    description: "Cozida e servida inteira, com o quebra-nozes ao lado.",
    price: 4.9,
    photo: photos.petiscoNavalheira,
  },
  {
    name: "Bacalhau à Brás",
    description: "Lascas desfiadas, batata palha e azeitona preta.",
    price: 12.2,
    photo: photos.petiscoBacalhauBras,
  },
] as const satisfies readonly Highlight[];

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
