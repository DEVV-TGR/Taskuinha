"use client";

import { useEffect, useRef, useState } from "react";
import { mapEmbedUrl } from "@/lib/site";

/*
  O embed da OpenStreetMap corre Leaflet, que mede o contentor ao inicializar
  e não volta a chamar invalidateSize. Como o iframe é de outra origem, não
  lhe podemos tocar por dentro: se a caixa mudar de tamanho depois, o mapa
  fica desenhado para as medidas antigas.

  Daí observar o contentor e voltar a montar o iframe quando o tamanho muda.
  Cada montagem inicializa o Leaflet com as medidas certas, o que cobre a
  rotação do telemóvel e o redimensionar da janela. A moldura tem altura fixa
  desde o início, por isso não há salto de layout enquanto o mapa não entra.
*/
/* `titulo` é o `encontrar.mapa` do dicionário. Vem por prop: componente de
   cliente não chega ao `next/root-params`. */
export function Mapa({ titulo }: { titulo: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;

      // Espera que o tamanho pare de mudar antes de montar.
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setSize({ w: Math.round(width), h: Math.round(height) });
      }, 200);
    });

    observer.observe(el);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="h-[420px] overflow-hidden rounded-[var(--radius-card)] border border-linha bg-breu-raso lg:h-[600px]"
    >
      {size ? (
        <iframe
          key={`${size.w}x${size.h}`}
          // Medidas também em atributos, e não só em CSS: o documento do
          // mapa tem de nascer já com o tamanho final, senão o Leaflet
          // arranca com a caixa por omissão e pede tiles a menos.
          width={size.w}
          height={size.h}
          title={titulo}
          src={mapEmbedUrl}
          className="map-frame block h-full w-full border-0"
        />
      ) : null}
    </div>
  );
}
