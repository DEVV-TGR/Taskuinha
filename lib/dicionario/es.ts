import type { Dicionario } from "./pt";

/*
  O espanhol.

  A língua do vizinho, e a de quem chega pelo Caminho vindo da Galiza — que
  fica a hora e meia de carro. É também a única das quatro em que "petiscos"
  se percebe sem explicação nenhuma.

  Atenção ao `reservar`: "Reservar mesa" escreve-se igual em português e em
  espanhol. Não é gralha nem chave por traduzir.
*/
export const es = {
  meta: {
    titulo: "Taberna a la orilla del mar en Vila Chã",
    descricao:
      "Taberna de petiscos frente a la playa de Vila Chã, Vila do Conde. Marisco fresco, terraza mirando al Atlántico y el Camino de Santiago pasando por la puerta.",
    palavras: [
      "restaurante Vila Chã",
      "marisco Vila do Conde",
      "restaurante junto al mar Oporto",
      "Taskuinha",
      "Camino de Santiago",
    ],
    ementaTitulo: "Carta",
    ementaDescricao:
      "Entrantes, snacks, bocadillos y tostas de la Taskuinha do Pirata, en Vila Chã, con la carta de cervezas, vinos y bar.",
    ogAlt: "Taskuinha do Pirata, taberna a la orilla del mar en Vila Chã",
  },

  geral: {
    reservar: "Reservar mesa",
    verEmenta: "Ver la carta",
    comoChegar: "Cómo llegar",
    saltar: "Saltar al contenido",
  },

  nav: {
    principal: "Navegación principal",
    rodape: "Navegación del pie de página",
    inicio: "Taskuinha do Pirata, ir a la página de inicio",
    abrir: "Abrir menú",
    fechar: "Cerrar menú",
    casa: "La casa",
    petiscos: "Petiscos",
    sitio: "El sitio",
    ementa: "Carta",
    encontrar: "Encontrarnos",
  },

  linguas: {
    escolher: "Elegir idioma",
    actual: "Idioma en uso",
  },

  hero: {
    titulo: "El mar está a veinte pasos.",
    frase:
      "Taberna de petiscos en Vila Chã. Marisco fresco, terraza tranquila y la bebida puede irse contigo hasta la arena.",
  },

  casa: {
    titulo: "La casa",
    p1: "Le llaman el Pirata. El nombre se le pegó y ahí quedó, como se pega todo en un pueblo pequeño.",
    p2: "La Taskuinha es una taberna de pescadores en la Avenida dos Banhos, con el mar al otro lado de la carretera. Sirve petiscos, no platos de bandera: almejas, calamares, buñuelos de bacalao, y percebes cuando el mar deja cogerlos.",
    p3: "Hay terraza en la parte de atrás para quien busca tranquilidad, y está la barra para quien no la busca. La bebida puede salir por la puerta e ir a ver la puesta de sol contigo.",
  },

  petiscos: {
    titulo: "Lo que más sale de la cocina",
    frase:
      "Estos son los platos que más aparecen en las reseñas de quienes han estado aquí.",
  },

  galeria: {
    titulo: "El sitio",
    frase:
      "Vila Chã es una aldea de pescadores. Las pasarelas de madera siguen la costa en los dos sentidos y el Camino de Santiago pasa aquí, por la puerta, todos los días, a los pies de alguien.",
  },

  vozes: {
    titulo: "Lo que dicen",
    frase:
      "Llegan reseñas en varios idiomas, lo que tiene sentido en una casa donde siempre hay alguien camino de Santiago.",
    traduzido: {
      pt: "Traducido del portugués",
      en: "Traducido del inglés",
      fr: "Traducido del francés",
      es: "Traducido del español",
    },
  },

  encontrar: {
    titulo: "Encontrarnos",
    horario: "Horario",
    folga: "Cerrado",
    aviso:
      "Los fines de semana la casa se llena. Merece la pena llamar antes de venir.",
    mapa: "Mapa con la ubicación de la Taskuinha en la Avenida dos Banhos, Vila Chã",
  },

  dias: {
    Segunda: "Lunes",
    Terça: "Martes",
    Quarta: "Miércoles",
    Quinta: "Jueves",
    Sexta: "Viernes",
    Sábado: "Sábado",
    Domingo: "Domingo",
  },

  horarios: {
    Encerrado: "Cerrado",
    "10h00 às 23h00": "10:00 a 23:00",
    "10h00 às 20h00": "10:00 a 20:00",
  },

  rodape: {
    peregrinos:
      "El Camino de Santiago pasa por la puerta. Los peregrinos son bienvenidos, con o sin reserva.",
    creditos: "Sitio por",
  },

  ementa: {
    titulo: "Carta",
    frase:
      "Casa de petiscos, no de platos de bandera. Lo que hay hoy depende de lo que el mar dio por la mañana.",
    categorias: "Categorías de la carta",
    alergias:
      "Si tienes alergias o intolerancias, dilo en la mesa antes de pedir. Casi todo pasa por el marisco.",
  },
} satisfies Dicionario;
