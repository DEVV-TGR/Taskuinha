import type { ReactNode } from "react";

/*
  Uma faixa de aviso — o erro que a entrada devolve, o conflito de gravação, a
  confirmação de que o commit foi feito.

  Três tons e mais nenhum. Nenhum deles usa `--sangue` em texto: faz 3,3:1
  sobre o breu e não passa AA, e a regra do `globals.css` é que ele só preenche,
  sublinha e desenha. O mau fica em `--lanterna` com a borda a marcar o tom.
*/

const tons = {
  mau: "border-sangue/70 bg-sangue/10 text-lanterna",
  bom: "border-turquesa/60 bg-turquesa/10 text-turquesa-luz",
  nota: "border-linha bg-breu-fundo text-osso-fraco",
} as const;

export function Aviso({
  tom = "nota",
  children,
  className = "",
}: {
  tom?: keyof typeof tons;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      role={tom === "mau" ? "alert" : undefined}
      className={`rounded-[var(--radius-card)] border px-3 py-2.5 text-sm leading-relaxed ${tons[tom]} ${className}`}
    >
      {children}
    </p>
  );
}
