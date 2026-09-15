"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Dicionario } from "@/lib/dicionario";
import { useFeriasAindaAvisam } from "@/lib/ferias";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  A tábua das férias, colada à aresta direita do Hero — só em ecrãs de 1024px
  para cima. No telemóvel o mesmo aviso é a `BarraFerias`. Onde fica, e o que
  faz ao esqueleto, está na `.tabua-ferias` do `globals.css`.

  ## Duas camadas, para só a tábua balançar

  Colada à aresta, a barra de ferro lê-se como aparafusada à parede — a ponta
  direita da imagem é uma chapa de fixação. Se a imagem inteira balançasse, a
  barra rodava com ela e descolava-se da aresta. Por isso vem em duas camadas
  do mesmo tamanho (757×699), que se sobrepõem ao píxel:

  - `tabua-ferias-barra.webp` — a barra, a bola, a chapa e os aros. **Parada**,
    e desenhada por cima;
  - `tabua-ferias-pendente.webp` — os elos e a tábua, com o texto. **Balança**
    à volta do centro da barra.

  As duas saem do `scripts/recortar-tabua-ferias.py`, que também explica onde
  é o corte e porque é que as camadas se sobrepõem nas colunas das correntes.

  ## O texto

  As ripas ocupam, do ficheiro, x 7–90% e y 29–98%. O texto vive dentro disso
  com folga para as pontas lascadas — daí os 11% de lado e os 33% de cima. Vai
  dentro do pendente, para balançar com a madeira.

  **As datas são o que mais importa, e o Gonçalo quere-as bem visíveis.**
  Estavam a 5,4cqw (~22px a 1440) e confundiam-se com o veio. Chegaram a ir
  para a Rye do título, quase do tamanho dele, e ele preferiu-as na letra de
  máquina de escrever, só um pouco maiores do que estavam: 6,2cqw (~25px).
  Uma linha cada — o dicionário parte-as em `desde` e `ate` para a quebra
  nunca cair a meio.

  O 6,2cqw cabe nas quatro línguas com margem: a linha mais comprida é a
  espanhola, "del 19 de septiembre", com 10,5em nesta letra — 65cqw, numa
  caixa de 78cqw. **Se as datas mudarem, remedir**: o `whitespace-nowrap`
  impede uma linha comprida de partir, e ela sairia da madeira.

  **E há um véu escuro por trás do texto.** A letra clara sobre esta madeira
  dava 3,4:1 de contraste, e ~2:1 nos veios claros. O véu é um gradiente que
  se desvanece antes das arestas das ripas — não pode passar delas, senão
  escurecia a fotografia do Hero à volta da tábua.

  As letras estão em `cqw` e não em `rem`: a tábua muda de largura com o ecrã
  (`min(28vw, 440px)`), e o texto tem de crescer e encolher com ela.

  ## Não é `aria-hidden`

  Ao contrário do resto da pasta `decor/`, isto é informação: a casa está
  fechada. O texto é texto de verdade, e os leitores de ecrã lêem-no.
*/

/*
  O pivô do balanço: o centro da barra, y = 35 em 699. Medido no ficheiro —
  ver o `PIVO` do script. Se o recorte mudar, muda aqui também.
*/
const PIVO = "50% 5.007%";

/*
  O véu por trás do texto. `closest-side` faz a elipse tocar nas arestas da
  caixa, e o último passo é transparente — nada escurece fora dela. A 0,6 no
  meio a letra clara passa dos 4,5:1 até sobre os veios mais claros.
*/
const VEU =
  "radial-gradient(closest-side, rgb(8 11 13 / 0.62) 0%, rgb(8 11 13 / 0.55) 55%, rgb(8 11 13 / 0.3) 80%, rgb(8 11 13 / 0) 100%)";

export function TabuaFerias({
  texto,
  className,
}: {
  texto: Dicionario["ferias"];
  className?: string;
}) {
  const avisa = useFeriasAindaAvisam();
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  if (!avisa) return null;

  return (
    <aside
      aria-label={texto.titulo}
      className={`[container-type:inline-size] ${className ?? ""}`}
    >
      <div className="relative">
        {/*
          O pendente. O `data-pendurado` é o que o `globals.css` e o
          `<noscript>` do layout usam para o pôr direito e parado com
          movimento reduzido ou sem JavaScript.
        */}
        <motion.div
          data-pendurado
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: PIVO }}
          animate={animar ? { rotate: [-0.9, 0.9, -0.9] } : { rotate: 0 }}
          transition={
            animar
              ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <Image
            src="/images/tabua-ferias-pendente.webp"
            alt=""
            width={757}
            height={699}
            sizes="(min-width: 1024px) 440px, 1px"
            className="h-auto w-full"
          />
          {/*
            O véu: mais escuro no meio, a zero nas arestas desta caixa, que
            fica dentro das ripas (x 9–88%, y 31–96%).
          */}
          <div
            aria-hidden
            className="absolute top-[31%] right-[12%] bottom-[4%] left-[9%]"
            style={{ backgroundImage: VEU }}
          />
          <div className="absolute inset-x-[11%] top-[33%] bottom-[6%] flex flex-col items-center justify-center text-center">
            <p className="display letra-na-madeira text-[7.6cqw] leading-[1.05] text-balance text-osso">
              {texto.titulo}
            </p>
            <p
              data-datas
              className="letra-na-madeira mt-[3.5cqw] text-[6.2cqw] leading-snug whitespace-nowrap text-osso"
              style={{ fontFamily: "var(--font-maquina)" }}
            >
              <span className="block">{texto.desde}</span>
              <span className="block">{texto.ate}</span>
            </p>
          </div>
        </motion.div>

        {/*
          A barra, parada e por cima: é ela que desenha a metade de baixo dos
          aros por cima do começo das correntes, e é isso que esconde a emenda
          entre as duas camadas. Está no fluxo para dar a altura à caixa.
        */}
        <Image
          src="/images/tabua-ferias-barra.webp"
          alt=""
          width={757}
          height={699}
          sizes="(min-width: 1024px) 440px, 1px"
          className="pointer-events-none relative h-auto w-full"
        />
      </div>
    </aside>
  );
}
