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
nenhuma, e o histórico de quem mudou o quê é o `git log`.

O preço disto é o tempo: **1 a 2 minutos** entre carregar em Publicar e a
alteração estar no ar. O painel diz isso no ecrã, com um contador, e avisa se
passarem cinco minutos sem aparecer.

---

## Como se entra

Dois passos, sempre:

```
1. utilizador + palavra-passe
        ↓
   aparelho já conhecido?  ──sim─→  entra
        ↓ não
2. código de 6 algarismos, que vai por email
        ↓
   entra — e este aparelho fica conhecido 30 dias
```

O código vai **no assunto do email**, para se ler na notificação do telemóvel
sem ter de abrir nada. Vale 10 minutos e serve uma vez só.

Depois de acertar o código uma vez, aquele telemóvel ou browser só volta a
pedi-lo daqui a 30 dias. Noutro aparelho, ou numa janela anónima, pede outra vez.

> **Quem controla a caixa de correio controla o painel.** É a natureza do
> segundo passo por email — mais fraco do que uma app de códigos, e muito mais
> fácil para quem não quer instalar nada. **O email que recebe os códigos deve
> ele próprio ter verificação em dois passos ligada.**

---

## Montar — três passos

### 1. As variáveis de ambiente, na Vercel

Project → Settings → Environment Variables. **Marcar como *Sensitive***, para não
serem legíveis de volta no dashboard depois de gravadas.

```
PAINEL_UTILIZADOR    goncalo
PAINEL_PASSWORD      a que ele escolher
PAINEL_EMAIL         goncalo@…            ← para onde vai o código
RESEND_API_KEY       re_…                 ← do passo 2
PAINEL_GITHUB_TOKEN  ghp_…                ← do passo 3
```

Escrevem-se à mão e acabou. Não há script para correr nem hash para gerar.

Para uma segunda pessoa, é o mesmo trio com um número ao lado —
`PAINEL_UTILIZADOR_2`, `PAINEL_PASSWORD_2` e `PAINEL_EMAIL_2`, até ao `_5`.

> **Faltar o email é o mesmo que o utilizador não existir.** É deliberado: sem
> email não há segundo passo, e um utilizador que entrasse só com password era
> uma porta aberta ao lado da que se acabou de trancar.

> **O email é fixo aqui, não se escreve no ecrã de entrada.** Se fosse escrito,
> quem tivesse a password mandava o código para o seu próprio endereço e o
> segundo passo não valia nada.

> **Mudar uma variável não afecta as funções já publicadas.** É preciso um
> redeploy para a nova valer. Quem mudar a password, testar, e concluir que o
> painel está partido, está a ver isto.

> **Mudar a password revoga tudo.** Sessões abertas, códigos a meio, e todos os
> aparelhos que estavam lembrados os 30 dias. É de propósito: as chaves saem das
> próprias credenciais, o que dispensa mais uma variável para gerar — e dá um
> botão de emergência que é um só e apaga tudo.

**Escolher a password.** Que não seja a password de mais nada.

Ela fica em claro nas variáveis de ambiente da Vercel. Guardar um hash protegia
de quem as conseguisse ler — e essa pessoa lê também o `PAINEL_GITHUB_TOKEN`,
que já dá escrita no repositório, por isso o hash não fecharia porta nenhuma que
o token não deixasse aberta. O que se perde mesmo é a password ser reutilizável
noutro sítio.

**E é aqui que o segundo passo muda a conta.** Uma password sozinha já não
chega para entrar: quem a souber — porque a adivinhou, porque a viu, ou porque
leu as variáveis — continua a precisar da caixa de correio do Gonçalo. É essa a
razão de existir.

### 2. A conta de email (Resend)

O painel precisa de um serviço que envie o email do código.

