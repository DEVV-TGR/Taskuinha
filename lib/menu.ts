import { photos, type Photo } from "@/lib/images";
import type { Texto } from "@/lib/texto";
import dados from "@/data/ementa.json";

/*
  A ementa da casa.

  Os dados já não estão aqui — estão no `data/ementa.json`, que é o ficheiro
  que o painel de administração grava. Este módulo é o que os lê, lhes dá
  forma e os entrega às páginas.

  ## De onde vieram

  Transcritos das sete fotografias do livro da ementa que o dono forneceu
  (`public/images/Menu1.jpg` a `Menu7.jpg`), revistos com ele, e migrados
  para JSON pelo `scripts/migrar-ementa.mts`.

  Regra do cliente, que continua a valer para quem acrescentar pratos: **o
  que aparece sem preço no livro não vai para o site.** Ficaram de fora as
  etiquetas em branco (Baguete, Bacalhau c/ grão, Atum c/ feijão frade,
  Sardinhas c/ salada, Caldo verde, Sopa, Presunto e Queijo dos extras, Água
  Carvalhelhos, Irish Coffee), as linhas riscadas a marcador (três cervejas,
  os dois ice teas, o Refrigerante) e os preços apagados (Veros, Veros
  Reserva, e o terceiro vinho verde, que ficou sem nome nem preço). O
  Baileys esteve nessa lista até 26 de Agosto de 2026: o preço estava
  borratado na fotografia e ninguém o sabia ler. O dono disse-o — 4,00 € —
  e ele entrou, que é o caminho de saída desta lista para os outros.

  ## O que se perdeu na passagem a JSON, e vale a pena saber

  A ementa era `as const satisfies`, e disso saíam os tipos que o
  `lib/menu-linguas.ts` usava como chaves: mudar o nome de um prato partia o
  build até a tradução acompanhar. Com os textos dentro dos dados essa
  garantia deixa de fazer sentido — cada prato leva as suas quatro línguas
  ao lado do preço, e uma que falte recua ao português em vez de partir
  nada. Ver `lib/texto.ts` para o porquê.

  O que **não** se perdeu é a verificação dos destaques: se um deles apontar
  para um prato que já não existe, este ficheiro atira no build. Ver o fim.
*/

/** Um prato como está escrito no `data/ementa.json`. */
export type PratoDeDados = {
  id: string;
  nome: string;
  preco: number;
  descricao?: Texto;
  /** etiqueta curta ao lado do nome — a região, nos vinhos */
  nota?: Texto;
};

/** Uma categoria como está escrita no `data/ementa.json`. */
export type CategoriaDeDados = {
  id: string;
  titulo: Texto;
  intro: Texto;
  pratos: readonly PratoDeDados[];
};

/*
  A ementa já resolvida numa língua — é esta a forma que as páginas desenham,
  e é de propósito que os campos estão em inglês e sem `Texto` nenhum: quem
  escreve o `app/[lang]/ementa/page.tsx` não tem de saber que há quatro
  línguas por baixo. Quem as resolve é o `ementaEm()` do `lib/menu-linguas.ts`.
*/
export type Dish = {
  name: string;
  description?: string;
  price: number;
  note?: string;
};

export type Category = {
  id: string;
  title: string;
  intro: string;
  dishes: readonly Dish[];
};

export const menu = dados.categorias as readonly CategoriaDeDados[];

/** Todos os pratos por identificador, para quem precisa de ir buscar um. */
const porId = new Map(
  menu.flatMap((categoria) => categoria.pratos.map((prato) => [prato.id, prato])),
);

export function pratoPorId(id: string): PratoDeDados | undefined {
  return porId.get(id);
}

/*
  Os pratos-âncora da página inicial.

  Eram cinco, escolhidos por serem os cinco com fotografia real servida à
  mesa. As sardinhas saíram: existem no livro como "Sardinhas c/ salada", mas
  sem preço, e o que não tem preço não vai para o site. Entraram a
  Francesinha e o Bacalhau à Brás; o Gonçalo mandou depois as fotografias da
  navalheira e do bacalhau à Brás, e com elas a troca — fora a Francesinha,
  dentro a navalheira. Os seis voltam a ser o que a secção anuncia: pratos
  com fotografia real da casa.

  **Seis, sempre.** A grelha do bento em `Petiscos.tsx` está calibrada para
  seis — o primeiro ocupa `col-span-4 row-span-2` e os outros cinco
  `col-span-2`. Sete ou cinco abrem buracos.

  ## Porque é que aqui só está o `pratoId` e não o preço

  Porque o preço passou a ter um dono só. Enquanto a ementa era código, cada
  destaque trazia o preço copiado e um comentário a avisar que quem mexesse
  num tinha de mexer no outro — uma nota que se cumpria porque as duas linhas
  estavam no mesmo ficheiro, à vista uma da outra. Com o painel isso deixa de
  ser verdade: o dono muda a amêijoa para 17,90 na ementa e a página inicial
  continuava a anunciar 16,90 sem ninguém dar por isso. O preço vem agora do
  prato, e a divergência deixa de ser possível.

  O `nome` fica, e não é redundante: o cartão da home diz "Lulas ao alho" e a
  ementa diz "Lulas ao alho com batata frita". O nome curto é escolha de
  desenho e não um descuido. A descrição e a fotografia também ficam cá — têm
  voz própria e não são as da ementa.
*/
export type Destaque = {
  pratoId: string;
  nome: string;
  descricao: Texto;
  photo: Photo;
};

