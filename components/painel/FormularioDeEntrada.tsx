"use client";

import { useActionState } from "react";
import { Campo } from "@/components/painel/Campo";
import { Aviso } from "@/components/painel/Aviso";
import { CtaBotao } from "@/components/Cta";
import { pedirCodigo, type EstadoDaEntrada } from "@/app/painel/accoes";

/*
  Um campo, e é tudo.

  Não há password para escrever nem para esquecer. Quem tem acesso escreve o
  email e recebe um código.

  `autoComplete="email"` faz o telemóvel oferecer o endereço logo; `type="email"`
  troca o teclado por um que tem o `@` à mão.
*/
export function FormularioDeEntrada() {
  const [estado, accao, aPedir] = useActionState<EstadoDaEntrada, FormData>(
    pedirCodigo,
    {},
  );

  return (
    <form action={accao} className="space-y-5">
      {estado.erro ? <Aviso tom="mau">{estado.erro}</Aviso> : null}

      {/*
        A mesma mensagem para quem tem acesso e para quem não tem. Se dissesse
        "esse email não está autorizado", qualquer pessoa podia usar este
        formulário para descobrir quem entra no painel.
      */}
      {estado.enviado ? (
        <Aviso tom="bom">
          Se este email tiver acesso ao painel, o código chega em instantes.
          Vale 10 minutos.
        </Aviso>
      ) : null}

      <Campo
        etiqueta="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoFocus
        placeholder="o-teu-email@exemplo.pt"
      />

      <CtaBotao type="submit" disabled={aPedir} className="w-full">
        {aPedir ? "A enviar…" : "Receber código"}
      </CtaBotao>
    </form>
  );
}