1. Conta em **[resend.com](https://resend.com)** — grátis até 3000 emails por
   mês, e isto vai usar uns 20.
2. **Domains → Add Domain → `taskuinhapirata.pt`.** O Resend dá três registos
   DNS (SPF, DKIM e um de retorno) para pôr onde o domínio está alojado. É o que
   permite enviar de `codigo@taskuinhapirata.pt` em vez de um endereço
   emprestado que aterra no spam. Demora uns minutos a verificar.
3. **API Keys → Create**, com permissão de envio apenas. Copiar para o
   `RESEND_API_KEY`.

> Se o Resend estiver em baixo, não se entra em **aparelhos novos**. Os que já
> estão conhecidos continuam a entrar durante os 30 dias.

### 3. O token do GitHub

Um **fine-grained personal access token**, criado por alguém com acesso de
escrita ao `DEVV-TGR/Taskuinha`:

- Resource owner: **DEVV-TGR**
- Repository access: **Only select repositories** → **Taskuinha**
- Repository permissions: **Contents: Read and write** (o `Metadata: Read-only`
  vem sozinho e é obrigatório)
- Mais nada. Sem Workflows, sem Pull requests, sem Administration.

> **Caduca.** Um fine-grained PAT dura no máximo um ano. Quando expirar, o painel
> deixa de gravar — e diz *"o token expirou ou perdeu permissões"* em vez de
> falhar em silêncio, mas continua a ser preciso alguém renová-lo. Vale a pena um
> lembrete no calendário.

---

## Experimentar na própria máquina

Um `.env.local` chega — o `.gitignore` já o apanha, e não tem nada que ver com
o que está na Vercel:

```
PAINEL_UTILIZADOR=…
PAINEL_PASSWORD=…
PAINEL_EMAIL=…
```

**Sem `RESEND_API_KEY`, e só em desenvolvimento, o código do segundo passo sai
no terminal** onde estiver o `npm run dev`, dentro de uma caixa difícil de não
ver. Não é uma porta traseira: o código continua a ser gerado, exigido, e a ter
de bater certo — muda só por onde sai, e sai para a mesma pessoa que está a
tentar entrar. Em produção o ramo não existe (`NODE_ENV`), e se não houver chave
o painel recusa-se a deixar entrar.

Sem `PAINEL_GITHUB_TOKEN`, a entrada e o aspecto do painel vêem-se na mesma; os
ecrãs da ementa e da casa mostram a mensagem de erro do GitHub em vez dos dados.

---

## Recomendado: a regra de rate limiting

Não é obrigatória para o painel funcionar, mas é o que trava mesmo um bot a
tentar passwords — e configura-se uma vez, sem código.

Dashboard → Projecto → **Firewall** → Configure → New Rule:

- **If**: `Request Path` *starts with* `/painel/entrar` **AND** `Request Method`
  *equals* `POST`
- **Then**: **Rate Limit**, janela de **60s**, limite de **5**, chave **IP
  Address**, acção **Challenge**

Três coisas que decidem se funciona:

- **O filtro `POST` é obrigatório.** A entrada é uma server action, e uma server
  action é um POST para o caminho da própria página. Sem o filtro, a regra conta
  também os GETs do dono a abrir o ecrã, e o contador esgota-se sozinho.
- **`Challenge` e não `Deny`.** Quem se engana cinco vezes resolve um desafio e
  continua; um bot não resolve. Um `Deny` bloqueava o dono um minuto sem
  explicação nenhuma.
- **Começar com a acção `Log`** durante uns dias, ver quantos pedidos legítimos
  apanharia, e só depois passar a `Challenge`.

Existe no plano Hobby: uma regra de rate limit grátis por projecto, com o
primeiro milhão de pedidos incluído por mês.

Há também um contador em memória no código (`lib/painel/travao.ts`), que apanha
um script ingénuo e mais nada — está lá explicado porquê. A regra do firewall é
que é a defesa.

---

## Quando alguma coisa corre mal

| O que se vê | O que é |
|---|---|
| A entrada não aceita a password certa | a variável mudou mas não houve redeploy — ver o aviso do passo 1 |
| *"a chave do serviço de email parece estar errada"* | a `RESEND_API_KEY` está errada ou expirou — passo 2 |
| O código não chega | ver Logs no dashboard do Resend. O mais provável é o domínio ter deixado de estar verificado, ou o email ter ido para o spam |
| Pede o código todas as vezes | o browser está a apagar cookies ao fechar, ou é uma janela anónima. É o comportamento certo |
| *"o token expirou ou perdeu permissões"* | o PAT do GitHub caducou — passo 3 |
| *"alguém gravou entretanto"* | duas pessoas no painel ao mesmo tempo. Recarregar e repetir; **nada foi gravado**, de propósito, para não apagar o trabalho do outro |
| *"passaram cinco minutos e o site continua na versão anterior"* | o build da Vercel falhou. **O site não caiu** — a Vercel mantém o deploy anterior no ar. A alteração está gravada no repositório; ver os registos da Vercel |

---

## O que fica de fora, e porquê

- **Criar ou apagar categorias.** Escolhem-se de entre as nove que a casa tem.
- **Os 6 destaques da página inicial.** Têm texto e fotografia próprios e vivem
  em `lib/menu.ts`. Apagar no painel um prato que é destaque **é recusado**, com
  a razão dita por extenso — senão o build partia-se.
- **Fotografias.** Precisariam de armazenamento de ficheiros e redimensionamento.
- **A ementa impressa** (`ementa-impressa/`) é uma cópia manual e continua a
  dessincronizar-se de cada alteração feita aqui.

---

## Uma coisa a não fazer sem pensar

**Não activar branch protection na `main`** sem tratar disto ao mesmo tempo. O
`ci.yml` pede essa regra, e faz sentido — mas se for activada sem excepção para o
autor do PAT, o `PUT` do painel passa a ser recusado e o painel morre em
silêncio.
