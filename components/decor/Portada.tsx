"use client";

import Image from "next/image";
import { motion, type MotionProps } from "motion/react";
import { photos } from "@/lib/images";

/*
  Uma folha do portão da taberna: meia largura do ecrã, altura toda, com a
  fotografia da porta e a junta na aresta de dentro.

  Servem duas coisas ao mesmo tempo — a chegada ao site (`Chegada.tsx`, as
  folhas começam fechadas e abrem) e a troca entre páginas (`Travessia.tsx`,
  entram das margens, encostam e voltam a sair). São movimentos opostos, por
  isso este componente **não sabe mexer-se**: trata do aspecto e recebe as
  propriedades do Motion de fora. Quem decide como se abre é quem a usa.

  ## Porque é que a madeira já não é gerada

  Era o `.tabua` com duas texturas de `lib/texturas.ts`, semeadas com números
  diferentes para a junta não se ler como um espelho. O Gonçalo trouxe
  fotografias de um portão a sério, e o desenho em SVG não tem como competir
  com ferragens, cravos e ferraduras reais.

  As texturas continuam vivas — o `decor/Tabua.tsx`, a `Nav` e os cartões dos
  petiscos usam-nas. Só aqui é que deixaram de servir.

  ## Porque é `<Image>` e não `background-image`

  Os dois PNG têm 2,2 MB cada. Em CSS iam em bruto para o visitante, que é
  exactamente o erro que a tabuleta acabou de deixar de cometer. Pelo
  `next/image` saem em WebP redimensionado e ficam nas centenas de KB.
*/

type Props = {
  lado: "esquerda" | "direita";
  /**
   * Carrega a fotografia com prioridade. Só na chegada: aí as folhas são a
   * primeira coisa que se pinta, e sem isto viam-se dois rectângulos de cor a
   * encher-se. Nas travessias já estão em cache.
   */
  prioritaria?: boolean;
} & MotionProps;

export function Portada({ lado, prioritaria, ...movimento }: Props) {
  const esquerda = lado === "esquerda";
  const foto = esquerda ? photos.portaEsquerda : photos.portaDireita;

  return (
    <motion.div
      className={`absolute inset-y-0 w-1/2 overflow-hidden bg-[var(--madeira)] ${
        esquerda
          ? "left-0 border-r-2 border-[var(--madeira-borda)]"
          : "right-0 border-l-2 border-[var(--madeira-borda)]"
      }`}
      {...movimento}
    >
      {/* A cor de fundo do elemento fica por baixo desta imagem, e é ela que
          evita um instante de vazio enquanto a fotografia não chega. */}
      <Image
        src={foto.src}
        alt=""
        fill
        sizes="50vw"
        priority={prioritaria}
        className="object-cover"
      />

      {/* A penumbra nas arestas que o `.tabua` dava com um `inset` box-shadow.
          Vai numa camada por cima porque a imagem tapava o box-shadow do
          elemento; sem ela as portas lêem-se como papel de parede, e não como
          duas folhas com volume. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 60px rgb(0 0 0 / 0.55)" }}
      />
    </motion.div>
  );
}
