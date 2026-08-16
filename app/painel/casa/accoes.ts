"use server";

import { exigirSessaoNaAccao } from "@/lib/painel/porta";
import { validarCasa } from "@/lib/painel/validar";
import {
  gravar,
  enderecoDoCommit,
  CAMINHO_CASA,
  ConflitoDeGravacao,
  ErroDoGithub,
} from "@/lib/painel/github";

/*
  Gravar os contactos e o horário.

  O estado que volta para o ecrã é sempre um destes três: um erro com uma frase
  que se pode ler em voz alta, uma lista de problemas de validação, ou o commit
  que se acabou de fazer.
*/

export type EstadoDaCasa =
  | { tipo: "parado" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "problemas"; lista: string[] }
  | { tipo: "gravado"; commit: string; endereco: string };

export async function gravarCasa(
  _estado: EstadoDaCasa,
  dados: FormData,
): Promise<EstadoDaCasa> {
  /* Primeiro de tudo, e outra vez — o `proxy.ts` não é a fechadura. */
  const { email } = await exigirSessaoNaAccao();

  const sha = String(dados.get("sha") ?? "");
  let casa: unknown;

  try {
    casa = JSON.parse(String(dados.get("casa") ?? ""));
  } catch {
    return { tipo: "erro", mensagem: "Os dados chegaram estragados. Recarrega a página." };
  }

  const problemas = validarCasa(casa);
  if (problemas.length > 0) return { tipo: "problemas", lista: problemas };

  try {
    const { commit } = await gravar({
      caminho: CAMINHO_CASA,
      dados: casa,
      sha,
      mensagem: `Contactos e horário, pelo painel (${email})`,
      autor: email,
    });

    return { tipo: "gravado", commit, endereco: enderecoDoCommit(commit) };
  } catch (erro) {
    if (erro instanceof ConflitoDeGravacao) {
      return {
        tipo: "erro",
        mensagem:
          "Alguém gravou entretanto e este ecrã ficou desactualizado. " +
          "Recarrega a página e volta a fazer a alteração — o que escreveste " +
          "não foi gravado, para não apagar o trabalho da outra pessoa.",
      };
    }
    if (erro instanceof ErroDoGithub) {
      return { tipo: "erro", mensagem: erro.paraOEcra };
    }
    throw erro;
  }
}
