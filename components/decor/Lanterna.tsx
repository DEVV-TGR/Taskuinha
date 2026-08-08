"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";
import { LANTERNA } from "@/lib/movimento";

/*
  Luz de lanterna: gradiente radial âmbar em `mix-blend-mode: screen`, com
  flicker de chama — passos de tempo irregulares, porque um flicker uniforme
  lê-se como pulsação de LED, não como chama ao vento.

  O flicker está guardado como o FEITIO da cava (fracções do ponto mais
  baixo), não como opacidades absolutas. Assim a profundidade escala com a
  intensidade em `lib/movimento.ts` e o desenho da chama fica igual — se
  fossem opacidades fixas, baixar a intensidade obrigava a reescrever os
  oito valores à mão e a perder a irregularidade pelo caminho.
*/
const FEITIO_DA_CHAMA = [0, 0.667, 0.167, 1, 0, 0.5, 0.111, 0];
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
        animate={
          animar
            ? { opacity: FEITIO_DA_CHAMA.map((f) => 1 - f * LANTERNA.cava) }
            : { opacity: 0.95 }
        }
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
