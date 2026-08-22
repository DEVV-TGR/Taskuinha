# Autenticação passwordless por código de email — documento de referência

> Descrição da implementação em uso no painel da Taskuinha (Next 16, Vercel,
> Upstash Redis, Resend). Escrito para ser lido por outra sessão, noutro
> projecto, que queira comparar a sua implementação com esta ou replicá-la.
>
> Não descreve o que *deve* ser feito em geral — descreve o que **está** feito
> aqui, e porquê. Onde houver um nome próprio (`taskuinha_sessao`,
> `PAINEL_EMAILS`), é convenção local e pode ser trocada.

---

## 1. O que isto é, em cinco linhas

Não há password. Escreve-se o email; se estiver numa lista fechada, chega um
código de seis algarismos; escreve-se o código e entra-se. O browser fica com
dois cookies assinados: um de sessão (8 horas) e um de aparelho (30 dias) que
permite saltar o código nas visitas seguintes.

Autenticação de **factor único**: a caixa de correio é a chave mestra.

## 2. Restrições que moldaram o desenho

Importam para perceber as decisões — noutro contexto, algumas mudam.

- **1 a 2 utilizadores**, conhecidos, fixos. Não há registo, não há
  recuperação de conta, não há perfis.
- **Serverless (Vercel)**: não há memória partilhada entre invocações. Um
  contador num `Map` reinicia-se sozinho, e um limite que se apaga a si próprio
  não é um limite. Daí o Redis ser obrigatório, não um extra.
- **Zero dependências de autenticação.** Nem `next-auth`, nem `jose`, nem SDK
  do Upstash ou do Resend. Só `node:crypto` e `fetch`. As `dependencies` do
  projecto inteiro são: `next`, `react`, `react-dom`, `motion`,
  `@phosphor-icons/react`, `server-only`.
- **Next 16**, onde o antigo `middleware.ts` passou a chamar-se `proxy.ts`, na
  raiz, e corre em runtime Node (já há `node:crypto` — foi por isso que o
  `jose` deixou de ser preciso).

## 3. Os ficheiros

| Ficheiro | Papel |
|---|---|
| `proxy.ts` (raiz) | Verificação **optimista**: o cookie existe? Não é a fechadura. |
| `lib/painel/porta.ts` | **A fechadura.** `exigirSessao()` / `exigirSessaoNaAccao()` |
| `lib/painel/sessao.ts` | Selar e abrir os cookies de sessão e de aparelho |
| `lib/painel/codigo.ts` | O código de 6 algarismos: gerar, guardar, conferir |
| `lib/painel/chaves.ts` | Segredo mestre + HKDF, uma chave por uso |
| `lib/painel/utilizadores.ts` | A allowlist de emails |
| `lib/painel/limites.ts` | Rate limiting por email e por IP |
| `lib/painel/redis.ts` | Upstash por REST, sem SDK |
| `lib/painel/email.ts` | Resend por REST, sem SDK |
| `app/painel/accoes.ts` | As server actions: pedir, confirmar, reenviar, sair |
| `app/painel/entrar/page.tsx` | Ecrã 1 — o email |
| `app/painel/entrar/codigo/page.tsx` | Ecrã 2 — o código |
| `components/painel/FormularioDeEntrada.tsx` | Formulário do ecrã 1 |
| `components/painel/FormularioDeCodigo.tsx` | Formulário do ecrã 2 |

## 4. O modelo de dados

### Cookies (todos `httpOnly`, `sameSite: lax`, `path: "/painel"`, `secure` só em produção)

| Cookie | Conteúdo | Validade |
|---|---|---|
| `taskuinha_sessao` | `s2.{corpo}.{hmac}`, corpo = `{e: email, exp}` | 8 h |
| `taskuinha_aparelho` | `s2.{corpo}.{hmac}`, corpo = `{e: email, s: segredo, exp}` | 30 dias |
| `taskuinha_desafio` | `d1.{id}.{hmac}` — só o `id`, o código não vai aqui | 10 min |

`path: "/painel"` e não `/`: assim nenhum cookie viaja nos pedidos às páginas
públicas servidas do CDN.

