import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { somar } from "./redis";

/*
  Quantas vezes se pode pedir um código, e de onde.

  Sem password, isto deixou de ser defesa em profundidade e passou a ser **a**
  defesa. Um código de seis algarismos são um milhão de hipóteses; sem limites,
  um script testa-as numa tarde.

  ## Os dois limites, e porque é preciso os dois

  **Por código, 5 tentativas** (essa contagem vive no `lib/painel/codigo.ts`,
  ao lado do próprio código). Reduz a janela de um milhão para cinco.

  **Por email, 3 pedidos em 15 minutos.** Sem este, o anterior não vale nada:
  quem ataca faz cinco tentativas, pede outro código, mais cinco, e assim
  sucessivamente até acertar. É este limite que fecha essa porta — e é o que
  falta em quase todas as implementações de OTP que se vêem.

  Serve também para uma coisa mais prosaica: impede que alguém use o formulário
  para encher a caixa de correio do dono da casa, e que se gastem os 100 envios
  diários do plano free do Resend numa tarde.

  **Por IP, 10 pedidos em 15 minutos.** Apanha quem tenta vários endereços
  diferentes a partir do mesmo sítio — a sondagem de quem procura descobrir que
  emails têm acesso.

  ## O que isto não faz, e quem faz

  Não trava volume bruto na borda: para isso está a regra do Vercel Firewall
  (`docs/PAINEL.md`), que corre antes de haver compute. Estes limites são os que
  o firewall não consegue fazer, porque são por email e não por endereço de rede.
*/

const JANELA_S = 15 * 60;
const POR_EMAIL = 3;
const POR_IP = 10;

/*
  O email vai em hash para a chave do Redis.

  Não é criptografia — é para a lista de quem tem acesso ao painel não ficar
  legível em texto no armazenamento, onde não faz falta nenhuma. Quem tiver as
  chaves do Redis vê `pedidos:9f86d0…` e não `pedidos:goncalo@…`.
*/
function chaveDoEmail(email: string): string {
  const digest = createHash("sha256").update(email.toLowerCase()).digest("hex");
  return `pedidos:${digest.slice(0, 32)}`;
}

/*
  Na Vercel o `x-forwarded-for` é reescrito pela plataforma e o primeiro endereço
  é o de quem pediu — não é um cabeçalho que o cliente controle. Fora da Vercel
  vale o que valer, e é por isso que o limite por IP é o terceiro da lista e não
  o primeiro.
*/
async function origem(): Promise<string> {
  const cabecalhos = await headers();
  return (
    cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    cabecalhos.get("x-real-ip") ||
    "desconhecida"
  );
}

/*
  Consome uma unidade do orçamento e diz se ainda havia.

  **Conta sempre, mesmo para emails que não estão na lista.** É essencial: se só
  contasse para os autorizados, o tempo de resposta e o comportamento a partir do
  quarto pedido diriam a quem está do outro lado quais os endereços que existem —
  que é exactamente a enumeração que a resposta uniforme do ecrã existe para
  evitar.
*/
export async function podePedirCodigo(email: string): Promise<boolean> {
  const [porEmail, porIp] = await Promise.all([
    somar(chaveDoEmail(email), JANELA_S),
    somar(`pedidos-ip:${await origem()}`, JANELA_S),
  ]);

  return porEmail <= POR_EMAIL && porIp <= POR_IP;
}

/*
  Fica no registo de execução da Vercel. Se algum dia houver um ataque a sério, é
  a única forma de saber que houve — e de ver de onde veio.

  O email vai em claro aqui, ao contrário do que vai para o Redis: um registo de
  servidor serve para se perceber o que aconteceu, e um hash não serve para isso.
*/
export async function anotar(o_que: string, email: string): Promise<void> {
  console.warn(`[painel] ${o_que} — ${email} — de ${await origem()}`);
}
