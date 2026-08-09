# Folha de reunião — Taskuinha

> Gerado por `ferramentas/folha-de-reuniao.mjs` a partir do código. Não editar à mão — mexe-se no `lib/menu.ts` e no `lib/site.ts` e corre-se outra vez.

Leva isto impresso ou no telemóvel. A coluna **Actual** é o que o site mostra hoje; a coluna **Real** é para preencher.

⚠️ **Os preços actuais são inventados.** Foram calibrados para o intervalo de 10–20 € por pessoa que as avaliações indicam. Nenhum veio da casa. Quando estiverem todos confirmados, pôr `PRECOS_SAO_DEMO = false` em `lib/menu.ts` — é isso que faz desaparecer o aviso do rodapé e do fim da ementa.

---

## Preços

> Atenção aos repetidos: **Lulas grelhadas** aparece em mais do que uma categoria, com preços diferentes de propósito. Confirmar os dois, não assumir que é o mesmo.

### Do mar

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Amêijoas ao alho | 12,50 € | | |
| Lulas grelhadas ⚠️ | 11,00 € | | |
| Percebes | 19,00 € | | |
| Lapas ao alho | 9,00 € | | |
| Sardinhas no pão | 7,50 € | | |
| Pataniscas de bacalhau | 8,00 € | | |
| Vieiras gratinadas | 9,50 € | | |
| Camarão cozido | 10,50 € | | |

### Da terra

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Chouriço assado | 7,50 € | | |
| Tábua de presunto e queijo | 13,00 € | | |
| Moelas à taberna | 7,00 € | | |
| Pica-pau | 9,50 € | | |

### Sandes e pregos

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Prego no pão | 6,50 € | | |
| Sandes de presunto e ovo | 6,00 € | | |
| Bifana | 5,50 € | | |

### Pratos

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Bacalhau à Brás | 14,00 € | | |
| Francesinha | 12,50 € | | |
| Lulas grelhadas ⚠️ | 14,50 € | | |

### Doces

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Queijada | 3,00 € | | |
| Leite-creme queimado | 4,00 € | | |
| Bolo de bolacha | 3,50 € | | |

### Bar

| Prato | Actual | Real | Existe? |
|---|---|---|---|
| Imperial | 1,50 € | | |
| Caneca | 2,50 € | | |
| Vinho verde, copo | 2,00 € | | |
| Vinho verde, garrafa | 9,00 € | | |
| Café | 0,90 € | | |
| Gin do Pirata | 6,50 € | | |

**Falta algum prato que a casa serve e não está aqui?**

&nbsp;

---

## Contactos e horário

Tudo isto veio de agregadores públicos (Restaurantji, Restaurant Guru, GastroRanking) em Agosto de 2026. **Nunca foi confirmado com a casa.** Mexe-se em `lib/site.ts`.

| Campo | Actual | Certo? |
|---|---|---|
| Morada | Av. dos Banhos 185, 4485-691 Vila Chã, Vila do Conde | |
| Telefone | 229 285 079 | |
| Segunda | Encerrado | |
| Terça | 10h00 às 23h00 | |
| Quarta | 10h00 às 23h00 | |
| Quinta | 10h00 às 23h00 | |
| Sexta | 10h00 às 23h00 | |
| Sábado | 10h00 às 23h00 | |
| Domingo | 10h00 às 21h00 | |

A morada e o horário também vão para o JSON-LD que o Google lê (`app/layout.tsx`) e para o `openingHoursSpec` — se o horário mudar, mudam os dois sítios do `lib/site.ts`.

---

## Outras perguntas

- [ ] **Domínio.** O site está a assumir `https://taskuinha.pt`. É esse? O JSON-LD, o sitemap e os cartões de partilha do WhatsApp dependem disto.
- [ ] **As citações** em `lib/reviews.ts` foram lidas através de agregadores. A atribuição a cada plataforma pode não estar certa.
- [ ] **Material próprio** — fotos da abertura, do dia a dia, vídeos. Ninguém tem mais essência do lugar do que o dono.
- [ ] **Os barris da fachada**, fotografados um a um, de frente, luz do dia. É a última fotografia que falta (ver `public/images/README.md`).
