import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { dicionarios, type Dicionario } from "./index";

/*
  A língua da página que está a ser desenhada, sem a passar de props em
  props.

  O `lang` do `next/root-params` é o getter do segmento `[lang]` que está
  **acima** do root layout — qualquer Server Component o pode chamar, por
  mais fundo que esteja na árvore. É por isso que o `Hero`, a `Casa` ou o
  `Footer` não precisam de receber nada: pedem o dicionário e pronto.

  Não funciona em componentes de cliente (`"use client"`) — a `Nav`, o
  `MenuCategoryNav` e o `Mapa` recebem o texto por props de quem os monta.
  Os tipos deste módulo são gerados pelo `next dev`/`next build`; um
  `tsc --noEmit` num repositório acabado de clonar, sem build nenhum
  feito, não os encontra.
*/

export async function linguaActual(): Promise<Locale> {
  const valor = await lang();
  /* Só chega aqui quem pediu /xx com um xx que não é língua nossa. */
  if (!valor || !isLocale(valor)) notFound();
  return valor;
}

export async function dicionario(): Promise<Dicionario> {
  return dicionarios[await linguaActual()];
}

/*
  A mesma coisa, mas para quem não pode falhar: os ecrãs de erro.

  O `linguaActual()` acima resolve o caso mau com `notFound()`, e isso é
  exactamente o que **não** se pode fazer dentro de um `not-found.tsx` —
  seria pedir à página de 404 que renderizasse um 404. E há um segundo
  caso: um erro pode rebentar antes de o segmento `[lang]` estar
  resolvido, e aí o próprio getter atira.

  Daí o recuo ao português em vez de falhar. É a língua da casa, e um 404
  na língua errada continua a ser um 404 legível — um ecrã em branco não.
*/
export async function linguaOuCasa(): Promise<Locale> {
  try {
    const valor = await lang();
    return valor && isLocale(valor) ? valor : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export async function dicionarioOuCasa(): Promise<Dicionario> {
  return dicionarios[await linguaOuCasa()];
}
