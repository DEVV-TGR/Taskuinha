import type { ReactNode } from "react";
import { veioMadeira, ripasMadeira } from "@/lib/texturas";

type Props = {
  children: ReactNode;
  /** Semente da textura — variar por índice para não repetir o mesmo padrão. */
  semente?: number;
  className?: string;
};

/*
  Superfície de tábuas. Duas texturas sobrepostas: `veioMadeira()` dá a fibra
  fina, `ripasMadeira()` dá as juntas entre ripas de largura variável, mais
  escuras. A classe `.tabua` (globals.css) trata da cor base e da sombra
  interna forte.
*/
export function Tabua({ children, semente = 0, className }: Props) {
  return (
    <div
      className={`tabua rounded-[var(--radius-card)] ${className ?? ""}`}
      style={
        {
          "--textura-madeira": `${ripasMadeira(semente)}, ${veioMadeira({ semente: semente + 1 })}`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
