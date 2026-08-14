import type { Locale } from "@/lib/i18n";
import { pt, type Dicionario } from "./pt";
import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";

/*
  Os quatro dicionários, indexados pela língua.

  Importados de uma vez e não com `import()` dinâmico, ao contrário do
  exemplo da documentação do Next: as oito páginas são todas geradas no
  build e o texto entra no HTML estático. Não há nada a carregar em
  execução, e um `await` por secção só tornava cada componente assíncrono
  sem ganho nenhum.

  Este ficheiro não toca no `next/root-params` de propósito — quem precisa
  da língua da página usa o `servidor.ts`. Assim continua a poder ser
  importado de qualquer lado.
*/
export const dicionarios: Record<Locale, Dicionario> = { pt, en, fr, es };

export type { Dicionario };

export function dicionarioDe(lang: Locale): Dicionario {
  return dicionarios[lang];
}
