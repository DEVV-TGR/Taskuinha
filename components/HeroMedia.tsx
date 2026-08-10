import Image from "next/image";
import { photos } from "@/lib/images";

/*
  A fotografia do cabeçalho, e nada mais: está parada.

  Houve aqui um parallax curto — a imagem deslizava 10% com o scroll, por um
  `useScroll` mais um `useTransform`. Saiu a pedido do Gonçalo, e a razão não
  é de gosto.

  No telemóvel o Hero era `min-h-[100dvh]`, e o `dvh` muda em degraus à medida
  que a barra de endereço se recolhe (ver o comentário do `Hero.tsx`). O
  `useScroll` mede o elemento para calcular o progresso; a cada degrau remedia
  e o deslocamento saltava. O Hero a mudar de altura e a fotografia a saltar ao
  mesmo tempo lia-se como o site a travar.

  A altura já foi corrigida, mas o parallax fica fora à mesma: ele quer aquilo
  parado, e um efeito que custa uma medição por frame para dar 10% de
  deslocamento não se justifica sozinho.

  Sem `"use client"`: já não há hook nenhum aqui. É um componente de servidor,
  e é menos JavaScript a descarregar no telemóvel.
*/
export function HeroMedia() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* `inset-0`, e não o `-bottom-[10%]` que aqui estava: essa folga
          existia para o parallax ter para onde deslizar sem descobrir a
          aresta de baixo. */}
      <div className="absolute inset-0">
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
      </div>

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
