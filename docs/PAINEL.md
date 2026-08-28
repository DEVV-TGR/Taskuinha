# O painel

O sítio onde o dono da casa muda preços sem abrir um editor: **`/painel`**.

Faz três coisas na ementa — mudar um preço, acrescentar um prato, tirar um
prato — e edita os contactos e o horário. Não edita o nome nem a descrição de um
prato que já existe: foi decisão do cliente, e é ela que faz o ecrã principal ser
uma lista de preços em vez de um editor de texto.

---

## Como funciona, em três linhas

O painel grava `data/ementa.json` e `data/casa.json` **no próprio repositório**,
pela API do GitHub. A Vercel vê o push e reconstrói o site. Não há base de dados
de conteúdo, e o histórico de quem mudou o quê é o `git log`.

O preço disto é o tempo: **1 a 2 minutos** entre carregar em Publicar e a
alteração estar no ar. O painel diz isso no ecrã, com um contador, e avisa se
passarem cinco minutos sem aparecer.

---

## Como se entra

Não há password.

```
1. escreve-se o email
        ↓
   aparelho já conhecido?  ──sim─→  entra
        ↓ não
2. chega um código de 6 algarismos por email
        ↓
   entra — e este aparelho fica conhecido 30 dias
```

O código vai **no assunto**, para se ler na notificação do telemóvel sem abrir
nada. Vale 10 minutos e serve uma vez só.

**Só entra quem estiver na lista** (`PAINEL_EMAILS`). Um email que não esteja não
recebe nada — mas o ecrã responde exactamente o mesmo, porque distinguir
transformaria o formulário numa ferramenta para descobrir quem tem acesso.

### O que isto é, e o que não é

**É autenticação de factor único, e assumimo-lo.** A caixa de correio é a chave
mestra: quem a controlar, controla o painel.

> **O email de quem entra tem de ter, ele próprio, verificação em dois passos.**
> É a única coisa que separa o painel de um atacante, e é uma pergunta de trinta
> segundos ao cliente. Se ele não tiver, vale a pena ajudar a ligar — leva cinco
> minutos e faz mais pela segurança disto do que qualquer linha de código.

**Endereços individuais, nunca um `geral@`.** Um endereço partilhado por cinco
pessoas não autentica ninguém.

---

## Montar — quatro passos

### 1. Upstash (os contadores)

Vercel → Storage → Marketplace → **Upstash Redis**, plano gratuito. A integração
injecta `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` sozinha; não há
nada para copiar.

É aqui que vivem os contadores de tentativas e de pedidos de código. **Sem eles o
painel recusa-se a abrir em produção** — em serverless não há memória partilhada
entre instâncias, e um contador que se apaga sozinho não é um contador.

### 2. Resend (o email)

Usar a **conta e o domínio da agência**. O domínio verificado governa o
*remetente*, não o destinatário — dá para enviar para qualquer endereço.
Verificar o `taskuinhapirata.pt` gastaria a única vaga do plano gratuito e
obrigava a mexer no DNS do cliente, sem ganho nenhum.

```
RESEND_API_KEY      re_…
RESEND_REMETENTE    Painel Taskuinha <noreply@send.devplus.pt>
```

> **O domínio verificado é `send.devplus.pt`, e não `devplus.pt`.** É um
> subdomínio, e para o Resend a raiz e o subdomínio são dois domínios
> diferentes: um remetente em `@devplus.pt` é recusado com 403, com a mesma
> naturalidade com que recusaria um domínio de outra pessoa.
>
> Esta linha existe porque a versão anterior deste documento dizia que o domínio
> da agência estava "já verificado", sem dizer **qual**. Custou uma hora de
> procura numa chave de API que não tinha problema nenhum. Antes de mexer em
> seja o que for, abrir o Resend → Domains e copiar o que lá está como
> *Verified*, à letra.

**Sem domínio verificado nenhum**, o Resend deixa enviar de
`onboarding@resend.dev` — mas só para o endereço com que a conta foi criada.
Serve para experimentar a volta completa antes de haver DNS tratado; não serve
para o cliente receber nada.

> No plano gratuito, ao atingir o limite diário o envio pausa em vez de ser
> cobrado. Para quem está à espera do código isso é indistinguível de uma avaria,
> e ninguém avisa — vale a pena um alerta de falha do lado do Resend.

### 3. A lista de quem entra

```
PAINEL_EMAILS    goncalo@…,tomas@…
```

Acrescentar uma pessoa é juntar o email e fazer redeploy. Tirar é apagar da lista.

