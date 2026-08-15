import "server-only";
import { headers } from "next/headers";

/*
  Um travão que quase não trava — e vale a pena dizê-lo aqui em vez de o
  descobrir mais tarde.

  Este `Map` vive na memória de **uma** instância de função. Na Vercel há várias
  em paralelo assim que há carga, e cada uma nasce com o contador vazio; e num
  site de tráfego baixo as instâncias são recicladas por inactividade ao fim de
  minutos, o que apaga sozinho o contador de um atacante lento — precisamente o
  que este mecanismo devia apanhar. Um atacante com vinte ligações em paralelo
  passa-lhe ao lado sem dar por ele.

  Está cá porque custa vinte linhas e trava um script ingénuo que martela do
  mesmo sítio. **Não é a defesa.** A defesa são as outras três, por esta ordem:

  1. **A password é gerada, não escolhida** — ver `scripts/palavra-passe.mjs`.
     É a única cujo custo para quem tenta é astronómico.
  2. **A regra de rate limiting no Vercel Firewall** — 5 POSTs por minuto por
     IP em `/painel/entrar`, configurada no dashboard. Corre na borda, antes de
     o pedido chegar à função, e um pedido travado não custa compute nenhum.
     Ver `docs/PAINEL.md`.
  3. **O custo do scrypt**, que torna cada tentativa cara por construção.

  O que **não** está cá, por ser teatro: um contador guardado num cookie (um bot
  é um ciclo à volta de um `fetch` e nunca envia cookies — o único efeito seria
  irritar o dono da casa) e um atraso artificial a cada falha (contra um
  atacante em paralelo não lhe reduz a taxa e mantém N funções nossas a dormir,
  o que é fazer negação de serviço a nós próprios e a pagar o compute).
*/

const JANELA_MS = 60_000;
const TENTATIVAS = 8;

const contagem = new Map<string, { ate: number; falhas: number }>();

/*
  Na Vercel o `x-forwarded-for` é reescrito pela plataforma e o primeiro
  endereço é o de quem pediu — não é um cabeçalho que o cliente controle. Fora
  da Vercel isto vale o que valer, que é outra razão para não ser a defesa.
*/
async function quemPede(): Promise<string> {
  const cabecalhos = await headers();
  const encaminhado = cabecalhos.get("x-forwarded-for");
  return encaminhado?.split(",")[0]?.trim() || cabecalhos.get("x-real-ip") || "desconhecido";
}

/** `true` se este endereço já gastou as tentativas desta janela. */
export async function travado(): Promise<boolean> {
  const registo = contagem.get(await quemPede());
  if (!registo || registo.ate < Date.now()) return false;
  return registo.falhas >= TENTATIVAS;
}

export async function registarFalha(): Promise<void> {
  const chave = await quemPede();
  const agora = Date.now();
  const registo = contagem.get(chave);

  if (!registo || registo.ate < agora) {
    contagem.set(chave, { ate: agora + JANELA_MS, falhas: 1 });
  } else {
    registo.falhas += 1;
  }

  /*
    Sem isto o Map cresce para sempre numa instância de vida longa. Limpar as
    janelas velhas de vez em quando chega — não há aqui volume nenhum.
  */
  if (contagem.size > 500) {
    for (const [k, v] of contagem) if (v.ate < agora) contagem.delete(k);
  }
}

export async function limpar(): Promise<void> {
  contagem.delete(await quemPede());
}

/*
  Fica no registo de execução da Vercel. Se algum dia houver um ataque a sério,
  é a única forma de saber que houve — e de ver de onde veio.
*/
export async function anotarTentativa(utilizador: string): Promise<void> {
  console.warn(
    `[painel] entrada recusada — utilizador ${JSON.stringify(utilizador)}, de ${await quemPede()}`,
  );
}
