"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";
import { MarcaCaveira } from "./Caveira";

/*
  O símbolo da casa: caveira de chapéu de bicorne, sabres cruzados por
  baixo. Ondula como pano ao vento — skewY + scaleX num ciclo de 4s, presa
  ao mastro pela esquerda.
*/
export function BandeiraNegra({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  return (
    <div aria-hidden="true" className={`inline-block ${className ?? ""}`}>
      {/* Mastro */}
      <div className="inline-block h-full w-1 bg-[var(--madeira-borda)] align-top" />
      <motion.svg
        viewBox="0 0 100 70"
        className="inline-block h-24 w-32 sm:h-32 sm:w-44"
        style={{ transformOrigin: "0% 50%" }}
        animate={animar ? { skewY: [0, 2.5, 0, -2, 0], scaleX: [1, 0.98, 1, 0.99, 1] } : undefined}
        transition={
          animar
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <rect x="0" y="0" width="100" height="70" fill="var(--breu-fundo)" />

        {/* Sabres cruzados */}
        <line x1="15" y1="55" x2="85" y2="20" stroke="var(--osso)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="15" y1="20" x2="85" y2="55" stroke="var(--osso)" strokeWidth="2.5" strokeLinecap="round" />

        {/*
          Caveira, chapéu e ossos vêm todos de `Caveira.tsx` — este ficheiro
          tinha a sua própria cópia, e as três cópias que havia no projecto
          já não eram exactamente o mesmo símbolo. As órbitas são buracos, e
          por isso deixam ver o pano preto por trás.
        */}
        <g fill="var(--osso)" color="var(--osso)">
          <MarcaCaveira ossos />
        </g>
      </motion.svg>
    </div>
  );
}
