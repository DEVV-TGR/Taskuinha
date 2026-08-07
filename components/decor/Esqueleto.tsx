"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  O mascote: o esqueleto pirata sentado à porta. Ciclo de 9s — cerca de 3s
  de movimento (o braço sobe a garrafa à boca e desce) e os restantes 6s
  parado. É gráfico, não a fotografia: a fotografia (esqueleto.jpg) não dá
  para articular um braço.
*/
export function Esqueleto({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 140"
      className={className}
    >
      {/* Arca onde está sentado */}
      <rect x="20" y="110" width="60" height="24" rx="2" fill="var(--madeira)" stroke="var(--madeira-borda)" />

      {/* Pernas */}
      <path d="M40,110 L34,138 M60,110 L66,138" stroke="var(--osso)" strokeWidth="5" strokeLinecap="round" />

      {/* Tronco com casaco esfarrapado */}
      <path
        d="M32,60 Q30,95 38,112 L62,112 Q70,95 68,60 Z"
        fill="var(--breu-fundo)"
        stroke="var(--madeira-borda)"
        strokeWidth="1"
      />
      {/* Costelas à mostra */}
      {[68, 76, 84, 92].map((y) => (
        <line key={y} x1="42" y1={y} x2="58" y2={y} stroke="var(--osso)" strokeWidth="2" opacity="0.8" />
      ))}

      {/* Braço parado (esquerdo) */}
      <line x1="32" y1="65" x2="20" y2="95" stroke="var(--osso)" strokeWidth="5" strokeLinecap="round" />

      {/* Braço da garrafa (direito), articulado a partir do ombro */}
      <motion.g
        style={{ transformOrigin: "68px 65px" }}
        animate={
          animar
            ? { rotate: [0, 0, -95, -95, 0, 0] }
            : { rotate: 0 }
        }
        transition={
          animar
            ? {
                duration: 9,
                times: [0, 0.66, 0.8, 0.87, 1, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <line x1="68" y1="65" x2="82" y2="90" stroke="var(--osso)" strokeWidth="5" strokeLinecap="round" />
        {/* Garrafa na mão */}
        <rect x="77" y="82" width="8" height="16" rx="2" fill="var(--sangue)" />
      </motion.g>

      {/* Cabeça: caveira com lenço */}
      <circle cx="50" cy="40" r="16" fill="var(--osso)" />
      <path d="M34,34 Q50,18 66,34 L66,30 Q50,14 34,30 Z" fill="var(--sangue)" />
      <circle cx="44" cy="40" r="3.5" fill="var(--breu)" />
      <circle cx="56" cy="40" r="3.5" fill="var(--breu)" />
      <path d="M46,50 L50,54 L54,50" fill="none" stroke="var(--breu)" strokeWidth="1.5" />
    </svg>
  );
}
