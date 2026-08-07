import Link from "next/link";

/*
  O logótipo é tipografia, não um desenho. Archivo largo em caixa alta para o
  nome, e a alcunha por baixo em corpo pequeno, como numa placa pintada.
*/
export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      className="group inline-flex flex-col leading-none"
      aria-label="Taskuinha do Pirata, ir para a página inicial"
    >
      <span
        className={`display text-ink transition-colors duration-200 group-hover:text-accent ${
          isLarge ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"
        }`}
      >
        Taskuinha
      </span>
      <span
        className={`font-mono uppercase text-ink-muted ${
          isLarge
            ? "mt-2 text-[0.7rem] tracking-[0.34em]"
            : "mt-1 text-[0.55rem] tracking-[0.28em]"
        }`}
      >
        do Pirata
      </span>
    </Link>
  );
}
