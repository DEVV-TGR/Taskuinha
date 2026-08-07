"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  Três camadas de onda, cada uma o dobro da largura do contentor, a
  deslizar em loop via translateX. Velocidades e amplitudes decrescem juntas
  — a onda mais rápida (40s) é também a mais alta; a mais lenta (88s), a
  mais rasa. Usado no Hero e no Footer.
*/

// As três cores precisam de contraste sobre fundos escuros diferentes (a
// foto do Hero com scrim, o --breu-fundo liso do Footer) — nunca um tom tão
// próximo do fundo que a onda desapareça nele.
const camadas = [
  { duracao: 40, amplitude: 18, cor: "var(--turquesa-luz)", opacidade: 0.3 },
  { duracao: 62, amplitude: 11, cor: "var(--turquesa)", opacidade: 0.4 },
  { duracao: 88, amplitude: 6, cor: "var(--breu-raso)", opacidade: 0.8 },
] as const;

function ondaPath(amplitude: number) {
  // Uma onda larga e suave, repetida duas vezes lado a lado (viewBox 0-400,
  // metade visível de cada vez) para o loop de translateX -50% fechar sem costura.
  const meio = 50 - amplitude / 2;
  return `M0,${50 + amplitude / 2} Q100,${meio} 200,${50 + amplitude / 2} T400,${50 + amplitude / 2} V100 H0 Z`;
}

export function Mar({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {camadas.map((c) => (
        <motion.div
          key={c.duracao}
          className="absolute inset-x-0 bottom-0 h-full w-[200%]"
          animate={animar ? { x: ["0%", "-50%"] } : { x: "0%" }}
          transition={
            animar
              ? { duration: c.duracao, repeat: Infinity, ease: "linear" }
              : undefined
          }
        >
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-full w-full">
            <path d={ondaPath(c.amplitude)} fill={c.cor} opacity={c.opacidade} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
