import { Caveira } from "./Caveira";
import { Tabua } from "./Tabua";

/*
  A caveira da casa pregada na linha que separa duas secções — uma placa de
  madeira por cima da junta, como as tabuletas da Nav.

  Não desenha régua nenhuma: monta-se dentro de uma secção que já tenha
  `border-t` (a Petiscos e a Vozes têm), e a placa tapa o pedaço de linha
  por baixo dela. É isso que a faz parecer pregada à régua em vez de
  pousada ao lado.

  Nada é redondo: a regra de raio do projecto é 4px em tudo, e uma medalha
  circular seria a única pílula do site.

  A secção que a monta precisa de ser `relative`. O `-top-*` puxa a placa
  metade para fora da caixa, e sem contexto de posicionamento ela subiria
  até ao primeiro ancestral posicionado, que pode estar em qualquer sítio
  da página.
*/
export function SeloDeSeccao({ semente = 3 }: { semente?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2"
    >
      <Tabua semente={semente} className="border border-[var(--madeira-borda)] px-3 py-2">
        <Caveira className="h-6 w-8 text-osso-fraco" chapeu={false} ossos />
      </Tabua>
    </div>
  );
}
