import { malhaRede } from "@/lib/texturas";

/*
  Rede de pesca em losango nos 4 cantos, com conchas de vieira e nós.
  Estática — nada aqui balança. Sem "use client": a textura é determinística
  e pode ser calculada no servidor.

  Não é `fixed`: assume que quem a monta (normalmente o `Tralha`) já
  estabeleceu um ancestral `fixed inset-0` — este componente só ocupa esse
  espaço com `absolute inset-0`.
*/

const cantos = [
  { classe: "top-0 left-0", clip: "polygon(0 0, 100% 0, 0 100%)" },
  { classe: "top-0 right-0", clip: "polygon(0 0, 100% 0, 100% 100%)" },
  { classe: "bottom-0 left-0", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { classe: "bottom-0 right-0", clip: "polygon(100% 0, 100% 100%, 0 100%)" },
] as const;

/** Concha de vieira, presa no vértice da rede — o símbolo do Caminho de Santiago. */
function Vieira({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3c-3 3-8 4-9 9 2 2 5 3 9 3s7-1 9-3c-1-5-6-6-9-9Z"
        stroke="var(--osso-fraco)"
        strokeWidth="1"
        opacity="0.5"
      />
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M12 3c${-1.5 - i * 0.4} 3 ${-3 - i} 5 ${-4.5 - i} 9`}
          stroke="var(--osso-fraco)"
          strokeWidth="0.8"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

export function Rede() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {cantos.map((canto) => (
        <div
          key={canto.classe}
          className={`absolute h-40 w-40 sm:h-56 sm:w-56 ${canto.classe}`}
          style={{ clipPath: canto.clip, opacity: 0.28 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: malhaRede({ passo: 34 }),
              backgroundRepeat: "repeat",
            }}
          />
          <Vieira
            className={`absolute h-6 w-6 ${
              canto.classe.includes("left") ? "left-3" : "right-3"
            } ${canto.classe.includes("top") ? "top-3" : "bottom-3"}`}
          />
        </div>
      ))}
    </div>
  );
}
