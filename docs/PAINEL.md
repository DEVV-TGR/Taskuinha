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

## Montar — dois passos

### 1. As variáveis de ambiente, na Vercel

Project → Settings → Environment Variables. **Marcar como *Sensitive***, para não
serem legíveis de volta no dashboard depois de gravadas.

```
PAINEL_UTILIZADOR    goncalo
PAINEL_PASSWORD      a que ele escolher
PAINEL_GITHUB_TOKEN  o token do passo 2
```

Escrevem-se à mão e acabou. Não há script para correr nem hash para gerar.

Para uma segunda pessoa, é o mesmo par com um número ao lado —
`PAINEL_UTILIZADOR_2` e `PAINEL_PASSWORD_2`, até ao `_5`.

> **Mudar uma variável não afecta as funções já publicadas.** É preciso um
> redeploy para a nova valer. Quem mudar a password, testar, e concluir que o
> painel está partido, está a ver isto.

> **Mudar a password expulsa quem estiver ligado.** É de propósito: a chave que
> assina o cookie de sessão sai das próprias credenciais, e é isso que evita ter
> de gerar e guardar uma terceira variável. Também é o botão de emergência, se
> alguma vez for preciso.

**Escolher a password.** Que não seja a password de mais nada. Ela fica em claro
nas variáveis de ambiente da Vercel — quem as conseguir ler também lê o
`PAINEL_GITHUB_TOKEN`, que já dá acesso de escrita ao repositório, por isso um
hash não fecharia porta nenhuma que o token não deixasse aberta. O que se perde
mesmo é a password ser reutilizável noutro sítio.

E que não seja `taskuinha2026`: cada tentativa custa ~100 ms e o firewall trava
por IP, mas uma password que está numa lista de palavras cai à mesma.

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
| *"o token expirou ou perdeu permissões"* | o PAT do GitHub caducou — passo 2 |
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
