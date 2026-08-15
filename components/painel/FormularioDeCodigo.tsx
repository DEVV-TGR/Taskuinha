"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { Aviso } from "@/components/painel/Aviso";
import { CtaBotao } from "@/components/Cta";
import {
  confirmarCodigo,
  reenviarCodigo,
  type EstadoDoCodigo,
} from "@/app/painel/accoes";

/*
  O segundo passo.

  O campo é um só, com seis algarismos. Não são seis caixinhas separadas: são
  bonitas e são péssimas — colar um código de seis dígitos numa delas costuma
  encher só a primeira, e apagar a meio salta para a caixa errada. Uma caixa
  larga aceita colar, aceita escrever, e aceita o preenchimento automático do
  iPhone.

  `inputMode="numeric"` abre o teclado de algarismos no telemóvel, e
  `autoComplete="one-time-code"` é o que faz o iOS oferecer o código por cima do
  teclado assim que o email chega — o que poupa a ida à caixa de correio.
*/
export function FormularioDeCodigo({ paraOnde }: { paraOnde: string }) {
  const [estado, accao, aConfirmar] = useActionState<EstadoDoCodigo, FormData>(
    confirmarCodigo,
    {},
  );
  const [reenvio, setReenvio] = useState<EstadoDoCodigo | null>(null);
  const [aReenviar, comecarReenvio] = useTransition();

  return (
    <div className="space-y-5">
      {estado.erro ? <Aviso tom="mau">{estado.erro}</Aviso> : null}
      {reenvio?.erro ? <Aviso tom="mau">{reenvio.erro}</Aviso> : null}
      {reenvio?.reenviado ? (
        <Aviso tom="bom">Enviámos outro código. O anterior já não serve.</Aviso>
      ) : null}

      <p className="text-sm leading-relaxed text-osso-fraco">
        Enviámos um código de seis algarismos para{" "}
        <span className="text-osso">{paraOnde}</span>. Vale 10 minutos.
      </p>

      <form action={accao} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-osso-fraco">
            Código
          </span>
          <input
            name="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            /* `\d*` faz o Safari abrir o teclado numérico mesmo em versões
               antigas, onde o inputMode sozinho não chega. */
            pattern="[0-9]*"
            maxLength={7}
            required
            autoFocus
            placeholder="000000"
            className="min-h-14 w-full rounded-[var(--radius-card)] border border-linha bg-breu-fundo px-3 text-center text-2xl tracking-[0.4em] text-osso placeholder:text-osso-fraco/40 focus:border-lanterna focus:outline-none focus:ring-1 focus:ring-lanterna"
            style={{ fontFamily: "var(--font-maquina)" }}
          />
        </label>

        <CtaBotao type="submit" disabled={aConfirmar} className="w-full">
          {aConfirmar ? "A confirmar…" : "Confirmar"}
        </CtaBotao>
      </form>

      <div className="flex flex-col gap-3 border-t border-linha pt-4 text-sm">
        <button
          type="button"
          disabled={aReenviar}
          onClick={() => comecarReenvio(async () => setReenvio(await reenviarCodigo()))}
          className="link-underline min-h-11 text-left text-osso-fraco hover:text-lanterna disabled:opacity-50"
        >
          {aReenviar ? "A enviar…" : "Não chegou nada — enviar outro código"}
        </button>

        <Link
          href="/painel/entrar"
          className="link-underline min-h-11 text-osso-fraco hover:text-lanterna"
        >
          Voltar atrás
        </Link>
      </div>
    </div>
  );
}
