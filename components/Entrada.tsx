"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { photos } from "@/lib/images";

const DURACAO_TOTAL_MS = 1500;

/*
  Ecrã de entrada. Em todas as chegadas ao site, sem som, sem cursor de gancho.

  t=0.0s  ecrã a --breu
  t=0.2s  lanterna acende
  t=0.6s  caveira-madeira.jpg entra com scale 1.06 → 1
  t=1.0s  TASKUIИHA aparece por baixo
  t=1.5s  cortina abre (clip-path a subir) e desmonta

  Nunca bloqueia a leitura: o servidor não renderiza nada disto — o
  conteúdo por baixo já está no HTML e indexado antes de qualquer JS
  correr. Se o JavaScript falhar, este componente nunca chega a mostrar
  nada; não é um portão, é uma camada por cima.

  Aparecia uma vez por dia, guardado em localStorage. Deixou de aparecer:
  decisão do cliente — a imersão vale a fricção de 1,5s para quem volta.
  A navegação interna não passa por aqui (é uma transição de cliente); quem
  anda entre a inicial e a ementa vê as portadas da `Travessia`, não isto.
*/
export function Entrada() {
  const reduce = useReducedMotion();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (reduce) return; // nunca com movimento reduzido

    // Num microtask, não directamente no corpo do efeito — evita a cascata
    // de renders que o react-hooks/set-state-in-effect assinala.
    queueMicrotask(() => setVisivel(true));
  }, [reduce]);

  useEffect(() => {
    if (!visivel) return;

    function saltar() {
      setVisivel(false);
    }

    // Botão invisível de escape: qualquer tecla ou clique salta.
    window.addEventListener("keydown", saltar);
    window.addEventListener("click", saltar);
    const temporizador = window.setTimeout(saltar, DURACAO_TOTAL_MS);

    return () => {
      window.removeEventListener("keydown", saltar);
      window.removeEventListener("click", saltar);
      window.clearTimeout(temporizador);
    };
  }, [visivel]);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-breu"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute h-72 w-72 rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--lanterna) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="relative h-40 w-32 overflow-hidden rounded-[var(--radius-card)] shadow-[0_20px_50px_rgb(0_0_0/0.6)]"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={photos.caveiraMadeira.src}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </motion.div>

            <motion.p
              className="display gravado text-3xl text-osso sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <span aria-hidden="true">
                TASKUI<span className="inline-block scale-x-[-1]">N</span>HA
              </span>
              <span className="sr-only">Taskuinha</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
