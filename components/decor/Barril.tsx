"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";
import { BARRIS } from "@/lib/movimento";

type Props = {
  /** A letra que este barril mostra — P·I·R·A·T·A na fachada. */
  letra: string;
  /** Posição na fila, só para variar a semente da textura. */
  indice: number;
  className?: string;
};

/*
  Barril de madeira pendurado por corda. Pêndulo amortecido: quanto mais
  perto o rato passa na horizontal, mais balança. A leitura da posição do
  rato usa um listener em `window`, nunca uma hit area — nunca rouba cliques
  (regra 2 do §7).
*/
export function Barril({ letra, indice, className }: Props) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const ref = useRef<HTMLDivElement>(null);
  const [angulo, setAngulo] = useState(BARRIS.repouso);

  useEffect(() => {
    if (reduce || !visivel) return;

    let bruto = 0;
    let raf = 0;

    function aoMoverRato(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const distancia = Math.abs(e.clientX - centroX);
      // Perto (< 80px): oscilação máxima. Longe (> 480px): quase parado.
      const intensidade = Math.max(0, 1 - distancia / 480);
      bruto = BARRIS.repouso + intensidade * BARRIS.extra;
    }

    function tique() {
      setAngulo((actual) => actual + (bruto - actual) * 0.05);
      raf = requestAnimationFrame(tique);
    }

    window.addEventListener("mousemove", aoMoverRato);
    raf = requestAnimationFrame(tique);
    return () => {
      window.removeEventListener("mousemove", aoMoverRato);
      cancelAnimationFrame(raf);
    };
  }, [reduce, visivel]);

  const lado = indice % 2 === 0 ? 1 : -1;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-pendurado=""
      className={`pendurado ${className ?? ""}`}
    >
      <motion.div
        className="pendurado"
        animate={reduce ? { rotate: 0 } : { rotate: angulo * lado }}
        transition={{ type: "spring", ...BARRIS.mola }}
      >
        {/* Corda */}
        <svg viewBox="0 0 4 16" className="mx-auto h-4 w-1" preserveAspectRatio="none">
          <line x1="2" y1="0" x2="2" y2="16" stroke="var(--osso-fraco)" strokeWidth="1" />
        </svg>

        {/* Corpo do barril */}
        <svg viewBox="0 0 60 80" className="h-16 w-12 sm:h-20 sm:w-16">
          <defs>
            <clipPath id={`barril-corpo-${indice}`}>
              <path d="M8,10 Q0,40 8,70 Q30,80 52,70 Q60,40 52,10 Q30,0 8,10 Z" />
            </clipPath>
          </defs>
          <path
            d="M8,10 Q0,40 8,70 Q30,80 52,70 Q60,40 52,10 Q30,0 8,10 Z"
            fill="var(--madeira)"
            stroke="var(--madeira-borda)"
            strokeWidth="1.5"
          />
          <g clipPath={`url(#barril-corpo-${indice})`}>
            {/* Veio: umas ripas verticais simples, desenhadas directamente —
                à escala de um ícone de 60px não vale a pena um recurso externo. */}
            {[16, 28, 44].map((x) => (
              <line
                key={x}
                x1={x}
                y1="0"
                x2={x + (indice % 2 === 0 ? 3 : -3)}
                y2="80"
                stroke="var(--madeira-luz)"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            {/* Arcos de metal */}
            {[16, 40, 64].map((y) => (
              <rect key={y} x="0" y={y} width="60" height="4" fill="var(--madeira-borda)" opacity="0.8" />
            ))}
          </g>
          <text
            x="30"
            y="46"
            textAnchor="middle"
            fontSize="26"
            fill="var(--lanterna)"
            style={{ fontFamily: "var(--font-tabuleta)" }}
          >
            {letra}
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
