import type { Locale } from "@/lib/i18n";
import { menu, highlights, type Category, type Highlight } from "@/lib/menu";
import { fotoEm } from "@/lib/images-linguas";

/*
  A ementa nas outras três línguas.

  ## O que se traduz e o que não

  **O nome do prato não se traduz.** Amêijoa à pirata é Amêijoa à pirata em
  Vila Chã e em Bordéus — é o que está escrito no livro da ementa e é o que
  se aponta com o dedo quando se pede. Traduz-se a linha por baixo, que é a
  que diz o que o prato é.

  Os preços também não. Ficam no formato da casa (`13,50 €`) em todas as
  línguas: é o que está no livro, e um mesmo número escrito de duas
  maneiras é mais confuso do que um formato estrangeiro.

  Nas notas dos vinhos, Beira, Douro e Alentejo são regiões e ficam como
  estão. "Verde" passa a "Vinho Verde" nas três — sozinha, a palavra
  traduzida não diz nada a ninguém.

  ## Porque é que as chaves são tipos

  `IdCategoria`, `PratoComDescricao`, `Nota` e `Destaque` saem todos do
  `lib/menu.ts` por inferência. Mudar o nome de um prato lá rebenta aqui,
  em vez de deixar uma tradução órfã apontada a uma chave que já não
  existe. É a mesma garantia que o `satisfies Dicionario` dá aos
  dicionários — e é por isso que o `menu.ts` teve de passar a `as const`.
*/

type Prato = (typeof menu)[number]["dishes"][number];

type IdCategoria = (typeof menu)[number]["id"];
type PratoComDescricao = Extract<Prato, { description: string }>["name"];
type Nota = Extract<Prato, { note: string }>["note"];
type Destaque = (typeof highlights)[number]["name"];

type EmentaTraduzida = {
  categorias: Record<IdCategoria, { title: string; intro: string }>;
  descricoes: Record<PratoComDescricao, string>;
  notas: Record<Nota, string>;
  destaques: Record<Destaque, string>;
};

const en: EmentaTraduzida = {
  categorias: {
    entradas: {
      title: "Starters",
      intro:
        "What goes on the table first. The seafood depends on what the sea gave this morning.",
    },
    snack: {
      title: "Snacks",
      intro:
        "For when the hunger no longer sorts itself out with bread and a few lupin beans.",
    },
    extras: {
      title: "Extras",
      intro: "To add to what is already on the plate.",
    },
    sandes: {
      title: "Sandwiches and toasties",
      intro: "The quick lunch of anyone walking on to Santiago.",
    },
    cafetaria: {
      title: "Coffee bar",
      intro: "The same counter as always, before or after the beach.",
    },
    bebidas: {
      title: "Soft drinks",
      intro: "Waters and soft drinks, to carry out to the terrace.",
    },
    cerveja: {
      title: "Beer",
      intro: "Your drink can go out the door and look at the sea with you.",
    },
    vinho: {
      title: "Wine",
      intro: "By the glass, by the jug, or a bottle for the whole table.",
    },
    bar: { title: "Bar", intro: "At the counter, once the sun is down." },
  },
  descricoes: {
    "Tábua de presunto e queijo": "Cured ham, aged cheese, olives and bread.",
    "Cesto de entradas": "Three pâtés and a small cheese. Bread is not included.",
    "Chouriço assado": "Roasted on a roof tile, in front of whoever ordered it.",
    Percebes: "Only when the sea lets them be picked.",
    "Torrada de lapas": "Grilled with garlic and coriander, on toasted bread.",
    Camarão: "Boiled, served warm with coarse salt.",
    Francesinha: "Bread, steak, sausage, chouriço, ham and cheese.",
    "Francesinha com ovo e batata frita": "The same, with a fried egg on top.",
    "Bacalhau à Brás": "Shredded salt cod, straw potatoes and black olives.",
    "Prego no prato": "With a fried egg and chips.",
    "Lulas ao alho com batata frita": "Grilled to order, with garlic.",
    Moelas: "Slow-stewed in red wine.",
    Pataniscas: "Salt cod fritters, made to order.",
    Bifana: "Stewed the day before in its own sauce.",
    "Prego no pão": "Grilled beef, garlic, bread from the village bakery.",
    "Sande P.O.": "Cured ham and a fried egg, the way it has always been made.",
    "Cachorro especial": "With cheese and hot sauce.",
    Pneu: "Sparkling water with fresh lemon.",
    Compal: "Fruit nectar.",
    Snappy: "Sparkling lime soda.",
    "Caneca de alumínio tango": "With blackcurrant cordial.",
    "Caneca tango": "With blackcurrant cordial.",
    Tango: "Beer with blackcurrant cordial.",
    Panaché: "Beer with lime soda.",
    Somersby: "Cider.",
    "Captain Morgan": "Rum.",
    "Cuba Libre": "Rum, Coca-Cola and lemon.",
    Caipirinha: "Cachaça, lime and sugar.",
    Caipirão: "Caipirinha with Beirão liqueur.",
    Poncha: "Rum, lemon and honey.",
    Croft: "Brandy.",
    Macieira: "Brandy.",
    "Amêndoa amarga": "Bitter almond liqueur.",
    Favaios: "Moscatel.",
    "Favaios com cerveja": "Moscatel with beer.",
    "Whiskey novo": "Blended.",
    "Whiskey Jameson": "Blended.",
    "Cutty Sark": "Blended.",
  },
  notas: {
    época: "in season",
    Beira: "Beira",
    Douro: "Douro",
    Alentejo: "Alentejo",
    verde: "Vinho Verde",
    espumante: "sparkling",
  },
  destaques: {
    "Amêijoa à pirata":
      "The dish that comes up most in the reviews. It arrives with bread, and the bread is there for the sauce.",
    "Torrada de lapas": "Grilled with garlic and coriander, on toasted bread.",
    "Lulas ao alho":
      "Grilled to order, with garlic and chips. They taste better on the terrace, with a small draught beer.",
    Percebes:
      "Only there when the sea lets them be picked. When there are some, they go early.",
    Navalheira: "Boiled and served whole, with the cracker beside it.",
    "Bacalhau à Brás": "Shredded salt cod, straw potatoes and black olives.",
  },
};

