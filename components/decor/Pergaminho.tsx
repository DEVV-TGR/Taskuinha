import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/*
  Moldura de pergaminho: a folha de papel velho, com o rasgão dela, e 4 pregos
  de ferro nos cantos. Serve as citações (`Vozes.tsx`) e o painel do mapa
  (`Encontrar.tsx`).

  ## A folha é uma fotografia, e já não é desenhada

  Era um SVG gerado em `lib/texturas.ts`: manchas de queimado por cima da cor
  base `--pergaminho`, e um contorno entalhado a servir de `mask-image`, cada
  instância com a sua semente. Passou a ser a `folhavelha.webp` — o mesmo
  caminho que a ementa fez quando o `RoloEmenta.tsx` substituiu os seis
  pergaminhos SVG que a página tinha.

  Perde-se a variação: as três citações tinham três recortes diferentes e
  passam a ter o mesmo. Foi decisão do Gonçalo, com o caso posto.

  ## Porque é `border-image` e não a imagem esticada

  Pela razão que o `RoloEmenta.tsx:11-31` documenta, e que aqui é ainda mais
  aguda: as citações são uma grelha de **duas colunas em todas as
  resoluções**, por isso num telemóvel a caixa mede ~170px de largura e cresce
  em altura com o texto. A folha é larga (rácio 1,376). Esticá-la numa caixa
  dessas achatava o rasgão — bordas finas e alongadas nos lados, comprimidas
  em cima e em baixo.

  Com nove fatias, os quatro cantos vão à escala natural, as bordas rasgadas
  mantêm a espessura, e só o miolo — que é textura de papel e não tem forma
  reconhecível — é que estica.

  ## De onde vêm as medidas

  Medidas no ficheiro final (1200×872), que sai do `scripts/folha-velha.mjs`
  já recortado à folha:

  | Medida | Valor | Porquê |
  |---|---|---|
  | fatia | 84 px | 7% da largura; o entalhe mais fundo mede 58 |
  | `border-width` | 7cqw | a mesma fracção, para a fatia esticar 1× |
  | padding do texto | 12% | folga sobre o entalhe em qualquer tamanho |

  O entalhe foi medido pelo alfa do original, percentil 95 por lado: 58px no
  topo, 36 em baixo, 50 à esquerda, 45 à direita (já na escala do `.webp`). A
  fatia de 84 leva folga sobre o pior deles.

  `stretch` nos dois eixos, e não o `stretch round` do rolo: o `round` obrigou
  lá a uma varredura à procura do par de linhas cuja costura casa (ver o
  comentário dele, linhas 34-44). Não há essa análise para esta folha, e uma
  costura mal escolhida no meio de um rasgão vê-se muito mais do que o
  esticamento do papel.

  ## Duas camadas, e o `container-type` numa terceira

  A moldura vive numa camada IRMÃ, absoluta, atrás do conteúdo — não no
  elemento que envolve `children`. É deliberado: o §9.9 do plano avisa que
  criar um *stacking context* no contentor que envolve um `<iframe>`
  cross-origin (o mapa) leva o Safari a fazer o iframe desaparecer.

  É a mesma razão que põe o `[container-type:inline-size]` num invólucro só
  para a moldura, em vez de ir no elemento de fora: `container-type` aplica
  `contain: layout`, que **cria stacking context**. No elemento de fora ficaria
  por cima do iframe do mapa — exactamente o que o aviso diz para não fazer.
  Assim o `cqw` resolve-se contra uma caixa do mesmo tamanho, e o conteúdo
  fica fora de qualquer containment.

  O `cqw` é preciso pelo que o `RoloEmenta.tsx:79-85` explica:
  `border-width` em percentagem resolve na **altura** para as bordas de cima e
  de baixo, e a altura de uma citação varia com o comprimento do texto — as
  varas engrossariam com o texto. Em `cqw` a régua é sempre a largura.

  ## O padding do texto

  O rasgão come 7% da largura de cada lado, e onde ele é mais fundo a folha
  desaparece e revela o fundo escuro da página. Texto que lá entre fica
  ilegível. Os 12% são a folga sobre esse valor; os extremos do `clamp` são os
  que interessam:

  - **1,5rem** — em caixas estreitas 12% seriam poucos píxeis. A 170px o
    entalhe são ~12px e o mínimo dá 24px.
  - **4,5rem** — tecto para o painel largo do mapa não ficar com margem
    absurda. A 600px o entalhe são 42px e o tecto dá 72px.
*/

/* Fatias, em pixéis do ficheiro: os quatro lados levam a mesma. */
const FATIA = 84;

/* A mesma fatia em fracção de 1200, para a régua ser a mesma. */
const BORDA = "7cqw";

export function Pergaminho({ children, className }: Props) {
  return (
    <div className={`pergaminho relative ${className ?? ""}`}>
      {/* Só a moldura vive dentro do contentor de consulta — ver acima. */}
      <div aria-hidden="true" className="absolute inset-0 [container-type:inline-size]">
        <div
          className="absolute inset-0 border-solid border-transparent [filter:drop-shadow(0_8px_24px_rgb(0_0_0/0.7))]"
          style={{
            borderWidth: BORDA,
            borderImageSource: "url(/images/folhavelha.webp)",
            /* `fill` pinta também o miolo — sem isto o papel do meio ficava vazio. */
            borderImageSlice: `${FATIA} fill`,
            borderImageRepeat: "stretch",
          }}
        />
      </div>

      {Prego("top-2 left-2")}
      {Prego("top-2 right-2")}
      {Prego("bottom-2 left-2")}
      {Prego("bottom-2 right-2")}

      {/* A cor da tinta vem da classe `.pergaminho`, por herança. */}
      <div className="relative p-[clamp(1.5rem,12%,4.5rem)]">{children}</div>
    </div>
  );
}

function Prego(posicao: string) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`pointer-events-none absolute z-10 h-3 w-3 ${posicao}`}
    >
      <circle cx="6" cy="6" r="4.5" fill="#3a3229" />
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#161310" strokeWidth="1" />
      <circle cx="4.7" cy="4.7" r="1" fill="#5c5347" opacity="0.7" />
    </svg>
  );
}
