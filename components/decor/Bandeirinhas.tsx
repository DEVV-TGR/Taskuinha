"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  As bandeiras reais da casa, pela ordem em que estão penduradas sobre o
  balcão (lidas em balcao-bandeirinhas.jpg). Emoji de bandeira em vez de SVG
  próprio — são reconhecíveis, pesam quase nada, e não exigem trinta
  ficheiros novos para dez países.

  Não é `fixed`: assume um ancestral posicionado (normalmente o `Tralha`,
  ou a própria secção do `Hero`).
*/

const bandeiras = [
  { emoji: "🇧🇷", pais: "Brasil" },
  { emoji: "🇪🇸", pais: "Espanha" },
  { emoji: "🇩🇪", pais: "Alemanha" },
  { emoji: "🇬🇭", pais: "Gana" },
  { emoji: "🇦🇷", pais: "Argentina" },
  { emoji: "🇨🇷", pais: "Costa Rica" },
  { emoji: "🇨🇲", pais: "Camarões" },
  { emoji: "🇨🇱", pais: "Chile" },
  { emoji: "🇦🇺", pais: "Austrália" },
  { emoji: "🇰🇷", pais: "Coreia do Sul" },
] as const;

export function Bandeirinhas({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const animar = !reduce && visivel;

  return (
    <div
      aria-hidden="true"
      data-tralha=""
      className={`pointer-events-none absolute inset-x-0 top-0 ${className ?? ""}`}
    >
      {/* O cordel de onde pendem. */}
      <svg
        className="absolute inset-x-0 top-3 h-2 w-full opacity-40"
        preserveAspectRatio="none"
        viewBox="0 0 100 4"
      >
        <path d="M0,1 Q50,4 100,1" stroke="var(--osso-fraco)" strokeWidth="0.4" fill="none" />
      </svg>

      <div className="flex justify-around px-4 pt-4">
        {bandeiras.map((b, i) => (
          <motion.span
            key={b.pais}
            className="pendurado inline-block text-xl sm:text-2xl"
            title={b.pais}
            animate={animar ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
            transition={
              animar
                ? {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }
                : undefined
            }
          >
            {b.emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
