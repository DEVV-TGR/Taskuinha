import { locales, defaultLocale } from "@/lib/i18n";
import { dias } from "@/lib/horario";
import { menu, destaques } from "@/lib/menu";
import type { Texto } from "@/lib/texto";
import type { CategoriaDeDados, PratoDeDados } from "@/lib/menu";

/*
  O porteiro dos dados, antes de eles irem para o repositório.

  ## Porque é que isto existe

  Enquanto a ementa era código, o `as const satisfies` do `lib/menu.ts` fazia o
  trabalho: um prato mal formado não compilava. Com os dados em JSON, e um
  painel a escrevê-los, essa rede desapareceu — e o que a substitui é isto,
  mais o `next build`, que continua a correr sobre o ficheiro já gravado.

  As duas redes apanham coisas diferentes e são as duas precisas. Esta corre
  **antes** do commit e recusa; o build corre depois e, se alguma coisa lhe
  escapar na mesma, a Vercel mantém o deploy anterior no ar — o site não cai,
  perde-se a alteração.

  ## O que não se valida aqui

  Que o preço está certo. Isso não é trabalho de código: se o dono escrever
  1,80 € numa francesinha, o painel grava 1,80 €. O que se valida é que é um
  número, que é positivo, e que tem no máximo dois algarismos depois da
  vírgula — porque `13.456 €` não é um preço, é um erro de digitação.
*/

export type Problema = string;

/*
  As categorias são as nove que existem e mais nenhuma.

  Criar categorias não faz parte do que o painel faz — escolhem-se de entre as
  que a casa tem. Esta lista sai do próprio `data/ementa.json` em vez de estar
  escrita à mão, para não haver dois sítios a discordar.
*/
export const idsDeCategoria = menu.map((c) => c.id);

