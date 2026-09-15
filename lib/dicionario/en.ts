import type { Dicionario } from "./pt";

/*
  O inglês.

  A língua com mais peso das três: é a que quem vem de longe usa quando não
  sabe qual usar. As avaliações em inglês são as segundas mais numerosas
  depois das portuguesas.

  ## O que fica por traduzir

  "Petiscos" fica. Não é "starters" nem "tapas" — é o que a casa serve e é
  o nome que está na porta, e quem procura a palavra encontra-a. O mesmo
  vale para "Taskuinha do Pirata" e para os nomes de sítios.

  Onde um prato não tem nome corrente em inglês, traduz-se o que ele **é**
  em vez de inventar nome: os percebes são "goose barnacles" na descrição,
  mas o prato continua a chamar-se Percebes na ementa (ver
  `lib/menu-linguas.ts`).

  As chaves de `dias` são os identificadores do `lib/horario.ts` e ficam em
  português — são chaves, não texto lido. As horas em si não estão aqui:
  são calculadas pelo `horasEm()`, porque uma etiqueta que o painel pode
  mudar não serve de chave de tradução.
*/
export const en = {
  meta: {
    titulo: "Seaside tavern in Vila Chã",
    descricao:
      "A petiscos tavern facing the beach at Vila Chã, Vila do Conde. Fresh seafood, a terrace looking out on the Atlantic and the Camino de Santiago passing the door.",
    palavras: [
      "restaurant Vila Chã",
      "seafood Vila do Conde",
      "beachfront restaurant Porto",
      "Taskuinha",
      "Camino de Santiago",
    ],
    ementaTitulo: "Menu",
    ementaDescricao:
      "Starters, snacks, sandwiches and toasties at Taskuinha do Pirata in Vila Chã, with the beer, wine and bar list.",
    ogAlt: "Taskuinha do Pirata, a seaside tavern in Vila Chã",
  },

  geral: {
    reservar: "Book a table",
    verEmenta: "See the menu",
    comoChegar: "Get directions",
    saltar: "Skip to content",
  },

  nav: {
    principal: "Main navigation",
    rodape: "Footer navigation",
    inicio: "Taskuinha do Pirata, go to the home page",
    abrir: "Open menu",
    fechar: "Close menu",
    casa: "The house",
    petiscos: "Petiscos",
    sitio: "The place",
    ementa: "Menu",
    encontrar: "Find us",
  },

  linguas: {
    escolher: "Choose language",
    actual: "Language in use",
  },

  som: {
    ligar: "Turn the music on",
    desligar: "Turn the music off",
  },

  hero: {
    titulo: "The sea is twenty steps away.",
    frase:
      "A petiscos tavern in Vila Chã. Fresh seafood, a quiet terrace, and your drink can go with you down to the sand.",
  },

  casa: {
    titulo: "The house",
    p1: "They call him the Pirate. The name stuck and stayed, the way everything sticks in a small place.",
    p2: "A Taskuinha is a fishermen's tavern on Avenida dos Banhos, with the sea on the other side of the road. It serves petiscos, not showpiece dishes: clams, squid, salt cod fritters, and goose barnacles when the sea lets them be picked.",
    p3: "There is a terrace out the back for anyone who wants quiet, and the counter for anyone who doesn't. Your drink can go out the door and watch the sunset with you.",
  },

  petiscos: {
    titulo: "What comes out of the kitchen most",
    frase:
      "These are the dishes that come up most often in reviews from people who have eaten here.",
  },

  galeria: {
    titulo: "The place",
    frase:
      "Vila Chã is a fishing village. The wooden boardwalks follow the coast in both directions and the Camino de Santiago passes the door, every day, under somebody's feet.",
  },

  vozes: {
    titulo: "What people say",
    frase:
      "Reviews arrive in several languages, which makes sense in a house where somebody is always on their way to Santiago.",
    traduzido: {
      pt: "Translated from Portuguese",
      en: "Translated from English",
      fr: "Translated from French",
      es: "Translated from Spanish",
    },
  },

  encontrar: {
    titulo: "Find us",
    horario: "Opening hours",
    folga: "Closed",
    aviso: "The house fills up at the weekend. It is worth calling ahead.",
    mapa: "Map showing where Taskuinha is on Avenida dos Banhos, Vila Chã",
  },

  dias: {
    segunda: "Monday",
    terca: "Tuesday",
    quarta: "Wednesday",
    quinta: "Thursday",
    sexta: "Friday",
    sabado: "Saturday",
    domingo: "Sunday",
  },


  rodape: {
    peregrinos:
      "The Camino de Santiago passes the door. Pilgrims are welcome, with or without a booking.",
    creditos: "Site by",
  },

  ementa: {
    titulo: "Menu",
    frase:
      "A petiscos house, not a house of showpiece dishes. What there is today depends on what the sea gave this morning.",
    categorias: "Menu categories",
    alergias:
      "If you have allergies or intolerances, tell us at the table before you order. Almost everything here passes through shellfish.",
    levar: "Take the menu with you",
  },

  erro: {
    perdido: {
      codigo: "404",
      titulo: "This page is not in the house",
      frase:
        "The address you followed leads nowhere. It happens — the sea takes things.",
      voltar: "Back to the door",
    },
    avaria: {
      titulo: "Something broke",
      frase:
        "It was not your fault. Try again; if it happens twice, give us a call — the table is still there.",
      tentar: "Try again",
      voltar: "Back to the door",
    },
  },
} satisfies Dicionario;
