"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Portada } from "@/components/decor/Portada";

/* A batida em que as folhas ficam paradas antes de abrir. Curta: é o instante
   em que se percebe que está fechado, não uma espera. */
const BATIDA_MS = 350;

/* Quanto demora a abrir. Mais devagar do que os 0,34s de uma travessia, e de
   propósito: uma porta que se abre para receber alguém não tem a mesma pressa
   que uma batida entre páginas. */
const ABERTURA_S = 0.55;

/*
  A chegada ao site: o portão fechado, e abre.

  t=0,00s  as duas folhas encostadas, a tapar o ecrã
  t=0,35s  fim da batida parada
  t=0,90s  folhas fora do ecrã, cada uma para o seu lado, e isto desmonta

  Substituiu um ecrã de entrada que era outra coisa — breu, halo de lanterna,
  a caveira em madeira a entrar em escala e o wordmark por baixo, 1,5s ao todo.
  O Gonçalo quis o portão que já se via nas trocas de página, e só ele.

  ## Porque é que isto vem no HTML do servidor

  O ecrã antigo montava-se só no cliente, num efeito. Isso deixa um instante de
  página à vista antes de a camada aparecer — invisível atrás de 1,5s de
  cortina, mas fatal aqui: uma porta que só aparece depois do JavaScript não
  está "já fechada", bate na cara de quem chega. As folhas são servidas em
  `x: 0`, fechadas, e é o cliente que as abre.

  Isso obriga a duas saídas de emergência, e nenhuma delas é JavaScript —
  precisam de valer *antes* de ele correr:

  1. **Sem JavaScript** as portas nunca abririam. O `<noscript>` do
     `app/layout.tsx` esconde o `[data-chegada]`.
  2. **Com movimento reduzido** não se mostram de todo, como o ecrã antigo
     também não se mostrava. A regra está no `@media (prefers-reduced-motion)`
     do `app/globals.css`, ao lado do `[data-tralha-movel]`, que já faz
     exactamente isto.

  O conteúdo da página continua todo no HTML por baixo, indexável. Isto é uma
  camada por cima, não um portão à entrada — no sentido em que importa.

  ## Só à chegada

  Está montada no layout, que persiste entre navegações de cliente. Monta uma
  vez, na primeira carga, e não volta: quem anda entre a inicial e a ementa vê
  as portadas da `Travessia`, que são as mesmas folhas com outro movimento.
*/
export function Chegada() {
  const reduzido = useReducedMotion();
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(true);

  useEffect(() => {
    /* Com movimento reduzido não há batida nem abertura a agendar: o
       componente não chega a devolver nada. */
    if (!montado || aberto || reduzido) return;

    function abrir() {
      setAberto(true);
    }

    /* Botão invisível de escape, como o ecrã antigo tinha: qualquer tecla ou
       clique abre já. */
    window.addEventListener("keydown", abrir);
    window.addEventListener("click", abrir);
    const temporizador = window.setTimeout(abrir, BATIDA_MS);

    return () => {
      window.removeEventListener("keydown", abrir);
      window.removeEventListener("click", abrir);
      window.clearTimeout(temporizador);
    };
  }, [montado, aberto, reduzido]);

  /*
    Com movimento reduzido sai do DOM, para não ficar uma camada invisível a
    engolir cliques. O CSS do `globals.css` já a tinha escondido antes de este
    componente sequer correr — isto é a segunda tranca, não a primeira.

    Sai em `return null` e não num estado posto num efeito: o
    `react-hooks/set-state-in-effect` tem razão, e é o que a `Travessia` já faz
    para o mesmo caso.
  */
  if (reduzido || !montado) return null;

  return (
    <AnimatePresence onExitComplete={() => setMontado(false)}>
      {!aberto && (
        <div
          aria-hidden="true"
          data-chegada
          /* z-[100]: o lugar mais alto do site, acima das portadas da
             travessia (90), da tralha (60) e do skip link (70).
             `pointer-events-auto` enquanto fechado — engolir os cliques em vez
             de deixar carregar num link que está tapado por duas folhas. */
          className="pointer-events-auto fixed inset-0 z-[100] overflow-hidden"
        >
          <Portada
            lado="esquerda"
            prioritaria
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: ABERTURA_S, ease: [0.76, 0, 0.24, 1] }}
          />
          <Portada
            lado="direita"
            prioritaria
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: ABERTURA_S, ease: [0.76, 0, 0.24, 1] }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