const fr: EmentaTraduzida = {
  categorias: {
    entradas: {
      title: "Entrées",
      intro:
        "Ce qu'on met sur la table en premier. Les fruits de mer dépendent de ce que la mer a donné le matin.",
    },
    snack: {
      title: "Snacks",
      intro:
        "Quand la faim ne se règle plus avec un bout de pain et quelques lupins.",
    },
    extras: {
      title: "Suppléments",
      intro: "À ajouter à ce qui est déjà dans l'assiette.",
    },
    sandes: {
      title: "Sandwichs et tartines",
      intro: "Le déjeuner rapide de qui continue vers Saint-Jacques.",
    },
    cafetaria: {
      title: "Cafétéria",
      intro: "Le comptoir de toujours, avant ou après la plage.",
    },
    bebidas: {
      title: "Boissons",
      intro: "Eaux et boissons fraîches, à emporter en terrasse.",
    },
    cerveja: {
      title: "Bière",
      intro: "Le verre peut sortir par la porte et aller voir la mer avec vous.",
    },
    vinho: {
      title: "Vin",
      intro: "Au verre, en pichet, ou la bouteille pour toute la table.",
    },
    bar: { title: "Bar", intro: "Au comptoir, une fois le soleil couché." },
  },
  descricoes: {
    "Tábua de presunto e queijo": "Jambon cru, fromage affiné, olives et pain.",
    "Cesto de entradas":
      "Trois pâtés et un petit fromage. Le pain n'est pas compris.",
    "Chouriço assado": "Grillé sur la tuile, devant celui qui le commande.",
    Percebes: "Seulement quand la mer laisse les cueillir.",
    "Torrada de lapas":
      "Grillées à l'ail et à la coriandre, sur du pain grillé.",
    Camarão: "Cuites, servies tièdes avec du gros sel.",
    Francesinha: "Pain, steak, saucisse, chouriço, jambon et fromage.",
    "Francesinha com ovo e batata frita":
      "La même, avec un œuf au plat par-dessus.",
    "Bacalhau à Brás": "Morue effilochée, pommes paille et olives noires.",
    "Prego no prato": "Avec œuf au plat et frites.",
    "Lulas ao alho com batata frita": "Grillés à la minute, à l'ail.",
    Moelas: "Mijotés doucement au vin rouge.",
    Pataniscas: "Beignets de morue, faits à la commande.",
    Bifana: "Mijotée la veille dans sa sauce.",
    "Prego no pão": "Bœuf grillé, ail, pain de la boulangerie du village.",
    "Sande P.O.": "Jambon cru et œuf au plat, comme on l'a toujours fait.",
    "Cachorro especial": "Avec fromage et sauce piquante.",
    Pneu: "Eau gazeuse et citron frais.",
    Compal: "Nectar de fruits.",
    Snappy: "Soda pétillant au citron vert.",
    "Caneca de alumínio tango": "Avec du sirop de groseille.",
    "Caneca tango": "Avec du sirop de groseille.",
    Tango: "Bière au sirop de groseille.",
    Panaché: "Bière et soda au citron vert.",
    Somersby: "Cidre.",
    "Captain Morgan": "Rhum.",
    "Cuba Libre": "Rhum, Coca-Cola et citron.",
    Caipirinha: "Cachaça, citron vert et sucre.",
    Caipirão: "Caipirinha à la liqueur Beirão.",
    Poncha: "Rhum, citron et miel.",
    Croft: "Brandy.",
    Macieira: "Brandy.",
    "Amêndoa amarga": "Liqueur d'amande amère.",
    Favaios: "Moscatel.",
    "Favaios com cerveja": "Moscatel avec de la bière.",
    "Whiskey novo": "Blended.",
    "Whiskey Jameson": "Blended.",
    "Cutty Sark": "Blended.",
  },
  notas: {
    época: "de saison",
    Beira: "Beira",
    Douro: "Douro",
    Alentejo: "Alentejo",
    verde: "Vinho Verde",
    espumante: "pétillant",
  },
  destaques: {
    "Amêijoa à pirata":
      "Le plat qui revient le plus dans les avis. Il arrive avec du pain, et le pain est là pour la sauce.",
    "Torrada de lapas":
      "Grillées à l'ail et à la coriandre, sur du pain grillé.",
    "Lulas ao alho":
      "Grillés à la minute, à l'ail, avec des frites. C'est meilleur en terrasse, avec une pression.",
    Percebes:
      "Il n'y en a que quand la mer laisse les cueillir. Quand il y en a, ils partent tôt.",
    Navalheira: "Cuit et servi entier, avec le casse-noix à côté.",
    "Bacalhau à Brás": "Morue effilochée, pommes paille et olives noires.",
  },
};

