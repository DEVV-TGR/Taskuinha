import type { Locale } from "@/lib/i18n";

/*
  Uma frase nas quatro línguas, com o português obrigatório.

  É a forma de tudo o que é texto dentro do `data/ementa.json`: o título de
  uma categoria, a introdução, a descrição de um prato, a nota de um vinho.

  ## Porque é que só o português é obrigatório

  Porque é a língua da casa e é a única que existe sempre. As outras três
  são opcionais, e a ausência de uma quer dizer "igual ao português" — não
  "em falta". Isso serve dois casos que são, na prática, o mesmo:

  - **A nota que não se traduz.** "Douro" é "Douro" nas quatro línguas.
    Escrevê-la quatro vezes enchia o ficheiro de ruído e obrigava quem
    edita no painel a copiar a mesma palavra três vezes por vinho.
  - **O prato acabado de criar.** Alguém acrescenta uma sardinha assada às
    onze da manhã e não fala francês. O prato entra nas quatro línguas com
    o texto português, e a tradução chega quando chegar.

  O segundo caso é a diferença mais visível face ao que havia antes: com a
  ementa em código, um prato novo com descrição **partia o build** até estar
  traduzido nas três línguas. Era uma boa rede enquanto os pratos entravam
  por commit; com um painel, seria o dono da casa a ver o site abaixo por
  não saber dizer "pataniscas" em espanhol.
*/
/*
  O `Omit<…, "pt">` no segundo membro não é decorativo: sem ele, o `pt`
  aparecia obrigatório de um lado e opcional do outro, e `texto.pt` passava a
  `string | undefined` — o recuo ficava a recuar para uma coisa que o
  TypeScript não garante existir.

  O `"pt"` está aqui em literal e não como `typeof defaultLocale`: o
  `lib/i18n.ts` anota o `defaultLocale` como `Locale` e não como `"pt"`,
  portanto o TypeScript alarga-o e o `Omit` comeria as quatro línguas. Este
  ficheiro é, por isso, o único do projecto que sabe qual é a língua da casa
  sem perguntar ao `lib/i18n.ts` — em duas linhas, aqui e no `em()` logo
  abaixo. Se a língua da casa mudar, mudam as duas.
*/
export type Texto = { pt: string } & Partial<Omit<Record<Locale, string>, "pt">>;

/** A frase na língua pedida, ou o português se essa língua não disser nada. */
export function em(texto: Texto, lang: Locale): string {
  return texto[lang] || texto.pt;
}

/** O mesmo, para os campos que podem não existir de todo. */
export function emOuNada(
  texto: Texto | undefined,
  lang: Locale,
): string | undefined {
  return texto ? em(texto, lang) : undefined;
}
