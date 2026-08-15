import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { chave } from "./chaves";

/*
  O código de seis algarismos, e o sítio onde ele espera entre os dois ecrãs.

  ## O problema

  O código nasce no primeiro ecrã (a seguir à password) e é confirmado no
  segundo. Entre um e outro há um pedido HTTP, e nada onde o guardar: não há
  base de dados, e em funções serverless não há memória partilhada — um `Map`
  não serve, pela mesma razão que já está escrita no `lib/painel/travao.ts`.

  ## A solução, e porque é *cifrado* e não assinado

  O desafio vai num cookie, **cifrado** com AES-256-GCM.

  Assinado não chegava. Quem esteja a atacar já passou a password para chegar
  aqui — é esse exactamente o cenário que o segundo passo existe para travar — e
  um cookie assinado é legível: bastava-lhe abri-lo e ler lá o código.

  Guardar um *hash* do código também não servia. Seis algarismos são um milhão
  de hipóteses; com o hash na mão, experimentam-se todas em segundos num
  portátil qualquer. O que impede a força bruta é ela ter de passar pela rede,
  e para isso o código não pode sair do servidor.

  Cifrado, o cookie não diz nada a quem não tem a chave — e a chave é derivada
  das credenciais e vive só no servidor.

  ## GCM, e não CBC

  O GCM autentica ao mesmo tempo que cifra: se alguém mexer num byte do cookie,
  o `decipher.final()` atira em vez de devolver lixo silencioso. Com CBC era
  preciso juntar um HMAC à mão e acertar na ordem — mais peças para enganar.

  ## A limitação, dita à cabeça

  O contador de tentativas vive dentro do próprio cookie e é reescrito a cada
  falha. Quem esteja a atacar pode guardar uma cópia de um cookie anterior e
  reenviá-la para pôr o contador a zero, e não há como impedir isso sem
  armazenamento partilhado.

  O que fecha a porta é a conta, e não o contador:

  - o código expira em **10 minutos**;
  - a regra do Vercel Firewall limita a **5 pedidos por minuto por IP** em
    `/painel/entrar*` — e o segundo ecrã é `/painel/entrar/codigo`, portanto
    está coberto pela mesma regra (ver `docs/PAINEL.md`);
  - **50 tentativas contra um milhão de códigos** dá 0,005% por desafio.

  É honesto dizer de onde vem a garantia: vem do firewall.
*/

export const NOME_DO_DESAFIO = "taskuinha_desafio";

/* Tempo que chega para ir ao email sem obrigar a correr. */
export const VALIDADE_MS = 10 * 60 * 1000;

/* Só conta para o aviso "já erraste umas quantas" — ver a limitação acima. */
const TENTATIVAS = 5;

type Desafio = {
  /** Quem está a entrar. */
  u: string;
  /** O código, em texto. Nunca sai do servidor por não estar cifrado. */
  c: string;
  exp: number;
  tentativas: number;
};

