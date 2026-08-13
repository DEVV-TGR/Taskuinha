import { photos, type Photo } from "@/lib/images";

/*
  A ementa da casa, transcrita das sete fotografias que o Gonçalo trouxe da
  reunião. Substituiu por inteiro a ementa de demonstração que aqui estava —
  categorias, pratos e preços, tudo inventado a partir das avaliações
  públicas.

  As fotografias ficaram fora do repositório, à espera de ele dizer onde as
  quer: estavam em `public/`, que é servido para toda a gente, e são 21 MB.

  Três regras saíram dessa conversa e explicam o que está aqui:

  1. A ordem é a do papel. As famílias seguem a ordem das páginas, e dentro de
     cada família os itens seguem a ordem das colunas: a coluna esquerda de
     cima a baixo, depois a direita. Não estão agrupados por lógica nossa.

  2. As descrições são as do papel, traduzidas do inglês que lá está. Onde a
     descrição só repetia o nome do prato ("Pataniscas / Cod fritters"), não
     ficou nenhuma — inventar texto era pôr palavras na boca da casa.

  3. Só entra o que tem preço legível. A ementa tem etiquetas em branco e
     etiquetas escritas por cima de etiquetas; ver `ITENS_POR_CONFIRMAR`.
*/

/*
  O que ficou de fora, e porquê. Está aqui em código, e não só no PR, porque
  a lista é para voltar a abrir quando o Anselmo der os valores: cada linha
  destas é um item que existe na casa e não aparece no site.

  Sem preço na ementa (etiqueta em branco):
    Baguete · Bacalhau c/ grão · Atum c/ feijão frade · Sardinhas c/ salada
    Caldo verde · Sopa · Presunto (extra) · Queijo (extra)
    Água Carvalhelhos · Irish Coffee

  Preço ilegível na fotografia (rasurado, tapado ou por baixo de outro):
    Percebes · Gin Hendricks (9,??) · Baileys · Martini
    Veros · Veros Reserva

  Nome trocado à mão, por confirmar antes de entrar:
    "Chaminé" riscado e substituído por "Desespero", a 13,90 ou 33,90
    Ice tea limão e Ice tea pêssego, ambos riscados — presumivelmente
      substituídos pelo Fuze Tea que está escrito à margem
    Duas cervejas riscadas a caneta, sem nome legível
    Um vinho verde a 12,50 com o nome tapado
*/
export const ITENS_POR_CONFIRMAR = 20;

export type Dish = {
  name: string;
  description?: string;
  price: number;
  /** aparece na secção de destaques da página inicial */
  note?: string;
  /**
   * Subtítulo dentro da família, como o papel os tem — só o vinho os usa
   * ("Maduros do Douro", "Verdes"). Itens sem `group` aparecem antes do
   * primeiro subtítulo, que é onde estão na ementa.
   */
  group?: string;
};

export type Category = {
  id: string;
  title: string;
  /**
   * Opcional desde que a ementa passou a ser a real: as famílias do papel
   * não têm texto de abertura, e escrever um para cada uma seria voltar a
   * inventar conteúdo.
   */
  intro?: string;
  dishes: Dish[];
};

