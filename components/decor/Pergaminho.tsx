import type { ReactNode } from "react";
import { bordaPergaminho } from "@/lib/texturas";

type Props = {
  children: ReactNode;
  /** Semente da borda rasgada — variar por índice para não repetir o recorte. */
  semente?: number;
  className?: string;
};

/*
  Moldura de pergaminho: borda rasgada, manchas de queimado, 4 pregos de
  ferro nos cantos.

  A textura e a máscara vivem numa camada IRMÃ, absoluta, atrás do conteúdo
  — não no elemento que envolve `children` directamente. É deliberado: o
  §9.9 do plano avisa que aplicar `mask-image` ao contentor que envolve um
  `<iframe>` cross-origin (o mapa) cria um *stacking context* que o Safari
  usa para fazer o iframe desaparecer. Ao separar a moldura do conteúdo,
  este componente fica seguro para qualquer coisa que lá dentro se ponha,
  não só texto.

  Verificado: nos cantos onde o recorte da borda rasgada é mais fundo, a
  camada de baixo desaparece e revela o fundo escuro da página por trás —
  se o texto estiver perto de mais da margem, fica ilegível em cima do
  fundo escuro. Duas coisas resolvem isto sem esconder o rasgão: o recorte
  em lib/texturas.ts tem um limite de profundidade menor do que o
  `padding` desta camada, e o padding aqui é generoso o suficiente para
  nunca deixar texto entrar nessa faixa.
*/
export function Pergaminho({ children, semente = 0, className }: Props) {
  const { fundo, mascara } = bordaPergaminho(semente);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="pergaminho absolute inset-0"
        style={
          {
            "--textura-pergaminho": fundo,
            "--mascara-rasgada": mascara,
          } as React.CSSProperties
        }
      />

      {Prego("top-2 left-2")}
      {Prego("top-2 right-2")}
      {Prego("bottom-2 left-2")}
      {Prego("bottom-2 right-2")}

      <div className="relative p-12 text-[var(--pergaminho-tinta)] sm:p-14">
        {children}
      </div>
    </div>
  );
}

function Prego(posicao: string) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`pointer-events-none absolute z-10 h-3 w-3 ${posicao}`}
    >
      <circle cx="6" cy="6" r="4.5" fill="#3a3229" />
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#161310" strokeWidth="1" />
      <circle cx="4.7" cy="4.7" r="1" fill="#5c5347" opacity="0.7" />
    </svg>
  );
}
