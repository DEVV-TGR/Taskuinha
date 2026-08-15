"use client";

import { useActionState } from "react";
import { Campo } from "@/components/painel/Campo";
import { Aviso } from "@/components/painel/Aviso";
import { CtaBotao } from "@/components/Cta";
import { entrar, type EstadoDaEntrada } from "@/app/painel/accoes";

export function FormularioDeEntrada() {
  const [estado, accao, aPedir] = useActionState<EstadoDaEntrada, FormData>(
    entrar,
    {},
  );

  return (
    <form action={accao} className="space-y-5">
      {estado.erro ? <Aviso tom="mau">{estado.erro}</Aviso> : null}

      <Campo
        etiqueta="Utilizador"
        name="utilizador"
        type="text"
        required
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        /*
          Só no ecrã de entrada, e é o único do painel que o leva: o campo é o
          primeiro da página e não há mais nada para fazer aqui.
        */
        autoFocus
      />

      <Campo
        etiqueta="Palavra-passe"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      <CtaBotao type="submit" disabled={aPedir} className="w-full">
        {aPedir ? "A verificar…" : "Entrar"}
      </CtaBotao>
    </form>
  );
}