export const menu: Category[] = [
  {
    id: "entradas",
    title: "Entradas",
    dishes: [
      {
        name: "Cesto de entradas",
        description:
          "Três patês e um queijinho. O pão e as azeitonas pagam-se à parte.",
        price: 4.9,
      },
      { name: "Chouriço assado", price: 5.4 },
      { name: "Pão simples", price: 2.5 },
      { name: "Pão com manteiga", price: 1.1 },
      { name: "Tábua de presunto e queijo", price: 13.5 },
      { name: "Tremoços", price: 1.8 },
      { name: "Amendoins sem casca", price: 1.2 },
      { name: "Pão com chouriço", price: 5.2 },
      { name: "Azeitonas", price: 1.5 },
      { name: "Patê", price: 1.0 },
      { name: "Queijinhos", price: 1.9 },
      { name: "Alheira", description: "Pão e alheira de caça.", price: 5.2 },
      { name: "Navalheira", price: 4.9 },
      { name: "Ameijoa à Pirata", price: 15.2 },
      { name: "Torrada de lapas", price: 11.9 },
      { name: "Camarão", description: "Cozido.", price: 9.0 },
    ],
  },
  {
    id: "snack",
    title: "Snack",
    dishes: [
      {
        name: "Bacalhau à Brás",
        description: "Bacalhau e batata palha envolvidos em ovo.",
        price: 12.2,
      },
      {
        name: "Francesinha",
        description: "Pão, bife, salsicha, chouriço, fiambre e queijo.",
        price: 12.4,
      },
      { name: "Meia francesinha", price: 7.9 },
      {
        name: "Francesinha com ovo e batata frita",
        description:
          "Pão, bife, salsicha, chouriço, fiambre, queijo, ovo estrelado e batata frita.",
        price: 12.9,
      },
      { name: "Alheira com ovo e batata frita", price: 8.5 },
      { name: "Bife na pedra", price: 26.9 },
      {
        name: "Prego no prato",
        description: "Bife com ovo estrelado e batata frita.",
        price: 11.9,
      },
      { name: "Salsicha com ovo e batata frita", price: 6.9 },
      { name: "Lulas ao alho com batata frita", price: 12.4 },
      { name: "Pataniscas", price: 5.2 },
      { name: "Moelas", description: "Estufadas.", price: 5.2 },
      { name: "Salada Taskuinha", price: 3.5 },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    dishes: [
      { name: "Ovo estrelado", price: 1.5 },
      { name: "Prato de batata", price: 2.5 },
      { name: "Dose de batatas fritas", price: 3.5 },
    ],
  },
  {
    id: "sandes",
    title: "Sandes e tostas",
    dishes: [
      { name: "Prego no pão", price: 5.9 },
      { name: "Cachorro simples", price: 4.0 },
      { name: "Sande de presunto", price: 3.0 },
      { name: "Sande de fiambre", price: 2.0 },
      { name: "Sande de queijo", price: 2.0 },
      { name: "Sande mista", description: "Fiambre e queijo.", price: 2.0 },
      { name: "Bifana", description: "Carne de porco marinada.", price: 3.2 },
      {
        name: "Sande P.O.",
        description: "Presunto e ovo estrelado.",
        price: 3.9,
      },
      {
        name: "Cachorro especial",
        description: "Com queijo e molho picante.",
        price: 7.4,
      },
      { name: "Tosta especial", price: 7.4 },
      { name: "Tosta de fiambre", price: 2.5 },
      { name: "Tosta de queijo", price: 2.5 },
      { name: "Tosta mista", description: "Fiambre e queijo.", price: 2.9 },
      { name: "Torrada", price: 1.5 },
    ],
  },
  {
    id: "cafetaria",
    title: "Cafetaria",
    dishes: [
      { name: "Abatanado", price: 1.5 },
      { name: "Cevada", price: 0.9 },
      { name: "Cevada dupla", price: 1.5 },
      { name: "Chá", price: 1.3 },
      { name: "Copo de leite", price: 1.2 },
      { name: "Galão", price: 1.8 },
      { name: "Pingo", description: "Leite com um pingo de café.", price: 1.0 },
      { name: "Meia de leite", price: 1.6 },
      { name: "Café", price: 1.0 },
      { name: "Café com natas", price: 1.4 },
      { name: "Café duplo", price: 2.0 },
      { name: "Cappuccino", price: 2.0 },
      { name: "Café pingado", price: 1.0 },
      { name: "Descafeinado", price: 1.0 },
      { name: "Carioca de café", price: 1.0 },
      {
        name: "Carioca de limão",
        description: "Água quente com casca de limão.",
        price: 1.0,
      },
      { name: "Carioca de limão duplo", price: 1.5 },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    dishes: [
      { name: "Água 0,33 L", price: 1.1 },
      { name: "Água 1,5 L", price: 2.5 },
      { name: "Água das Pedras", price: 1.4 },
      { name: "Água das Pedras com limão", price: 1.8 },
      { name: "Água tónica", price: 1.7 },
      { name: "Pneu", description: "Água com gás e limão fresco.", price: 1.6 },
      { name: "Coca-Cola de pressão", price: 1.7 },
      { name: "Coca-Cola Zero", price: 2.1 },
      { name: "Coca-Cola lata", price: 2.1 },
      { name: "Coca-Cola garrafa", price: 2.3 },
      { name: "Compal", price: 1.9 },
      { name: "Fuze Tea", price: 2.1 },
      { name: "Snappy", price: 1.7 },
      { name: "Refrigerante", price: 2.0 },
      { name: "Sumo de laranja natural", price: 2.5 },
    ],
  },
  {
    id: "cerveja",
    title: "Cerveja",
    dishes: [
      { name: "Caneca 0,50 L", price: 4.5 },
      { name: "Caneca de alumínio", price: 2.7 },
      { name: "Caneca de alumínio preta", price: 2.7 },
      { name: "Caneca de alumínio tango", price: 2.8 },
      { name: "Caneca super", price: 3.0 },
      { name: "Caneca tango", price: 3.0 },
      { name: "Tango", description: "Cerveja com groselha.", price: 1.6 },
      { name: "Panaché", description: "Cerveja com gasosa de lima.", price: 1.6 },
      { name: "Somersby", description: "Sidra.", price: 2.5 },
      { name: "Fino", price: 1.6 },
      { name: "Fino preto", price: 1.6 },
      { name: "Super Bock lata", price: 2.0 },
      { name: "Super Bock sem álcool", price: 1.9 },
      { name: "Super Bock preta sem álcool", price: 1.9 },
    ],
  },
  {
    id: "vinho",
    title: "Vinho",
    dishes: [
      { name: "Caneca de vinho pequena", price: 3.8 },
      { name: "Copo de vinho tinto", price: 2.0 },
      { name: "Copo de vinho branco", price: 2.0 },

      { name: "Montes Ermos", price: 13.5, group: "Maduros da Beira" },
      { name: "Quinta Termos", price: 13.5, group: "Maduros da Beira" },
      { name: "Quinta Termos Reserva", price: 18.0, group: "Maduros da Beira" },
      { name: "Quinta Termos Seleção", price: 21.0, group: "Maduros da Beira" },
      {
        name: "Termos Touriga Nacional",
        price: 17.5,
        group: "Maduros da Beira",
      },
      {
        name: "Termos Vinhas Velhas Reserva",
        price: 17.5,
        group: "Maduros da Beira",
      },

      { name: "Diálogo tinto", price: 16.5, group: "Maduros do Douro" },
      { name: "Papa Figos", price: 14.0, group: "Maduros do Douro" },
      { name: "Esteva tinto", price: 13.5, group: "Maduros do Douro" },
      { name: "Meia Esteva tinto", price: 6.5, group: "Maduros do Douro" },

      { name: "Jorna", price: 27.0, group: "Maduros do Alentejo" },
      { name: "Monte Velho", price: 17.5, group: "Maduros do Alentejo" },
      { name: "Planalto", price: 13.5, group: "Maduros do Alentejo" },

      { name: "Maderne", price: 12.5, group: "Verdes" },
      { name: "Dibino", price: 13.5, group: "Verdes" },

      { name: "Terras do Demo", price: 19.0, group: "Espumantes" },
      { name: "Murganheira", price: 19.0, group: "Espumantes" },
      { name: "Raposeira", price: 17.0, group: "Espumantes" },

      { name: "Jarro de sangria", price: 16.0, group: "Sangria" },
      { name: "Copo de sangria", price: 3.0, group: "Sangria" },
    ],
  },
  {
    id: "bar",
    title: "Bar",
    dishes: [
      { name: "Gin Bombay", price: 8.0 },
      { name: "Gin Bulldog", price: 9.0 },
      { name: "Gin Gordon's", price: 6.0 },
      { name: "Gin Tanqueray", price: 8.0 },
      { name: "Gin Vigne", price: 10.0 },
      { name: "Vodka", price: 5.0 },
      { name: "Vodka com sumo", price: 6.0 },
      { name: "Poncha", description: "Rum, limão e mel.", price: 5.0 },
      { name: "Ponche", price: 3.0 },
      {
        name: "Caipirinha",
        description: "Aguardente de cana, lima e açúcar.",
        price: 6.0,
      },
      {
        name: "Caipirão",
        description: "Caipirinha com licor Beirão.",
        price: 6.0,
      },
      { name: "Aguardente velha", price: 4.0 },
      { name: "Amêndoa amarga", price: 3.8 },
      { name: "Bacardi", price: 5.0 },
      { name: "Bacardi limão", price: 5.0 },
      { name: "Favaios", description: "Moscatel.", price: 2.0 },
      { name: "Favaios com cerveja", price: 2.2 },
      { name: "Capitan Morgan", description: "Rum.", price: 5.0 },
      {
        name: "Cuba Libre",
        description: "Rum, Coca-Cola e limão.",
        price: 5.0,
      },
      { name: "Croft", description: "Brandy.", price: 3.0 },
      { name: "Macieira", description: "Brandy.", price: 3.0 },
      { name: "Licor", price: 4.0 },
      { name: "Licor Beirão", price: 4.0 },
      { name: "Shot", price: 2.0 },
      { name: "Martini Bianco", price: 3.0 },
      { name: "Martini com cerveja", price: 2.2 },
      { name: "Porto novo", price: 2.5 },
      { name: "Porto tónico", price: 6.0 },
      { name: "Porto velho", price: 4.0 },
      { name: "Whiskey Old Parr", price: 6.0 },
      { name: "Whiskey velho", price: 6.0 },
      { name: "Cutty Sark", price: 4.0 },
      { name: "Whiskey novo", price: 4.0 },
      { name: "Whiskey Jameson", price: 4.5 },
      { name: "Whiskey com cola", price: 6.0 },
      { name: "Shot de whiskey velho", price: 3.0 },
      { name: "Shot de whiskey", price: 2.5 },
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
  Os pratos-âncora da página inicial. São os que têm fotografia real, servida
  à mesa, e passaram a chamar-se e a custar o que a ementa da casa diz.

  Eram cinco. Ficaram três:

  - as sardinhas saíram porque não são prato do Taskuinha. Estavam cá por
    engano da nossa parte, e o Gonçalo mandou-as retirar;
  - os percebes saíram por não se conseguir ler o preço na fotografia da
    ementa — a etiqueta está escrita por cima de outra. Voltam assim que o
    valor estiver confirmado, e a fotografia continua em `lib/images.ts`
    à espera disso.

  `photo` continua opcional no tipo, mesmo com os três a terem fotografia:
  apertar o tipo ao conteúdo de hoje era obrigar a alargá-lo outra vez no dia
  em que entre um prato sem foto.
*/
export const highlights: Highlight[] = [
  {
    name: "Ameijoa à Pirata",
    description:
      "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
    price: 15.2,
    photo: photos.petiscoAmeijoas,
  },
  {
    name: "Torrada de lapas",
    description: "Grelhadas com alho e coentros, sobre pão torrado.",
    price: 11.9,
    photo: photos.petiscoLapas,
  },
  {
    name: "Lulas ao alho com batata frita",
    description:
      "Grelhadas na hora, com alho. Sabem melhor na esplanada, com uma imperial.",
    price: 12.4,
    photo: photos.petiscoLulas,
  },
];

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

/*
  Parte os pratos de uma família nos blocos que o papel tem: primeiro os que
  não estão debaixo de nenhum subtítulo, depois um bloco por subtítulo, pela
  ordem em que aparecem. Preserva a ordem original — a ementa é para se ler
  como se lê o papel, e agrupar por outra lógica seria reordená-la.
*/
export function groupDishes(dishes: Dish[]) {
  const blocks: { group?: string; dishes: Dish[] }[] = [];

  for (const dish of dishes) {
    const last = blocks[blocks.length - 1];
    if (last && last.group === dish.group) last.dishes.push(dish);
    else blocks.push({ group: dish.group, dishes: [dish] });
  }

  return blocks;
}
