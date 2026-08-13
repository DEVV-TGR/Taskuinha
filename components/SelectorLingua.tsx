"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, linguas, trocarLingua, type Locale } from "@/lib/i18n";

/*
  Uma língua à vista — a que está em uso. As outras três aparecem ao clicar.

  O botão mostra a bandeira e as duas letras da língua actual; a lista que
  abre traz só as **outras**, porque a que está em uso já é o próprio
  botão. É a leitura directa do pedido do Gonçalo, e é também o que poupa
  largura numa barra que já tem wordmark, quatro placas, o CTA e a argola.

  ## Duas montagens, um comportamento

  Na barra a lista é `absolute` e cai por cima do que está por baixo. Na
  gaveta do telemóvel não pode ser: a gaveta é `overflow-hidden` por causa
  da animação de altura, e uma lista absoluta ficava cortada. Aí a lista
  entra no fluxo (`flutuante={false}`) e a gaveta cresce com ela.

  ## O que se lê e o que se ouve

  Vê-se a bandeira e as duas letras. Ouve-se o nome da língua, na própria
  língua: a bandeira e a etiqueta levam `aria-hidden` e o nome vai em
  `sr-only`, senão um leitor de ecrã anunciava "PT Português" e, com
  algumas vozes, também o nome do país da bandeira.

  O `lang` de cada ligação é o da língua de destino — é o que faz o leitor
  de ecrã dizer "Français" com sotaque francês em vez de o soletrar à
  portuguesa.
*/
export function SelectorLingua({
  lang,
  texto,
  flutuante = true,
  className = "",
}: {
  lang: Locale;
  texto: { escolher: string; actual: string };
  /** `false` na gaveta do telemóvel, que é `overflow-hidden`. */
  flutuante?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const actual = linguas[lang];
  const outras = locales.filter((codigo) => codigo !== lang);

  /*
    Fecha com Escape e ao clicar fora. O `pointerdown` e não o `click`:
    um clique numa das ligações do próprio menu não deve fechá-lo antes de
    a navegação arrancar, e o `contains` trata disso — mas com `click` o
    alvo já pode ter saído do DOM quando o evento chega.
  */
  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setAberto(false);
      botaoRef.current?.focus();
    }

    function aoApontar(e: PointerEvent) {
      if (caixaRef.current?.contains(e.target as Node)) return;
      setAberto(false);
    }

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("pointerdown", aoApontar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("pointerdown", aoApontar);
    };
  }, [aberto]);

  return (
    <div ref={caixaRef} className={`relative ${className}`}>
      <button
        ref={botaoRef}
        type="button"
        aria-expanded={aberto}
        aria-haspopup="true"
        aria-controls="linguas-lista"
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-1.5 rounded-[var(--radius-card)] px-2 py-1.5 text-[0.7rem] tracking-[0.08em] text-osso-fraco transition-colors hover:text-osso"
        style={{ fontFamily: "var(--font-maquina)" }}
      >
        <span aria-hidden className="text-[0.95rem] leading-none">
          {actual.bandeira}
        </span>
        <span aria-hidden>{actual.etiqueta}</span>
        <span className="sr-only">
          {texto.escolher} — {texto.actual}: {actual.nome}
        </span>
        <Bico aberto={aberto} />
      </button>

      {aberto ? (
        <ul
          id="linguas-lista"
          className={
            flutuante
              ? "absolute right-0 top-full z-50 mt-1.5 min-w-max overflow-hidden rounded-[var(--radius-card)] border border-linha bg-breu/98 shadow-[0_10px_26px_rgb(0_0_0/0.55)] backdrop-blur-md"
              : "mt-2 overflow-hidden rounded-[var(--radius-card)] border border-linha bg-breu/60"
          }
        >
          {outras.map((codigo) => {
            const lingua = linguas[codigo];

            return (
              <li key={codigo}>
                <a
                  href={trocarLingua(pathname, codigo)}
                  hrefLang={lingua.htmlLang}
                  lang={lingua.htmlLang}
                  className="flex items-center gap-2 px-3 py-2.5 text-[0.7rem] tracking-[0.08em] text-osso-fraco transition-colors hover:bg-breu-raso hover:text-lanterna"
                  style={{ fontFamily: "var(--font-maquina)" }}
                >
                  <span aria-hidden className="text-[0.95rem] leading-none">
                    {lingua.bandeira}
                  </span>
                  <span aria-hidden>{lingua.etiqueta}</span>
                  <span className="sr-only">{lingua.nome}</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/* Bico da argola: aponta para baixo fechado, para cima aberto. */
function Bico({ aberto }: { aberto: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 6"
      className={`h-1.5 w-2.5 transition-transform duration-200 ${
        aberto ? "rotate-180" : ""
      }`}
      fill="none"
    >
      <path
        d="M1 1.25 5 4.75 9 1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