/*
  O identificador de um prato, tirado do nome.

  Mesma regra que a migração usou, e tem de continuar a ser: `NFD` mais a
  classe `\p{M}` separam a letra do acento e deitam fora o acento — "Amêijoa"
  fica "ameijoa", e não "amijoa" nem "am-ijoa".

  O id nasce do nome e depois deixa de depender dele. É o que os destaques da
  página inicial apontam.
*/
export function identificador(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Um id que ainda não está em uso, com sufixo numérico se for preciso. */
export function identificadorLivre(nome: string, ocupados: Set<string>): string {
  const base = identificador(nome) || "prato";
  if (!ocupados.has(base)) return base;

  for (let n = 2; ; n++) {
    const tentativa = `${base}-${n}`;
    if (!ocupados.has(tentativa)) return tentativa;
  }
}

function eTexto(valor: unknown): valor is Texto {
  if (typeof valor !== "object" || valor === null) return false;
  const registo = valor as Record<string, unknown>;

  if (typeof registo[defaultLocale] !== "string" || registo[defaultLocale] === "") {
    return false;
  }
  return locales.every(
    (l) => registo[l] === undefined || typeof registo[l] === "string",
  );
}

/*
  Duas casas decimais, no máximo.

  `Math.round(p * 100) !== p * 100` seria o teste óbvio e está errado: em vírgula
  flutuante, `16.9 * 100` dá 1689.9999999999998 e um preço legítimo era recusado.
  Comparar com a representação decimal do próprio número evita a aritmética.
*/
function precoValido(preco: unknown): preco is number {
  if (typeof preco !== "number" || !Number.isFinite(preco) || preco <= 0) {
    return false;
  }
  return preco === Number(preco.toFixed(2));
}

function validarPrato(
  prato: unknown,
  onde: string,
  vistos: Set<string>,
  problemas: Problema[],
): void {
  if (typeof prato !== "object" || prato === null) {
    problemas.push(`${onde}: não é um prato.`);
    return;
  }

  const { id, nome, preco, descricao, nota } = prato as Record<string, unknown>;

  if (typeof id !== "string" || !/^[a-z0-9-]+$/.test(id)) {
    problemas.push(`${onde}: identificador inválido (${JSON.stringify(id)}).`);
  } else if (vistos.has(id)) {
    problemas.push(`${onde}: já existe um prato com o identificador "${id}".`);
  } else {
    vistos.add(id);
  }

  if (typeof nome !== "string" || nome.trim() === "") {
    problemas.push(`${onde}: um prato tem de ter nome.`);
  }

  if (!precoValido(preco)) {
    problemas.push(
      `${onde}: o preço tem de ser um número positivo com duas casas decimais, no máximo.`,
    );
  }

  if (descricao !== undefined && !eTexto(descricao)) {
    problemas.push(`${onde}: a descrição tem de ter, pelo menos, português.`);
  }
  if (nota !== undefined && !eTexto(nota)) {
    problemas.push(`${onde}: a nota tem de ter, pelo menos, português.`);
  }
}

/** Os problemas do `data/ementa.json`. Lista vazia quer dizer que está bom. */
export function validarEmenta(dados: unknown): Problema[] {
  const problemas: Problema[] = [];

  if (typeof dados !== "object" || dados === null) {
    return ["A ementa não é um objecto."];
  }

  const { categorias } = dados as Record<string, unknown>;
  if (!Array.isArray(categorias) || categorias.length === 0) {
    return ["A ementa não tem categorias."];
  }

  const vistos = new Set<string>();
  const categoriasVistas = new Set<string>();

  for (const categoria of categorias) {
    if (typeof categoria !== "object" || categoria === null) {
      problemas.push("Uma das categorias não é um objecto.");
      continue;
    }

    const { id, titulo, intro, pratos } = categoria as Record<string, unknown>;
    const onde = typeof id === "string" ? `Em "${id}"` : "Numa categoria sem id";

    if (typeof id !== "string" || !idsDeCategoria.includes(id as never)) {
      problemas.push(
        `${onde}: categoria desconhecida. As categorias são ${idsDeCategoria.join(", ")}.`,
      );
    } else if (categoriasVistas.has(id)) {
      problemas.push(`A categoria "${id}" aparece duas vezes.`);
    } else {
      categoriasVistas.add(id);
    }

    if (!eTexto(titulo)) problemas.push(`${onde}: falta o título em português.`);
    if (!eTexto(intro)) problemas.push(`${onde}: falta a introdução em português.`);

    if (!Array.isArray(pratos)) {
      problemas.push(`${onde}: não tem lista de pratos.`);
      continue;
    }
    for (const prato of pratos) validarPrato(prato, onde, vistos, problemas);
  }

  /*
    A verificação que impede o painel de partir a página inicial.

    Os seis destaques apontam para pratos por identificador, e o `lib/menu.ts`
    atira no build se um deles ficar pendurado. Apanhá-lo aqui, antes do
    commit, é a diferença entre uma mensagem que diz o que fazer e um deploy
    falhado que ninguém percebe.
  */
  for (const destaque of destaques) {
    if (!vistos.has(destaque.pratoId)) {
      problemas.push(
        `"${destaque.nome}" é um dos seis destaques da página inicial e não ` +
          `pode ser apagado. Tira-o dos destaques primeiro — isso faz-se no ` +
          `código, em lib/menu.ts.`,
      );
    }
  }

  return problemas;
}

/** Os problemas do `data/casa.json`. */
export function validarCasa(dados: unknown): Problema[] {
  const problemas: Problema[] = [];

  if (typeof dados !== "object" || dados === null) return ["A casa não é um objecto."];
  const { telefone, morada, horario, links } = dados as Record<string, unknown>;

  const tel = telefone as Record<string, unknown> | undefined;
  if (typeof tel?.mostrar !== "string" || tel.mostrar.trim() === "") {
    problemas.push("O telefone que se mostra não pode ficar vazio.");
  }
  /* O `tel:` é o que o botão de telefone marca. Um espaço a mais e não liga. */
  if (typeof tel?.tel !== "string" || !/^\+?[0-9]{6,15}$/.test(tel.tel)) {
    problemas.push(
      "O número para marcar tem de ser só algarismos, com indicativo — +351229285079.",
    );
  }

  const mor = morada as Record<string, unknown> | undefined;
  for (const campo of ["rua", "codigoPostal", "localidade", "concelho"]) {
    if (typeof mor?.[campo] !== "string" || (mor[campo] as string).trim() === "") {
      problemas.push(`A morada tem de ter ${campo}.`);
    }
  }

  if (!Array.isArray(horario) || horario.length !== dias.length) {
    problemas.push("O horário tem de ter os sete dias.");
  } else {
    for (const [i, entrada] of horario.entries()) {
      const e = entrada as Record<string, unknown>;
      if (e?.dia !== dias[i]) {
        problemas.push(`O horário tem de vir por ordem, de segunda a domingo.`);
        break;
      }
      if (e.fechado === true) continue;
      for (const campo of ["abre", "fecha"] as const) {
        if (typeof e[campo] !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(e[campo])) {
          problemas.push(`${dias[i]}: as horas escrevem-se como 10:00 ou 23:30.`);
        }
      }
    }
  }

  const lig = links as Record<string, unknown> | undefined;
  for (const campo of ["instagram", "facebook", "tripadvisor", "restaurantGuru"]) {
    const valor = lig?.[campo];
    if (typeof valor !== "string" || !valor.startsWith("https://")) {
      problemas.push(`A ligação do ${campo} tem de começar por https://`);
    }
  }

  return problemas;
}

/*
  Reexportados para os ecrãs não terem de importar de dois sítios — a forma dos
  dados é do `lib/menu.ts`, quem os valida é este ficheiro, e quem os edita não
  precisa de saber dessa divisão.
*/
export type { CategoriaDeDados, PratoDeDados };
