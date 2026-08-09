/*
  Gera docs/FOLHA-DE-REUNIAO.md — a folha para levar à mesa com o Anselmo.

    node --experimental-strip-types ferramentas/folha-de-reuniao.mjs

  (A flag é para o Node conseguir importar o `lib/menu.ts` directamente.
  Testado no Node 22.)

  Porque é que é gerado e não escrito à mão: uma folha de preços copiada à
  mão fica desactualizada na primeira vez que alguém acrescenta um prato, e
  é impossível saber que ficou. Assim é sempre o que o site diz hoje.

  Correr outra vez depois de mexer na ementa.
*/

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { menu, formatPrice, PRECOS_SAO_DEMO } from "../lib/menu.ts";
import { site, fullAddress } from "../lib/site.ts";

const SAIDA = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "docs",
  "FOLHA-DE-REUNIAO.md",
);

/* Pratos com o mesmo nome em categorias diferentes. Não é erro — "Lulas
   grelhadas" é petisco numa e prato noutra — mas é exactamente o tipo de
   coisa que se confunde a preencher preços à pressa. Marca-se. */
const contagem = new Map();
for (const c of menu) {
  for (const d of c.dishes) contagem.set(d.name, (contagem.get(d.name) ?? 0) + 1);
}
const repetidos = [...contagem].filter(([, n]) => n > 1).map(([nome]) => nome);

const linhas = [];

linhas.push("# Folha de reunião — Taskuinha");
linhas.push("");
linhas.push(
  "> Gerado por `ferramentas/folha-de-reuniao.mjs` a partir do código. " +
    "Não editar à mão — mexe-se no `lib/menu.ts` e no `lib/site.ts` e " +
    "corre-se outra vez.",
);
linhas.push("");
linhas.push(
  "Leva isto impresso ou no telemóvel. A coluna **Actual** é o que o site " +
    "mostra hoje; a coluna **Real** é para preencher.",
);
linhas.push("");

if (PRECOS_SAO_DEMO) {
  linhas.push(
    "⚠️ **Os preços actuais são inventados.** Foram calibrados para o " +
      "intervalo de 10–20 € por pessoa que as avaliações indicam. Nenhum " +
      "veio da casa. Quando estiverem todos confirmados, pôr " +
      "`PRECOS_SAO_DEMO = false` em `lib/menu.ts` — é isso que faz " +
      "desaparecer o aviso do rodapé e do fim da ementa.",
  );
  linhas.push("");
}

linhas.push("---");
linhas.push("");
linhas.push("## Preços");
linhas.push("");

if (repetidos.length > 0) {
  linhas.push(
    `> Atenção aos repetidos: **${repetidos.join("**, **")}** aparece em mais ` +
      "do que uma categoria, com preços diferentes de propósito. Confirmar " +
      "os dois, não assumir que é o mesmo.",
  );
  linhas.push("");
}

for (const categoria of menu) {
  linhas.push(`### ${categoria.title}`);
  linhas.push("");
  linhas.push("| Prato | Actual | Real | Existe? |");
  linhas.push("|---|---|---|---|");
  for (const prato of categoria.dishes) {
    const marca = repetidos.includes(prato.name) ? " ⚠️" : "";
    linhas.push(`| ${prato.name}${marca} | ${formatPrice(prato.price)} | | |`);
  }
  linhas.push("");
}

linhas.push("**Falta algum prato que a casa serve e não está aqui?**");
linhas.push("");
linhas.push("&nbsp;");
linhas.push("");
linhas.push("---");
linhas.push("");
linhas.push("## Contactos e horário");
linhas.push("");
linhas.push(
  "Tudo isto veio de agregadores públicos (Restaurantji, Restaurant Guru, " +
    "GastroRanking) em Agosto de 2026. **Nunca foi confirmado com a casa.** " +
    "Mexe-se em `lib/site.ts`.",
);
linhas.push("");
linhas.push("| Campo | Actual | Certo? |");
linhas.push("|---|---|---|");
linhas.push(`| Morada | ${fullAddress()} | |`);
linhas.push(`| Telefone | ${site.phone.display} | |`);
for (const h of site.hours) {
  linhas.push(`| ${h.day} | ${h.label} | |`);
}
linhas.push("");
linhas.push(
  "A morada e o horário também vão para o JSON-LD que o Google lê " +
    "(`app/layout.tsx`) e para o `openingHoursSpec` — se o horário mudar, " +
    "mudam os dois sítios do `lib/site.ts`.",
);
linhas.push("");
linhas.push("---");
linhas.push("");
linhas.push("## Outras perguntas");
linhas.push("");
linhas.push(
  "- [ ] **Domínio.** O site está a assumir `" +
    site.url +
    "`. É esse? O JSON-LD, o sitemap e os cartões de partilha do WhatsApp " +
    "dependem disto.",
);
linhas.push(
  "- [ ] **As citações** em `lib/reviews.ts` foram lidas através de " +
    "agregadores. A atribuição a cada plataforma pode não estar certa.",
);
linhas.push(
  "- [ ] **Material próprio** — fotos da abertura, do dia a dia, vídeos. " +
    "Ninguém tem mais essência do lugar do que o dono.",
);
linhas.push(
  "- [ ] **Os barris da fachada**, fotografados um a um, de frente, luz do " +
    "dia. É a última fotografia que falta (ver `public/images/README.md`).",
);
linhas.push("");

writeFileSync(SAIDA, linhas.join("\n"));
console.log(`escrito ${SAIDA}`);
