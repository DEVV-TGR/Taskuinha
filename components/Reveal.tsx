"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { REVELACAO } from "@/lib/movimento";

type Props = {
  children: ReactNode;
  /** posição na sequência, para o stagger */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "figure";
};

/*
  Revelação na entrada em viewport: cai e balança, como algo pendurado num
  prego. É o ficheiro mais perigoso do redesenho — usado em todos os blocos
  de conteúdo das duas páginas. O `spring` faz *overshoot* de propósito;
  com `rotate` isso lê-se como balanço.

  Os números vivem em `lib/movimento.ts`, não aqui: é o ficheiro único que
  o cliente e o Gonçalo vão mexer à mesa, e ter metade da calibração
  espalhada pelos componentes tornava essa conversa impossível.

  `tilt` alterna o lado por índice para o conjunto ler como um mural
  desalinhado, não como uma fila toda inclinada para o mesmo lado.

  `will-change: transform` porque em elementos largos (um `<h2>` de secção)
  3° de rotação desloca os cantos vários pixels — sem isto, alguns
  navegadores recalculam layout a cada frame em vez de só compor a camada.
*/
export function Reveal({ children, index = 0, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const tilt = index % 2 === 0 ? -REVELACAO.rotacao : REVELACAO.rotacao;

  return (
    <Component
      // Marca usada pela regra de <noscript> em app/layout.tsx e pelo bloco
      // de prefers-reduced-motion em globals.css, para o conteúdo continuar
      // visível sem JavaScript ou com movimento reduzido.
      data-reveal=""
      className={className}
      style={{ willChange: "transform" }}
      initial={
        reduce ? false : { opacity: 0, y: -REVELACAO.deslocamento, rotate: tilt }
      }
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        ...REVELACAO.mola,
        delay: reduce
          ? 0
          : Math.min(index * REVELACAO.atrasoPorItem, REVELACAO.atrasoMaximo),
      }}
    >
      {children}
    </Component>
  );
}
