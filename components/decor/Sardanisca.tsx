"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

type Borda = "cima" | "baixo" | "esquerda" | "direita";

type Props = {
  borda: Borda;
  /** Atraso antes do primeiro ciclo, para desfasar várias sardaniscas. */
  atraso?: number;
  className?: string;
};

const RAIO_FUGA = 120;
const FAIXA_PX = 48;

/*
  Lagartixa de borracha, restrita a uma faixa de 48px junto a uma borda do
  ecrã — nunca sobre texto. Ciclo: corre 1–3s → pára 2–5s com a cabeça a
  virar → foge se o rato chegar a menos de 120px, detectado por um listener
  em `window` (regra 2 do §7: nunca uma hit area, nunca rouba um clique).
*/
export function Sardanisca({ borda, atraso = 0, className }: Props) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const ref = useRef<HTMLDivElement>(null);
  // Posição inicial determinística (nunca Math.random() durante a
  // renderização — o HTML do servidor tem de bater certo com o do cliente).
  // A variação a sério só começa depois de montar, dentro do useEffect.
  const [posicao, setPosicao] = useState(12 + (atraso * 17) % 30);
  const [aCorrer, setACorrer] = useState(false);
  const [viradaNegativa, setViradaNegativa] = useState(false);
  const [duracaoCorrida, setDuracaoCorrida] = useState(2);
  const temporizadores = useRef<number[]>([]);
  const posicaoRef = useRef(posicao);

  useEffect(() => {
    posicaoRef.current = posicao;
  }, [posicao]);

  const eixo = borda === "cima" || borda === "baixo" ? "x" : "y";

  useEffect(() => {
    if (reduce || !visivel) return;

    function agendar(atrasoMs: number, fn: () => void) {
      const id = window.setTimeout(fn, atrasoMs);
      temporizadores.current.push(id);
    }

    function ciclo() {
      // Pausa: 2–5s parada.
      setACorrer(false);
      agendar(2000 + Math.random() * 3000, () => {
        // Corrida: 1–3s a deslocar para uma posição nova ao longo da borda.
        const alvo = Math.min(92, Math.max(4, posicaoRef.current + (Math.random() * 40 - 20)));
        setViradaNegativa(alvo < posicaoRef.current);
        setDuracaoCorrida(1 + Math.random() * 2);
        setACorrer(true);
        setPosicao(alvo);
        agendar(1000 + Math.random() * 2000, ciclo);
      });
    }

    ciclo();
    return () => {
      temporizadores.current.forEach(clearTimeout);
      temporizadores.current = [];
    };
  }, [reduce, visivel]);

  // Foge se o rato entrar no raio.
  useEffect(() => {
    if (reduce || !visivel) return;

    function aoMoverRato(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distancia = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (distancia >= RAIO_FUGA) return;

      const aFugirParaMenos = eixo === "x" ? e.clientX > cx : e.clientY > cy;
      const alvo = aFugirParaMenos
        ? Math.max(4, posicaoRef.current - 25)
        : Math.min(92, posicaoRef.current + 25);
      setViradaNegativa(alvo < posicaoRef.current);
      setDuracaoCorrida(0.3);
      setACorrer(true);
      setPosicao(alvo);
    }

    window.addEventListener("mousemove", aoMoverRato);
    return () => window.removeEventListener("mousemove", aoMoverRato);
  }, [reduce, visivel, eixo]);

  if (reduce) return null;

  const posicaoEstilo =
    eixo === "x"
      ? { left: `${posicao}%`, [borda === "cima" ? "top" : "bottom"]: 0 }
      : { top: `${posicao}%`, [borda === "esquerda" ? "left" : "right"]: 0 };

  const tamanhoFaixa =
    eixo === "x" ? { height: FAIXA_PX } : { width: FAIXA_PX };

  return (
    <div
      ref={ref}
      data-tralha-movel=""
      aria-hidden="true"
      className={`pointer-events-none absolute ${eixo === "x" ? "inset-x-0" : "inset-y-0"} ${className ?? ""}`}
      style={tamanhoFaixa}
    >
      <motion.div
        className="absolute h-6 w-10"
        style={{
          ...posicaoEstilo,
          translateX: eixo === "x" ? "-50%" : 0,
          translateY: eixo === "y" ? "-50%" : 0,
        }}
        animate={
          eixo === "x"
            ? { left: `${posicao}%`, scaleX: viradaNegativa ? -1 : 1, rotate: !aCorrer ? [-6, 6, -6] : 0 }
            : { top: `${posicao}%`, scaleX: viradaNegativa ? -1 : 1, rotate: !aCorrer ? [-6, 6, -6] : 0 }
        }
        transition={{
          left: { duration: aCorrer ? duracaoCorrida : 0.3, ease: "easeInOut", delay: atraso },
          top: { duration: aCorrer ? duracaoCorrida : 0.3, ease: "easeInOut", delay: atraso },
          rotate: !aCorrer
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 },
        }}
      >
        <svg viewBox="0 0 40 24" className="h-full w-full">
          {/* Pernas: duas dianteiras, duas traseiras, com micro-animação de corrida */}
          {aCorrer ? (
            <g>
              <line x1="12" y1="16" x2="6" y2="22" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="16" y1="16" x2="14" y2="23" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="24" y1="16" x2="22" y2="23" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="28" y1="16" x2="34" y2="22" stroke="var(--turquesa)" strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              <line x1="12" y1="16" x2="8" y2="20" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="16" y1="16" x2="16" y2="21" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="24" y1="16" x2="20" y2="21" stroke="var(--turquesa)" strokeWidth="1.5" />
              <line x1="28" y1="16" x2="32" y2="20" stroke="var(--turquesa)" strokeWidth="1.5" />
            </g>
          )}
          {/* Corpo e cauda */}
          <path d="M4,14 Q0,12 -2,10" stroke="var(--turquesa)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="18" cy="13" rx="14" ry="4.5" fill="var(--turquesa)" />
          {/* Cabeça */}
          <circle cx="33" cy="12" r="4.5" fill="var(--turquesa)" />
          <circle cx="35" cy="11" r="0.9" fill="var(--breu)" />
        </svg>
      </motion.div>
    </div>
  );
}
