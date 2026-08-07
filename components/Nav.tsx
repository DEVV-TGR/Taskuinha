"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { Cta } from "@/components/Cta";
import { site } from "@/lib/site";

const links = [
  { label: "A casa", href: "/#a-casa" },
  { label: "Petiscos", href: "/#petiscos" },
  { label: "O sítio", href: "/#o-sitio" },
  { label: "Ementa", href: "/ementa" },
];

/*
  A barra começa transparente por cima da fotografia do cabeçalho e ganha
  fundo à medida que se desce. Feedback de estado, não decoração: diz que
  saíste do topo. A opacidade é um motion value, por isso não há re-render
  por frame.
*/
export function Nav({ transparentAtTop = false }: { transparentAtTop?: boolean }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const backdropOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        aria-hidden
        className="absolute inset-0 border-b border-line bg-surface/92 backdrop-blur-md"
        style={
          transparentAtTop && !reduce ? { opacity: backdropOpacity } : undefined
        }
      />

      <nav
        aria-label="Navegação principal"
        className="relative mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        <Wordmark />

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="link-underline text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="/ementa"
            className="link-underline text-sm text-ink-muted transition-colors hover:text-ink md:hidden"
          >
            Ementa
          </a>
          <Cta href={`tel:${site.phone.tel}`} className="px-4 py-2 text-sm sm:px-6 sm:py-3">
            <Phone size={16} weight="bold" aria-hidden />
            <span className="hidden sm:inline">Reservar mesa</span>
            <span className="sr-only sm:hidden">Reservar mesa</span>
          </Cta>
        </div>
      </nav>
    </header>
  );
}
