"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Cta, CtaBotao } from "@/components/Cta";
import { PainelDeErro } from "@/components/PainelDeErro";
import { caminho, defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { dicionarioDe } from "@/lib/dicionario";

/*
  O ecrã de avaria.

  ## O que este ficheiro não mostra, e não é por esquecimento

  Nem `error.message`, nem `error.stack`, nem o nome do ficheiro onde
  rebentou. Em produção o Next já substitui a mensagem por um texto
  genérico antes de ela chegar ao browser, mas em desenvolvimento não —
  e um ecrã que mostra o que apanha é um ecrã que um dia mostra um caminho
  de servidor a um cliente. O único identificador que sai daqui é o
  `digest`, que é um hash opaco feito pelo Next exactamente para se poder
  cruzar o que a pessoa viu com a entrada nos registos da Vercel. Não tem
  conteúdo nenhum lá dentro.

  ## A língua, sem `next/root-params`

  Isto é um componente de cliente e os getters de root params não chegam
  cá. Mas a língua vive no endereço e mais lado nenhum (ver `lib/i18n.ts`),
  por isso lê-se do `usePathname` — o primeiro segmento, se for uma das
  quatro. O caminho nu, sem prefixo, é português por definição.
*/
function linguaDoCaminho(pathname: string): Locale {
  const primeiro = pathname.split("/").filter(Boolean)[0];
  return primeiro && isLocale(primeiro) ? primeiro : defaultLocale;
}

export default function Avaria({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = linguaDoCaminho(usePathname());
  const dic = dicionarioDe(lang);

  useEffect(() => {
    /* Só o digest. Ver o comentário no topo. */
    console.error("Avaria na página. Digest:", error.digest ?? "sem digest");
  }, [error.digest]);

  return (
    <>
      <Nav
        lang={lang}
        texto={{ nav: dic.nav, geral: dic.geral, linguas: dic.linguas }}
      />

      <PainelDeErro titulo={dic.erro.avaria.titulo} frase={dic.erro.avaria.frase}>
        {/*
          O `reset()` volta a montar a árvore que rebentou, sem recarregar
          a página. É a primeira coisa a tentar e por isso é o botão
          primário; a saída para a entrada fica ao lado, para quem já
          tentou e não quer tentar mais.
        */}
        <CtaBotao onClick={reset}>{dic.erro.avaria.tentar}</CtaBotao>
        <Cta href={caminho(lang, "/")} variant="secondary">
          {dic.erro.avaria.voltar}
        </Cta>
      </PainelDeErro>
    </>
  );
}
