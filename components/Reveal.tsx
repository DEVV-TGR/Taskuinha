"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** posição na sequência, para o stagger */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "figure";
};

/*
  Revelação na entrada em viewport.

  Porquê: as secções contam uma sequência (a casa, depois o que se come,
  depois onde é). O stagger sublinha essa ordem de leitura em vez de
  entregar tudo de uma vez. Nada aqui é decorativo: com movimento reduzido,
  o conteúdo aparece imediatamente e no sítio certo.
*/
export function Reveal({ children, index = 0, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      // Marca usada pela regra de <noscript> em app/layout.tsx, para o
      // conteúdo continuar visível sem JavaScript.
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.6,
        delay: reduce ? 0 : Math.min(index * 0.07, 0.35),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}