### Chaves do Redis

| Chave | Valor | TTL |
|---|---|---|
| `painel:segredo` | 32 bytes base64 — o segredo mestre | nenhum |
| `otp:{id}` | `{email, hash: sha256(código)}` | 600 s |
| `otp-tentativas:{id}` | contador `INCR` | 600 s |
| `aparelho:{sha256(segredo)[0:32]}` | o email | 30 dias |
| `pedidos:{sha256(email)[0:32]}` | contador `INCR` | 900 s |
| `pedidos-ip:{ip}` | contador `INCR` | 900 s |

Repare-se no padrão: **o que vai para o cookie é o segredo; o que vai para o
Redis é o hash dele.** Ler o armazenamento não permite reconstruir cookies.

## 5. Fluxo A — pedir o código

`app/painel/accoes.ts` → `pedirCodigo(estado, formData)`, uma server action.

```
email normalizado (trim + lowercase)
  │
  ├─ não tem "@"?  → erro "Escreve um endereço de email."
  │
  ├─ podePedirCodigo(email)          ← consome orçamento SEMPRE, mesmo fora da lista
  │     └─ esgotado → { enviado: true }   ← resposta idêntica, log interno
  │
  ├─ autorizado(email)               ← a allowlist
  │     └─ não está → { enviado: true }   ← resposta idêntica, log interno
  │
  ├─ aparelhoConhecido(cookie, email)?
  │     ├─ SIM → sela sessão, redirect("/painel")        ← salta o código
  │     └─ NÃO → apagarDesafio(anterior)
  │              código = randomInt(0, 1_000_000)
  │              enviarCodigo(email, código)
  │              SET otp:{id} = {email, sha256(código)} EX 600
  │              cookie taskuinha_desafio = d1.{id}.{hmac}
  │              redirect("/painel/entrar/codigo")
```

**Três pontos que definem este fluxo:**

**(a) A resposta é sempre a mesma.** Um email da lista e um de fora saem daqui
com `{ enviado: true }`, e o ecrã escreve *"Se este email tiver acesso ao
painel, o código chega em instantes"*. Se distinguisse, o formulário passava a
ser uma ferramenta para descobrir quem tem acesso.

**(b) O orçamento é consumido antes de saber se o email existe.** Não é
detalhe: se só contasse para os autorizados, o comportamento a partir do quarto
pedido revelaria quais os endereços que existem — exactamente a enumeração que
(a) evita.

**(c) O `redirect` fica fora do `try`.** No Next, o `redirect()` funciona
atirando uma excepção que o framework apanha; um `catch` à volta engole-a em
silêncio. Por isso o que se decide dentro do `try` é um booleano, e o salto
dá-se depois. **Este é o erro mais fácil de cometer a replicar isto.**

```ts
let jaConhecido = false;
try {
  /* … tudo o que fala com o Redis ou com o Resend … */
} catch (erro) {
  if (erro instanceof ErroDoRedis) return { erro: erro.paraOEcra };
  if (erro instanceof ErroAoEnviar) return { erro: erro.paraOEcra };
  throw erro;
}
redirect(jaConhecido ? "/painel" : "/painel/entrar/codigo");
```

## 6. Fluxo B — confirmar o código

`confirmarCodigo(estado, formData)` → `conferirCodigo()` em `codigo.ts`.

```
abrir cookie do desafio (verifica HMAC) → id
  │  sem id → { estado: "sem-desafio" }
  │
GET otp:{id}
  │  vazio → { estado: "expirado" }        ← expirou, foi usado, ou foi queimado
  │
INCR otp-tentativas:{id}                   ← SOMA ANTES DE COMPARAR
  │  > 5 → DEL otp:{id}, { estado: "expirado" }
  │
timingSafeEqual(hash guardado, sha256(escrito))
  │  não bate → { estado: "errado", restam: 5 - tentativa }
  │
DEL otp:{id} + DEL otp-tentativas:{id}     ← uso único
{ estado: "certo", email }
```

Com o veredicto `certo`, a action sela os dois cookies e apaga o do desafio.

