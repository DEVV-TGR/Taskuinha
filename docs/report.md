# Porque é que a CI esteve vermelha — 13 e 14 de Agosto de 2026

> Registo do que aconteceu, para não se voltar a perder uma tarde a olhar
> para cruzes vermelhas sem saber de quem são. Dois problemas, um escondido
> atrás do outro, ambos no andaime e nenhum no site.

---

## O sintoma

De 13 de Agosto às 19:41 em diante, **todos** os commits e todos os PRs
apareceram com ✗. Os PRs #28, #29 e #31 incluídos — e nenhum deles tinha
culpa nenhuma.

A cruz começou no commit `42edbdd` ("Segurança"), que foi o que trouxe o
ficheiro `.github/workflows/ci.yml`. Ou seja: a CI não começou a apanhar
erros que já cá estavam. A CI nasceu partida e passou a marcar ✗ em tudo o
que lhe passasse à frente.

Vale a pena separar as duas coisas, porque é fácil confundi-las: **o site
esteve sempre bem**. A Vercel compilou e publicou cada push sem falhar uma
única vez ao longo destes dois dias. O que estava avariado era a verificação,
não o verificado.

---

## Problema 1 — o compilador procurava um nome que ninguém tinha escrito

### O que se via

```
app/[lang]/layout.tsx(119,56): error TS2304: Cannot find name 'LayoutProps'.
```

Sempre no mesmo sítio, sempre ao fim de 26 segundos.

### Porquê

A linha 119 do `app/[lang]/layout.tsx` é esta:

```tsx
export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
```

O `LayoutProps` não se importa de lado nenhum, e isso é de propósito: é um
dos **ajudantes globais de rota** que o Next 16 escreve sozinho. Ele olha
para as pastas dentro de `app/`, percebe que rotas existem, e escreve os
tipos correspondentes para dentro de `.next/types`. Está na documentação do
próprio Next, em `05-config/02-typescript.md`:

> Next.js generates global helpers for App Router route types. These are
> available without imports and are generated during `next dev`,
> `next build`, or via `next typegen`.

As três alturas em que os escreve são essas e mais nenhuma. E no workflow,
o passo dos tipos vinha **antes** do passo do build:

```yaml
- name: Tipos
  run: npm run tipos      # tsc --noEmit  ← aqui ainda não há .next/types

- name: ESLint
  run: npm run lint

- name: Build
  run: npm run build      # ← só aqui é que os tipos passariam a existir
```

Num runner acabado de nascer não há `.next`. O `tsc` ia procurar o
`LayoutProps` e não o encontrava, porque a essa altura ainda ninguém o tinha
escrito.

Na nossa máquina nunca deu sinal de vida pela razão mais banal do mundo: o
`next dev` já cá tinha deixado o ficheiro há muito tempo, de uma sessão
qualquer. Corríamos `npm run tipos`, passava, e a conclusão errada era a
única disponível.

### A correcção

Uma linha no `package.json`:

```diff
-    "tipos": "tsc --noEmit",
+    "tipos": "next typegen && tsc --noEmit",
```

Gerar os tipos passa a fazer parte de verificar os tipos, que é o que sempre
foi na prática — só que essa parte estava a ser feita por acidente, pelo
`next dev` de outro dia, em vez de ser feita de propósito.

Ficou no `package.json` e não no `ci.yml` por causa do caso de quem clona o
repositório de raiz: assim `npm run tipos` funciona à primeira, sem ter de
saber que há um comando escondido a correr antes.

---

## Problema 2 — o teste de fumo passava e depois não se ia embora

Este só apareceu depois do primeiro estar resolvido, e a razão é literal: o
passo `Fumo` é o último do workflow, e como a CI morria sempre nos tipos,
**o teste de fumo nunca tinha chegado a correr uma única vez** desde o dia
em que foi escrito.

### O que se via

Nada. O job ficava simplesmente a correr. Sem output, sem erro, sem fim — e
sem intervenção iria até ao tecto das 6 horas do GitHub.

O log, depois de cancelado, conta a história toda em três linhas:

```
10:45:49.52   Fumo limpo.
11:12:00.90   ##[error]The operation was canceled.
11:12:01.19   Terminate orphan process: pid (2588) (npm run fumo)
```

As cinquenta e quatro verificações passaram todas, em menos de dois
segundos. A
seguir, vinte e sete minutos de silêncio absoluto, até alguém carregar em
cancelar. E o runner, ao arrumar a casa, encontrou um processo órfão à
espera de nada.

O teste fazia o seu trabalho na perfeição. O que não fazia era acabar.

