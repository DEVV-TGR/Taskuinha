"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { autenticar } from "@/lib/painel/utilizadores";
import { selar, opcoesDoCookie, NOME_DO_COOKIE } from "@/lib/painel/sessao";
import { exigirSessaoNaAccao } from "@/lib/painel/porta";
import { travado, registarFalha, limpar, anotarTentativa } from "@/lib/painel/travao";

/*
  Entrar e sair.

  As acções que mexem em dados vivem ao lado dos ecrãs que as usam
  (`ementa/accoes.ts`, `casa/accoes.ts`); estas duas são do painel inteiro.
*/

export type EstadoDaEntrada = { erro?: string };

export async function entrar(
  _estado: EstadoDaEntrada,
  dados: FormData,
): Promise<EstadoDaEntrada> {
  const utilizador = String(dados.get("utilizador") ?? "").trim();
  const password = String(dados.get("password") ?? "");

  if (await travado()) {
    return {
      erro: "Demasiadas tentativas seguidas. Espera um minuto e tenta outra vez.",
    };
  }

  const quem = await autenticar(utilizador, password);

  if (!quem) {
    await registarFalha();
    await anotarTentativa(utilizador);
    /*
      Uma mensagem só para os dois casos. Dizer "esse utilizador não existe"
      poupava um segundo a quem se engana e dava a quem tenta entrar a lista
      dos nomes que valem a pena — e a derivação contra o hash fantasma, no
      `lib/painel/utilizadores.ts`, existe para o tempo de resposta também não
      dizer isso.
    */
    return { erro: "Utilizador ou palavra-passe inválidos." };
  }

  await limpar();
  (await cookies()).set(NOME_DO_COOKIE, selar(quem.utilizador), opcoesDoCookie());

  /*
    Fora de qualquer `try`: o `redirect` funciona atirando uma excepção que o
    Next apanha, e um `catch` à volta engolia-a e deixava a pessoa no ecrã de
    entrada depois de ter entrado.
  */
  redirect("/painel");
}

export async function sair(): Promise<void> {
  await exigirSessaoNaAccao();

  /*
    O `delete` tem de levar as mesmas opções de caminho com que o cookie foi
    posto. Um `delete` sem `path` apaga o cookie de `/` — que não existe — e
    deixa o de `/painel` onde estava, com a sessão viva e o botão de sair a
    não fazer nada.
  */
  (await cookies()).delete({ name: NOME_DO_COOKIE, path: "/painel" });

  redirect("/painel/entrar");
}
