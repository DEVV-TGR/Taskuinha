/*
  Ensina o Node a resolver o alias `@/` do projecto.

  O `tsconfig.json` mapeia `@/*` para a raiz, mas isso é do TypeScript e do
  bundler do Next — o Node não sabe nada disso, e qualquer ferramenta em
  `ferramentas/` que importe um ficheiro de `lib/` esbarra nele.

  A alternativa era trocar `@/lib/images` por `./images` dentro do `lib/`.
  Preferi dez linhas aqui a mudar a convenção do código por causa de uma
  ferramenta de bancada.

  Uso: `node --experimental-strip-types --import ./ferramentas/registar.mjs ...`
*/

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/* O TypeScript importa sem extensão (`@/lib/images`); o Node exige-a.
   Testa as duas que este projecto usa, por esta ordem. */
const EXTENSOES = [".ts", ".tsx"];

export function resolve(especificador, contexto, seguinte) {
  if (!especificador.startsWith("@/")) {
    return seguinte(especificador, contexto);
  }

  const caminho = join(RAIZ, especificador.slice(2));
  const comExtensao = existsSync(caminho)
    ? caminho
    : (EXTENSOES.map((e) => caminho + e).find(existsSync) ?? caminho);

  return seguinte(pathToFileURL(comExtensao).href, contexto);
}
