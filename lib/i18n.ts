/*
  As quatro línguas da casa.

  A Taskuinha está em frente à praia, com o Caminho de Santiago à porta —
  metade de quem entra em Agosto não fala português. Português, inglês,
  francês e espanhol foram as quatro que o Gonçalo pediu.

  ## Onde vive a língua

  No endereço, e só lá. Não há cookie, não há `localStorage`, não há
  detecção pelo `Accept-Language`: a página em francês é `/fr`, e é isso
  que se envia a um amigo. O português é a língua da casa e não leva
  prefixo nenhum — `taskuinha.pt/` e `taskuinha.pt/ementa`.

  Quem faz essa excepção acontecer é o `next.config.ts`: as páginas são
  todas geradas debaixo de `app/[lang]/`, incluindo as portuguesas em
  `/pt`, e um *rewrite* serve `/pt` a quem pede `/`. O endereço `/pt` em
  si existe, mas é redireccionado para `/` para não haver duas moradas
  para a mesma página.

  Este ficheiro não importa `server-only`: é dos poucos que corre nos dois
  lados. O selector de língua é um componente de cliente e precisa do
  `trocarLingua`.
*/

export const locales = ["pt", "en", "fr", "es"] as const;

export type Locale = (typeof locales)[number];

/** A língua da casa. É a única sem prefixo no endereço. */
export const defaultLocale: Locale = "pt";

export function isLocale(valor: string): valor is Locale {
  return (locales as readonly string[]).includes(valor);
}

/*
  Como cada língua se apresenta no selector.

  `nome` é o nome da língua **na própria língua** — quem procura o
  francês procura "Français", não "Francês". `etiqueta` são as duas
  letras que aparecem ao lado da bandeira, e `bandeira` é o emoji do país
  que representa a língua: o inglês leva o do Reino Unido, que é o que a
  sinalética europeia usa.

  Emoji e não SVG, pela mesma razão que está escrita no
  `components/decor/Bandeirinhas.tsx` — que já pendura dez bandeiras assim
  sobre o balcão. Não há ficheiros de bandeira no projecto e não vale a
  pena passar a haver por causa de quatro glifos. A `etiqueta` fica sempre
  visível ao lado, e não só como alternativa: em Windows o emoji de
  bandeira não desenha bandeira nenhuma, desenha as duas letras do país.
  Quem estiver nesse caso lê "PT", que é exactamente o que precisa.

  `ogLocale` é o formato que o Open Graph pede, com underscore e região.
*/
export const linguas: Record<
  Locale,
  { nome: string; etiqueta: string; bandeira: string; htmlLang: string; ogLocale: string }
> = {
  pt: { nome: "Português", etiqueta: "PT", bandeira: "🇵🇹", htmlLang: "pt-PT", ogLocale: "pt_PT" },
  en: { nome: "English", etiqueta: "EN", bandeira: "🇬🇧", htmlLang: "en", ogLocale: "en_GB" },
  fr: { nome: "Français", etiqueta: "FR", bandeira: "🇫🇷", htmlLang: "fr", ogLocale: "fr_FR" },
  es: { nome: "Español", etiqueta: "ES", bandeira: "🇪🇸", htmlLang: "es", ogLocale: "es_ES" },
};

/*
  O endereço de uma página numa dada língua.

  `caminho("pt", "/ementa")` → `/ementa`
  `caminho("en", "/ementa")` → `/en/ementa`
  `caminho("fr", "/")`       → `/fr`

  A raiz em português é `/` e não `""` — um href vazio recarrega a página
  actual com o fragmento intacto, que não é a mesma coisa.
*/
export function caminho(lang: Locale, rota: string): string {
  const limpa = rota === "/" ? "" : rota.startsWith("/") ? rota : `/${rota}`;
  if (lang === defaultLocale) return limpa === "" ? "/" : limpa;
  return `/${lang}${limpa}`;
}

/*
  A rota "nua" de um caminho de browser, sem o prefixo de língua:
  `/fr/ementa` → `/ementa`, `/en` → `/`, `/ementa` → `/ementa`.
*/
export function rotaNua(pathname: string): string {
  const partes = pathname.split("/").filter(Boolean);
  if (partes.length > 0 && isLocale(partes[0])) partes.shift();
  return partes.length === 0 ? "/" : `/${partes.join("/")}`;
}

/** A página em que se está, na outra língua. É o que o selector precisa. */
export function trocarLingua(pathname: string, para: Locale): string {
  return caminho(para, rotaNua(pathname));
}

/*
  As quatro moradas da mesma página, para o `alternates.languages` da
  metadata e para o `sitemap.ts`.

  O `x-default` aponta ao português. É a língua da casa e é a morada sem
  prefixo, que é a que se quer indexada quando o motor de busca não
  consegue decidir a língua de quem procura.
*/
export function alternativas(rota: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.map((lang) => [linguas[lang].htmlLang, caminho(lang, rota)]),
    ),
    "x-default": caminho(defaultLocale, rota),
  };
}
