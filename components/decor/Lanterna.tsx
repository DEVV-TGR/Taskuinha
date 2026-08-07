"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  Luz de lanterna: gradiente radial âmbar em `mix-blend-mode: screen`, com
  flicker de chama — passos de tempo irregulares, porque um flicker uniforme
  lê-se como pulsação de LED, não como chama ao vento.
*/
export function Lanterna({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className ?? ""}`}
    >
      <motion.div
        className="h-32 w-32 sm:h-48 sm:w-48"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--lanterna) 0%, rgb(242 163 60 / 0.35) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
        animate={animar ? { opacity: [1, 0.88, 0.97, 0.82, 1, 0.91, 0.98, 1] } : { opacity: 0.95 }}
        transition={
          animar
            ? {
                duration: 3.4,
                times: [0, 0.12, 0.28, 0.4, 0.55, 0.7, 0.86, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
      />
    </div>
  );
}