const es: EmentaTraduzida = {
  categorias: {
    entradas: {
      title: "Entrantes",
      intro:
        "Lo que se pone primero en la mesa. El marisco depende de lo que el mar dio por la mañana.",
    },
    snack: {
      title: "Snacks",
      intro:
        "Cuando el hambre ya no se resuelve con un pan y unos altramuces.",
    },
    extras: {
      title: "Extras",
      intro: "Para añadir a lo que ya va en el plato.",
    },
    sandes: {
      title: "Bocadillos y tostas",
      intro: "El almuerzo rápido de quien sigue camino de Santiago.",
    },
    cafetaria: {
      title: "Cafetería",
      intro: "La barra de siempre, antes o después de la playa.",
    },
    bebidas: {
      title: "Bebidas",
      intro: "Aguas y refrescos, para llevar a la terraza.",
    },
    cerveja: {
      title: "Cerveza",
      intro: "La bebida puede salir por la puerta e ir a ver el mar contigo.",
    },
    vinho: {
      title: "Vino",
      intro: "Por copa, en jarra, o la botella para toda la mesa.",
    },
    bar: { title: "Bar", intro: "En la barra, ya con el sol puesto." },
  },
  descricoes: {
    "Tábua de presunto e queijo": "Jamón, queso curado, aceitunas y pan.",
    "Cesto de entradas": "Tres patés y un quesito. El pan no está incluido.",
    "Chouriço assado": "Asado en la teja, delante de quien lo pide.",
    Percebes: "Solo cuando el mar deja cogerlos.",
    "Torrada de lapas": "A la plancha con ajo y cilantro, sobre pan tostado.",
    Camarão: "Cocidos, servidos templados con sal gruesa.",
    Francesinha: "Pan, filete, salchicha, chouriço, jamón de york y queso.",
    "Francesinha com ovo e batata frita": "La misma, con huevo frito por encima.",
    "Bacalhau à Brás": "Bacalao desmigado, patatas paja y aceituna negra.",
    "Prego no prato": "Con huevo frito y patatas fritas.",
    "Lulas ao alho com batata frita": "A la plancha al momento, con ajo.",
    Moelas: "Guisadas despacio en vino tinto.",
    Pataniscas: "Buñuelos de bacalao, hechos al momento.",
    Bifana: "Guisada la víspera en su salsa.",
    "Prego no pão": "Ternera a la plancha, ajo, pan de la panadería del pueblo.",
    "Sande P.O.": "Jamón y huevo frito, como se hizo siempre.",
    "Cachorro especial": "Con queso y salsa picante.",
    Pneu: "Agua con gas y limón fresco.",
    Compal: "Néctar de fruta.",
    Snappy: "Refresco de lima con gas.",
    "Caneca de alumínio tango": "Con grosella.",
    "Caneca tango": "Con grosella.",
    Tango: "Cerveza con grosella.",
    Panaché: "Cerveza con refresco de lima.",
    Somersby: "Sidra.",
    "Captain Morgan": "Ron.",
    "Cuba Libre": "Ron, Coca-Cola y limón.",
    Caipirinha: "Cachaza, lima y azúcar.",
    Caipirão: "Caipiriña con licor Beirão.",
    Poncha: "Ron, limón y miel.",
    Croft: "Brandy.",
    Macieira: "Brandy.",
    "Amêndoa amarga": "Licor de almendra amarga.",
    Favaios: "Moscatel.",
    "Favaios com cerveja": "Moscatel con cerveza.",
    "Whiskey novo": "Blended.",
    "Whiskey Jameson": "Blended.",
    "Cutty Sark": "Blended.",
  },
  notas: {
    época: "de temporada",
    Beira: "Beira",
    Douro: "Douro",
    Alentejo: "Alentejo",
    verde: "Vinho Verde",
    espumante: "espumoso",
  },
  destaques: {
    "Amêijoa à pirata":
      "El plato que más aparece en las reseñas. Viene con pan, y el pan es para la salsa.",
    "Torrada de lapas": "A la plancha con ajo y cilantro, sobre pan tostado.",
    "Lulas ao alho":
      "A la plancha al momento, con ajo y patatas fritas. Saben mejor en la terraza, con una caña.",
    Percebes:
      "Solo hay cuando el mar deja cogerlos. Cuando hay, se acaban pronto.",
    Navalheira: "Cocida y servida entera, con el cascanueces al lado.",
    "Bacalhau à Brás": "Bacalao desmigado, patatas paja y aceituna negra.",
  },
};

