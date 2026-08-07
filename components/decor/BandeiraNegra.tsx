"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  O símbolo da casa: caveira de chapéu de bicorne, sabres cruzados por
  baixo, uma caveira pequena na aba. Ondula como pano ao vento — skewY +
  scaleX num ciclo de 4s, presa ao mastro pela esquerda.
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

        {/* Chapéu de bicorne */}
        <path
          d="M25,28 Q50,8 75,28 Q60,20 50,24 Q40,20 25,28 Z"
          fill="var(--osso)"
        />

        {/* Caveira */}
        <circle cx="50" cy="34" r="13" fill="var(--osso)" />
        <path d="M39,40 Q50,52 61,40 L58,44 Q50,48 42,44 Z" fill="var(--osso)" />
        <circle cx="45" cy="34" r="3" fill="var(--breu-fundo)" />
        <circle cx="55" cy="34" r="3" fill="var(--breu-fundo)" />
        <path d="M47,41 L50,44 L53,41" fill="none" stroke="var(--breu-fundo)" strokeWidth="1.2" />

        {/* Ossos cruzados por baixo */}
        <line x1="35" y1="58" x2="65" y2="66" stroke="var(--osso)" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="66" x2="65" y2="58" stroke="var(--osso)" strokeWidth="3" strokeLinecap="round" />

        {/* Caveira pequena na aba do chapéu */}
        <circle cx="70" cy="24" r="3.5" fill="var(--osso)" />
      </motion.svg>
    </div>
  );
}
