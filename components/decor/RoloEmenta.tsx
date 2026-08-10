import type { ReactNode } from "react";

/*
  O rolo de pergaminho da ementa: uma vara em cima, uma vara em baixo, e o
  papel a esticar-se entre as duas até a ementa acabar.

  Substitui os seis pergaminhos gerados em SVG que a página tinha — um por
  categoria. O `decor/Pergaminho.tsx` continua vivo e intocado: é ele que
  serve as citações (`Vozes.tsx`) e o painel do mapa (`Encontrar.tsx`).

  ## Porque é `border-image` e não uma imagem cortada em três

  Pela mesma razão que a `decor/Tabuleta.tsx`: o rolo tem de **crescer com o
  texto**, e uma fotografia tem rácio fixo. Cortar o ficheiro em três
  (topo / faixa / fundo) e empilhar `<div>`s dá o mesmo resultado, mas com
  três pedidos de rede, três ficheiros a manter em sincronia e as juntas
  entre eles a alinhar à mão.

  O `border-image` de nove fatias faz isto nativamente, de um ficheiro só:

  ```
  ┌──────────┬─────────────────┬──────────┐
  │ ferragem │  vara + corda   │ ferragem │  ← altura FIXA, nunca estica
  │ + caracol│   (estica →)    │ + caracol│
  ├──────────┼─────────────────┼──────────┤
  │  borda   │                 │  borda   │
  │ rasgada  │     o papel     │ rasgada  │  ← repetem-se (round) conforme
  │ (repete) │    (repete)     │ (repete) │    a ementa faz a caixa crescer
  ├──────────┼─────────────────┼──────────┤
  │ ferragem │  vara de baixo  │ ferragem │  ← altura FIXA
  └──────────┴─────────────────┴──────────┘
  ```

  ## De onde vêm os dois cortes horizontais

  Não foram escolhidos a olho. Numa repetição vertical, a última linha do
  ladrilho encosta à primeira — e num rasgão irregular quase nenhum par de
  linhas casa. Varreu-se o ficheiro à procura do par (topo, fundo) que
  minimiza a diferença entre as duas linhas, alfa incluído e a pesar mais do
  que a cor: um salto na silhueta vê-se, uma mancha no papel não.

  O par que ganhou — **633** e **1153** — dá uma diferença menor do que a de
  duas linhas separadas por 3 px no próprio ficheiro. A costura da repetição
  lê-se como mais um entalhe do rasgão.

  Os dois cortes têm ainda de cair na zona limpa: abaixo dos caracóis de cima
  (acabam a ~550) e acima dos de baixo (começam a ~1242). Ambos caem.

  ## De onde vêm as outras medidas

  Medidas no ficheiro (1600×1800), todas em fracção da **largura**:

  | Medida | Valor | Porquê |
  |---|---|---|
  | fatia de cima | 633 px | acaba a vara e os caracóis |
  | fatia de baixo | 647 px | 1800 − 1153 |
  | fatias laterais | 320 px | o entalhe mais fundo da faixa está a 261 |
  | texto, laterais | 22cqw | 5,7 pontos de folga sobre esse entalhe |
  | texto, cima | 27cqw | o papel limpo começa a 22,2% da largura |
  | texto, baixo | 29cqw | o papel limpo acaba a 23,1% da largura |

  As três medidas do texto têm quase cinco pontos a mais do que o mínimo
  medido. Não é desperdício: o detector de "papel limpo" procura corridas de
  píxeis escuros, e apanha a ferragem no ponto em que ela já é escura — não no
  ponto em que ela começa, que é claro e esbatido. A primeira versão levava o
  mínimo à risca e no ecrã a última linha do Bar passava a ~40px da voluta.

  As três primeiras vão em `border-width`, à escala natural do ficheiro — é
  isso que garante que **nada se deforma**: a fatia central de cima estica
  exactamente 1×, porque 1600 − 320 − 320 = 960 é a mesma fracção (60%) que
  sobra na caixa depois das duas bordas de 20%.

  As três últimas são o `padding` do texto, e são **menores** do que as
  bordas de cima e de baixo. É deliberado: o texto sobe por cima da parte de
  baixo da fatia da vara, onde já é papel limpo no meio, e poupa meio ecrã de
  rolo vazio antes da primeira categoria. Pode fazê-lo porque o desenho da
  borda é pintado com a borda — e a borda pinta-se *antes* do conteúdo.

  ## Porque é que as medidas estão em `cqw`

  O mesmo argumento da `Tabuleta`: `padding` em percentagem resolve sempre na
  largura, mas `border-image-width` em percentagem resolve na **altura** para
  as bordas de cima e de baixo — e a altura aqui varia com a ementa, o que
  punha a vara a crescer com o número de pratos. Em `cqw` as medidas todas
  escalam pela mesma régua.

  ## Porque é que a moldura vive numa camada irmã

  Pelo motivo que o `decor/Pergaminho.tsx` documenta: o `filter` do
  `drop-shadow` aplicado ao elemento que envolve o conteúdo apanhava também o
  texto, e punha sombra em cada preço. Separada, a sombra é do rolo e o texto
  fica limpo.

  **Se o ficheiro for substituído** (a versão sem marca de água, por
  exemplo): remedir os dois cortes e as três fatias. É a única coisa que este
  componente sabe da imagem.
*/

/* Fatias, em pixéis do ficheiro: cima, direita, baixo, esquerda. */
const FATIAS = "633 320 647 320";

/* As mesmas fatias em fracção de 1600, para a régua ser a mesma. */
const VARAS = "39.5625cqw 20cqw 40.4375cqw 20cqw";

/* Onde o texto pode começar sem apanhar ferragem, caracol ou rasgão. */
const MARGEM_DO_TEXTO = "27cqw 22cqw 29cqw";

export function RoloEmenta({ children }: { children: ReactNode }) {
  return (
    /* O `container-type` é o que dá sentido ao `cqw` lá dentro. */
    <div className="relative [container-type:inline-size]">
      <div
        aria-hidden="true"
        className="absolute inset-0 border-solid border-transparent [filter:drop-shadow(0_8px_24px_rgb(0_0_0/0.7))]"
        style={{
          borderWidth: VARAS,
          borderImageSource: "url(/images/rolo-ementa.webp)",
          /* `fill` pinta também o miolo — sem isto o papel do meio ficava vazio. */
          borderImageSlice: `${FATIAS} fill`,
          /*
            Horizontal `stretch`: a vara e o papel esticam de uma borda
            rasgada à outra — e, pelas contas acima, esticam 1×.
            Vertical `round`: a borda rasgada e o papel **repetem-se** em vez
            de esticarem, e o `round` ajusta o ladrilho para caber um número
            inteiro de vezes.
          */
          borderImageRepeat: "stretch round",
        }}
      />

      <div
        className="relative text-[var(--pergaminho-tinta)]"
        style={{ padding: MARGEM_DO_TEXTO }}
      >
        {children}
      </div>
    </div>
  );
}
