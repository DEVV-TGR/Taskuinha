import type { Locale } from "@/lib/i18n";
import type { Dia as HorarioDia } from "@/lib/horario";

/*
  O português — a língua da casa, e o original de tudo o resto.

  Este ficheiro é a **forma** do dicionário: o `type Dicionario` é
  literalmente `typeof pt`, e os outros três (`en`, `fr`, `es`) declaram-se
  com `satisfies Dicionario`. Uma chave a menos, a mais ou com outro nome
  não compila. É essa a única garantia de que nenhuma frase fica por
  traduzir, e é por isso que estes ficheiros são TypeScript e não JSON.

  ## O que NÃO está aqui

  - **Os pratos.** Nome, preço e ordem vivem no `lib/menu.ts`, que continua
    a ser a fonte única; as descrições traduzidas estão no
    `lib/menu-linguas.ts`, com o nome do prato sempre em português.
  - **As citações dos clientes.** Estão no `lib/reviews.ts`, ao lado da nota
    de proveniência de cada uma.
  - **Nomes próprios.** "Taskuinha", "do Pirata", "Vila Chã", "Rumoceano" e
    "@taskuinhadopirata" não se traduzem em língua nenhuma.

  ## Sem `as const`

  Deliberado. Com `as const` os arrays viravam tuplos de comprimento fixo e
  cada literal virava o seu próprio tipo — as outras línguas passavam a ser
  obrigadas a ter exactamente as mesmas palavras, que é o oposto do que se
  quer.
*/

/*
  Os sete dias da semana, pelos identificadores do `lib/horario.ts`.

  Eram chaveados pelo nome português — `Segunda`, `Terça` — e a par deles
  havia um mapa `horarios` chaveado pela etiqueta escrita à mão
  (`"10h00 às 23h00"`). Os dois saíram do `lib/site.ts` quando o horário
  passou a ser editável no painel: uma etiqueta que muda não pode ser chave
  de tradução, senão mudar a hora de fecho deixa três línguas sem texto.
  Quem escreve a etiqueta agora é o `horasEm()`; aqui ficam só os nomes dos
  dias, que são sete e não mudam nunca.
*/
type Dia = HorarioDia;

export const pt = {
  meta: {
    titulo: "Taberna à beira-mar em Vila Chã",
    descricao:
      "Taberna de petiscos em frente à praia de Vila Chã, Vila do Conde. Marisco fresco, esplanada virada ao Atlântico e o Caminho de Santiago a passar à porta.",
    palavras: [
      "restaurante Vila Chã",
      "petiscos Vila do Conde",
      "marisco à beira-mar",
      "Taskuinha",
      "Caminho de Santiago",
    ],
    ementaTitulo: "Ementa",
    ementaDescricao:
      "Entradas, snacks, sandes e tostas da Taskuinha do Pirata, em Vila Chã, com a carta de cervejas, vinhos e bar.",
    ogAlt: "Taskuinha do Pirata, taberna à beira-mar em Vila Chã",
  },

  /* Frases que aparecem em mais do que um sítio. */
  geral: {
    reservar: "Reservar mesa",
    verEmenta: "Ver a ementa",
    comoChegar: "Como chegar",
    saltar: "Saltar para o conteúdo",
  },

  nav: {
    principal: "Navegação principal",
    rodape: "Navegação do rodapé",
    inicio: "Taskuinha do Pirata, ir para a página inicial",
    abrir: "Abrir menu",
    fechar: "Fechar menu",
    casa: "A casa",
    petiscos: "Petiscos",
    sitio: "O sítio",
    ementa: "Ementa",
    encontrar: "Encontrar-nos",
  },

  linguas: {
    escolher: "Escolher língua",
    actual: "Língua em uso",
  },

  hero: {
    titulo: "O mar fica a vinte passos.",
    frase:
      "Taberna de petiscos em Vila Chã. Marisco fresco, esplanada calma e a bebida pode ir contigo até à areia.",
  },

  casa: {
    titulo: "A casa",
    p1: "Chamam-lhe o Pirata. O nome pegou-se e ficou, como se pega tudo numa terra pequena.",
    p2: "A Taskuinha é uma taberna de pescadores na Avenida dos Banhos, com o mar do outro lado da estrada. Serve petiscos, não pratos de bandeira: amêijoas, lulas, pataniscas, e percebes quando o mar deixa apanhar.",
    p3: "Há esplanada nas traseiras para quem quer sossego, e há o balcão para quem não quer. A bebida pode sair porta fora e ir ver o pôr do sol contigo.",
  },

  petiscos: {
    titulo: "O que sai mais da cozinha",
    frase:
      "Estes são os pratos que mais aparecem nas avaliações de quem cá esteve.",
  },

  galeria: {
    titulo: "O sítio",
    frase:
      "Vila Chã é uma aldeia piscatória. Os passadiços de madeira seguem a costa nos dois sentidos e o Caminho de Santiago passa aqui à porta, todos os dias, aos pés de alguém.",
  },

  vozes: {
    titulo: "O que dizem",
    frase:
      "Chegam avaliações em várias línguas, o que faz sentido numa casa onde há sempre alguém a caminho de Santiago.",
    /*
      As citações são de pessoas com nome e mês publicados. Quando se lêem
      numa língua que não é aquela em que foram escritas, tem de se dizer —
      senão põe-se na boca delas uma frase que não escreveram.
    */
    traduzido: {
      pt: "Traduzido do português",
      en: "Traduzido do inglês",
      fr: "Traduzido do francês",
      es: "Traduzido do espanhol",
    } satisfies Record<Locale, string>,
  },

  encontrar: {
    titulo: "Encontrar-nos",
    horario: "Horário",
    folga: "Folga",
    aviso: "Ao fim de semana a casa enche. Vale a pena telefonar antes de vir.",
    mapa:
      "Mapa com a localização da Taskuinha na Avenida dos Banhos, Vila Chã",
  },

  /* Chaveados pelos ids do lib/horario.ts. */
  dias: {
    segunda: "Segunda",
    terca: "Terça",
    quarta: "Quarta",
    quinta: "Quinta",
    sexta: "Sexta",
    sabado: "Sábado",
    domingo: "Domingo",
  } satisfies Record<Dia, string>,

  rodape: {
    peregrinos:
      "O Caminho de Santiago passa à porta. Peregrinos são bem recebidos, com ou sem reserva.",
    creditos: "Site by",
  },

  ementa: {
    titulo: "Ementa",
    frase:
      "Casa de petiscos, não de pratos de bandeira. O que há hoje depende do que o mar deu de manhã.",
    categorias: "Categorias da ementa",
    alergias:
      "Se tiveres alergias ou intolerâncias, diz à mesa antes de pedir. Quase tudo passa por marisco.",
  },

  /*
    Os dois ecrãs de erro.

    O `avaria` não diz o que se avariou, e é de propósito: a mensagem
    técnica fica no registo do servidor, não à frente de quem só queria
    ver a ementa. Nem `error.message` nem `error.digest` chegam ao ecrã.
  */
  erro: {
    perdido: {
      codigo: "404",
      titulo: "Esta página não está na casa",
      frase:
        "A morada que seguiste não leva a lado nenhum. Acontece — o mar leva coisas.",
      voltar: "Voltar à entrada",
    },
    avaria: {
      titulo: "Alguma coisa se partiu",
      frase:
        "Não foi culpa tua. Tenta outra vez; se voltar a acontecer, telefona-nos que a mesa está lá na mesma.",
      tentar: "Tentar de novo",
      voltar: "Voltar à entrada",
    },
  },
};

export type Dicionario = typeof pt;
