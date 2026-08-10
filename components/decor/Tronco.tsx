import Image from "next/image";
import { photos } from "@/lib/images";

type Props = {
  /**
   * Fracção da caixa que fica acima da linha da divisória. `50%` centra a
   * trave nela, que é o que serve em qualquer sítio onde não haja nada
   * pendurado. Ver a nota do `ACIMA_DA_LINHA` para a única excepção.
   */
  acimaDaLinha?: string;
  /**
   * Espelha a trave na horizontal, para o padrão da casca não se repetir de
   * divisória em divisória.
   */
  espelhada?: boolean;
  /** Camada, quando o valor por omissão não serve. */
  className?: string;
};

/*
  A trave que atravessa a página de aresta a aresta a separar duas secções.

  Começou por ser uma só, na junta entre o Hero e a secção "A casa", onde o
  esqueleto se senta e a tabuleta se pendura. O Gonçalo pediu-a para todas as
  divisórias, e com isso deixou de ser um adereço de um sítio: é o sistema de
  divisórias da página. Onde havia um fio de 1px a separar secções, há madeira
  — as linhas que faziam esse trabalho saíram todas.

  Na junta do Hero passa **por trás** do esqueleto: entra e sai por detrás do
  baú, e é o esqueleto inteiro, pernas incluídas, que fica à vista por cima da
  madeira.

  ## Porque é que a caixa é muito mais alta do que a trave

  O ficheiro tem 6000×1563 e a madeira ocupa só a faixa central: 32,9% de
  transparente em cima, 35,5% de madeira, 31,6% de transparente em baixo. A
  espessura que se vê é `ALTURA × 0,355` — a caixa é quase três vezes a trave.

  ## Porque é `object-fill` e não `object-cover`

  Uma trave de 6000×1563 esticada aos 1400 px do contentor daria 364 px de
  altura de caixa, ou seja ~130 px de madeira: um cepo, não uma viga.
  `object-cover` resolveria a altura mas cortava a faixa de madeira ao meio e
  perdia-se-lhe a silhueta redonda — ficava uma barra chata.

  `object-fill` esmaga a imagem na vertical e mantém as duas arestas curvas
  intactas. Numa casca de árvore isso lê-se como uma trave mais longa e mais
  fina, que é exactamente o que se quer; e o ficheiro é um padrão que já se
  repete ao longo dos 6000 px, por isso a distorção não tem nada onde se
  denunciar.

  ## Onde está montada, e porque traz a régua consigo

  Não é filha de secção nenhuma. O Hero é `overflow-hidden` e cortava-a nas
  pontas; a `Casa` e as outras são `max-w-[1400px]` e nunca chegam às arestas
  do ecrã sem `w-screen` (que conta a barra de scroll e abre scroll
  horizontal). Vive entre secções, como irmã delas, que já é largura total.

  A régua — o `relative z-10 h-0` que a segura — está **dentro** deste
  componente e não em quem o monta. Era escrita à mão quando havia uma só
  trave; com seis passava a ser copiada seis vezes, e é ela que tem as
  decisões todas: a altura zero (a divisória é uma linha, não ocupa espaço) e
  a camada.

  `shrink-0` porque a última trave da página fica entre o `</main>` e o
  `<Footer />`, e aí é um item de um `flex flex-col` (o `<body>`, em
  `app/layout.tsx`). Um item de altura zero não tem nada que entrar na conta
  de encolhimento.

  Sem `Reveal`: uma trave que cai a balançar contradiz o que uma trave é.

  ## Porquê espelhar

  Seis vezes a mesma casca dá um padrão que se reconhece de divisória em
  divisória — a mesma nódoa no mesmo sítio, seis vezes. Alternar o sentido por
  posição quebra isso sem precisar de um segundo ficheiro.

  É quem monta que decide, e não um `Math.random()` aqui dentro: aleatoriedade
  no render dá marcação diferente no servidor e no cliente, e rebenta a
  hidratação.
*/

/*
  Altura da caixa, não da trave. A espessura visível sai daqui a 35,5%:

  | Ecrã | Caixa | Trave |
  |---|---|---|
  | telemóvel 390 | 112px (mínimo) | 40px |
  | 1024 | 133px | 47px |
  | 1440 | 187px | 66px |
  | ≥1770 | 230px (tecto) | 82px |

  Os extremos vêm dos dois mockups do Gonçalo: ~42 px de trave no telemóvel,
  ~82 px no ecrã largo. Trocar o ficheiro implica reconfirmar os 35,5% — é
  medido NESTE recorte. Na passagem da madeira clara para a escura foram
  remedidos e não mudaram: as duas têm a faixa nos mesmos 32,8%–69,3%.
*/
const ALTURA_CAIXA = "clamp(112px, 13vw, 230px)";

/*
  Quanto da caixa fica acima da linha, por omissão. **50% centra a trave na
  divisória**, e é o que serve em cinco das seis.

  A sexta — a junta do Hero — pede `56%` a quem a monta, e a excepção fica à
  vista lá em vez de virar a regra aqui. A razão é dela só: a aresta de baixo
  da madeira tem de ficar abaixo da linha para tapar as pontas das correntes da
  tabuleta, que nascem exactamente nessa linha. Um valor mais alto punha-as à
  vista, penduradas do nada. Nas outras cinco não há nada pendurado, e o valor
  honesto é o que centra.
*/
const ACIMA_DA_LINHA = "50%";

export function Tronco({
  acimaDaLinha = ACIMA_DA_LINHA,
  espelhada = false,
  className,
}: Props = {}) {
  const foto = photos.tronco;

  return (
    /* A régua da divisória: uma linha sem altura, e a trave centrada nela. */
    <div className={`relative z-10 h-0 shrink-0 ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: ALTURA_CAIXA, transform: `translateY(-${acimaDaLinha})` }}
      >
        <Image
          src={foto.src}
          alt=""
          fill
          sizes="100vw"
          className={`object-fill ${espelhada ? "scale-x-[-1]" : ""}`}
          /*
            A sombra vai no filtro e não em `box-shadow`, pela mesma razão que
            está escrita no `Esqueleto.tsx`: o `box-shadow` desenha o
            rectângulo da caixa, e a caixa aqui é quase três vezes a trave —
            desenhava uma mancha muito acima e muito abaixo dela. O
            `drop-shadow` segue o alfa.
          */
          style={{ filter: "drop-shadow(0 12px 20px rgb(0 0 0 / 0.55))" }}
        />
      </div>
    </div>
  );
}
