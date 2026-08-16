# Autenticação do Painel de Gestão — Taskuinha

**Projeto:** Painel de gestão web (Next.js, Vercel Pro)
**Autor:** Xquisite / DevPlus
**Data:** 16 de agosto de 2026
**Estado:** Decisão de arquitetura, pré-implementação

---

## 1. Sumário executivo

Este documento analisa duas arquiteturas de autenticação para o painel de gestão da Taskuinha e define os mecanismos de proteção obrigatórios em qualquer uma delas.

A conclusão principal é contra-intuitiva e vale a pena lê-la antes do resto: **a combinação email + password + código por email não é verdadeiro 2FA.** Ambos os fatores acabam na mesma caixa de correio, porque quem controla o email do utilizador também controla o "recuperar password". Na prática são 1,5 fatores com o dobro da fricção.

Perante isso, a opção que descreveste — **entrar só com o email, receber um código, sem password, e apenas para endereços previamente autorizados** — é defensável não por ser mais simples, mas porque é honesta quanto ao seu modelo de segurança e elimina uma superfície de ataque inteira (passwords fracas, reutilizadas, ou vazadas noutros sites).

A decisão real não é "com ou sem password". É **onde está o rate limiting** e **quem consegue pedir códigos**. Essa é a parte que determina se o sistema é seguro ou decorativo.

---

## 2. Opção A — Email + Password + Código OTP por email

### 2.1 Resumo de implementação

| Elemento | Definição |
|---|---|
| Fatores | Password (algo que sabes) + código de 6 dígitos por email |
| Tabelas | `users`, `otp_codes`, `trusted_devices`, `auth_attempts` |
| Fluxo | Email + password → validação bcrypt → gerar OTP → enviar via Resend → validar código → criar sessão |
| Password | Hash com bcrypt (cost 12) ou argon2id |
| Código | 6 dígitos, aleatório criptográfico, hash guardado (nunca em texto simples) |
| Validade | 10 minutos |
| Onboarding | Criar conta + definir password + verificar email |
| Recuperação | Fluxo de "esqueci a password" (mais código a escrever) |

### 2.2 Explicação detalhada

Este é o modelo tradicional e o que a maioria das pessoas espera encontrar. O utilizador introduz email e password, o servidor valida o hash da password, e só depois gera e envia o código de verificação.

**O ponto forte real** é a defesa em profundidade contra um cenário específico: alguém que tenha acesso momentâneo ao email do utilizador (um portátil desbloqueado, uma sessão aberta num computador partilhado) não consegue entrar no painel sem saber também a password. É um cenário estreito, mas existe.

**O ponto fraco que raramente se admite** é o que descrevi no sumário. Se implementares "esqueci a minha password" — e vais ter de implementar, porque o cliente vai esquecer-se — o link de recuperação vai por email. A partir desse momento, o email sozinho dá acesso total à conta. A password deixou de ser um fator independente e passou a ser um obstáculo temporário.

Há ainda um custo operacional escondido. Passwords geram trabalho de suporte: esquecimentos, resets, utilizadores que escolhem `taskuinha2026` e a reutilizam no Gmail. Cada uma dessas situações é uma chamada para ti. E o pior é que a password fraca não protege nada mas dá uma sensação de proteção que leva a relaxar noutros sítios.

**Quando esta opção é a certa:** se o painel vier a ter dados sensíveis (dados de faturação, informação de clientes, RGPD a sério), ou se prevês integrações onde o email não seja o canal de confiança.

---

## 3. Opção B — Passwordless com lista de emails autorizados

### 3.1 Resumo de implementação

| Elemento | Definição |
|---|---|
| Fatores | Posse da caixa de correio (fator único, assumido explicitamente) |
| Tabelas | `allowed_emails`, `otp_codes`, `trusted_devices`, `auth_attempts` |
| Fluxo | Email → verificar se está na allowlist → gerar OTP → enviar via Resend → validar → criar sessão |
| Allowlist | Emails inseridos manualmente por vocês na BD; não há auto-registo |
| Código | 6 dígitos, aleatório criptográfico, hash guardado |
| Validade | 10 minutos |
| Onboarding | Zero. Adicionas o email à tabela e a pessoa já entra |
| Recuperação | Não existe fluxo de recuperação — não há nada para recuperar |