const traducoes = { en, fr, es };

/*
  A ementa já na língua da página.

  Em português devolve-se o `menu` tal e qual — é o original, não há nada a
  substituir. Nas outras troca-se título, introdução, descrição e nota, e
  deixa-se tudo o resto (nome, preço, ordem) exactamente onde estava.
*/
export function ementaEm(lang: Locale): readonly Category[] {
  if (lang === "pt") return menu;
  const t = traducoes[lang];

  return menu.map((categoria) => ({
    ...categoria,
    title: t.categorias[categoria.id].title,
    intro: t.categorias[categoria.id].intro,
    dishes: categoria.dishes.map((prato) => ({
      ...prato,
      description:
        "description" in prato ? t.descricoes[prato.name] : undefined,
      note: "note" in prato ? t.notas[prato.note] : undefined,
    })),
  }));
}

/*
  Os seis pratos-âncora da página inicial, na língua da página.

  A fotografia vai junto: cada destaque traz uma `Photo`, e o `alt` dela é
  texto lido como qualquer outro. Sem o `fotoEm` ficava a descrição em
  francês e a fotografia descrita em português no mesmo cartão.
*/
export function destaquesEm(lang: Locale): readonly Highlight[] {
  if (lang === "pt") return highlights;
  const t = traducoes[lang];

  return highlights.map((destaque) => ({
    ...destaque,
    description: t.destaques[destaque.name],
    photo: fotoEm(lang, destaque.photo),
  }));
}
