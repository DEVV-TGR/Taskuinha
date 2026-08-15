import type { Locale } from "@/lib/i18n";
import {
  menu,
  destaques,
  pratoPorId,
  type Category,
  type Highlight,
} from "@/lib/menu";
import { em, emOuNada } from "@/lib/texto";
import { fotoEm } from "@/lib/images-linguas";

/*
  A ementa e os destaques na língua da página.

  Este ficheiro já teve 389 linhas e três dicionários escritos à mão. Agora
  tem o que resta depois de os textos passarem para dentro dos dados: duas
  funções que escolhem a coluna certa.

  ## O que se traduz e o que não

  **O nome do prato não se traduz.** Amêijoa à pirata é Amêijoa à pirata em
  Vila Chã e em Bordéus — é o que está escrito no livro da ementa e é o que
  se aponta com o dedo quando se pede. Traduz-se a linha por baixo, que é a
  que diz o que o prato é.

  Os preços também não. Ficam no formato da casa (`13,50 €`) em todas as
  línguas: é o que está no livro, e um mesmo número escrito de duas maneiras
  é mais confuso do que um formato estrangeiro.

  Nas notas dos vinhos, Beira, Douro e Alentejo são regiões e ficam como
  estão — no `data/ementa.json` aparecem só com `pt`, e o recuo do
  `lib/texto.ts` trata do resto. "Verde" é a excepção: passa a "Vinho Verde"
  nas três, porque sozinha a palavra traduzida não diz nada a ninguém.
*/

export function ementaEm(lang: Locale): readonly Category[] {
  return menu.map((categoria) => ({
    id: categoria.id,
    title: em(categoria.titulo, lang),
    intro: em(categoria.intro, lang),
    dishes: categoria.pratos.map((prato) => ({
      name: prato.nome,
      price: prato.preco,
      description: emOuNada(prato.descricao, lang),
      note: emOuNada(prato.nota, lang),
    })),
  }));
}

/*
  Os seis pratos-âncora da página inicial, na língua da página.

  O preço vem do prato da ementa e não do destaque — ver o comentário longo
  no `lib/menu.ts`. O `pratoPorId` nunca devolve `undefined` aqui: o
  `lib/menu.ts` verifica os seis quando é carregado e atira se algum apontar
  para o vazio. O `!` é sobre essa garantia, não sobre optimismo.

  A fotografia vai junto: cada destaque traz uma `Photo`, e o `alt` dela é
  texto lido como qualquer outro. Sem o `fotoEm` ficava a descrição em
  francês e a fotografia descrita em português no mesmo cartão.
*/
export function destaquesEm(lang: Locale): readonly Highlight[] {
  return destaques.map((destaque) => ({
    name: destaque.nome,
    description: em(destaque.descricao, lang),
    price: pratoPorId(destaque.pratoId)!.preco,
    photo: fotoEm(lang, destaque.photo),
  }));
}
