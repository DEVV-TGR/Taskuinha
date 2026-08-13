"use client";

import { usePathname } from "next/navigation";
import { locales, linguas, trocarLingua, type Locale } from "@/lib/i18n";

/*
  As quatro línguas, sempre as quatro à vista.

  Não é um menu que abre: são quatro ligações lado a lado. Com quatro
  opções, uma gaveta é mais cliques e mais código para esconder o que cabe
  na barra — e esconde justamente a informação de que há outras línguas, que
  é o que quem chega precisa de ver primeiro.

  Cada uma aponta para **esta mesma página** na outra língua, não para a
  inicial: quem está a meio da ementa em português e carrega em FR fica na
  ementa em francês. É o que o `trocarLingua` faz, com o `usePathname` a
  dizer onde se está. Em `/` o pathname é `/` — o rewrite do
  `next.config.ts` não muda o endereço que o browser conhece.

  ## O que se lê e o que se ouve

  Vê-se a bandeira e as duas letras. Ouve-se só o nome da língua, na
  própria língua: a bandeira e a etiqueta levam `aria-hidden` e o nome vai
  em `sr-only`, senão um leitor de ecrã anunciava "PT Português" e, com
  algumas vozes, também o nome do país da bandeira.

  O `lang` de cada ligação é o da língua de destino — é o que faz o leitor
  de ecrã dizer "Français" com sotaque francês em vez de o soletrar à
  portuguesa.
*/
export function SelectorLingua({
  lang,
  texto,
  className = "",
}: {
  lang: Locale;
  texto: { escolher: string; actual: string };
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={texto.escolher} className={className}>
      <ul className="flex items-center gap-0.5">
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
                className={`flex items-center gap-1 rounded-[var(--radius-card)] px-1.5 py-1 text-[0.7rem] tracking-[0.08em] transition-colors ${
                  actual
                    ? "text-lanterna"
                    : "text-osso-fraco hover:text-osso"
                }`}
                style={{ fontFamily: "var(--font-maquina)" }}
              >
                <span aria-hidden className="text-[0.95rem] leading-none">
                  {lingua.bandeira}
                </span>
                <span aria-hidden>{lingua.etiqueta}</span>
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