**Somar antes de comparar** é o detalhe mais fácil de errar e o mais fácil de
não notar. Se o contador subisse *depois* da comparação, dois pedidos
simultâneos comparariam ambos antes de qualquer um somar — e passariam
tentativas a mais em cada corrida. Somar primeiro é o que faz a quinta ser
mesmo a quinta.

**Uso único**: a chave é apagada ao ser aceite. Um código que já entrou não
volta a entrar, mesmo dentro dos 10 minutos — o que importa se o email for lido
mais tarde por outra pessoa.

**Normalização da entrada**: `escrito.replace(/\D/g, "")`, para aceitar
`"384 921"` colado do assunto do email.

## 7. Fluxo C — o aparelho lembrado

O que evita pedir o código de cada vez. Duas verificações, e as duas são
precisas:

```ts
export async function aparelhoConhecido(valor, email) {
  const lido = await abrirComo("aparelho", valor);
  if (lido?.e !== email || typeof lido.s !== "string") return false;   // 1
  return (await ler(chaveDoAparelho(lido.s))) === email;               // 2
}
```

1. **A assinatura do cookie** prova que fomos nós a emiti-lo.
2. **O registo no Redis** prova que não foi revogado desde então. Sem esta, o
   botão de "esquecer este aparelho" não fazia nada.

A comparação do email não é decorativa: sem ela, um aparelho lembrado para uma
pessoa deixava outra pessoa da lista entrar sem código.

**O token não roda.** A prática recomendada é emitir um token novo a cada uso
para detectar cópias. Aqui não se faz, deliberadamente: duas abas abertas
correm a rotação ao mesmo tempo, uma fica com um token morto, e a resposta
habitual a essa detecção (apagar todos os aparelhos) transforma uma corrida
banal numa expulsão geral. Com uma ou duas pessoas, a probabilidade de duas
abas é muito maior do que a de um cookie roubado.

## 8. Fluxo D — a guarda em cada pedido

**Duas camadas, e a distinção entre elas é o ponto mais importante do
documento.**

### `proxy.ts` — optimista, não é segurança

```ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/painel/entrar")) return NextResponse.next();
  if (!request.cookies.has(NOME_DO_COOKIE)) {
    return NextResponse.redirect(new URL("/painel/entrar", request.nextUrl));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/painel", "/painel/:path*"] };
```

Olha se o cookie **existe**. Não o abre, não verifica a assinatura, não toca em
segredos. Serve duas coisas: poupar um render a quem chega sem sessão, e
garantir que nenhuma rota nova fica por cobrir por esquecimento.

Um cookie com o nome certo e conteúdo inventado passa por aqui — e morre na
camada seguinte.

Não tocar em segredos aqui tem uma vantagem prática: o caminho de quem não tem
sessão funciona num ambiente sem variáveis nenhumas, que é o do teste de fumo
no CI.

### `lib/painel/porta.ts` — a fechadura

```ts
export const sessao = cache(async () => {
  const valor = (await cookies()).get(NOME_DO_COOKIE)?.value;
  return abrir(valor);
});

export const exigirSessao = cache(async () => {      // para páginas
  const s = await sessao();
  if (!s) redirect("/painel/entrar");
  return s;
});

export async function exigirSessaoNaAccao() {        // para server actions
  const s = await sessao();
  if (!s) throw new Error("Sem sessão.");
  return s;
}
```

**Chamada dentro de cada `page.tsx` e à cabeça de cada server action** — o mais
perto possível dos dados.

**Porque não no layout:** um layout não é fronteira de segurança. Não volta a
renderizar em navegação do lado do cliente e não impede um segmento filho de
correr. Um `exigirSessao()` no layout dava a sensação de proteger tudo o que
está por baixo e não protegia nada. (O layout chama a `sessao()` — para mostrar
quem está ligado — e mais nada.)

**Porque as actions atiram em vez de redireccionar:** uma server action é um
ponto de entrada como outro qualquer, pode ser chamada por um POST feito à mão
sem browser e sem página, e a resposta certa a "não tens sessão" é recusar, não
mandar navegar.

**O `cache` do React** memoiza dentro do mesmo render: a página, o cabeçalho e
o editor pedem a sessão e o cookie só é aberto uma vez. Não é cache entre
pedidos.

