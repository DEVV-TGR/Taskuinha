"use server";

import { exigirSessaoNaAccao } from "@/lib/painel/porta";
import { validarEmenta } from "@/lib/painel/validar";
import {
  gravar,
  enderecoDoCommit,
  CAMINHO_EMENTA,
  ConflitoDeGravacao,
  ErroDoGithub,
} from "@/lib/painel/github";

export type EstadoDaEmenta =
  | { tipo: "parado" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "problemas"; lista: string[] }
  | { tipo: "gravado"; commit: string; endereco: string };

/*
  Publicar a ementa.

  Recebe o ficheiro inteiro, não um remendo. É mais bytes a viajar e é a
  escolha certa: o que se grava é um ficheiro completo, e mandar o ficheiro
  completo é a única forma de o que se valida ser exactamente o que vai para o
  repositório.

  A mensagem do commit diz **o que mudou**, não "actualização de dados". Quem
  for ver o `git log` daqui a um ano quer ler "3 preços, 1 prato novo" e não ter
  de abrir o diff para saber se vale a pena olhar.
*/
export async function publicarEmenta(
  _estado: EstadoDaEmenta,
  dados: FormData,
): Promise<EstadoDaEmenta> {
  const { email } = await exigirSessaoNaAccao();

  const sha = String(dados.get("sha") ?? "");
  const resumo = String(dados.get("resumo") ?? "").trim();
  let ementa: unknown;

  try {
    ementa = JSON.parse(String(dados.get("ementa") ?? ""));
  } catch {
    return {
      tipo: "erro",
      mensagem: "Os dados chegaram estragados. Recarrega a página.",
    };
  }

  const problemas = validarEmenta(ementa);
  if (problemas.length > 0) return { tipo: "problemas", lista: problemas };

  try {
    const { commit } = await gravar({
      caminho: CAMINHO_EMENTA,
      dados: ementa,
      sha,
      mensagem: `Ementa: ${resumo || "alterações"}, pelo painel (${email})`,
      autor: email,
    });

    return { tipo: "gravado", commit, endereco: enderecoDoCommit(commit) };
  } catch (erro) {
    if (erro instanceof ConflitoDeGravacao) {
      return {
        tipo: "erro",
        mensagem:
          "Alguém gravou entretanto e este ecrã ficou desactualizado. " +
          "Recarrega a página e volta a fazer as alterações — nada foi gravado, " +
          "para não apagar o trabalho da outra pessoa.",
      };
    }
    if (erro instanceof ErroDoGithub) return { tipo: "erro", mensagem: erro.paraOEcra };
    throw erro;
  }
}