### 3.2 Explicação detalhada

O utilizador escreve o email, recebe um código, escreve o código, entra. Não há password para criar, esquecer, ou recuperar.

**A allowlist é o que torna isto seguro** e é a diferença crítica face a um sistema passwordless público. Num sistema aberto, qualquer pessoa pode pedir um código para qualquer email e tu ficas a enviar emails para o mundo inteiro (com o teu domínio a queimar reputação de envio). Aqui, o servidor verifica primeiro se o email consta de `allowed_emails`. Se não constar, **não envia nada**.

Detalhe importante de implementação: a resposta ao utilizador tem de ser **idêntica** para email autorizado e não autorizado. Algo como "Se este email estiver registado, receberá um código em instantes." Se responderes "email não autorizado", acabaste de construir uma ferramenta que permite a qualquer pessoa descobrir quem tem acesso ao painel. Chama-se enumeração de utilizadores e é um erro comum.

**As vantagens concretas para este projeto:**

- Não existe base de dados de passwords para vazar. Não podes perder o que não guardas.
- Elimina a reutilização de passwords, que é a causa número um de contas comprometidas em pequenos negócios.
- Onboarding de um funcionário novo demora o tempo de um `INSERT`. Nada de "envia-me a password", nada de passwords partilhadas no WhatsApp da equipa.
- Revogação instantânea. Alguém sai da empresa, apagas a linha, acabou o acesso.
- Menos código a escrever e a manter: sem hashing de passwords, sem fluxo de reset, sem regras de complexidade, sem ecrã de "alterar password".

**As desvantagens que tens de aceitar conscientemente:**

- É autenticação de fator único. A caixa de correio é a chave mestra, ponto final. Se o Gmail do dono for comprometido, o painel vai atrás.
- Cada login exige ir buscar o email. Sem "remember this device" (secção 6), isto torna-se irritante depressa.
- Se o email for de um domínio partilhado (`geral@taskuinha.pt` visto por cinco pessoas), a autenticação perde o significado. **Exige contas individuais.**

**Mitigação obrigatória se escolheres esta via:** confirma com o cliente que a conta de email dele tem 2FA ativo. É uma pergunta de trinta segundos e é literalmente a única coisa que separa o painel de um atacante. Se ele não tiver, ajuda-o a ativar — leva cinco minutos e faz mais pela segurança do sistema do que qualquer coisa que escrevas em código.

---

## 4. Comparação e recomendação

| Critério | Opção A (password + OTP) | Opção B (passwordless + allowlist) |
|---|---|---|
| Segurança teórica | 2 fatores | 1 fator |
| Segurança prática | ~1,5 fatores (reset vai por email) | 1 fator, assumido |
| Superfície de ataque | Passwords vazadas, brute force, reutilização | Só a caixa de correio |
| Fricção no primeiro login | Alta | Baixa |
| Fricção nos logins seguintes | Média (mitigável) | Média (mitigável) |
| Código a escrever | ~2x | ~1x |
| Carga de suporte | Resets de password | Praticamente nula |
| Adicionar utilizador | Convite + criação de conta | `INSERT` numa tabela |
| Remover utilizador | Desativar conta | `DELETE` numa linha |

**Recomendação:** Opção B, com as três condições abaixo tratadas como parte da definição de "pronto", não como melhorias futuras.

1. Rate limiting completo conforme a secção 5.
2. Resposta uniforme para emails autorizados e não autorizados.
3. Confirmação de que os emails autorizados são individuais e têm 2FA no fornecedor.

Se qualquer uma destas três não for cumprida, a Opção A passa a ser preferível — não porque seja melhor, mas porque a Opção B mal implementada é significativamente pior do que qualquer das duas bem implementada.

