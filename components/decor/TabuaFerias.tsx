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
  com folga para as pontas lascadas — daí os 12% de lado e os 35% de cima. Vai
  dentro do pendente, para balançar com a madeira.

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
          <div className="absolute inset-x-[12%] top-[35%] bottom-[6%] flex flex-col items-center justify-center text-center">
            <p className="display letra-na-madeira text-[7.6cqw] leading-[1.05] text-balance text-osso">
              {texto.titulo}
            </p>
            <p
              className="letra-na-madeira mt-[3.5cqw] text-[5.4cqw] leading-snug text-balance text-osso"
              style={{ fontFamily: "var(--font-maquina)" }}
            >
              {texto.datas}
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
