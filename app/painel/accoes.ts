"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { autenticar, emailDe } from "@/lib/painel/utilizadores";
import {
  selar,
  selarAparelho,
  aparelhoConhecido,
  opcoesDoCookie,
  NOME_DO_COOKIE,
  NOME_DO_APARELHO,
  VALIDADE_APARELHO_MS,
} from "@/lib/painel/sessao";
import {
  gerarCodigo,
  criarDesafio,
  conferirCodigo,
  utilizadorDoDesafio,
  NOME_DO_DESAFIO,
  VALIDADE_MS as VALIDADE_DO_DESAFIO,
} from "@/lib/painel/codigo";
import { enviarCodigo, ErroAoEnviar } from "@/lib/painel/email";
import { exigirSessaoNaAccao } from "@/lib/painel/porta";
import { travado, registarFalha, limpar, anotarTentativa } from "@/lib/painel/travao";

/*
  Entrar, confirmar o código, e sair.

  A entrada tem dois passos. O primeiro confere a password; o segundo confere um
  código de seis algarismos que foi por email. Um aparelho que já tenha passado
  pelo segundo salta-o durante 30 dias.

  As acções que mexem em dados vivem ao lado dos ecrãs que as usam
  (`ementa/accoes.ts`, `casa/accoes.ts`); estas são da porta.
*/

export type EstadoDaEntrada = { erro?: string };

/*
  Passo 1 — a password.

  Password errada não manda email nenhum: só se avança com a password certa.
  Isto revela, a quem tenta, se acertou na password — mas é assim que qualquer
  banco funciona, e a alternativa (mandar sempre um email, mesmo com password
  errada) transformava o formulário numa máquina de enviar spam para a caixa do
  dono da casa.
*/
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
      poupava um segundo a quem se engana e dava a quem tenta entrar a lista dos
      nomes que valem a pena — e a derivação contra uma password que não é de
      ninguém, no `lib/painel/utilizadores.ts`, existe para o tempo de resposta
      também não dizer isso.
    */
    return { erro: "Utilizador ou palavra-passe inválidos." };
  }

  await limpar();
  const frasco = await cookies();

  /*
    Já passou por aqui neste aparelho nos últimos 30 dias — não se pede o
    código outra vez.
  */
  if (aparelhoConhecido(frasco.get(NOME_DO_APARELHO)?.value, quem.utilizador)) {
    frasco.set(NOME_DO_COOKIE, selar(quem.utilizador), opcoesDoCookie());
    redirect("/painel");
  }

  const email = emailDe(quem.utilizador);
  if (!email) {
    /* Não devia acontecer — um utilizador sem email não é carregado. */
    return { erro: "Este utilizador não tem email configurado. Fala com o Tomás." };
  }

  const codigo = gerarCodigo();

  try {
    await enviarCodigo({ para: email, codigo });
  } catch (erro) {
    /*
      Uma falha de email **nunca** pode virar "entra à mesma". O painel fica na
      porta e diz o que se passou.
    */
    if (erro instanceof ErroAoEnviar) return { erro: erro.paraOEcra };
    throw erro;
  }

  frasco.set(
    NOME_DO_DESAFIO,
    criarDesafio(quem.utilizador, codigo),
    opcoesDoCookie(VALIDADE_DO_DESAFIO),
  );

  /*
    Fora de qualquer `try`: o `redirect` funciona atirando uma excepção que o
    Next apanha, e um `catch` à volta engolia-a.
  */
  redirect("/painel/entrar/codigo");
}

export type EstadoDoCodigo = { erro?: string; reenviado?: boolean };

/** Passo 2 — o código que foi por email. */
export async function confirmarCodigo(
  _estado: EstadoDoCodigo,
  dados: FormData,
): Promise<EstadoDoCodigo> {
  if (await travado()) {
    return { erro: "Demasiadas tentativas seguidas. Espera um minuto." };
  }

  const frasco = await cookies();
  const escrito = String(dados.get("codigo") ?? "");
  const veredicto = conferirCodigo(frasco.get(NOME_DO_DESAFIO)?.value, escrito);

  if (veredicto.estado === "sem-desafio" || veredicto.estado === "expirado") {
    frasco.delete({ name: NOME_DO_DESAFIO, path: "/painel" });
    return {
      erro: "O código expirou. Volta a escrever o utilizador e a palavra-passe.",
    };
  }

  if (veredicto.estado === "errado") {
    await registarFalha();
    /* O cookie novo é o que faz o contador andar — ver lib/painel/codigo.ts. */
    frasco.set(NOME_DO_DESAFIO, veredicto.cookie, opcoesDoCookie(VALIDADE_DO_DESAFIO));

    return {
      erro:
        veredicto.restam > 0
          ? `Código errado. Faltam ${veredicto.restam} tentativas.`
          : "Código errado. Volta a começar.",
    };
  }

  await limpar();

  frasco.set(NOME_DO_COOKIE, selar(veredicto.utilizador), opcoesDoCookie());
  frasco.set(
    NOME_DO_APARELHO,
    selarAparelho(veredicto.utilizador),
    opcoesDoCookie(VALIDADE_APARELHO_MS),
  );
  frasco.delete({ name: NOME_DO_DESAFIO, path: "/painel" });

  redirect("/painel");
}

/** "Não chegou nada" — outro código, e o anterior deixa de servir. */
export async function reenviarCodigo(): Promise<EstadoDoCodigo> {
  const frasco = await cookies();
  const utilizador = utilizadorDoDesafio(frasco.get(NOME_DO_DESAFIO)?.value);

  if (!utilizador) {
    return {
      erro: "O código expirou. Volta a escrever o utilizador e a palavra-passe.",
    };
  }

  const email = emailDe(utilizador);
  if (!email) return { erro: "Este utilizador não tem email configurado." };

  const codigo = gerarCodigo();

  try {
    await enviarCodigo({ para: email, codigo });
  } catch (erro) {
    if (erro instanceof ErroAoEnviar) return { erro: erro.paraOEcra };
    throw erro;
  }

  /*
    Um desafio novo substitui o antigo. O código anterior deixa de servir, o que
    evita a confusão de haver dois emails válidos na caixa ao mesmo tempo — e de
    caminho põe o contador de tentativas a zero, que é o que quem carregou no
    botão espera.
  */
  frasco.set(
    NOME_DO_DESAFIO,
    criarDesafio(utilizador, codigo),
    opcoesDoCookie(VALIDADE_DO_DESAFIO),
  );

  return { reenviado: true };
}

export async function sair(): Promise<void> {
  await exigirSessaoNaAccao();

  /*
    O `delete` tem de levar as mesmas opções de caminho com que o cookie foi
    posto. Um `delete` sem `path` apaga o cookie de `/` — que não existe — e
    deixa o de `/painel` onde estava, com a sessão viva e o botão de sair a não
    fazer nada.

    O cookie do aparelho **fica**. Sair é fechar a sessão, não esquecer o
    telemóvel: quem sair volta a entrar com a password e sem código, que é o que
    se espera de um aparelho que já é conhecido.
  */
  (await cookies()).delete({ name: NOME_DO_COOKIE, path: "/painel" });

  redirect("/painel/entrar");
}
