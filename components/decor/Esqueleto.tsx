import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { photos } from "@/lib/images";

/*
  O mascote — a estátua a sério, recortada do fundo e colada por cima do
  layout. Senta-se na junta entre o Hero e a secção "A casa", à direita,
  com as pernas penduradas para dentro desta.

  À direita, e não por acaso: é o lado onde ele está na fachada real (ver a
  descrição da `fachadaNoite` em lib/images.ts), e é o lado livre — o texto
  do Hero vive num `max-w-3xl` encostado à esquerda.

  Fica **à frente da trave** (`z-20` no `Casa.tsx`, contra o `z-10` do
  `Tronco`): a madeira entra e sai por detrás do baú, e a `drop-shadow` daqui
  de baixo cai em cima dela — é essa sombra na madeira que faz a sobreposição
  ler-se como profundidade e não como recorte colado.

  Era um SVG desenhado à mão que **nunca chegou a ser montado em página
  nenhuma**. Ninguém o viu, por isso isto não é uma substituição: é a
  estreia do mascote no site. Perde-se o braço articulado que levava a
  garrafa à boca de nove em nove segundos, e não faz falta — uma estátua de
  cimento não mexe o braço.

  ## Porque é que são dois elementos e não um

  ```
  contentor   absolute · largura responsiva · -translate-y-[63%]
    └ Reveal  a queda — o Motion escreve `transform` inline AQUI
        └ Image
  ```

  1. `-translate-y-[63%]` é percentagem da **própria altura** do elemento.
     É o que faz o assento cair sempre em cima da junta sem precisar de um
     valor de `top` por cada tamanho de ecrã: muda-se a largura e o resto
     acerta-se sozinho, porque a altura vem do rácio da fotografia.

  2. Tem de estar num elemento **separado** do `Reveal`. O Motion escreve
     `transform` inline no elemento que anima; se fosse o mesmo, a queda
     esmagava o posicionamento e ele aparecia encavalitado no sítio errado.

  3. De borla, o mesmo arranjo salva o caso sem movimento: as regras de
     `prefers-reduced-motion` e de `<noscript>` forçam
     `transform: none !important` em `[data-reveal]`, e esse atributo cai
     no elemento de dentro. O posicionamento do de fora sobrevive — ele
     fica quieto **e no sítio**.

  ## Nunca desaparece

  Não há classes `hidden` aqui. O que muda com a resolução é a largura,
  nunca a presença.

  | Ecrã | Largura | Altura | Acima da junta | Abaixo | Espaço na `Casa` |
  |---|---|---|---|---|---|
  | telemóvel 390 | 240px | 273px | 235px | 38px | 96px |
  | tablet | 300px | 342px | 294px | 48px | 128px |
  | `lg` 1024 | 389px | 443px | 381px | 62px | 128px |
  | ≥1632 | 620px | 706px | 607px | 99px | 128px |

  O que fica abaixo da junta cabe sempre no espaçamento da secção "A casa" —
  nunca toca em texto.

  **Em `lg` a largura é `38vw` com tecto em 620px, e não um valor fixo.** O
  620 foi escolhido a olhar para um ecrã de 1764px, onde o contentor está no
  máximo de 1400 e sobram 568px à direita do texto do Hero. Num portátil de
  1024 o contentor encolhe para 960 e um esqueleto de 620 punha-se em cima
  do wordmark. Em `vw` acompanha o contentor e só chega aos 620 a partir dos
  1632px, que é onde há espaço para ele.

  A conta que o garante: a figura visível começa a 15% da largura do
  elemento (o recorte tem margem transparente), por isso a sua aresta
  esquerda fica em `direita_do_contentor − 0,85 × largura`. Isso tem de
  ficar à direita do texto do Hero, que é `max-w-3xl` mas na prática mede o
  wordmark, ~536px.

  **Em telemóvel é `62vw` e não 240px fixos** pela mesma família de razões:
  num iPhone SE (375×667) um valor fixo não caberia.
*/

/*
  Fracção da altura onde a régua da secção lhe passa. A 86% a arca fica
  pousada em cima da linha e só os pés e a perna de pau balançam por baixo.

  Medido NESTA fotografia. Trocar o ficheiro implica reconfirmar o número —
  o recorte anterior tinha outro enquadramento e usava 63%.
*/
const ASSENTO = "86%";

export function Esqueleto({ className }: { className?: string }) {
  const foto = photos.esqueletoRecorte;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute w-[62vw] max-w-[240px] sm:w-[300px] sm:max-w-none lg:w-[38vw] lg:max-w-[620px] ${className ?? ""}`}
      style={{ transform: `translateY(-${ASSENTO})` }}
    >
      <Reveal>
        <Image
          src={foto.src}
          alt=""
          width={foto.width}
          height={foto.height}
          /* Tem de acompanhar as três larguras do contentor, senão o
             telemóvel descarrega a versão de ecrã grande para uma caixa de
             240px. */
          sizes="(min-width: 1632px) 620px, (min-width: 1024px) 38vw, (min-width: 640px) 300px, 62vw"
          className="h-auto w-full"
          /*
            A sombra vai no filtro e não em `box-shadow`: o `box-shadow`
            desenha o rectângulo da caixa, e um rectângulo à volta de um
            recorte mata precisamente a leitura de recorte. O `drop-shadow`
            segue o alfa da imagem.
          */
          style={{ filter: "drop-shadow(0 14px 22px rgb(0 0 0 / 0.55))" }}
        />
      </Reveal>
    </div>
  );
}
