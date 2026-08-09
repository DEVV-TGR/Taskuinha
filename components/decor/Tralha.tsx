import { Rede } from "./Rede";
import { Aranha } from "./Aranha";

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

  As sardaniscas saíram na ronda de afinações com o cliente — não gostou do
  resultado. O componente foi apagado, não desligado: uma lagartixa SVG que
  ninguém quer não vale a manutenção. O `[data-tralha-movel]` mantém-se em
  globals.css porque a aranha continua a precisar dele.
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
    </div>
  );
}
