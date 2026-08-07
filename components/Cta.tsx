import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/*
  Dois níveis de CTA e mais nenhum.
  O primário assenta sobre o acento; o secundário é traço.
  Ambos ficam legíveis por cima de fotografia porque o secundário
  leva sempre um fundo semi-opaco.
*/

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,border-color] duration-200 ease-out active:translate-y-px";

const variants = {
  primary: "bg-accent text-on-accent hover:brightness-110",
  secondary:
    "border border-line-strong bg-surface/70 text-ink backdrop-blur-sm hover:border-accent hover:text-accent",
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

  if (href.startsWith("tel:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
