/*
  Inventário fotográfico da Taskuinha.

  Todas as imagens são locais, em /public/images. Não há URLs remotas e o
  next.config.ts já não tem `remotePatterns` — não voltar a acrescentar.

  Vinte e quatro destas fotografias são da casa (fachada, salas, esplanada,
  pratos, o mar à porta). As outras seis — as três naus e as três caveiras —
  são ilustrações de fora, usadas como decoração. O campo `origem` guarda essa
  distinção porque o rodapé precisa dela: o aviso "as fotografias não são da
  casa" deixou de ser verdade para a esmagadora maioria, mas não para todas.

  O inventário legível, com a proveniência de cada ficheiro, está em
  public/images/README.md.
*/

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Como a fotografia se comporta debaixo da gradação nocturna:
   * "dia" leva as duas camadas completas, "noite" leva metade da primeira.
   */
  luz: "dia" | "noite";
  /** "casa" = fotografada na Taskuinha. "ilustracao" = imagem de fora. */
  origem: "casa" | "ilustracao";
};

export const photos = {
  /* ---------------------------------------------------------------- fachada */

  fachadaNoite: {
    src: "/images/fachada-noite.jpg",
    alt: "A fachada da Taskuinha de noite: as letras PIRATA iluminadas ao longo do beiral, seis barris pendurados por baixo, a porta aberta a deitar luz para a calçada e o esqueleto pirata sentado à direita com uma garrafa na mão.",
    width: 1536,
    height: 2048,
    luz: "noite",
    origem: "casa",
  },
  fachadaNoite2: {
    src: "/images/fachada-noite-2.jpg",
    alt: "A mesma fachada noutra noite, vista de frente: os barris, os dois lemes de madeira, as lanternas acesas e o corredor de entrada pintado com um cais de barcos.",
    width: 1536,
    height: 2048,
    luz: "noite",
    origem: "casa",
  },
  fachadaPorDoSol: {
    src: "/images/fachada-por-do-sol.jpg",
    alt: "A fachada ao fim da tarde, com o sol rasante a acender o telhado de telha. Lê-se o letreiro de madeira sobre a porta, o cartaz manuscrito do horário e a ementa escrita em ripas de madeira ao lado da entrada.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },

  /* --------------------------------------------------------------- esqueleto */

  esqueleto: {
    src: "/images/esqueleto.jpg",
    alt: "O esqueleto pirata que recebe à porta, sentado numa arca do tesouro: lenço vermelho na cabeça, pala no olho, casaco esfarrapado e uma garrafa levada à boca.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  esqueletoCorpo: {
    src: "/images/esqueleto-corpo.jpg",
    alt: "O esqueleto pirata de corpo inteiro, com a ementa manuscrita em ripas de madeira atrás e o quadro de autocolantes de clubes de motards ao lado.",
    width: 1080,
    height: 1440,
    luz: "dia",
    origem: "casa",
  },
  /*
    O mascote recortado, com fundo transparente. É esta que vai para o site
    — as duas de cima têm a parede, a calçada e a floreira atrás, e servem
    de galeria, não de autocolante.

    Chegou com 3228×3678 e 8,8 MB, e está aqui reduzida a 1200. A maior
    caixa em que aparece são 620px, que num ecrã a 3× pede 1860px — mas a
    diferença acima de 1200 já não se vê num recorte fotográfico a esta
    escala, e eram megabytes de repositório para sempre.

    `alt: ""` porque é decoração: o contentor em `Esqueleto.tsx` é
    `aria-hidden`, e a estátua já está descrita na `esqueleto.jpg`, que é a
    mesma peça fotografada com contexto.

    `luz: "dia"` mas **não leva a gradação nocturna**. As duas camadas
    (`--breu` multiply + `--lanterna` overlay) existem para assentar
    fotografias que estão *dentro* da página; esta está colada *por cima*
    dela, e escurecê-la punha-a a parecer que estava por trás.
  */
  esqueletoRecorte: {
    src: "/images/esqueleto-grande.png",
    alt: "",
    width: 1200,
    height: 1367,
    luz: "dia",
    origem: "casa",
  },

  /* ----------------------------------------------------------------- tronco */

  /*
    A trave que atravessa a página na junta entre o Hero e a secção "A casa".
    Recorte com fundo transparente: a madeira ocupa a faixa dos 33% aos 68%
    da altura do ficheiro, e o resto é transparente — é desse 35,5% que sai a
    espessura visível da trave (ver `components/decor/Tronco.tsx`).

    Chega a `object-fill` e não a `object-cover`: a trave é esticada em
    largura de uma aresta à outra do ecrã, e é isso que lhe dá o aspecto de
    viga longa em vez de cepo curto. `cover` cortava-lhe o cimo e o fundo e
    matava a silhueta redonda.

    `alt: ""` porque é decoração pura, e o contentor do componente é
    `aria-hidden`.

    **Não leva a gradação nocturna** — as duas camadas (`--breu` multiply +
    `--lanterna` overlay) existem para assentar fotografias que estão *dentro*
    da página; esta está colada *por cima* dela.
  */
  tronco: {
    src: "/images/tronco.png",
    alt: "",
    width: 6000,
    height: 1563,
    luz: "dia",
    origem: "ilustracao",
  },

  /* ------------------------------------------------------------------- casa */

  bandeiraCaveira: {
    src: "/images/bandeira-caveira.jpg",
    alt: "A bandeira negra da casa pendurada no tecto turquesa: caveira de chapéu de bicorne, sabres cruzados por baixo e uma caveira pequena na aba do chapéu.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },
  lemeTaskuinha: {
    src: "/images/leme-taskuinha.jpg",
    alt: "O comando de mesa em forma de leme de navio, pintado à mão a vermelho com o nome da casa — o N ao contrário, como no letreiro da porta.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  tectoNau: {
    src: "/images/tecto-nau.jpg",
    alt: "O tecto pintado com uma nau à vela em mar bravo, e por baixo a parede coberta de barcos em miniatura, redes, chapéus de marinheiro e reclames antigos.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },
  tectoNauAranha: {
    src: "/images/tecto-nau-aranha.jpg",
    alt: "O mural da nau no tecto com uma aranha peluda pendurada a meio, sobre o balcão carregado de chapéus, máscaras de mergulho e barcos de madeira.",
    width: 1152,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  salaCheia: {
    src: "/images/sala-cheia.jpg",
    alt: "A sala cheia a uma noite de jantar, com cachecóis de clubes de futebol pendurados no tecto de madeira, lanternas de papel, bóias salva-vidas e mesas de cadeiras verdes, amarelas e laranja.",
    width: 2048,
    height: 1536,
    luz: "noite",
    origem: "casa",
  },
  balcaoBandeirinhas: {
    src: "/images/balcao-bandeirinhas.jpg",
    alt: "O balcão visto de baixo, com a fita de bandeirinhas de países atravessada por cima — Brasil, Espanha, Alemanha, Gana, Argentina, Costa Rica, Camarões, Chile, Austrália e Coreia do Sul — sob o tecto de tábuas turquesa.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },
  balcaoEspingardas: {
    src: "/images/balcao-espingardas.jpg",
    alt: "Duas espingardas antigas cruzadas com remos por cima do balcão, entre redes de pesca, lanternas brancas, conchas de vieira e uma fila de barcos de madeira.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },
  salaEstatuas: {
    src: "/images/sala-estatuas.jpg",
    alt: "O canto dos piratas em tamanho real, com uma arca a transbordar de colares e moedas, balas de canhão empilhadas e o reclame do Captain Morgan na parede de madeira.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },

  /* -------------------------------------------------------------- esplanada */

  esplanada: {
    src: "/images/esplanada.jpg",
    alt: "A esplanada, com a vedação de tábuas pintadas de todas as cores, uma prancha de salvamento do I.S.N. pendurada, bóias, remos e uma bicicleta enferrujada encostada ao fundo.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },
  esplanada2: {
    src: "/images/esplanada-2.jpg",
    alt: "Mesas de tampo de madeira e cadeiras vermelhas na relva sintética da esplanada, frente à vedação de tábuas às cores com a prancha do I.S.N. e duas bóias salva-vidas.",
    width: 2048,
    height: 1536,
    luz: "dia",
    origem: "casa",
  },

  /* --------------------------------------------------------------------- mar */

  marPorDoSol: {
    src: "/images/mar-por-do-sol.jpg",
    alt: "O sol a descer sobre o Atlântico em maré vazia, visto do murete da marginal, com as rochas descobertas e o céu riscado de nuvens altas.",
    width: 2048,
    height: 1536,
    luz: "noite",
    origem: "casa",
  },
  marCao: {
    src: "/images/mar-cao.jpg",
    alt: "Um homem sentado no murete da marginal com o cão ao lado, os dois a ver o sol pôr-se no mar.",
    width: 1536,
    height: 2048,
    luz: "noite",
    origem: "casa",
  },

  /* ---------------------------------------------------------------- petiscos */

  petiscoAmeijoas: {
    src: "/images/petisco-ameijoas.jpg",
    alt: "Uma travessa de amêijoas abertas em azeite e orégãos, com meio limão ao meio e um prato de pão ao lado.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  petiscoLapas: {
    src: "/images/petisco-lapas.jpg",
    alt: "Lapas grelhadas com alho e coentros, cada uma na sua concha, servidas sobre fatias de pão torrado numa frigideira de ferro.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  petiscoLulas: {
    src: "/images/petisco-lulas.jpg",
    alt: "Lulas grelhadas com alho e pimenta numa travessa, com batata frita ao lado.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  petiscoSardinhas: {
    src: "/images/petisco-sardinhas.jpg",
    alt: "Duas sardinhas assadas deitadas sobre uma fatia larga de pão torrado, num prato branco, à frente da grelha de carvão ainda acesa.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  petiscoPercebes: {
    src: "/images/petisco-percebes.jpg",
    alt: "Um prato de percebes cozidos e uma navalheira, à mesa da esplanada, com uma caneca de cerveja e a ementa da casa ao lado.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  percebesCrus: {
    src: "/images/percebes-crus.jpg",
    alt: "Percebes acabados de apanhar, ainda com as unhas fechadas e restos de alga, num alguidar.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },
  lapasCruas: {
    src: "/images/lapas-cruas.jpg",
    alt: "Lapas cruas dispostas numa tábua vermelha, tiradas da rocha nessa manhã, com fios de alga por entre as conchas.",
    width: 1536,
    height: 2048,
    luz: "dia",
    origem: "casa",
  },

  /* ------------------------------------------------------------ ilustrações */

  nauCruz: {
    src: "/images/nau-cruz.jpg",
    alt: "Ilustração antiga de uma nau portuguesa de velas quadradas com a cruz de Cristo.",
    width: 401,
    height: 453,
    luz: "dia",
    origem: "ilustracao",
  },
  nauArmada: {
    src: "/images/nau-armada.webp",
    alt: "Ilustração de uma nau das armadas portuguesas do século XVI.",
    width: 800,
    height: 547,
    luz: "dia",
    origem: "ilustracao",
  },
  nausFrota: {
    src: "/images/naus-frota.jpg",
    alt: "Ilustração de uma frota de naus à vela no mar alto.",
    width: 630,
    height: 420,
    luz: "dia",
    origem: "ilustracao",
  },
  caveiraMadeira: {
    src: "/images/caveira-madeira.jpg",
    alt: "Caveira de pirata entalhada em madeira, com chapéu de bicorne, pala no olho e sabres cruzados atrás, sobre fundo preto.",
    width: 570,
    height: 713,
    luz: "noite",
    origem: "ilustracao",
  },
  caveiraLenco: {
    src: "/images/caveira-lenco.webp",
    alt: "Caveira de pirata com lenço na cabeça, recortada sobre fundo liso.",
    width: 410,
    height: 500,
    luz: "dia",
    origem: "ilustracao",
  },
  caveiraMesa: {
    src: "/images/caveira-mesa.webp",
    alt: "Caveira decorativa vista de frente, recortada sobre fundo liso.",
    width: 500,
    height: 500,
    luz: "dia",
    origem: "ilustracao",
  },
} satisfies Record<string, Photo>;
