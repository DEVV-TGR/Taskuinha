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
  | telemóvel 390 | 360px | 410px | 372px | 38px | 96px |
  | tablet | 300px | 342px | 294px | 48px | 128px |
  | `lg` 1024 | 389px | 443px | 381px | 62px | 128px |
  | ≥1632 | 620px | 706px | 607px | 99px | 128px |

  O que fica abaixo da junta cabe sempre no espaçamento da secção "A casa" —
  nunca toca em texto.

  **O telemóvel está a 1,5× do que esteve**, por pedido do Gonçalo: era
  `62vw`/240px e passou a `93vw`/360px, os dois números multiplicados pelo
  mesmo factor para a régua não mudar de forma. É por isso que a linha do
  telemóvel é agora maior do que a do tablet — não é engano.

  Os 137px que o esqueleto ganhou em altura vão **todos para cima**, para o
  vazio do Hero: no telemóvel a coluna "Abaixo" fica presa nos 38px que ele
  tinha antes de crescer. Ver a nota do ancoramento, mais abaixo.

  Que cabe, na horizontal: com o `right-5` do sítio onde está montado, a caixa
  vai de x=10 a x=370 num ecrã de 390. Num iPhone SE (375) os `93vw` dão 349px
  e sobram 6px. Não abre scroll lateral em nenhum dos dois.

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

  **Em telemóvel é `93vw` e não 360px fixos** pela mesma família de razões:
  num iPhone SE (375×667) um valor fixo não caberia.
*/

/*
  Onde é que a régua da secção lhe passa. Há duas maneiras de ancorar isto, e
  a diferença entre elas só se vê quando o tamanho muda.

  ## `sm` e acima: 86% da altura acima da linha

  A arca fica pousada em cima da linha e só os pés e a perna de pau balançam
  por baixo. Medido NESTA fotografia — trocar o ficheiro implica reconfirmar o
  número, que o recorte anterior tinha outro enquadramento e usava 63%.

  ## Telemóvel: 38px de perna abaixo da linha, e ponto

  Ancorar por percentagem tem uma consequência que passou despercebida quando
  o esqueleto foi a 1,5× no telemóvel: **ele cresceu para os dois lados**.
  Subiu 118px para dentro do Hero, como se queria, mas desceu também 19px para
  dentro da secção "A casa", empurrando as pernas para cima das correntes da
  tabuleta. O Gonçalo apanhou-o e disse o que queria: a base quieta, e o
  crescimento todo para cima, a ocupar o vazio do Hero.

  É isso que o `calc(-100% + 38px)` faz. Não é uma fracção da altura: é a
  aresta de baixo do recorte a ficar sempre 38px abaixo da linha, cresça o
  esqueleto o que crescer. Os 38px são os que ele tinha antes de ser ampliado,
  e são o "um pouco das pernas" que ele quer à vista.

  A trave e a tabuleta **não se mexem**: a divisória continua onde estava, que
  foi o outro lado do pedido dele.

  Ambos os valores vão em classes e não no `style`: um `style` inline ganha a
  qualquer classe, e o `sm:` nunca chegaria a aplicar-se.

  ## O tecto de altura, e o browser do Facebook

  `max-w-[min(360px,calc(45vh+33px))]`, e não os 360px sozinhos.

  O defeito aparecia ao abrir o site pelo browser embutido do Facebook, no
  Android: o esqueleto subia para cima do texto e dos botões. Ele não cresceu
  — o Hero é que encolheu por baixo dele, e a razão é que os dois se medem em
  eixos diferentes. O esqueleto tem a largura em `vw` e a altura vem do rácio
  da fotografia; o Hero tem a altura em `vh`. Enquanto a proporção do ecrã é a
  de sempre, a conta bate certo. Quando a área visível fica baixa — barra do
  Facebook em cima, barra do sistema em baixo, nenhuma delas recolhe — a parte
  do esqueleto que fica dentro do Hero passa de ~50% para ~62% dele.

  A conta do tecto: para a parte de cima caber em metade do Hero é preciso
  `largura × 1,139 − 38 ≤ 0,5 × H`, e daí sai `largura ≤ 45vh + 33px`.

  Num telemóvel normal em Chrome (390×844, ~750px visíveis) isso dá 370px, o
  `min()` escolhe os 360px de sempre e **não muda nada**. A 600px de altura dá
  303px, o esqueleto encolhe e volta aos ~51%. Só morde onde é preciso.

  O `sm:max-w-none` logo a seguir já lá estava, por isso isto fica preso ao
  telemóvel e não toca em tablet nem em `lg`.
*/

export function Esqueleto({ className }: { className?: string }) {
  const foto = photos.esqueletoRecorte;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute translate-y-[calc(-100%_+_38px)] w-[93vw] max-w-[min(360px,calc(45vh+33px))] sm:w-[300px] sm:max-w-none sm:translate-y-[-86%] lg:w-[38vw] lg:max-w-[620px] ${className ?? ""}`}
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
          sizes="(min-width: 1632px) 620px, (min-width: 1024px) 38vw, (min-width: 640px) 300px, 93vw"
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
