import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontes } from "../fontes";
import "../globals.css";

/*
  O painel da casa — o segundo documento HTML deste projecto.

  ## Porque é que este ficheiro tem `<html>` e `<body>`

  Porque é um root layout, e não por acidente. Não existe `app/layout.tsx`
  neste projecto: o root layout do site vive debaixo de um segmento dinâmico
  (`app/[lang]/layout.tsx`), e qualquer layout sem outro por cima é raiz. Os
  docs do Next 16 chamam-lhe *multiple root layouts* e suportam-no.

  O `app/not-found.tsx` já usa este mesmo padrão pela mesma razão estrutural, e
  foi de lá que saíram as quatro linhas que interessam — as fontes partilhadas,
  o `globals.css`, a `className` do `<html>` e o `theme-color`. Sem elas o
  painel abria sem fontes e sem uma única cor da casa.

  Efeito colateral: navegar entre o site e o painel faz recarregamento completo
  em vez de navegação do lado do cliente. É o que se quer — são duas coisas
  diferentes, e ninguém passa de uma para a outra a meio de uma tarefa.

  ## Está em português, e só

  As oito páginas públicas falam quatro línguas porque metade de quem entra em
  Agosto não fala português. O painel é para quem trabalha na casa.

  ## Este layout NÃO verifica a sessão

  E é deliberado. Um layout não volta a renderizar em navegação do lado do
  cliente e não impede um segmento filho de correr — os docs do Next dizem-no
  com todas as letras em "Layouts and auth checks". Um `exigirSessao()` aqui
  dava a sensação de proteger tudo o que está por baixo sem proteger nada.

  Quem protege é o `exigirSessao()` do `lib/painel/porta.ts`, chamado dentro de
  **cada** `page.tsx` e à cabeça de **cada** server action.
*/

export const metadata: Metadata = {
  title: "Painel · Taskuinha",
  /*
    Uma de três camadas, e a mais fraca. As outras duas são o `disallow` do
    `app/robots.ts` e o `X-Robots-Tag` do `next.config.ts` — este último é o
    único que vale em respostas que não são HTML.
  */
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutDoPainel({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${fontes} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#080B0D" />
      </head>
      <body className="flex min-h-full flex-col bg-breu text-osso">
        {children}
      </body>
    </html>
  );
}
