import { Rede } from "./Rede";
import { Aranha } from "./Aranha";
import { Sardanisca } from "./Sardanisca";

/*
  Orquestrador da camada de tralha. Monta uma vez em app/layout.tsx, depois
  de {children} — é `fixed inset-0`, acima da Nav (z-40) e abaixo do ecrã de
  entrada (z-100). Nenhum filho repete `fixed`: todos assumem este
  contentor como o seu ancestral posicionado e usam `absolute`.

  Sem "use client": esta função só compõe JSX, não tem hooks próprios. Os
  filhos com movimento já são client components por si.

  <Bandeirinhas /> NÃO está aqui — verificado na Fase 6: presa a `top-0`
  globalmente, tapava o texto da Nav em todas as páginas (a própria Nav é
  `fixed top-0 z-40`, por baixo do z-60 da tralha). Faz sentido: nas fotos
  reais as bandeirinhas estão penduradas sobre o balcão, um sítio concreto
  lá dentro — não fazem sentido como camada fixa a acompanhar o scroll da
  página toda. Ficam disponíveis para montagem contextual, não fixa, dentro
  de uma secção específica (Casa.tsx, Fase 7).

  Nenhuma Sardanisca usa `borda="cima"` por omissão — verificado na Fase 8:
  a faixa de 48px do topo cai exactamente onde os cabeçalhos das páginas
  (H1 + parágrafo de abertura) costumam começar, sobretudo em ecrãs
  estreitos. A regra "nunca sobre texto" só se cumpre se o conteúdo nunca
  chegar perto da borda — e o topo da página é precisamente onde isso é
  menos garantido. Baixo, esquerda e direita têm muito menos conteúdo a
  roçar a margem.
*/
export function Tralha() {
  return (
    <div
      aria-hidden="true"
      data-tralha=""
      className="pointer-events-none fixed inset-0 z-[60]"
    >
      <Rede />
      <Aranha className="left-[15%] sm:left-[20%]" />
      <Sardanisca borda="baixo" atraso={0} />
      <Sardanisca borda="direita" atraso={0.6} />
      <Sardanisca borda="esquerda" atraso={1.1} />
    </div>
  );
}