> **Mudar uma variável não afecta as funções já publicadas.** É preciso um
> redeploy para a nova valer.

### 4. O token do GitHub

Um **fine-grained personal access token**, criado por alguém com acesso de escrita
ao `DEVV-TGR/Taskuinha`:

- Resource owner: **DEVV-TGR** ← o engano mais comum é deixar a conta pessoal, e
  aí o token não vê o repositório e dá 404
- Repository access: **Only select repositories** → **Taskuinha**
- Repository permissions: **Contents: Read and write** (o `Metadata: Read-only`
  vem sozinho e é obrigatório)
- Mais nada. Sem Workflows, sem Pull requests, sem Administration.

> **Caduca ao fim de um ano, no máximo.** Quando expirar, o painel diz *"o token
> expirou ou perdeu permissões"* em vez de falhar em silêncio — mas continua a
> ser preciso alguém renová-lo. Vale um lembrete no calendário.

---

## Recomendado: a regra de rate limiting

Os contadores do Upstash limitam por email e por código. A regra do firewall
limita o **volume bruto**, na borda, antes de haver compute — um pedido travado lá
não custa nada. As duas coisas são complementares.

Dashboard → Projecto → **Firewall** → Configure → New Rule:

- **If**: `Request Path` *starts with* `/painel/entrar` **AND** `Request Method`
  *equals* `POST`
- **Then**: **Rate Limit**, janela de **60s**, limite de **5**, chave **IP
  Address**, acção **Challenge**

Três coisas que decidem se funciona:

- **O filtro `POST` é obrigatório.** A entrada é uma server action, e uma server
  action é um POST para o caminho da própria página. Sem o filtro, a regra conta
  também os GETs de quem abre o ecrã, e o contador esgota-se sozinho.
- **`Challenge` e não `Deny`.** Quem se engana resolve um desafio e continua; um
  bot não resolve.
- **Começar com a acção `Log`** durante uns dias, ver quantos pedidos legítimos
  apanharia, e só depois passar a `Challenge`.

A regra cobre os dois ecrãs, porque o segundo é `/painel/entrar/codigo`.

### Os limites, todos juntos

| Regra | Limite | Janela | Onde |
|---|---|---|---|
| Tentativas por código | 5 | vida do código | Upstash |
| Pedidos de código por email | 3 | 15 min | Upstash |
| Pedidos por IP | 10 | 15 min | Upstash |
| Pedidos por IP, na borda | 5 | 60 s | Vercel Firewall |
| **Envios ao todo** | **40** | **24 h** | **Upstash** |
| Validade do código | — | 10 min | Upstash (TTL) |
| Uso do código | 1 vez | — | apagado ao ser aceite |

### Porque é que há um limite que não tem chave nenhuma

Todos os outros contam por alguma coisa: por email, por endereço de rede, por
código. Nenhum deles vê o total, e é isso que um ataque repartido por muitos IPs
explora — cada um deles dentro do seu limite, e a soma a gastar a quota que
interessa: os **100 envios diários** do plano gratuito do Resend, que ao serem
atingidos param o envio e fecham o painel a quem tem acesso a sério.

Com dois endereços na lista, os limites por chave deixavam passar ~576 envios por
dia. O teto de 40 é o que fecha essa conta. Está muito acima do uso real — duas
pessoas, e aparelhos lembrados 30 dias que nem chegam a pedir código — e muito
abaixo dos cem.

Se for atingido, fica no registo da Vercel: `teto diário de envios esgotado`. Em
condições normais isso não acontece, e se acontecer o número é que está errado.

### Os emails nos registos vão mascarados

`g•••••o@dominio.pt`, e não o endereço por extenso. Chega para perceber de que
domínio vem uma sondagem e se é sempre o mesmo a insistir; o que deixa de existir
é uma lista de endereços legível no registo da Vercel. O mesmo vale para o que o
Resend responde quando um envio falha.

---

## Os dados, e como se repõem

**Não há base de dados, e por isso não há backup para montar.** Cada gravação do
painel é um commit no `DEVV-TGR/Taskuinha` — os dados são o repositório, com o
histórico todo, no GitHub e em cada clone que exista.

Repor uma alteração é git, e mais nada:

```sh
git log --oneline -- data/          # qual foi o commit
git revert <commit>                 # desfazer inteiro
git checkout <commit>^ -- data/ementa.json   # ou só um ficheiro
git push
```

O push refaz o deploy e o site volta ao que era em ~2 minutos. **Testado**, num
clone, sobre um commit verdadeiro do painel: o ficheiro reposto passa na
validação do `lib/painel/validar.ts` e o `next build` corre.