export const destaques = [
  {
    pratoId: "ameijoa-a-pirata",
    nome: "Amêijoa à pirata",
    descricao: {
      pt: "O prato que mais aparece nas avaliações. Vem com pão, e o pão serve para o molho.",
      en: "The dish that comes up most in the reviews. It arrives with bread, and the bread is there for the sauce.",
      fr: "Le plat qui revient le plus dans les avis. Il arrive avec du pain, et le pain est là pour la sauce.",
      es: "El plato que más aparece en las reseñas. Viene con pan, y el pan es para la salsa.",
    },
    photo: photos.petiscoAmeijoas,
  },
  {
    pratoId: "torrada-de-lapas",
    nome: "Torrada de lapas",
    descricao: {
      pt: "Grelhadas com alho e coentros, sobre pão torrado.",
      en: "Grilled with garlic and coriander, on toasted bread.",
      fr: "Grillées à l'ail et à la coriandre, sur du pain grillé.",
      es: "A la plancha con ajo y cilantro, sobre pan tostado.",
    },
    photo: photos.petiscoLapas,
  },
  {
    pratoId: "lulas-ao-alho-com-batata-frita",
    nome: "Lulas ao alho",
    descricao: {
      pt: "Grelhadas na hora, com alho e batata frita. Sabem melhor na esplanada, com um fino.",
      en: "Grilled to order, with garlic and chips. They taste better on the terrace, with a small draught beer.",
      fr: "Grillés à la minute, à l'ail, avec des frites. C'est meilleur en terrasse, avec une pression.",
      es: "A la plancha al momento, con ajo y patatas fritas. Saben mejor en la terraza, con una caña.",
    },
    photo: photos.petiscoLulas,
  },
  {
    pratoId: "percebes",
    nome: "Percebes",
    descricao: {
      pt: "Só há quando o mar deixa apanhar. Quando há, acabam cedo.",
      en: "Only there when the sea lets them be picked. When there are some, they go early.",
      fr: "Il n'y en a que quand la mer laisse les cueillir. Quand il y en a, ils partent tôt.",
      es: "Solo hay cuando el mar deja cogerlos. Cuando hay, se acaban pronto.",
    },
    photo: photos.petiscoPercebes,
  },
  {
    pratoId: "navalheira",
    nome: "Navalheira",
    descricao: {
      pt: "Cozida e servida inteira, com o quebra-nozes ao lado.",
      en: "Boiled and served whole, with the cracker beside it.",
      fr: "Cuit et servi entier, avec le casse-noix à côté.",
      es: "Cocida y servida entera, con el cascanueces al lado.",
    },
    photo: photos.petiscoNavalheira,
  },
  {
    pratoId: "bacalhau-a-bras",
    nome: "Bacalhau à Brás",
    descricao: {
      pt: "Lascas desfiadas, batata palha e azeitona preta.",
      en: "Shredded salt cod, straw potatoes and black olives.",
      fr: "Morue effilochée, pommes paille et olives noires.",
      es: "Bacalao desmigado, patatas paja y aceituna negra.",
    },
    photo: photos.petiscoBacalhauBras,
  },
] as const satisfies readonly Destaque[];

/** Um destaque já resolvido numa língua, com o preço vindo da ementa. */
export type Highlight = {
  name: string;
  description: string;
  price: number;
  photo: Photo;
};

/*
  A rede que substitui a que o `as const satisfies` dava.

  Isto corre no build, quando o módulo é carregado, e é o que impede que uma
  gravação do painel deixe a página inicial a apontar para um prato que já não
  existe. Falha alto e com o nome do prato: a alternativa era um `undefined`
  a chegar ao `formatPrice` e um "NaN €" na home.

  Se acontecer, a Vercel mantém o deploy anterior no ar e o site não cai — o
  que se perde é a alteração, não a casa.
*/
for (const destaque of destaques) {
  if (!porId.has(destaque.pratoId)) {
    throw new Error(
      `O destaque "${destaque.nome}" aponta para o prato "${destaque.pratoId}", ` +
        `que não existe no data/ementa.json. Um prato que é destaque da página ` +
        `inicial não pode ser apagado sem se tratar do destaque primeiro.`,
    );
  }
}

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