Rotas de API seguem a mesma regra — `app/painel/versao/route.ts` chama
`exigirSessaoNaAccao()` antes de responder.

## 9. As primitivas criptográficas

### 9.1 Selar e abrir (`sessao.ts`)

JWTs HS256 sem a papelada: `versão.corpo.assinatura`, corpo em JSON base64url.

```ts
async function assinar(rotulo, corpo) {
  return createHmac("sha256", await chave(rotulo))
    .update(`${VERSAO}.${rotulo}.${corpo}`)      // o rótulo entra no HMAC
    .digest("base64url");
}

async function selarComo(rotulo, dados, validade) {
  const corpo = Buffer.from(
    JSON.stringify({ ...dados, exp: Date.now() + validade }),
  ).toString("base64url");
  return `${VERSAO}.${corpo}.${await assinar(rotulo, corpo)}`;
}
```

**A abertura, e os quatro cuidados que a definem:**

```ts
async function abrirComo(rotulo, valor) {
  if (!valor) return null;
  const partes = valor.split(".");
  if (partes.length !== 3 || partes[0] !== VERSAO) return null;
  const [, corpo, selo] = partes;

  let esperado;
  try {
    esperado = Buffer.from(await assinar(rotulo, corpo));
  } catch (erro) {
    if (erro instanceof ErroDoRedis) { console.error(…); return null; }  // (4)
    throw erro;
  }

  const recebido = Buffer.from(selo);
  if (esperado.length !== recebido.length) return null;                  // (3)
  if (!timingSafeEqual(esperado, recebido)) return null;

  /* Só a partir daqui é que estes bytes são de confiança. */            // (1)
  try {
    const lido = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8"));
    if (typeof lido !== "object" || lido === null) return null;
    const { exp } = lido;
    if (typeof exp !== "number" || exp < Date.now()) return null;        // (2)
    return lido;
  } catch { return null; }
}
```

1. **A assinatura verifica-se antes de o JSON ser lido.** Um `JSON.parse` sobre
   bytes que ainda não se sabe se são nossos é superfície de ataque de graça.
2. **A validade vai dentro do corpo assinado, e é verificada.** O `Max-Age` do
   cookie é do cliente e não vale nada.
3. **`timingSafeEqual` com guarda de comprimento** — a função atira se os
   buffers tiverem tamanhos diferentes, portanto a guarda não é opcional.
4. **Não conseguir verificar é motivo para não confiar, nunca para confiar.**
   Se o armazenamento estiver em baixo, a chave não vem, e a resposta é `null`
   — falha fechado, e quem estava lá dentro dá por si no ecrã de entrada.

### 9.2 Uma chave por uso (`chaves.ts`)

Três usos, três chaves independentes, derivadas por HKDF de um segredo mestre:

```ts
export async function chave(uso: "sessao" | "desafio" | "aparelho", bytes = 32) {
  return Buffer.from(
    hkdfSync("sha256", await segredo(), "", `taskuinha:${uso}:v2`, bytes),
  );
}
```

Sem isto, um selo de sessão podia ser apresentado como selo de aparelho, e uma
fraqueza num uso passava aos outros. O rótulo vai no parâmetro `info` do HKDF
**e** dentro do próprio HMAC — cinto e suspensórios, e ambos custam zero.

Sem sal: a separação que interessa é entre usos, e essa é feita pelo rótulo. Um
sal fixo escrito no código não acrescentava nada.

**De onde vem o segredo mestre** — a decisão menos convencional deste ficheiro.
Não é uma variável de ambiente. **Nasce à primeira utilização e fica no Redis:**

```ts
let emCache: string | null = null;

async function segredo(): Promise<string> {
  if (emCache) return emCache;
  const existente = await ler("painel:segredo");
  if (existente) { emCache = existente; return existente; }

  const novo = randomBytes(32).toString("base64");
  const foiEle = await guardarSeNovo("painel:segredo", novo);   // SET NX, atómico
  emCache = foiEle ? novo : ((await ler("painel:segredo")) ?? novo);
  return emCache;
}
```

