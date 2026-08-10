import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/*
  A tabuleta de madeira pendurada por correntes, com o texto por cima. Fica
  atrás do `Tronco` — as correntes sobem e desaparecem por trás da trave.

  ## Porque é que isto não é um <Image>

  Porque a tábua tem de **crescer com o texto**. Uma fotografia tem um rácio
  fixo: ou o texto encolhia até caber lá dentro (ilegível no telemóvel), ou
  saía por baixo da tábua, ou a imagem esticava toda — correntes e rebites
  incluídos.

  A saída é um `border-image` de nove fatias. A imagem é cortada numa grelha
  de 3×3, e cada pedaço tem um destino diferente:

  ```
  ┌─────────┬───────────────┬─────────┐
  │ corrente│  vão + ripa   │corrente │  ← altura FIXA, nunca estica
  │ + aro   │  (estica →)   │ + aro   │
  ├─────────┼───────────────┼─────────┤
  │ barra   │               │ barra   │
  │ de ferro│   as ripas    │ de ferro│  ← repetem-se (round) conforme
  │ (repete)│   (repetem)   │ (repete)│    o texto faz a caixa crescer
  ├─────────┼───────────────┼─────────┤
  │ canto   │  ripa de baixo│  canto  │  ← altura FIXA
  └─────────┴───────────────┴─────────┘
  ```

  As correntes e as ferragens vivem nos cantos e nas arestas, que são
  desenhados ao tamanho natural. Só o miolo se repete. Resultado: a tábua fica
  sempre maior do que o que leva dentro, em qualquer ecrã, sem deformar nada.

  ## De onde vêm os quatro números

  Medidos no ficheiro (1800×1800 depois de reduzido), do topo para baixo:

  | y | O que é |
  |---|---|
  | 0–49 | transparente |
  | 49–509 | as correntes |
  | 509–774 | a primeira ripa |
  | 774 · 1075 · 1368 | **as juntas entre ripas** |
  | 1368–1633 | a última ripa |
  | 1633–1800 | transparente |

  O corte de cima (774) e o de baixo (432 = 1800−1368) caem **exactamente em
  cima de duas juntas**. É isso que faz o miolo repetir-se sem costura: o
  ladrilho tem duas ripas inteiras e a emenda cai onde já havia uma junta.
  Cortar a meio de uma ripa dava um salto de veio visível a cada repetição.

  Na horizontal:

  | x | O que é |
  |---|---|
  | 0–79 | transparente |
  | 79–236 | a aresta queimada |
  | 236–328 | a barra de ferro com os rebites |
  | 328–1440 | a tábua livre — **é aqui que o texto cabe** |
  | 1440–1530 | a barra de ferro |
  | 1530–1723 | a aresta queimada |
  | 1723–1800 | transparente |

  Sobram 62% da largura para o texto. Numa tabuleta é o que há: as ferragens
  e a aresta queimada ocupam o resto, e é essa proporção que está nos dois
  mockups do Gonçalo.

  ## Porque é que as medidas estão em `cqw`

  `border-image-width` em percentagem resolve na **largura** para as arestas
  laterais mas na **altura** para as de cima e de baixo — e a altura aqui varia
  com o texto, o que punha as correntes a crescer com os parágrafos. Em `cqw`
  (percentagem da largura do contentor) as quatro medidas escalam juntas, pela
  mesma régua, em qualquer largura.

  O `border-width` leva os mesmos valores porque `border-image-width` só pinta
  — quem decide onde o texto começa é o `border-width`.

  **Se o ficheiro for substituído:** remedir as sete fronteiras acima. É a
  única coisa que este componente sabe da imagem.

  Já aconteceu uma vez, na passagem da tábua clara para a escura, e as sete
  bateram certo ao centésimo — é o mesmo recorte, só escurecido. Não é razão
  para não remedir da próxima: dois ficheiros iguais foram sorte, não regra.
*/

/* Fatias, em pixéis do ficheiro: cima, direita, baixo, esquerda. */
const FATIAS = "774 375 432 345";

/* As mesmas fatias em fracção de 1800, para a régua ser a mesma. */
const AROS = "43cqw 20.8333cqw 24cqw 19.1667cqw";

/*
  A margem transparente que o ficheiro tem por cima das correntes: 49px em
  1800, ou 2,7222% da largura. Subida em margem negativa para as **pontas das
  correntes** — e não a aresta do ficheiro — caírem exactamente na linha da
  junta, que é onde o tronco está.

  Tem de ser em `cqw` como o resto: em píxeis fixos o desalinhamento voltava a
  cada largura de ecrã, e é meia dúzia de píxeis que decide se as correntes
  nascem de trás da trave ou penduradas do nada por baixo dela.
*/
const MARGEM_DAS_CORRENTES = "-2.7222cqw";

export function Tabuleta({ children, className }: Props) {
  return (
    /* O `container-type` é o que dá sentido ao `cqw` lá dentro. */
    <div className="[container-type:inline-size]">
      <div
        className={`border-solid border-transparent ${className ?? ""}`}
        style={{
          marginTop: MARGEM_DAS_CORRENTES,
          borderWidth: AROS,
          borderImageSource: "url(/images/tableta-escura.webp)",
          /* `fill` pinta também o miolo — sem isto o meio da tábua ficava vazio. */
          borderImageSlice: `${FATIAS} fill`,
          /*
            Horizontal `stretch`: o vão entre as duas correntes é transparente,
            e transparente esticado continua transparente.
            Vertical `round`: as ripas e os rebites **repetem-se** em vez de
            esticarem, e o `round` ajusta o ladrilho para caber um número
            inteiro de vezes.
          */
          borderImageRepeat: "stretch round",
        }}
      >
        {children}
      </div>
    </div>
  );
}
