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
import { Phone, X } from "@phosphor-icons/react/dist/ssr";
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

  // Fecho com Escape, focus trap enquanto aberto, e overflow:hidden no
  // <body> — o cartão está por cima da página, e sem isto arrastar no véu
  // fazia a página correr por baixo dele.
  useEffect(() => {
    if (!aberto) return;

    document.body.style.overflow = "hidden";

    const primeiroLink = gavetaRef.current?.querySelector<HTMLElement>("a[href]");
    primeiroLink?.focus();

    // `a[href]` já não chega: o botão de fechar está dentro do cartão e,
    // sem ele na lista, o Tab saltava-o e caía na página por trás.
    const FOCAVEIS = "a[href], button:not([disabled])";

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        fechar();
        return;
      }
      if (e.key !== "Tab") return;

      const el = gavetaRef.current;
      if (!el) return;
      const focaveis = Array.from(el.querySelectorAll<HTMLElement>(FOCAVEIS));
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

      {/*
        O menu do telemóvel: um cartão ao meio do ecrã, sobre véu.

        Era uma gaveta encostada ao cabeçalho, que animava de altura. O
        cartão ao centro põe as quatro placas debaixo do polegar em vez de
        no topo do ecrã — num telemóvel grande, o cimo é a parte que a mão
        não alcança sem mudar de pega.

        A mudança de sítio trouxe as obrigações de um diálogo, e nenhuma
        delas é decoração:

        - **o véu** separa o cartão da página e dá onde tocar para fechar;
        - **`role="dialog"` e `aria-modal`** dizem ao leitor de ecrã que a
          página por trás deixou de contar;
        - **o botão de fechar vive dentro do cartão**, porque a argola que o
          abriu ficou debaixo do véu e já não se lhe pode tocar;
        - **`max-h` com `dvh`** e scroll interno, para o cartão caber num
          telemóvel deitado — são 380px de altura, e a barra do browser come
          parte deles, que é o que o `vh` não sabe e o `dvh` sabe.

        A animação deixa de ser de altura, que era coisa de gaveta: o véu
        aparece e o cartão cresce de 0,96, a partir do meio. Com movimento
        reduzido não há nem uma coisa nem outra — o `initial={false}` põe-no
        já no sítio, como no resto do site.
      */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              aria-hidden
              onClick={fechar}
              className="absolute inset-0 bg-[var(--veu)] backdrop-blur-[2px]"
            />

            {/*
              A grelha que centra o cartão cobre o ecrã inteiro, portanto
              apanhava ela os toques que eram para o véu — e tocar ao lado
              do cartão não fechava nada. `pointer-events-none` aqui e
              `auto` no cartão devolvem o véu a quem lhe toca.
            */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-5">
              <motion.div
                id="menu-movel"
                ref={gavetaRef}
                role="dialog"
                aria-modal="true"
                aria-label={texto.nav.principal}
                initial={reduce ? false : { scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={reduce ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="tabua pointer-events-auto relative max-h-[min(34rem,calc(100dvh-2.5rem))] w-full max-w-[21rem] overflow-y-auto overscroll-contain rounded-[var(--radius-card)] border border-linha shadow-[0_18px_50px_rgb(0_0_0/0.6)]"
              >
                <button
                  type="button"
                  onClick={fechar}
                  aria-label={texto.nav.fechar}
                  className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-[var(--radius-card)] text-osso-fraco transition-colors hover:text-lanterna"
                >
                  <X size={18} weight="bold" aria-hidden />
                </button>

                <ul className="flex flex-col gap-1 px-5 pb-4 pt-12">
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
                  As línguas fecham o cartão, separadas por uma linha, e aqui
                  ficam as quatro seguidas: um menu dentro de um menu era um
                  clique a mais para o mesmo sítio. São ligações, por isso
                  entram na armadilha de foco montada no `useEffect` e o Tab
                  continua a circular só dentro do cartão.
                */}
                <div className="border-t border-linha px-5 py-4">
                  <SelectorLingua
                    lang={lang}
                    texto={texto.linguas}
                    variante="cartao"
                  />
                </div>
              </motion.div>
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