O `SET NX` é o que importa: se duas instâncias arrancarem ao mesmo tempo, a
primeira ganha e a segunda lê o que ela pôs, em vez de ficarem duas metades do
sistema a assinar com chaves diferentes.

Vantagem: uma variável de ambiente a menos para explicar, gerar e copiar entre
ambientes. Custo: o memoize por instância significa que apagar a chave (o botão
de emergência que revoga tudo) só faz efeito nas instâncias novas.

### 9.3 O código (`codigo.ts`)

```ts
export function gerarCodigo(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}
```

`randomInt` e não `Math.random()` — o segundo é previsível a partir de umas
quantas saídas. Zeros à esquerda para o `000042` ser tão provável como o
`384921`.

**Guardado em SHA-256, nunca em texto.** E aqui o SHA-256 chega, ao contrário
do que aconteceria num cookie: um hash de seis algarismos quebra-se num instante
*se quem o tem puder experimentar à vontade*. No Redis, para chegar ao hash é
preciso já ter as chaves do Redis. `bcrypt` seria lentidão sem ganho — isto
expira em 10 minutos e tem 5 tentativas.

**O cookie do desafio leva o `id` e uma assinatura, e mais nada.** Assinado para
que o `id` não possa ser inventado: sem isso, alguém pedia um código para o seu
próprio endereço e depois trocava o `id` pelo de outra pessoa.

## 10. A allowlist (`utilizadores.ts`)

Uma variável de ambiente, emails separados por vírgulas:

```
PAINEL_EMAILS=goncalo@exemplo.pt,tomas@devplus.pt
```

Sem passwords, sem hashes, sem tabela de utilizadores.

```ts
function carregar(): Utilizador[] {
  const bruto = process.env.PAINEL_EMAILS;
  if (!bruto) return [];                     // falha fechado, sem atirar
  return bruto.split(",")
    .map((e) => e.trim().toLowerCase())      // normalizar
    .filter((e) => e.includes("@") && e.length > 2)
    .map((email) => ({ email, nome: email.split("@")[0] }));
}
```

**Lido dentro da função, nunca em module scope.** O `next build` do CI corre sem
uma única variável definida, e ler no topo do ficheiro rebentava-o. Vale para
todos os ficheiros deste conjunto que tocam em `process.env`.

**Normalizar para minúsculas não é cosmético.** Quem escreve o email no
telemóvel apanha uma maiúscula automática na primeira letra quase sempre. Sem
essa linha, `Goncalo@…` não estaria na lista, e o painel dizia-lhe com toda a
educação que o código ia a caminho — e não ia.

**A allowlist é o que separa isto de um sistema aberto.** Num passwordless
público, qualquer pessoa pede um código para qualquer email e o domínio de
envio queima reputação a mandar correio para o mundo. Aqui a lista é conferida
**antes** de se enviar seja o que for.

**`meioEscondido()`**: `goncalo@casa.pt` → `g•••••o@casa.pt`. O segundo ecrã
tem de dizer para onde foi o código, mas escrevê-lo por extenso confirmaria a
quem o escreveu que aquele endereço tem acesso.

## 11. Limites (`limites.ts`)

Sem password, isto deixou de ser defesa em profundidade e passou a ser **a**
defesa. Um código de seis algarismos são um milhão de hipóteses.

```
JANELA_S = 15 min     POR_EMAIL = 3     POR_IP = 10
```

```ts
export async function podePedirCodigo(email: string): Promise<boolean> {
  const [porEmail, porIp] = await Promise.all([
    somar(chaveDoEmail(email), JANELA_S),
    somar(`pedidos-ip:${await origem()}`, JANELA_S),
  ]);
  return porEmail <= POR_EMAIL && porIp <= POR_IP;
}
```

**São precisos os dois limites, e por razões diferentes:**

- **5 tentativas por código** reduz a janela de um milhão para cinco.
- **3 códigos por email/15 min** fecha a porta que quase todas as
  implementações de OTP deixam aberta: sem ele, quem ataca faz 5 tentativas,
  pede outro código, mais 5, e assim sucessivamente até acertar.

