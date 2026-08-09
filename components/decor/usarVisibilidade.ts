"use client";

import { useEffect, useState } from "react";

/*
  Não é um dos 13 ficheiros de tralha do plano — é o único ponto partilhado
  entre eles, para não repetir o mesmo listener de `visibilitychange` treze
  vezes. Todo o movimento contínuo (Aranha, Bandeirinhas, Lanterna, Mar,
  BandeiraNegra, Relampago) consulta isto e pára quando o
  separador está em segundo plano — regra 4 do §7 do plano: animações em
  loop não devem comer bateria com a aba escondida.
*/

/** Verdadeiro enquanto o separador está visível. */
export function useAbaVisivel() {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const aoMudar = () => setVisivel(document.visibilityState === "visible");
    aoMudar();
    document.addEventListener("visibilitychange", aoMudar);
    return () => document.removeEventListener("visibilitychange", aoMudar);
  }, []);

  return visivel;
}
