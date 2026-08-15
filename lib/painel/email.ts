import "server-only";
import { comEspaco } from "./codigo";

/*
  Mandar o código por email.

  Um `fetch` ao Resend, e mais nada — o SDK deles faria isto com menos linhas e
  traria uma árvore de dependências para um pedido HTTP, que é a mesma razão
  pela qual o `lib/painel/github.ts` não usa o Octokit.

  A CSP não muda por causa disto: a chamada é feita no servidor e o browser
  nunca fala com o Resend. Se alguém alguma vez precisar de acrescentar
  `api.resend.com` ao `connect-src`, é sinal de que a chave de API está a passar
  pelo cliente — que é a mesma nota que está escrita no `next.config.ts` a
  propósito do GitHub.

  ## O remetente

  `codigo@taskuinhapirata.pt`. É preciso que o domínio esteja verificado no
  Resend (três registos DNS, uma vez só — ver `docs/PAINEL.md`); sem isso o
  Resend recusa o envio, e é melhor assim do que mandar de um endereço
  emprestado que aterra na pasta de spam.

  A caixa não recebe respostas. O `reply_to` aponta ao próprio remetente e o
  texto do email diz que não vale a pena responder.
*/

const REMETENTE = "Taskuinha <codigo@taskuinhapirata.pt>";

export class ErroAoEnviar extends Error {
  readonly estado: number;

  constructor(estado: number, detalhe: string) {
    super(`O Resend respondeu ${estado}: ${detalhe}`);
    this.name = "ErroAoEnviar";
    this.estado = estado;
  }

  /*
    O que se mostra a quem está à espera do código. Nunca o erro do Resend —
    esse vai para o registo da Vercel, onde é útil, e não para um ecrã onde só
    assusta.
  */
  get paraOEcra(): string {
    if (this.estado === 401 || this.estado === 403) {
      return (
        "O painel não conseguiu enviar o código — a chave do serviço de email " +
        "parece estar errada ou expirada. Fala com o Tomás."
      );
    }
    return (
      "Não foi possível enviar o código agora. Tenta daqui a um minuto; se " +
      "continuar, fala com o Tomás."
    );
  }
}

/*
  Lido dentro da função, como tudo o resto que toca no ambiente: o `next build`
  da CI corre sem uma única variável definida.
*/
function chaveDeApi(): string {
  const valor = process.env.RESEND_API_KEY;
  if (!valor) throw new ErroAoEnviar(401, "RESEND_API_KEY em falta.");
  return valor;
}

/*
  Em desenvolvimento, sem chave do Resend, o código vai para o terminal.

  Sem isto não há forma de entrar no painel na própria máquina sem montar uma
  conta de email — e montar uma conta de email para carregar num botão e ver se
  o ecrã está direito é fricção a mais.

  **Isto não é uma porta traseira.** O código continua a ser gerado, continua a
  ser exigido, e continua a ter de bater certo. O que muda é por onde ele sai:
  em vez de um email, sai no terminal de quem está a correr o `npm run dev`, que
  é a mesma pessoa que está a tentar entrar.

  Duas condições, e as duas têm de se verificar:

  - `NODE_ENV !== "production"` — na Vercel o build de produção é sempre
    `production`, portanto este ramo não existe lá;
  - **não haver `RESEND_API_KEY`** — se houver chave, manda-se o email a sério,
    mesmo em desenvolvimento.

  Se um dia isto aparecer a disparar em produção, é sinal de que o `NODE_ENV`
  está errado — e aí o problema é esse, não este ficheiro.
*/
function paraOTerminal(para: string, legivel: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.RESEND_API_KEY) return false;

  console.log(
    [
      "",
      "┌────────────────────────────────────────────────┐",
      "│  DESENVOLVIMENTO — sem RESEND_API_KEY          │",
      "│  O código não foi enviado por email.           │",
      "├────────────────────────────────────────────────┤",
      `│  para:   ${para.padEnd(38)}│`,
      `│  código: ${legivel.padEnd(38)}│`,
      "└────────────────────────────────────────────────┘",
      "",
    ].join("\n"),
  );

  return true;
}

export async function enviarCodigo({
  para,
  codigo,
}: {
  para: string;
  codigo: string;
}): Promise<void> {
  const legivel = comEspaco(codigo);

  if (paraOTerminal(para, legivel)) return;

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chaveDeApi()}`,
      "Content-Type": "application/json",
      /*
        Dois cliques no botão de enviar dão dois pedidos iguais; com esta chave
        o Resend manda um email só. É por código e por destinatário, portanto um
        código novo continua a produzir um email novo.
      */
      "Idempotency-Key": `painel-${para}-${codigo}`,
    },
    body: JSON.stringify({
      from: REMETENTE,
      to: [para],
      reply_to: REMETENTE,
      /*
        O código vai no **assunto** de propósito. Quem estiver no telemóvel
        lê-o na notificação, sem desbloquear e sem abrir o email — que é como
        isto vai ser usado, ao balcão e com uma mão só.
      */
      subject: `${legivel} — entrar no painel da Taskuinha`,
      text: [
        `O teu código para entrar no painel é ${legivel}.`,
        "",
        "Vale 10 minutos e serve uma vez só.",
        "",
        "Se não foste tu a tentar entrar, alguém sabe a palavra-passe do",
        "painel — vale a pena mudá-la.",
        "",
        "Esta caixa não lê respostas.",
      ].join("\n"),
    }),
  });

  if (!resposta.ok) {
    throw new ErroAoEnviar(resposta.status, await resposta.text());
  }
}
