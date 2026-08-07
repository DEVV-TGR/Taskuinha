"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

/*
  Relâmpago: duas descargas rápidas (80 ms + 140 ms, com 60 ms de intervalo
  às escuras), depois nada durante 15–40 s. Só no hero.

  A aleatoriedade dos intervalos vem de `Math.random()` dentro de
  `useEffect` — depois da hidratação, nunca durante a renderização.
*/
export function Relampago({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const [opacidade, setOpacidade] = useState(0);
  const temporizadores = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;

    function limpar() {
      temporizadores.current.forEach(clearTimeout);
      temporizadores.current = [];
    }

    function agendar(atraso: number, fn: () => void) {
      const id = window.setTimeout(fn, atraso);
      temporizadores.current.push(id);
    }

    function ciclo() {
      if (document.visibilityState !== "visible") {
        agendar(5000, ciclo);
        return;
      }
      // Duas descargas: 80ms aceso, 60ms apagado, 140ms aceso, depois apaga.
      setOpacidade(0.35);
      agendar(80, () => setOpacidade(0));
      agendar(140, () => setOpacidade(0.35));
      agendar(280, () => setOpacidade(0));

      const proximo = 15000 + Math.random() * 25000;
      agendar(proximo, ciclo);
    }

    agendar(4000 + Math.random() * 6000, ciclo);
    return limpar;
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-75 ${className ?? ""}`}
      style={{
        backgroundColor: "var(--relampago)",
        opacity: visivel ? opacidade : 0,
      }}
    />
  );
}
