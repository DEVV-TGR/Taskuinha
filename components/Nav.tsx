"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { Cta } from "@/components/Cta";
import { SelectorLingua } from "@/components/SelectorLingua";
import { Tabua } from "@/components/decor/Tabua";
import { site } from "@/lib/site";
import { caminho, defaultLocale, type Locale } from "@/lib/i18n";
import type { Dicionario } from "@/lib/dicionario";

/*
  As quatro placas, por rota e âncora em vez de por href pronto.

  As âncoras não se traduzem — `#a-casa` é a mesma secção em qualquer
  língua, e traduzi-las partia todas as ligações antigas sem ganho nenhum
  para quem lê. O que muda de língua para língua é só o prefixo, que o
  `caminho()` põe à frente.
*/
const placas = [
  { chave: "casa", rota: "/", ancora: "#a-casa" },
  { chave: "petiscos", rota: "/", ancora: "#petiscos" },
  { chave: "sitio", rota: "/", ancora: "#o-sitio" },
  { chave: "ementa", rota: "/ementa", ancora: "" },
] as const;

export type TextoNav = {
  nav: Dicionario["nav"];
  geral: Dicionario["geral"];
  linguas: Dicionario["linguas"];
};

/*
  A barra começa transparente por cima da fotografia do cabeçalho e ganha
  fundo à medida que se desce. Feedback de estado, não decoração: diz que
  saíste do topo. A opacidade é um motion value, por isso não há re-render
  por frame — o mesmo vale para o balanço das placas, derivado da
  velocidade do scroll.

  Componente de cliente: o `next/root-params` não chega cá, por isso a
  língua e o texto vêm por props de quem a monta.
*/
export function Nav({
  transparentAtTop = false,
  lang,
  texto,
}: {
  transparentAtTop?: boolean;
  lang: Locale;
  texto: TextoNav;
}) {
  const links = placas.map((placa) => ({
    label: texto.nav[placa.chave],
    href: `${caminho(lang, placa.rota)}${placa.ancora}`,
    /*
      A semente do veio da madeira sai sempre da morada **portuguesa**. Se
      saísse do href da língua em uso, o `/fr` de dois caracteres mudava o
      comprimento e cada língua ficava com placas de desenho diferente.
    */
    semente: `${caminho(defaultLocale, placa.rota)}${placa.ancora}`.length,
  }));
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const backdropOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  // As placas de madeira balançam quando se scrolla depressa, como
  // tabuletas penduradas por corda que apanham uma corrente de ar.
  const velocidadeScroll = useVelocity(scrollY);
  const rotateBruto = useTransform(velocidadeScroll, [-1500, 0, 1500], [9, 0, -9], {
    clamp: true,
  });
  const rotate = useSpring(rotateBruto, { stiffness: 300, damping: 18, mass: 0.5 });

  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const gavetaRef = useRef<HTMLDivElement>(null);

  function fechar() {
    setAberto(false);
    botaoRef.current?.focus();
  }

  // Fecho com Escape, focus trap enquanto aberta, e overflow:hidden no
  // <body> — a gaveta é `fixed`, sem isto dava para scrollar o conteúdo
  // por trás dela.
  useEffect(() => {
    if (!aberto) return;

    document.body.style.overflow = "hidden";

    const primeiroLink = gavetaRef.current?.querySelector<HTMLElement>("a[href]");
    primeiroLink?.focus();

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        fechar();
        return;
      }
      if (e.key !== "Tab") return;

      const el = gavetaRef.current;
      if (!el) return;
      const focaveis = Array.from(el.querySelectorAll<HTMLElement>("a[href]"));
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        aria-hidden
        className="absolute inset-0 border-b border-linha bg-breu/92 backdrop-blur-md"
        style={
          transparentAtTop && !reduce ? { opacity: backdropOpacity } : undefined
        }
      />

      <nav
        aria-label={texto.nav.principal}
        className="relative mx-auto flex h-[var(--altura-nav)] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        <Wordmark lang={lang} etiqueta={texto.nav.inicio} />

        <ul className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <motion.span
                className="pendurado inline-block"
                style={reduce ? undefined : { rotate }}
              >
                <Tabua semente={link.semente} className="text-osso">
                  <a
                    href={link.href}
                    className="gravado block px-3 py-1.5 text-sm transition-colors hover:text-lanterna"
                  >
                    {link.label}
                  </a>
                </Tabua>
              </motion.span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Só a partir de md, e em menu: aqui a barra não tem largura
              para quatro bandeiras seguidas. Em telemóvel o selector vai
              dentro da gaveta, em fila. */}
          <SelectorLingua
            lang={lang}
            texto={texto.linguas}
            variante="menu"
            className="hidden md:block"
          />

          <Cta href={`tel:${site.phone.tel}`} className="px-4 py-2 text-sm sm:px-6 sm:py-3">
            <Phone size={16} weight="bold" aria-hidden />
            <span className="hidden sm:inline">{texto.geral.reservar}</span>
            <span className="sr-only sm:hidden">{texto.geral.reservar}</span>
          </Cta>

          <button
            ref={botaoRef}
            type="button"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? texto.nav.fechar : texto.nav.abrir}
            onClick={() => setAberto((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-card)] text-osso md:hidden"
          >
            <ArgolaDeLatao aberta={aberto} reduce={!!reduce} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id="menu-movel"
            ref={gavetaRef}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="tabua relative overflow-hidden border-t border-linha md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={fechar}
                    className="gravado block rounded-[var(--radius-card)] px-3 py-3 text-base text-osso transition-colors hover:text-lanterna"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/*
              As línguas fecham a gaveta, separadas por uma linha, e aqui
              ficam as quatro seguidas: há largura para elas, e um menu
              dentro de um menu era um clique a mais para o mesmo sítio.
              São ligações, por isso entram na armadilha de foco montada no
              `useEffect` e o Tab continua a circular só dentro da gaveta.
            */}
            <div className="border-t border-linha px-5 py-3">
              <SelectorLingua
                lang={lang}
                texto={texto.linguas}
                variante="fila"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* Botão do menu de telemóvel: uma argola de latão, como as das arcas. Gira
   um quarto de volta quando o menu abre — a fechadura destranca. */
function ArgolaDeLatao({ aberta, reduce }: { aberta: boolean; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      animate={reduce ? undefined : { rotate: aberta ? 90 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <circle cx="12" cy="12" r="8" stroke="var(--lanterna)" strokeWidth="1.75" />
      <circle cx="12" cy="7.5" r="1.4" fill="var(--lanterna)" />
      <line x1="12" y1="16" x2="12" y2="19" stroke="var(--lanterna)" strokeWidth="1.75" strokeLinecap="round" />
    </motion.svg>
  );
}