No Upstash não há nada para repor. Tudo o que lá vive tem prazo — códigos de 10
minutos, contadores de 15, aparelhos de 30 dias — e a única chave que não expira,
o `painel:segredo`, nasce sozinha outra vez se desaparecer. O preço de a perder é
toda a gente ter de voltar a entrar, que é precisamente o botão de emergência.

---

## Alertas

O que é código já cá está: as falhas de autenticação, os limites esgotados e os
erros de envio ficam no registo da Vercel com o prefixo `[painel]`. O resto são
dois interruptores em painéis de terceiros, e não se ligam a partir do
repositório:

- **Vercel** → Projecto → Observability → Alerts: um alerta de picos de erro 5xx
  e de invocações. É o que avisa que alguma coisa está a acontecer antes de
  alguém telefonar.
- **Resend** → Settings → Notificações de falha de envio. O plano gratuito pausa
  o envio ao atingir o limite diário **sem avisar ninguém** — para quem está à
  espera do código, isso é indistinguível de uma avaria.

---

## Experimentar na própria máquina

Um `.env.local` com `PAINEL_EMAILS` chega — o `.gitignore` já o apanha.

**Sem `RESEND_API_KEY`, e só em desenvolvimento, o código sai no terminal** onde
estiver o `npm run dev`, dentro de uma caixa difícil de não ver. Não é uma porta
traseira: o código continua a ser gerado, exigido, e a ter de bater certo — muda
só por onde sai, e sai para a mesma pessoa que está a tentar entrar. Em produção
o ramo não existe.

**Sem Upstash**, os contadores caem para a memória do processo, com um aviso no
arranque. Chega para carregar num botão; não chega para produção, e em produção o
painel recusa-se a abrir sem eles.

Sem `PAINEL_GITHUB_TOKEN`, a entrada e o aspecto do painel vêem-se na mesma; os
ecrãs da ementa e da casa dizem que falta configurar o token.

---

## Quando alguma coisa corre mal

| O que se vê | O que é |
|---|---|
| O código não chega | ver Logs no Resend. Domínio deixou de estar verificado, limite diário atingido, ou foi para o spam |
| *"o domínio do remetente não está verificado"* | o `RESEND_REMETENTE` não usa o domínio que está como *Verified* no Resend — passo 2. É o engano mais provável dos dois |
| *"a chave do serviço de email foi recusada"* | `RESEND_API_KEY` errada ou revogada — passo 2 |
| *"falta configurar o RESEND_…"* | a variável não existe nas Environment Variables, ou faltou o redeploy — passo 2 |
| Escreveu o email e não recebeu nada, sem erro | o email não está no `PAINEL_EMAILS`. É de propósito que o ecrã não o diz |
| *"falta configurar o PAINEL_GITHUB_TOKEN"* | passo 4 |
| *"o token expirou ou perdeu permissões"* | o PAT caducou — passo 4 |
| *"não encontrou o ficheiro no repositório"* | o token ficou com a conta pessoal como Resource owner, ou o `data/` não existe no ramo |
| Pede o código todas as vezes | o browser apaga cookies ao fechar, ou é janela anónima. É o comportamento certo |
| Ninguém entra, e o painel fala em armazenamento | o Upstash caiu ou as variáveis desapareceram — passo 1 |

**Expulsar toda a gente**, se for preciso: apagar a chave `painel:segredo` no
Upstash. Caem as sessões, os códigos a meio e os aparelhos lembrados.

---

## O que fica de fora, e porquê

- **Criar ou apagar categorias.** Escolhem-se de entre as nove que a casa tem.
- **Os 6 destaques da página inicial.** Têm texto e fotografia próprios e vivem em
  `lib/menu.ts`. Apagar no painel um prato que é destaque **é recusado**.
- **Fotografias.** Precisariam de armazenamento de ficheiros e redimensionamento.
- **Rotação do token de aparelho.** É prática recomendada, e aqui o custo é maior
  do que o ganho: duas abas correm a rotação ao mesmo tempo e uma fica com um
  token morto. Com uma ou duas pessoas, a revogação manual — que existe, no fundo
  do painel — vale mais do que a detecção automática de roubo.
- **A ementa impressa** (`ementa-impressa/`) é uma cópia manual e continua a
  dessincronizar-se.

---

## Uma coisa a não fazer sem pensar

**Não activar branch protection na `main`** sem tratar disto ao mesmo tempo. O
`ci.yml` pede essa regra, e faz sentido — mas se for activada sem excepção para o
autor do PAT, o `PUT` do painel passa a ser recusado e o painel morre em silêncio.
