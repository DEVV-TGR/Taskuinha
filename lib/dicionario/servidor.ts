import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
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
