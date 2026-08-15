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

## Os três passos que ninguém pode fazer por código

Sem estes o painel não arranca.

### 1. As variáveis de ambiente, na Vercel

Project → Settings → Environment Variables. **Marcar as três como *Sensitive***,
para não serem legíveis de volta no dashboard.

| Nome | Onde arranjar |
|---|---|
| `PAINEL_UTILIZADORES` | `npm run palavra-passe` imprime a linha inteira, pronta a colar |
| `PAINEL_SESSAO_SEGREDO` | `openssl rand -base64 32` |
| `PAINEL_GITHUB_TOKEN` | o token do passo 2 |

> **Mudar uma variável não afecta as funções já publicadas.** É preciso um
> redeploy para a nova valer. Quem mudar uma password, testar, e concluir que o
> painel está partido, está a ver isto.

### 2. O token do GitHub

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
>
> Uma GitHub App resolvia a expiração, ao custo de bastante mais montagem: JWT
> assinado com chave privada, troca por um token de instalação de uma hora, e a
> chave em base64 nas variáveis de ambiente. Para uma casa com um painel, o PAT
> é a escolha proporcional.

### 3. A regra de rate limiting, no Vercel Firewall

Dashboard → Projecto → **Firewall** → Configure → New Rule:

- **If**: `Request Path` *starts with* `/painel/entrar` **AND** `Request Method`
  *equals* `POST`
- **Then**: **Rate Limit**, janela de **60s**, limite de **5**, chave **IP
  Address**, acção **Challenge**
- Review Changes → Publish

Três coisas que decidem se isto funciona:

- **O filtro `POST` é obrigatório.** A entrada é uma server action, e uma server
  action é um POST para o caminho da própria página. Sem o filtro, a regra conta
  também os GETs do dono a abrir o ecrã, e o contador esgota-se sozinho.
- **`Challenge` e não `Deny`.** Quem se engana cinco vezes resolve um desafio e
  continua; um bot não resolve. Um `Deny` bloqueava o dono um minuto sem
  explicação nenhuma.
- **Começar com a acção `Log`** durante uns dias, ver na Firewall Overview
  quantos pedidos legítimos apanharia, e só depois passar a `Challenge`.

Existe no plano Hobby: uma regra de rate limit grátis por projecto, com o
primeiro milhão de pedidos incluído por mês.

---

## Acrescentar um utilizador

```bash
npm run palavra-passe
```

Pede o nome, e **carrega em Enter na password** para a deixar gerar. Guarda-a no
gestor de passwords do telemóvel — não há forma de a recuperar depois.

Se já houver um `PAINEL_UTILIZADORES` no ambiente, o script junta-se a ele em vez
de o substituir, e imprime a lista inteira.

> **Porque é que a password é gerada e não escolhida.** É a medida que mais
> protege o painel — mais do que o scrypt, mais do que o firewall, mais do que
> tudo o resto junto. Com ~100 ms por tentativa e a regra do firewall a travar por
> IP, `taskuinha2026` está em qualquer lista de palavras e cai em segundos; 18
> bytes aleatórios não caem nunca. O scrypt não protege uma password fraca —
> protege uma forte, e protege-a sobretudo no dia em que os hashes vazarem.

---

## Quando alguma coisa corre mal

| O que se vê | O que é |
|---|---|
| *"o token expirou ou perdeu permissões"* | o PAT do GitHub caducou — passo 2 |
| *"alguém gravou entretanto"* | duas pessoas no painel ao mesmo tempo. Recarregar e repetir; **nada foi gravado**, de propósito, para não apagar o trabalho do outro |
| *"passaram cinco minutos e o site continua na versão anterior"* | o build da Vercel falhou. **O site não caiu** — a Vercel mantém o deploy anterior no ar. A alteração está gravada no repositório; ver os registos da Vercel |
| A entrada não aceita a password certa | a variável mudou mas não houve redeploy — ver o aviso do passo 1 |

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