---

## 5. Rate limiting

Esta é a secção mais importante do documento. Um sistema de OTP sem rate limiting não é um sistema de segurança — é um teatro. Um código de 6 dígitos tem um milhão de combinações; um script simples testa isso em minutos.

### 5.1 Resumo de implementação

| Regra | Limite | Janela | Ação ao exceder |
|---|---|---|---|
| Tentativas de validação por código | 5 | Vida do código | Invalida o código; obriga a pedir novo |
| Pedidos de código por email | 3 | 15 minutos | Bloqueia novos pedidos; devolve mensagem genérica |
| Validade do código | — | 10 minutos | Código expira e é inutilizável |
| Uso do código | 1 vez | — | Marca `used_at`; segunda tentativa falha sempre |
| Pedidos por IP (recomendado extra) | 10 | 15 minutos | Bloqueia o IP temporariamente |

Contadores guardados na base de dados ou no Upstash Redis (free tier serve). **Nunca em memória do processo** — em serverless cada invocação pode ser uma instância nova e o contador reinicia sozinho, o que anula a proteção toda.

### 5.2 Explicação detalhada

**Máximo 5 tentativas por código.** Cada vez que alguém submete um código errado, incrementas `attempts` na linha do OTP. Ao chegar a 5, marcas o código como inutilizado e a pessoa tem de pedir um novo. Isto reduz a janela de ataque de um milhão de hipóteses para cinco, o que é uma probabilidade de 0,0005% por código.

O contador tem de estar ligado **ao código**, não à sessão do browser. Se o ligares à sessão, o atacante limpa os cookies e recomeça do zero.

**Máximo 3 pedidos de código por 15 minutos.** Sem este limite, o atacante contorna o limite anterior simplesmente pedindo códigos novos: 5 tentativas, pede outro, mais 5 tentativas, e assim sucessivamente. É este limite que fecha essa porta.

Serve também um segundo propósito, mais mundano: impede que alguém use o teu formulário para bombardear a caixa de correio do cliente com centenas de emails, e impede que gastes os 100 envios diários do plano free do Resend numa tarde.

**Código expira em 10 minutos.** Limita a janela de utilidade de um código intercetado. Dez minutos é o equilíbrio razoável: tempo suficiente para alguém ir buscar o email com calma, curto o suficiente para que um código esquecido num email antigo não sirva de nada. A verificação é `expires_at > NOW()` no momento da validação — não confies em jobs de limpeza para isto, porque se o job falhar ficas com códigos válidos indefinidamente.

**Uso único.** Assim que um código é validado com sucesso, marcas `used_at`. Um código já usado falha sempre, mesmo dentro dos 10 minutos. Isto protege contra reutilização se o email for lido posteriormente por outra pessoa.

**Rate limiting por IP.** Camada adicional que apanha o caso de alguém tentar vários emails diferentes a partir da mesma origem. Menos crítico que os anteriores, mas barato de adicionar.

### 5.3 Nota sobre comparação de códigos

Ao comparar o código submetido com o guardado, usa comparação de tempo constante (`crypto.timingSafeEqual` no Node) em vez de `===`. É uma proteção contra timing attacks. Num painel deste tamanho o risco prático é baixo, mas o custo de fazer bem é uma linha de código.

---

## 6. "Remember this device"

### 6.1 Resumo de implementação

| Elemento | Definição |
|---|---|
| Tabela | `trusted_devices` (id, user_id, token_hash, expires_at, user_agent, ip, last_used_at) |
| Token | 32 bytes aleatórios; **hash** na BD, valor original só no cookie |
| Cookie | Separado do de sessão. `httpOnly`, `secure`, `sameSite=lax`, `maxAge` 30 dias |
| Rotação | Token novo a cada utilização; o antigo é invalidado |
| Revogação | Botão "terminar sessão em todos os dispositivos" que apaga todas as linhas do utilizador |
| Ativação | Checkbox opcional no ecrã do OTP, nunca por defeito |

