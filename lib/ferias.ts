import { useSyncExternalStore } from "react";

/*
  As férias da casa: encerrada de 19 de setembro a 14 de outubro de 2026.

  O aviso aparece em dois sítios, só na página inicial — a tábua pendurada
  do lado direito do Hero em ecrãs grandes (`components/decor/TabuaFerias.tsx`)
  e a barra fixa em baixo no telemóvel (`components/BarraFerias.tsx`). Os
  dois somem sozinhos a partir de 15 de outubro.

  ## Porque é que a data se verifica no cliente

  As páginas são geradas no build. Se a verificação fosse só no servidor, o
  aviso ficava no HTML até alguém fazer um deploy depois do dia 14 — e ninguém
  se ia lembrar. O HTML vem com o aviso, e o browser tira-o se a data já
  passou.

  ## As datas estão escritas duas vezes

  Aqui, para saber quando esconder, e nos quatro dicionários (`ferias.datas` e
  `ferias.datasCurtas`), que é o texto que se lê. Mudar as férias é mudar os
  dois sítios.

  Passadas as férias, tudo isto pode ser apagado: este ficheiro, os dois
  componentes, a chave `ferias` dos dicionários e as regras
  `[data-barra-ferias]` do `globals.css`.
*/

/** O último dia fechado, na hora de Lisboa. */
export const FIM_DAS_FERIAS = "2026-10-14";

/* `en-CA` escreve as datas como AAAA-MM-DD, que se comparam como texto. */
const diaEmLisboa = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Lisbon",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Verdadeiro até ao fim do dia 14 de outubro, em Portugal. */
export function feriasAindaAvisam(agora: Date = new Date()): boolean {
  return diaEmLisboa.format(agora) <= FIM_DAS_FERIAS;
}

/* A data não muda enquanto a página está aberta de maneira que interesse
   ouvir — ninguém fica com o site aberto a atravessar a meia-noite de 14. */
function semNadaParaOuvir() {
  return () => {};
}

/*
  A mesma pergunta, para os componentes de cliente.

  `useSyncExternalStore` e não `useState` + `useEffect`: o terceiro argumento
  é o que o servidor e a hidratação usam (`true`, o HTML vem com o aviso), e
  logo a seguir o React pergunta ao browser a data verdadeira. Se não bater,
  volta a desenhar sem erro de hidratação.
*/
export function useFeriasAindaAvisam(): boolean {
  return useSyncExternalStore(semNadaParaOuvir, feriasAindaAvisam, () => true);
}
