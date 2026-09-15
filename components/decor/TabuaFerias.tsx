"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Dicionario } from "@/lib/dicionario";
import { useFeriasAindaAvisam } from "@/lib/ferias";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  A tábua das férias, pendurada do lado direito do Hero — só em ecrãs de
  1024px para cima, que é onde há lado direito. No telemóvel o mesmo aviso
  é a `BarraFerias`.

  ## A imagem

  `tabua-ferias.webp` é a tábua que o Gonçalo encontrou, com o xadrez que
  vinha pintado no ficheiro tirado pelo `scripts/recortar-tabua-ferias.py`.
  757×699. As ripas ocupam, do ficheiro:

  | | de | a |
  |---|---|---|
  | x | 7% | 90% |
  | y | 29% | 98% |

  O texto vive dentro disso com folga para as pontas lascadas — daí os 12%
  de lado e os 35% de cima.

  ## Porque é que as letras estão em `cqw`

  A tábua muda de largura com o ecrã — até 380px, e mais estreita quando é
  preciso para não tocar no nome nem no esqueleto (a conta está na
  `.tabua-ferias` do `globals.css`). Em `rem` o texto ficava do mesmo tamanho
  e saía da madeira na tábua mais estreita; em `cqw` cresce e encolhe com
  ela. As datas estão a 5,4cqw e não menos para ainda se lerem nas estreitas.

  ## Não é `aria-hidden`

  Ao contrário do resto da pasta `decor/`, isto é informação: a casa está
  fechada. O texto é texto de verdade, e os leitores de ecrã lêem-no.
*/
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
      {/*
        Balanço lento a partir do topo (`.pendurado`). O `data-pendurado` é o
        que o `globals.css` e o `<noscript>` do layout usam para a pôr direita
        e parada com movimento reduzido ou sem JavaScript.
      */}
      <motion.div
        data-pendurado
        className="pendurado relative"
        animate={animar ? { rotate: [-0.9, 0.9, -0.9] } : { rotate: 0 }}
        transition={
          animar
            ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <Image
          src="/images/tabua-ferias.webp"
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
    </aside>
  );
}
