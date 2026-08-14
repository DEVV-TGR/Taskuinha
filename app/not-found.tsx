import type { Metadata } from "next";
import { fontes } from "./fontes";
import { Nav } from "@/components/Nav";
import { Cta } from "@/components/Cta";
import { PainelDeErro } from "@/components/PainelDeErro";
import { caminho, defaultLocale, linguas } from "@/lib/i18n";
import { dicionarioDe } from "@/lib/dicionario";
import "./globals.css";

/*
  O 404 de quem bate numa morada que não existe de todo.

  ## Porque é que este ficheiro tem `<html>` e `<body>`

  Porque corre **por fora** do root layout. O root layout deste site está
  debaixo de um segmento dinâmico de topo (`app/[lang]/layout.tsx`), e com
  `dynamicParams = false` um pedido a `/xyz` é recusado no encaminhamento,
  antes de esse layout sequer ser considerado. Verificado a sério, com
  build de produção: com só o `app/[lang]/not-found.tsx`, o `/xyz`
  continuava a servir o ecrã inglês de fábrica do Next. Este ficheiro é o
  que o substitui, e por isso monta o documento todo — fontes e
  `globals.css` incluídos.

  ## Porque é que está em português

  Porque não há língua nenhuma para ler. O endereço não casou com rota
  nenhuma, e a língua deste site vive no endereço e mais lado nenhum (ver
  `lib/i18n.ts`). Sobra a língua da casa — a mesma escolha que o
  `x-default` do sitemap já faz pela mesma razão. A `Nav` vai junto com o
  selector das quatro, por isso quem chegou aqui em francês tem a saída à
  mão.

  ## O irmão deste ficheiro

  O `app/[lang]/not-found.tsx` continua a existir e não é redundante: esse
  apanha um `notFound()` atirado de dentro de uma página que já resolveu a
  língua, e desenha o 404 **na língua da pessoa**, dentro do layout, com a
  tralha e tudo. Este só entra quando não há língua nenhuma para saber.
*/

const dic = dicionarioDe(defaultLocale);

export const metadata: Metadata = {
  title: dic.erro.perdido.titulo,
  /* Um 404 não se indexa. */
  robots: { index: false, follow: false },
};

export default function NaoEncontradoGlobal() {
  return (
    <html
      lang={linguas[defaultLocale].htmlLang}
      className={`${fontes} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#080B0D" />
      </head>
      <body className="flex min-h-full flex-col bg-breu text-osso">
        <Nav
          lang={defaultLocale}
          texto={{ nav: dic.nav, geral: dic.geral, linguas: dic.linguas }}
        />

        <PainelDeErro
          codigo={dic.erro.perdido.codigo}
          titulo={dic.erro.perdido.titulo}
          frase={dic.erro.perdido.frase}
        >
          <Cta href={caminho(defaultLocale, "/")}>
            {dic.erro.perdido.voltar}
          </Cta>
          <Cta href={caminho(defaultLocale, "/ementa")} variant="secondary">
            {dic.geral.verEmenta}
          </Cta>
        </PainelDeErro>
      </body>
    </html>
  );
}
