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
          src={photos.fachadaNoite.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/*
          Gradação nocturna, versão suave (§6.2 do plano): fachadaNoite já é
          `luz: "noite"` em lib/images.ts, por isso leva só metade da camada
          que uma foto diurna levaria — só o suficiente para assentar na
          paleta, sem apagar as luzes das lanternas que já lá estão.
        */}
        <div className="absolute inset-0 bg-breu/22 mix-blend-multiply" />
        <div className="absolute inset-0 bg-lanterna/6 mix-blend-overlay" />
      </motion.div>

      {/*
        Scrim: garante contraste do texto sobre qualquer parte da foto.
        --veu não está mapeado no @theme inline (só existe como custom
        property crua), por isso é sintaxe de valor arbitrário, não a
        classe de cor gerada.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-breu via-[var(--veu)] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--veu)] to-transparent" />
    </div>
  );
}
