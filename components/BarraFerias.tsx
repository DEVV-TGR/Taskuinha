"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import type { Dicionario } from "@/lib/dicionario";
import { useFeriasAindaAvisam } from "@/lib/ferias";

/*
  Fechada nesta visita.

  Ao nível do módulo, e não num `useState` só: a página inicial remonta a
  cada navegação de cliente — ir à ementa e voltar — e o estado de dentro do
  componente perdia-se, com a barra a reaparecer. O módulo não remonta. Quem
  recarrega, ou volta noutro dia, começa do zero e vê a barra outra vez, que
  é o que o Gonçalo pediu.

  Nada guardado no browser, pelas mesmas razões que estão escritas na
  `Musica.tsx`.
*/
let fechadaNestaVisita = false;

/*
  O aviso das férias no telemóvel e no tablet: uma barra de madeira fixa em
  baixo, à vista durante o scroll todo, com uma cruz para a fechar. Em
  1024px para cima some, e o aviso passa a ser a `TabuaFerias` do Hero.

  Só está montada na página inicial (`app/[lang]/page.tsx`).

  ## O que ela empurra

  Enquanto existe no ecrã, o `globals.css` apanha-a pelo `data-barra-ferias`
  (com `:has`) e faz duas coisas: sobe o botão da música para cima dela, e dá
  ao `body` uma folga em baixo do tamanho dela, para o fim do rodapé não ficar
  tapado. Fechar desmonta-a, e as duas regras deixam de valer sozinhas.

  ## O fundo

  A mesma `tabua-ferias.webp` da tábua do Hero, ampliada e posicionada de
  maneira que só se vê uma ripa — sem a barra de ferro nem as correntes.
*/
export function BarraFerias({ texto }: { texto: Dicionario["ferias"] }) {
  const avisa = useFeriasAindaAvisam();
  const [fechada, setFechada] = useState(() => fechadaNestaVisita);

  if (!avisa || fechada) return null;

  function fechar() {
    fechadaNestaVisita = true;
    setFechada(true);
  }

  return (
    <aside
      data-barra-ferias
      aria-label={texto.titulo}
      /* z-[75]: acima da tralha (60), abaixo do botão da música (80), das
         portadas da travessia (90) e do portão da chegada (100). */
      className="fixed inset-x-0 bottom-0 z-[75] border-t border-black/70 shadow-[0_-10px_28px_rgb(0_0_0_/_0.6)] lg:hidden"
      style={{
        backgroundImage: "url(/images/tabua-ferias.webp)",
        backgroundSize: "180% auto",
        backgroundPosition: "50% 62%",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex min-h-[var(--altura-barra-ferias)] items-center justify-between gap-3 bg-breu/20 py-2 pr-2 pl-5 sm:pl-8">
        <div className="min-w-0">
          <p className="display letra-na-madeira text-[1.05rem] leading-tight text-osso">
            {texto.titulo}
          </p>
          <p
            className="letra-na-madeira mt-0.5 text-sm text-osso"
            style={{ fontFamily: "var(--font-maquina)" }}
          >
            {texto.datasCurtas}
          </p>
        </div>

        <button
          type="button"
          onClick={fechar}
          aria-label={texto.fechar}
          title={texto.fechar}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-card)] bg-breu/45 text-osso transition-colors hover:text-lanterna focus-visible:text-lanterna active:translate-y-px"
        >
          <X aria-hidden size={20} weight="bold" />
        </button>
      </div>
    </aside>
  );
}