/*
  `randomInt` e não `Math.random()`: o segundo é previsível a partir de umas
  quantas saídas, e um código de entrada previsível não é um código. O intervalo
  vai de 0 a 999999 e é enchido com zeros à esquerda, para o "000042" ser tão
  provável como o "384921".
*/
export function gerarCodigo(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** `"384921"` → `"384 921"`, para se ler de uma vez no assunto do email. */
export function comEspaco(codigo: string): string {
  return `${codigo.slice(0, 3)} ${codigo.slice(3)}`;
}

function selar(desafio: Desafio): string {
  /*
    12 bytes é o tamanho canónico do nonce em GCM, e tem de ser diferente em
    cada cifragem com a mesma chave — daí vir do `randomBytes` e viajar em claro
    ao lado do texto cifrado, que é como o GCM foi desenhado para ser usado.
  */
  const nonce = randomBytes(12);
  const cifra = createCipheriv("aes-256-gcm", chave("desafio"), nonce);

  const corpo = Buffer.concat([
    cifra.update(JSON.stringify(desafio), "utf8"),
    cifra.final(),
  ]);

  return [nonce, cifra.getAuthTag(), corpo]
    .map((parte) => parte.toString("base64url"))
    .join(".");
}

function abrir(valor: string | undefined): Desafio | null {
  if (!valor) return null;

  const partes = valor.split(".");
  if (partes.length !== 3) return null;

  try {
    const [nonce, etiqueta, corpo] = partes.map((p) => Buffer.from(p, "base64url"));
    const decifra = createDecipheriv("aes-256-gcm", chave("desafio"), nonce);
    decifra.setAuthTag(etiqueta);

    /* Se alguém mexeu num byte, é aqui que rebenta — e é o que se quer. */
    const texto = Buffer.concat([decifra.update(corpo), decifra.final()]).toString("utf8");

    const lido: unknown = JSON.parse(texto);
    if (typeof lido !== "object" || lido === null) return null;

    const { u, c, exp, tentativas } = lido as Record<string, unknown>;
    if (
      typeof u !== "string" ||
      typeof c !== "string" ||
      typeof exp !== "number" ||
      typeof tentativas !== "number"
    ) {
      return null;
    }

    return { u, c, exp, tentativas };
  } catch {
    return null;
  }
}

/** Um desafio novo, pronto a ir para o cookie. */
export function criarDesafio(utilizador: string, codigo: string): string {
  return selar({
    u: utilizador,
    c: codigo,
    exp: Date.now() + VALIDADE_MS,
    tentativas: 0,
  });
}

export type Veredicto =
  | { estado: "certo"; utilizador: string }
  | { estado: "errado"; cookie: string; restam: number }
  | { estado: "expirado" }
  | { estado: "sem-desafio" };

/*
  Confere o código escrito contra o que está no cookie.

  Devolve sempre o que a acção precisa de fazer a seguir, incluindo o cookie
  novo quando erra — é assim que o contador anda para a frente, já que não há
  onde o guardar do lado de cá.
*/
export function conferirCodigo(
  cookie: string | undefined,
  escrito: string,
): Veredicto {
  const desafio = abrir(cookie);
  if (!desafio) return { estado: "sem-desafio" };
  if (desafio.exp < Date.now()) return { estado: "expirado" };
  if (desafio.tentativas >= TENTATIVAS) return { estado: "expirado" };

  /*
    Comparação em tempo constante. Contra seis algarismos por HTTP isto é quase
    simbólico — mas é uma linha, e a alternativa é a única comparação de segredos
    de todo o projecto a ser feita com `===`.
  */
  const esperado = Buffer.from(desafio.c);
  const obtido = Buffer.from(escrito.replace(/\D/g, ""));

  const bate =
    esperado.length === obtido.length && timingSafeEqual(esperado, obtido);

  if (bate) return { estado: "certo", utilizador: desafio.u };

  const tentativas = desafio.tentativas + 1;
  return {
    estado: "errado",
    cookie: selar({ ...desafio, tentativas }),
    restam: Math.max(0, TENTATIVAS - tentativas),
  };
}

/** Quem é que está a meio de entrar, para o segundo ecrã saber a quem falar. */
export function utilizadorDoDesafio(cookie: string | undefined): string | null {
  const desafio = abrir(cookie);
  if (!desafio || desafio.exp < Date.now()) return null;
  return desafio.u;
}

/*
  `goncalo@taskuinhapirata.pt` → `g•••••o@taskuinhapirata.pt`

  O segundo ecrã tem de dizer para onde foi o código, senão quem lá está não
  sabe onde procurar. Mas escrever o endereço por extenso seria oferecê-lo a
  quem chegou ali com uma password roubada. Mostrar as pontas chega para quem é
  dono da caixa reconhecer, e não chega para quem não é.
*/
export function meioEscondido(email: string): string {
  const [nome, dominio] = email.split("@");
  if (!dominio) return "•••";

  const visivel =
    nome.length <= 2 ? nome.slice(0, 1) : `${nome[0]}${"•".repeat(Math.min(nome.length - 2, 6))}${nome.at(-1)}`;

  return `${visivel}@${dominio}`;
}