O **reenvio conta como pedido** — senão era a porta das traseiras do limite.

O email vai em hash na chave do Redis: quem tiver as chaves vê
`pedidos:9f86d0…` e não `pedidos:goncalo@…`.

**O limite por IP vale o que a plataforma o fizer valer.** Na Vercel o
`x-forwarded-for` é reescrito pela plataforma e o primeiro endereço é o de quem
pediu. Fora da Vercel o cliente controla o cabeçalho — é por isso que o limite
por IP é o terceiro da lista e não o primeiro. Volume bruto trava-se na borda
(regra de firewall), antes de haver compute.

## 12. Armazenamento (`redis.ts`)

Upstash por REST, só `fetch`. Os comandos vão no caminho: `URL/INCR/chave`.

```ts
const caminho = partes.map((p) => encodeURIComponent(String(p))).join("/");
const resposta = await fetch(`${ligado.url}/${caminho}`, {
  headers: { Authorization: `Bearer ${ligado.token}` },
  cache: "no-store",
});
```

**O `encodeURIComponent` não é opcional** — um email tem `@` e `.`, e um valor
pode ter uma barra; sem ele, uma chave com barra parte o caminho em dois e o
comando vai dar a outro sítio.

**O contador atómico**, que é a razão de existir do ficheiro:

```ts
export async function somar(chave: string, segundos: number): Promise<number> {
  const total = await comando<number>(["INCR", chave]);
  if (total === 1) await comando(["EXPIRE", chave, segundos]);
  return total;
}
```

O `EXPIRE` **só quando o contador nasce**. Se fosse a cada soma, cada tentativa
empurrava a janela para a frente e o limite nunca fechava.

**Recuo em desenvolvimento**: sem Upstash configurado e **só** fora de
produção, os contadores vivem num `Map` da instância. Em produção, sem ligação,
atira `ErroDoRedis`. Um painel que conta em memória é um painel que não conta, e
é melhor não abrir do que abrir sem trinco.

**Aceita dois pares de nomes** — `UPSTASH_REDIS_REST_*` e `KV_REST_API_*` —
porque apontam ao mesmo serviço consoante a porta por onde o projecto foi
ligado.

## 13. Envio (`email.ts`)

Resend por REST, sem SDK. Três detalhes que valem a pena copiar:

**O código vai no assunto**: `"384 921 — entrar no painel"`. Quem estiver no
telemóvel lê-o na notificação, sem desbloquear e sem abrir o email.

**`Idempotency-Key: painel-{email}-{código}`** — dois cliques no botão dão dois
pedidos iguais e o Resend manda um email só. É por código e por destinatário,
portanto um código novo continua a produzir um email novo.

**Em desenvolvimento sem chave de API, o código sai no terminal**, numa caixa
desenhada. Não é uma porta traseira: o código continua a ser gerado, exigido, e
tem de bater certo — muda só por onde sai. Duas condições, ambas necessárias:
`NODE_ENV !== "production"` **e** não haver `RESEND_API_KEY`.

**Erros com frases distintas por causa** (`403` domínio não verificado, `401`
chave recusada, `429` limite diário, `0` variável em falta). O detalhe cru vai
para o registo do servidor; ao ecrã vai a frase educada. *Uma mensagem errada é
pior do que uma genérica: a genérica faz perguntar, a errada faz procurar no
sítio errado durante uma hora.*

Armadilha registada: no Resend, o domínio do remetente tem de ser, caracter a
caracter, o que aparece como *Verified*. Um subdomínio verificado
(`send.exemplo.pt`) não autoriza a raiz (`exemplo.pt`) — dá 403.

## 14. O lado do cliente

Server actions com `useActionState`, sem estado de autenticação no cliente e
sem token em JavaScript. Os cookies são `httpOnly` e o cliente nunca lhes toca.

**Ecrã 1** — um campo. `type="email"`, `autoComplete="email"`,
`autoCapitalize="none"`, `autoCorrect="off"`, `autoFocus`.

**Ecrã 2** — **uma caixa larga, não seis caixinhas separadas.** As seis
caixinhas são bonitas e são péssimas: colar um código de seis dígitos numa
delas costuma encher só a primeira, e apagar a meio salta para a caixa errada.
Uma caixa larga aceita colar, escrever, e o preenchimento automático.

