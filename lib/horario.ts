import type { Locale } from "@/lib/i18n";

/*
  O horário da casa.

  ## Porque é que isto deixou de ser texto

  O horário era uma etiqueta escrita à mão — `{ day: "Terça", label: "10h00
  às 23h00" }` — e essa etiqueta era **chave** nos dicionários das outras
  três línguas (`horarios: { "10h00 às 23h00": "10am to 11pm" }`). Funcionava
  bem enquanto o horário só mudava por commit: mexer na hora de fecho sem
  acompanhar as três traduções partia o build, que é exactamente o que se
  quer de uma rede de segurança.

  Com o painel deixa de servir. O dono muda o fecho de domingo das 20h para
  as 21h e o site fica sem tradução nenhuma para a etiqueta nova — em três
  línguas, e com o build abaixo. Por isso o horário passou a horas a sério
  (`abre`, `fecha`) e a etiqueta passou a ser calculada.

  ## O que cada língua escreve

  | | aberto | fechado |
  |---|---|---|
  | pt | `10h00 às 23h00` | tratado por quem desenha, com `dic.encontrar.folga` |
  | en | `10am to 11pm` | idem |
  | fr | `10h00 à 23h00` | idem |
  | es | `10:00 a 23:00` | idem |

  São as formas que estavam escritas nos dicionários antes desta mudança,
  reproduzidas tal e qual. O dia fechado não aparece aqui de propósito: o
  `components/Encontrar.tsx` nunca desenhou a etiqueta "Encerrado" — escreve
  "Segunda — Folga" no próprio dia e deixa a coluna da direita vazia.
*/

export const dias = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
] as const;

export type Dia = (typeof dias)[number];

export type EntradaDeHorario =
  | { dia: Dia; fechado: true; abre?: undefined; fecha?: undefined }
  | { dia: Dia; fechado?: false; abre: string; fecha: string };

/* "10:00" → { horas: 10, minutos: 0 } */
function partir(hora: string): { horas: number; minutos: number } {
  const [horas, minutos] = hora.split(":");
  return { horas: Number(horas), minutos: Number(minutos) };
}

/* 10, 0 → "10h00" · 23, 30 → "23h30" */
function relogioDeCa(hora: string): string {
  const { horas, minutos } = partir(hora);
  return `${horas}h${String(minutos).padStart(2, "0")}`;
}

/*
  10, 0 → "10am" · 23, 0 → "11pm" · 10, 30 → "10:30am"

  Sem os minutos quando são zero, que é como se escreve em inglês e é o que
  estava no dicionário. Meia-noite é "12am" e meio-dia "12pm" — o `% 12` dá
  zero nos dois e o `|| 12` corrige.
*/
function relogioDeLa(hora: string): string {
  const { horas, minutos } = partir(hora);
  const periodo = horas < 12 ? "am" : "pm";
  const doze = horas % 12 || 12;
  return minutos === 0
    ? `${doze}${periodo}`
    : `${doze}:${String(minutos).padStart(2, "0")}${periodo}`;
}

/** A etiqueta de um dia aberto, na língua pedida. `null` se estiver fechado. */
export function horasEm(entrada: EntradaDeHorario, lang: Locale): string | null {
  if (entrada.fechado) return null;
  const { abre, fecha } = entrada;

  switch (lang) {
    case "pt":
      return `${relogioDeCa(abre)} às ${relogioDeCa(fecha)}`;
    case "fr":
      return `${relogioDeCa(abre)} à ${relogioDeCa(fecha)}`;
    case "en":
      return `${relogioDeLa(abre)} to ${relogioDeLa(fecha)}`;
    case "es":
      return `${abre} a ${fecha}`;
  }
}

/*
  Os dias como o schema.org os escreve, para o JSON-LD.

  A ordem deste objecto não interessa; a ordem que conta é a do
  `data/casa.json`, que é a que o `especificacaoDeHorario` percorre.
*/
const emSchemaOrg: Record<Dia, string> = {
  segunda: "Monday",
  terca: "Tuesday",
  quarta: "Wednesday",
  quinta: "Thursday",
  sexta: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
};

export type FaixaDeHorario = {
  days: readonly string[];
  opens: string;
  closes: string;
};

/*
  O horário no formato que o `openingHoursSpecification` do JSON-LD pede.

  Era uma segunda cópia escrita à mão ao lado da primeira, com o risco óbvio
  de as duas divergirem — e com o painel esse risco passava a certeza, porque
  quem edita o horário no ecrã não faz ideia de que existe um segundo sítio.
  Agora sai do mesmo sítio que a tabela que se vê na página.

  Dias seguidos com as mesmas horas juntam-se numa faixa só, que é como o
  schema.org gosta e como estava escrito à mão: terça a sábado numa linha,
  domingo noutra, segunda de fora por estar fechada.
*/
export function especificacaoDeHorario(
  horario: readonly EntradaDeHorario[],
): FaixaDeHorario[] {
  const faixas: FaixaDeHorario[] = [];

  for (const entrada of horario) {
    if (entrada.fechado) continue;

    const ultima = faixas.at(-1);
    if (ultima?.opens === entrada.abre && ultima.closes === entrada.fecha) {
      (ultima.days as string[]).push(emSchemaOrg[entrada.dia]);
      continue;
    }

    faixas.push({
      days: [emSchemaOrg[entrada.dia]],
      opens: entrada.abre,
      closes: entrada.fecha,
    });
  }

  return faixas;
}