### 6.2 Explicação detalhada

Sem isto, o cliente vai buscar um código ao email cada vez que abre o painel. Ao fim de uma semana deixa de usar o painel e liga-te a ti para trocar um preço, que é exatamente o problema que estás a tentar resolver com o projeto.

O mecanismo: após uma validação de OTP bem sucedida, se o utilizador marcou a caixa, geras um token aleatório de 32 bytes, guardas o hash na tabela `trusted_devices` com expiração a 30 dias, e envias o token original num cookie próprio. No login seguinte, verificas o cookie antes de gerar qualquer código — se o hash bater e não tiver expirado, saltas o OTP diretamente.

**A rotação é o detalhe que quase toda a gente omite.** A cada utilização válida, gera um token novo, atualiza o hash na BD e substitui o cookie. Se um token antigo voltar a aparecer depois de ter sido rodado, é sinal de que foi copiado — nesse caso o comportamento correto é apagar todos os dispositivos confiáveis daquele utilizador e forçar nova verificação.

**Guarda `user_agent` e `last_used_at`** para poderes mostrar ao cliente uma lista legível: "Chrome no Windows, usado há 2 dias". Sem isso, o botão de revogação é um ato de fé.

**Cuidado com o contexto do negócio.** Se o painel for usado num tablet partilhado no balcão do restaurante, "remember this device" transforma o dispositivo inteiro numa chave permanente. Nesse cenário, ou desativas a opção, ou reduzes a validade para 7 dias.

---

## 7. Modelo de dados

### 7.1 Resumo

```sql
-- Opção B (passwordless). Para a Opção A, adicionar password_hash a users.

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  nome          TEXT,
  role          TEXT NOT NULL DEFAULT 'staff',   -- 'admin' | 'staff'
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ultimo_login  TIMESTAMPTZ
);

CREATE TABLE otp_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  attempts    SMALLINT NOT NULL DEFAULT 0,
  used_at     TIMESTAMPTZ,
  ip          INET,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_otp_user_valido ON otp_codes(user_id, expires_at) WHERE used_at IS NULL;

CREATE TABLE trusted_devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT UNIQUE NOT NULL,
  user_agent    TEXT,
  ip            INET,
  expires_at    TIMESTAMPTZ NOT NULL,
  last_used_at  TIMESTAMPTZ,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_attempts (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT,
  ip          INET,
  tipo        TEXT NOT NULL,     -- 'pedido_codigo' | 'validacao_codigo'
  sucesso     BOOLEAN NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_attempts_janela ON auth_attempts(email, tipo, criado_em);
```

### 7.2 Explicação detalhada

**A tabela `users` é a allowlist.** Não há tabela separada — um utilizador existir na tabela é o que o autoriza a pedir códigos. O campo `ativo` permite suspender acesso sem perder o histórico.

**`code_hash`, não `code`.** O código nunca é guardado em texto simples. Se a BD for comprometida, os códigos ativos não são utilizáveis. Usa SHA-256 (bcrypt é desnecessariamente lento aqui, e o código expira em 10 minutos de qualquer forma).

**`attempts` na própria linha do código** é o que implementa o limite de 5 tentativas. Um `UPDATE ... SET attempts = attempts + 1` atómico evita condições de corrida com pedidos simultâneos.

**`auth_attempts` serve dois fins:** implementa o limite de 3 pedidos por 15 minutos (`SELECT COUNT(*) WHERE email = ? AND tipo = 'pedido_codigo' AND criado_em > NOW() - INTERVAL '15 minutes'`) e dá-te um registo de auditoria para quando algo correr mal. Adiciona um cron da Vercel para limpar registos com mais de 30 dias.

---

## 8. Configuração do Resend

### 8.1 Resumo

| Item | Decisão |
|---|---|
| Conta | Reutilizar a conta existente da DevPlus |
| Domínio verificado | Domínio da agência (já verificado) |
| Remetente | `noreply@[dominio-devplus]` com nome de exibição "Painel Taskuinha" |
| Volume estimado | < 100 emails/mês (limite free: 3.000/mês, 100/dia) |
| Template | React Email (`react-email`), integra nativamente com Next.js |
| Custo | 0 € |

