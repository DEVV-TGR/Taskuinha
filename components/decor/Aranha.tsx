"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

const MAX_APARICOES = 3;
const RAIO_FUGA = 140;

type Estado = "escondida" | "descendo" | "pousada" | "subindo";

/*
  A aranha peluda do tecto (referência real: tecto-nau-aranha.jpg). Desce ao
  entrar em #a-casa, depois reaparece em intervalos aleatórios de 45–120s,
  no máximo 3 vezes por sessão. Foge se o rato chegar perto — detectado por
  um listener em `window`, nunca por uma hit area (regra 2 do §7): a aranha
  nunca rouba um clique.

  Com movimento reduzido, desaparece por completo — não fica pendurada a
  meio do ecrã sem se mexer.
*/
export function Aranha({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const ref = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("escondida");
  const aparicoes = useRef(0);
  const temporizadores = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;

    function agendar(atraso: number, fn: () => void) {
      const id = window.setTimeout(fn, atraso);
      temporizadores.current.push(id);
      return id;
    }

    function agendarProxima() {
      if (aparicoes.current >= MAX_APARICOES) return;
      agendar(45000 + Math.random() * 75000, descer);
    }

    function descer() {
      if (aparicoes.current >= MAX_APARICOES) return;
      aparicoes.current += 1;
      setEstado("descendo");
      agendar(1200, () => setEstado("pousada"));
      const tempoPousada = 5000 + Math.random() * 3000;
      agendar(1200 + tempoPousada, () =>
        setEstado((actual) => (actual === "pousada" ? "subindo" : actual)),
      );
      agendar(1200 + tempoPousada + 500, () => {
        setEstado("escondida");
        agendarProxima();
      });
    }

    const alvo = document.getElementById("a-casa");
    let observer: IntersectionObserver | undefined;
    if (alvo) {
      observer = new IntersectionObserver(
        (entradas) => {
          if (entradas[0]?.isIntersecting && aparicoes.current === 0) {
            descer();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(alvo);
    }

    return () => {
      observer?.disconnect();
      temporizadores.current.forEach(clearTimeout);
      temporizadores.current = [];
    };
  }, [reduce]);

  // Foge se o rato entrar no raio, só enquanto está pousada.
  useEffect(() => {
    if (reduce || !visivel || estado !== "pousada") return;

    function aoMoverRato(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distancia = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (distancia < RAIO_FUGA) {
        setEstado("subindo");
        window.setTimeout(() => setEstado("escondida"), 500);
      }
    }

    window.addEventListener("mousemove", aoMoverRato);
    return () => window.removeEventListener("mousemove", aoMoverRato);
  }, [estado, reduce, visivel]);

  if (reduce) return null;

  const descendoOuPousada = estado === "descendo" || estado === "pousada";
  // O plano fala em "y: -120 a y: 220" para o percurso da descida — mas o fio
  // sozinho já tem 240px, por isso -120 deixava uma pontinha visível mesmo
  // em repouso. -260 esconde o conjunto todo (fio + corpo) sem tocar no
  // ponto de chegada nem na duração descrita.
  const y = descendoOuPousada ? 220 : -260;
  const aSubir = estado === "subindo";

  return (
    <div
      ref={ref}
      data-tralha-movel=""
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 ${className ?? ""}`}
    >
      <motion.div
        className="pendurado"
        animate={{ y }}
        transition={{
          duration: aSubir ? 0.5 : 1.2,
          ease: aSubir ? [0.4, 0, 0.2, 1] : [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* Fio de seda */}
        <svg viewBox="0 0 2 240" className="mx-auto h-60 w-0.5" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="240" stroke="var(--osso-fraco)" strokeWidth="1" opacity="0.5" />
        </svg>

        <motion.svg
          viewBox="0 0 40 40"
          className="-mt-2 h-8 w-8 sm:h-10 sm:w-10"
          style={{ transformOrigin: "50% 0%" }}
          animate={estado === "pousada" ? { rotate: [-6, 6, -6] } : { rotate: 0 }}
          transition={
            estado === "pousada"
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          {[-1, 1].map((lado) =>
            [0, 1, 2, 3].map((i) => (
              <path
                key={`${lado}-${i}`}
                d={`M20,18 Q${20 + lado * (10 + i * 2)},${10 + i * 4} ${20 + lado * (16 + i * 3)},${14 + i * 6}`}
                stroke="var(--breu-fundo)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            )),
          )}
          <circle cx="20" cy="22" r="8" fill="var(--breu-fundo)" />
          <circle cx="20" cy="13" r="5" fill="var(--breu-fundo)" />
          <circle cx="18" cy="12" r="1" fill="var(--lanterna)" />
          <circle cx="22" cy="12" r="1" fill="var(--lanterna)" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
