import {
  Rye,
  Alegreya_Sans,
  Special_Elite,
  IM_Fell_English_SC,
} from "next/font/google";

/*
  As quatro fontes, num sítio só.

  Estiveram sempre dentro do `[lang]/layout.tsx`, e chegava — havia um
  documento HTML e era ele. Mudou quando apareceu o `app/not-found.tsx`:
  esse renderiza o seu próprio `<html>` **por fora** do root layout (é a
  única forma de apanhar um endereço que não casa com rota nenhuma), e
  precisa das mesmas fontes. Declaradas duas vezes seriam duas
  configurações a divergir com o tempo; declaradas aqui são uma.

  O `next/font` descarrega os ficheiros no build e serve-os da nossa
  origem. Não há pedido à Google em execução — é por isso que o
  `font-src 'self'` do `next.config.ts` chega.
*/

/*
  Títulos e wordmark. Wood-type de tabuleta de doca. Só tem peso 400.
  É a única fonte com `preload`: aparece no hero e é o maior candidato a LCP.
*/
const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/*
  Corpo. Humanista, boa em pt-PT, tem acentuação completa.
  `preload: false` — o `next/font` faz preload por omissão em todas as
  fontes; o comentário da Rye já dizia "só ela leva preload" mas isso nunca
  tinha sido desligado nas outras três. Verificado com Lighthouse: quatro
  fontes a competir pela mesma ligação no arranque empurra o LCP para bem
  longe dos 2,5s do plano.
*/
const alegreya = Alegreya_Sans({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

/* Preços, horas e números fora do pergaminho. Máquina de escrever gasta. */
const elite = Special_Elite({
  variable: "--font-elite",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/* Só dentro do pergaminho da ementa. Prensa inglesa do séc. XVII. */
const imfell = IM_Fell_English_SC({
  variable: "--font-imfell",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/** As quatro variáveis CSS, para a `className` do `<html>`. */
export const fontes = `${rye.variable} ${alegreya.variable} ${elite.variable} ${imfell.variable}`;
