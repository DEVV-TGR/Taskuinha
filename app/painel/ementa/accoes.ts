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

/*
  O resumo que o ecrã escreve vai para a primeira linha da mensagem do commit, e
  por isso passa por aqui primeiro.

  Não é defesa contra injecção — o resumo viaja dentro de um corpo JSON para a
  API do GitHub, e não há aspas para escapar. É contra as duas maneiras banais de
  estragar um histórico: uma mudança de linha, que parte o assunto do commit ao
  meio e empurra o resto para o corpo; e um texto sem fim, colado de outro sítio
  sem querer, que faz um `git log --oneline` ilegível para sempre.

  Cinquenta é o comprimento clássico de um assunto de commit; cem dá folga a quem
  escreve em português sem transformar a linha num parágrafo.
*/
function primeiraLinha(texto: string): string {
  const limpo = texto.split(/[\r\n]/)[0].trim();
  return limpo.length > 100 ? `${limpo.slice(0, 99)}…` : limpo;
}
export async function publicarEmenta(
  _estado: EstadoDaEmenta,
  dados: FormData,
): Promise<EstadoDaEmenta> {
  const { email } = await exigirSessaoNaAccao();

  const sha = String(dados.get("sha") ?? "");
  const resumo = primeiraLinha(String(dados.get("resumo") ?? ""));
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