### Porquê

O script arrancava o servidor assim:

```js
const servidor = spawn("npx", ["next", "start", "-p", String(PORTA)], { … });
```

e ao fim de tudo despedia-se dele assim:

```js
} finally {
  servidor.kill("SIGTERM");
}
```

O problema é que aquele `servidor` não é o servidor. É o `npx`. O `next
start` é filho do `npx` e neto do script, e no Linux o `npx` não passa os
sinais à frente: o SIGTERM matava o intermediário e deixava o servidor vivo.

E um servidor vivo que herdou os canos do `stdout` e do `stderr` mantém-nos
abertos. O Node não sai enquanto tiver canos abertos por onde alguém ainda
possa falar, portanto ficava à espera. O `npm` por cima dele ficava à espera
do Node. O passo da CI ficava à espera do `npm`. Ninguém tinha nada a dizer,
e todos ficaram à escuta.

No macOS isto não acontece porque lá o `npx` se substitui a si próprio pelo
processo do Next em vez de o pôr por baixo. Não há intermediário, logo não
há sinal por entregar. Foi por isso que correr `npm run fumo` na nossa
máquina — que se fez, e várias vezes — nunca revelou nada: o defeito só
existe do lado de lá.

### A correcção

Duas mudanças no `scripts/fumo.mjs`. A primeira tira o intermediário do
caminho, chamando o binário do Next directamente:

```diff
-const servidor = spawn("npx", ["next", "start", "-p", String(PORTA)], {
-  stdio: ["ignore", "pipe", "pipe"],
-});
+const servidor = spawn(
+  process.execPath,
+  ["node_modules/next/dist/bin/next", "start", "-p", String(PORTA)],
+  { stdio: ["ignore", "pipe", "pipe"] },
+);
```

Sem `npx` pelo meio, o `kill` chega a quem é para chegar.

A segunda é o cinto por cima dos suspensórios — pedir a saída não é vê-la
acontecer:

```diff
 } finally {
   servidor.kill("SIGTERM");
+  await new Promise((resolve) => servidor.once("close", resolve));
 }
```

Agora o script só se dá por terminado depois de os canos fecharem mesmo.

---

## Como se verificou

A cadeia inteira do workflow, corrida à mão num clone limpo (`npm ci`, sem
`.next`, sem `next-env.d.ts`), pela mesma ordem em que a CI a corre:

| Passo                            | Resultado                       |
| -------------------------------- | ------------------------------- |
| `npm audit --audit-level=high`   | 0 vulnerabilidades              |
| `npm run tipos`                  | passa                           |
| `npm run lint`                   | passa                           |
| `npm run build`                  | 13 páginas geradas              |
| `npm run fumo`                   | fumo limpo, sai, porta livre    |

O primeiro problema também foi confirmado na CI a sério, no PR #32: os
passos `npm ci`, auditoria, **Tipos**, ESLint e Build passaram todos antes
de o job encalhar no fumo.

Uma ressalva honesta sobre o segundo: o defeito só se manifesta em Linux, e
a correcção foi validada em macOS — onde passa e sai limpo, mas onde o
problema também nunca existiu. O que se pode afirmar com segurança é que a
causa estrutural desapareceu, porque o intermediário que engolia o sinal
deixou de estar lá. A prova final é o próprio job da CI ficar verde.

---

## O que fica por fazer

Nada disto trava um merge enquanto não se acrescentar a regra que já vinha
apontada no cabeçalho do `ci.yml`, e que não se faz em código:

> No GitHub, em **Settings → Branches**, exigir que o workflow `CI` passe
> antes de se poder fazer merge para a `main`.

Sem essa regra, o que aqui se arranjou avisa, mas não impede. Vale a pena
ligá-la agora que a CI diz a verdade — ligá-la antes teria bloqueado o
repositório inteiro.

---

## A lição, que é curta

Uma verificação que nunca passou não é uma verificação — é uma promessa. O
`ci.yml` entrou com cinco passos, e três deles (ESLint, Build, Fumo) nunca
tinham chegado a correr, porque o segundo passo abortava o job antes.
Durante um dia inteiro, o que parecia uma rede de segurança era um ✗ fixo
que toda a gente aprendeu a ignorar — que é exactamente o pior estado
possível: o custo de ter CI, sem nenhum dos benefícios.

Quando se acrescenta um workflow, o que interessa não é vê-lo falhar num
código partido de propósito. É vê-lo **passar** uma vez, do princípio ao
fim, com tudo bom. Só a partir daí é que a cruz vermelha volta a querer
dizer alguma coisa.
