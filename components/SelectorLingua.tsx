"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, linguas, trocarLingua, type Locale } from "@/lib/i18n";

/*
  O selector de língua, em duas formas — e a forma depende do sítio, não
  do tamanho do ecrã por si só.

  **`menu`, na barra do computador.** À vista fica só a língua em uso; as
  outras três aparecem ao clicar. A barra já tem wordmark, quatro placas,
  o CTA e a argola, e quatro bandeiras seguidas a mais não cabiam sem
  apertar o resto.

  **`cartao`, no menu do telemóvel.** As quatro seguidas, sem nada para
  abrir, mas em alvos de dedo: a bandeira grande por cima das duas letras,
  49px de lado, a que está em uso com moldura de lanterna. Um menu dentro
  de um menu era um clique a mais para chegar ao mesmo sítio.

  Havia uma terceira, `fila`, com as quatro numa linha apertada — era o que
  a gaveta do telemóvel usava. Saiu com a gaveta: o cartão tem largura para
  alvos a sério, e um componente que ninguém monta é dívida.

  ## O que se lê e o que se ouve

  Vê-se a bandeira e as duas letras. Ouve-se o nome da língua, na própria
  língua: a bandeira e a etiqueta levam `aria-hidden` e o nome vai em
  `sr-only`, senão um leitor de ecrã anunciava "PT Português" e, com
  algumas vozes, também o nome do país da bandeira.

  O `lang` de cada ligação é o da língua de destino — é o que faz o leitor
  de ecrã dizer "Français" com sotaque francês em vez de o soletrar à
  portuguesa.
*/
type Texto = { escolher: string; actual: string };

export function SelectorLingua({
  lang,
  texto,
  variante = "menu",
  className = "",
}: {
  lang: Locale;
  texto: Texto;
  variante?: "menu" | "cartao";
  className?: string;
}) {
  return variante === "cartao" ? (
    <Cartao lang={lang} texto={texto} className={className} />
  ) : (
    <Menu lang={lang} texto={texto} className={className} />
  );
}

/*
  As quatro em alvos de dedo, para dentro do menu do telemóvel.

  A bandeira sobe para 1,35rem e ganha as duas letras por baixo em vez de ao
  lado — não é enfeite: é o que permite ter 49px de altura sem o botão ficar
  um retângulo comprido, e 49 está acima dos 44 que a Apple e a WCAG pedem
  para um alvo de toque.

  A que está em uso leva moldura e fundo de lanterna, e não só cor de texto
  como na `fila`: no meio de quatro bandeiras a cor da letra perde-se.

  **A bandeira não é a informação.** É emoji, e no Windows não desenha
  bandeira nenhuma — desenha as duas letras do país (ver `lib/i18n.ts`). Por
  isso as letras estão sempre lá por baixo, e não como legenda opcional: são
  elas que aguentam a leitura quando a bandeira não aparece.
*/
function Cartao({
  lang,
  texto,
  className,
}: {
  lang: Locale;
  texto: Texto;
  className: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={texto.escolher} className={className}>
      <ul className="grid grid-cols-4 gap-2">
        {locales.map((codigo) => {
          const lingua = linguas[codigo];
          const actual = codigo === lang;

          return (
            <li key={codigo}>
              <a
                href={trocarLingua(pathname, codigo)}
                hrefLang={lingua.htmlLang}
                lang={lingua.htmlLang}
                aria-current={actual ? "true" : undefined}
                className={`flex min-h-[49px] flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border px-1 py-2 transition-colors ${
                  actual
                    ? "border-lanterna/55 bg-lanterna/10 text-lanterna"
                    : "border-linha bg-breu-raso/70 text-osso-fraco hover:border-linha-forte hover:text-osso"
                }`}
                style={{ fontFamily: "var(--font-maquina)" }}
              >
                <span aria-hidden className="text-[1.35rem] leading-none">
                  {lingua.bandeira}
                </span>
                <span aria-hidden className="text-[0.62rem] tracking-[0.12em]">
                  {lingua.etiqueta}
                </span>
                <span className="sr-only">
                  {actual ? `${lingua.nome} — ${texto.actual}` : lingua.nome}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Só a língua em uso; as outras três abrem por baixo. */
function Menu({
  lang,
  texto,
  className,
}: {
  lang: Locale;
  texto: Texto;
  className: string;
}) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const actual = linguas[lang];
  const outras = locales.filter((codigo) => codigo !== lang);

  /*
    Fecha com Escape e ao apontar para fora. `pointerdown` e não `click`:
    com `click`, o alvo pode já ter saído do DOM quando o evento chega, e
    o `contains` deixava de saber dizer se o clique foi cá dentro.
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
          className="absolute right-0 top-full z-50 mt-1.5 min-w-max overflow-hidden rounded-[var(--radius-card)] border border-linha bg-breu/98 shadow-[0_10px_26px_rgb(0_0_0/0.55)] backdrop-blur-md"
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