```jsx
<input
  name="codigo"
  inputMode="numeric"                  // teclado de algarismos no telemóvel
  autoComplete="one-time-code"         // o iOS oferece o código por cima do teclado
  pattern="[0-9]*"
  maxLength={7}                        // 7 e não 6 — aceita "384 921" com espaço
  required autoFocus
/>
```

O `autoComplete="one-time-code"` é o que poupa a ida à caixa de correio: assim
que o email chega, o iOS oferece o código. É a diferença entre um passo e três.

## 15. Variáveis de ambiente

| Variável | Para quê | Sem ela |
|---|---|---|
| `PAINEL_EMAILS` | A allowlist | Ninguém entra (falha fechado) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Contadores, códigos, segredo | Produção: atira. Dev: `Map` em memória |
| `RESEND_API_KEY` | Enviar o código | Dev: sai no terminal. Produção: erro explicado |
| `RESEND_REMETENTE` | `Nome <endereço@domínio-verificado>` | Erro explicado |

Nenhum segredo de sessão: nasce sozinho no Redis (§9.2).

**Todas lidas dentro de funções, nunca em module scope.**

## 16. Checklist para replicar

O que não se pode mudar sem partir alguma coisa:

- [ ] A verificação real está **em cada página e em cada action**, não no
      middleware nem no layout.
- [ ] O middleware/proxy só verifica **existência** do cookie e não toca em
      segredos.
- [ ] A assinatura é verificada **antes** de qualquer `JSON.parse`.
- [ ] A validade vai **dentro** do corpo assinado, e é verificada.
- [ ] `timingSafeEqual` **com guarda de comprimento** em todas as comparações.
- [ ] Chaves separadas por uso (HKDF com `info`), e o rótulo dentro do HMAC.
- [ ] O contador de tentativas é **atómico** (`INCR`) e **soma antes de
      comparar**.
- [ ] Dois limites: por código **e** por pedido de código. O reenvio conta.
- [ ] O `EXPIRE` do contador só quando ele nasce.
- [ ] Uso único: a chave do código é apagada ao ser aceite.
- [ ] Resposta uniforme para email da lista e de fora — **incluindo o consumo
      de orçamento**.
- [ ] Falha fechado em todo o lado: sem armazenamento não entra ninguém.
- [ ] O `redirect()` **fora** de qualquer `try/catch`.
- [ ] `process.env` lido dentro de funções.
- [ ] Emails normalizados para minúsculas antes de comparar.
- [ ] Cookies `httpOnly`, `sameSite`, `path` limitado à área protegida, e o
      `delete` com o **mesmo `path`** com que foram postos.

## 17. O que este desenho assume, e onde deixa de servir

Vale a pena ler antes de copiar para um contexto diferente:

- **É factor único.** A caixa de correio é a chave mestra. A condição que o
  sustenta não é técnica: quem entra tem de ter verificação em dois passos no
  próprio email.
- **Não há revogação imediata.** Tirar um email da lista não expulsa quem já
  tem sessão — essa dura até 8 horas. (O aparelho lembrado *está* coberto: a
  allowlist é conferida antes.) Com 1–2 pessoas conhecidas isto é irrelevante;
  com dezenas de utilizadores e rotatividade, deixa de ser, e a correcção é
  conferir a allowlist dentro da `sessao()`.
- **A sessão é *stateless*.** Sair apaga o cookie, mas um cookie copiado antes
  continua válido até expirar. Corrigir obrigava a um registo de sessões.
- **O aparelho de 30 dias é conforto assumido.** Se o painel passar a ser usado
  num tablet partilhado ao balcão, isto tem de baixar ou desaparecer — nesse
  cenário é uma chave que fica em cima do balcão.
- **Emails individuais, nunca um `geral@`.** Um endereço visto por cinco
  pessoas não autentica ninguém.
- **Quem tiver as chaves do Redis forja cookies de sessão.** Aceitável, porque
  nessa altura já tem o conteúdo todo de qualquer maneira.

