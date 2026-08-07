import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/*
  Dois níveis de CTA e mais nenhum. Tabuletas de madeira, não pílulas — uma
  tabuleta não se arredonda toda, por isso `border-radius` é
  `var(--radius-card)` em vez de `rounded-full`. Isto quebra a regra antiga
  do sistema ("interactivos totalmente arredondados"); é deliberado, ver o
  comentário no topo de globals.css.

  O primário leva 4 pregos de ferro nos cantos, como uma tabuleta pregada a
  sério. O secundário é só contorno — não é madeira, é a opção que não
  chama tanta atenção.
*/

const base =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-card)] px-6 py-3 text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,border-color] duration-200 ease-out active:translate-y-px";

const variants = {
  primary:
    "gravado bg-lanterna text-sobre-acento shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_4px_rgb(0_0_0/0.25)] hover:brightness-110",
  secondary:
    "border border-linha-forte bg-breu/70 text-osso backdrop-blur-sm hover:border-lanterna hover:text-lanterna",
} as const;

type Variant = keyof typeof variants;

export function Cta({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const pregos = variant === "primary" ? <Pregos /> : null;

  if (href.startsWith("tel:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
      >
        {pregos}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {pregos}
      {children}
    </Link>
  );
}

function Pregos() {
  const posicoes = ["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"];
  return (
    <>
      {posicoes.map((posicao) => (
        <svg
          key={posicao}
          aria-hidden="true"
          viewBox="0 0 8 8"
          className={`pointer-events-none absolute h-1.5 w-1.5 ${posicao}`}
        >
          <circle cx="4" cy="4" r="3" fill="var(--sobre-acento)" opacity="0.55" />
          <circle cx="3.3" cy="3.3" r="0.7" fill="var(--osso)" opacity="0.35" />
        </svg>
      ))}
    </>
  );
}
