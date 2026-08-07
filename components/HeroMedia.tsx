"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { photos } from "@/lib/images";

/*
  Parallax curto na fotografia do cabeçalho.

  Porquê: dá profundidade entre o mar e o texto que assenta por cima, e
  sinaliza que a página continua. É de 10%, não mais, para não competir com
  a leitura. Com movimento reduzido, a imagem fica parada.
*/
export function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 -bottom-[10%]"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={photos.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Scrim: garante contraste do texto sobre qualquer parte da foto. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--scrim)] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--scrim)] to-transparent" />
    </div>
  );
}