### 8.2 Explicação detalhada

**Não é preciso criar conta nova.** O domínio verificado no Resend controla o *remetente*, não o destinatário — podes enviar para qualquer endereço a partir de um domínio já verificado. O cliente recebe o código de um email da DevPlus, o que para um painel interno é perfeitamente aceitável.

A alternativa de enviar de `noreply@taskuinha.pt` exigiria verificar um segundo domínio, e o plano free só permite um. As saídas seriam uma segunda conta free (cuja conformidade com os termos do Resend convém verificar antes de a operacionalizar) ou o plano Pro a 20 €/mês, que desbloqueia domínios ilimitados.

**Recomendação de escalabilidade:** se o painel de gestão vier a ser um produto repetível da Xquisite, o Pro na conta da agência é o caminho certo por volta do terceiro ou quarto cliente. Uma conta, um API key, domínios por cliente. Gerir cinco contas free separadas custa mais em tempo do que 20 € por mês.

**Configura alertas de falha.** No plano free, ao atingir o limite diário o envio pausa em vez de ser cobrado. É bom comportamento comercial, mas para o utilizador é indistinguível de uma avaria — ninguém consegue entrar no painel e ninguém te avisa. Um webhook do Resend a apitar num canal vosso resolve.

**Nota sobre o conteúdo do email:** inclui o código no corpo em texto grande, o tempo de validade explícito, e uma linha a dizer que se não foi ele a pedir deve ignorar. Não incluas links clicáveis no email do OTP — reduz a probabilidade de ser marcado como phishing e evita treinar o cliente a clicar em links de emails de autenticação.

---

## 9. Riscos e pontos por decidir

| Risco | Impacto | Mitigação |
|---|---|---|
| Email do cliente sem 2FA no fornecedor | Crítico na Opção B | Verificar e ajudar a ativar antes do lançamento |
| Email partilhado (`geral@`) | Anula a autenticação | Exigir contas individuais desde o início |
| Rate limiting em memória | Proteção inexistente em serverless | Usar BD ou Redis |
| Enumeração de utilizadores | Expõe quem tem acesso | Resposta uniforme para todos os emails |
| Email na pasta de spam | Cliente bloqueado, chamada para ti | SPF/DKIM corretos; testar com Gmail, Outlook e o email do cliente |
| Base de dados suspensa por inatividade | Painel em baixo sem aviso | Confirmar comportamento do fornecedor escolhido (free tiers costumam suspender projetos inativos) |
| Tablet partilhado com dispositivo confiável | Acesso permanente sem verificação | Reduzir validade ou desativar a opção |

### Decisões em aberto

1. **Base de dados** — Neon, Supabase ou Vercel Postgres. Com o plano Pro já pago, vale a pena comparar antes de escolher por hábito.
2. **Propriedade da conta** — o projeto fica na conta pessoal ou numa conta partilhada da Xquisite? Decidir agora, não quando o Sobral precisar de aceder.
3. **Papéis de utilizador** — o campo `role` está previsto no schema, mas é preciso definir o que um `staff` pode fazer e o que fica reservado ao `admin`.
4. **Duração da sessão** — separada da duração do dispositivo confiável. Sugestão: sessão de 8 horas, dispositivo confiável de 30 dias.

---

## 10. Próximos passos sugeridos

1. Confirmar com o cliente: contas individuais e 2FA no email.
2. Escolher a base de dados e criar o schema da secção 7.
3. Implementar o fluxo de pedido de código **com o rate limiting incluído desde a primeira versão** — não como tarefa posterior.
4. Implementar validação e criação de sessão (Auth.js recomendado; não escrever gestão de sessões à mão).
5. Adicionar "remember this device".
6. Testar entrega de email em Gmail, Outlook e no domínio real do cliente.
7. Só depois construir a interface do painel.
