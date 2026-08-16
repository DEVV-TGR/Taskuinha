# Mapa da Taskuinha

Índice de navegação do projecto. Se procuras onde mexer em alguma coisa, é aqui.

> **Estado:** o redesenho "taberna total, noite de tempestade" (ver
> `docs/PLANO.md`) está construído — as 10 fases feitas, incluindo a
> passagem final de acessibilidade e desempenho.
>
> **Há um painel de administração em `/painel`.** A ementa e os contactos
> saíram do código para `data/*.json`, e o painel grava-os no repositório pela
> API do GitHub — a Vercel vê o push e reconstrói o site. O dono da casa muda
> preços, acrescenta e tira pratos sem abrir um editor. Entra-se **só com o
> email**: escreve-se o endereço, chega um código de seis algarismos, e o
> aparelho fica lembrado 30 dias. Não há password.
> Ver `docs/PAINEL.md`, que tem os passos de montagem que não se fazem em
> código.
>
> **A seguir:** o cliente já viu o site e há uma ronda de afinações a fazer
> depois de uma reunião presencial na casa. Ver `docs/PROXIMAS-MELHORIAS.md`
> (o que muda, o que fica) e `docs/RECURSOS-A-PROCURAR.md` (imagens e
> texturas a fotografar ou procurar). Ainda não implementado.

---

## O que é isto

Site da **Taskuinha do Pirata** — taberna de petiscos na Av. dos Banhos 185,
Vila Chã, Vila do Conde. Frente ao mar, no Caminho de Santiago.

Casa decorada de alto a baixo: barris pendurados a soletrar PIRATA na fachada,
tecto de tábuas turquesa com um mural de nau em tempestade, redes de pesca,
caveiras, aranhas que descem do tecto, sardaniscas, e um esqueleto pirata
sentado à porta a beber uma cerveja.

**Stack:** Next.js 16.3 (App Router) · React 19.2 · Tailwind v4.3 (CSS-first,
sem ficheiro de config) · `motion` v13 (importado de `motion/react`) ·
Phosphor Icons (`@phosphor-icons/react/dist/ssr`) · TypeScript strict.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Alias de importação: `@/*` → raiz do projecto. Ex.: `@/lib/site`, `@/components/Nav`.

---

## Onde mexer em quê

| Quero mudar… | Ficheiro |
|---|---|
| Morada, telefone, horário, redes sociais | `data/casa.json` |
| Pratos, preços e traduções da ementa | `data/ementa.json` |
| Coordenadas, mapa, nome e descrição da casa | `lib/site.ts` |
| Os 6 destaques da página inicial | `lib/menu.ts` → `destaques` (**têm de ser 6**) |
| Fotografias e textos alternativos | `lib/images.ts` |
| Avaliações e citações | `lib/reviews.ts` |
| Cores, tipos, classes utilitárias | `app/globals.css` |
| Fontes carregadas | `app/layout.tsx` |
| Texturas de madeira / pergaminho / rede | `lib/texturas.ts` |
| Aranha, bandeirinhas, rede, lanternas | `components/decor/` |
| O mascote — tamanho, sítio, altura do assento | `components/decor/Esqueleto.tsx`, montado em `Casa.tsx` |
| Onde vive o texto do Hero (topo ou fundo, por tamanho de ecrã) | `components/Hero.tsx` |
| Ecrã de abertura / transição entre páginas | `components/Entrada.tsx`, `components/Travessia.tsx` |
| Como as secções entram no ecrã | `components/Reveal.tsx` |
| Ordem das secções da homepage | `app/page.tsx` |
| Quem entra no painel, e como | `docs/PAINEL.md` |
| Favicon | `app/icon.svg` |
| Cartão de partilha (WhatsApp, Facebook) | `app/opengraph-image.tsx` |
| Dados estruturados para o Google | `app/layout.tsx` → `StructuredData` |
| O que os motores de busca indexam | `app/robots.ts`, `app/sitemap.ts` |

---

## Rotas

| Rota | Ficheiro | Conteúdo |
|---|---|---|
| `/` | `app/[lang]/page.tsx` | Hero → Casa → Petiscos → Galeria → Vozes → Encontrar |
| `/ementa` | `app/[lang]/ementa/page.tsx` | Ementa completa num rolo só |
| `/painel` | `app/painel/page.tsx` | O painel da casa — **fora do `[lang]`** |
| `/painel/entrar` | `app/painel/entrar/page.tsx` | O email de quem entra |
| `/painel/entrar/codigo` | `app/painel/entrar/codigo/page.tsx` | O código de 6 algarismos, por email |
| `/painel/ementa` | `app/painel/ementa/page.tsx` | Preços, pratos novos, tirar pratos |
| `/painel/casa` | `app/painel/casa/page.tsx` | Contactos e horário |

As oito públicas são geradas no build; as do painel são dinâmicas, e o
`npm run fumo` lê o `prerender-manifest.json` para essa divisão não regredir.

Gerados automaticamente: `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg`.

**Âncoras da homepage:** `#a-casa` · `#petiscos` · `#o-sitio` · `#encontrar-nos`

> `app/page.tsx` e `app/ementa/page.tsx` importam a `Nav` e o `Footer`
> individualmente — **não estão no `layout.tsx`**. É deliberado: a homepage
> passa `transparentAtTop` à `Nav` e a ementa não.

---

## Componentes

**Estrutura**
`Nav` (68 px, fixa, com gaveta de telemóvel) · `Footer` · `Wordmark` · `Cta`

**Secções**
`Hero` + `HeroMedia` · `Casa` · `Petiscos` · `Galeria` · `Vozes` ·
`Encontrar` + `Mapa` · `MenuCategoryNav`

**Movimento**
`Reveal` (o único primitivo, usado em todo o lado) · `Entrada` (ecrã de
abertura, em todas as chegadas ao site) · `Travessia` (portadas de madeira
entre páginas — intersecta os cliques em ligações internas)

**Decoração** `components/decor/` — construídos na Fase 3, ainda **não ligados**
a nenhuma página (isso é das Fases 5–9, ao mesmo tempo que cada secção troca
de pele).
`Tralha` (orquestrador, o único `fixed`; os restantes são `absolute` e
assumem-no como ancestral) · `Aranha` · `Rede` · `Bandeirinhas` ·
`Lanterna` · `Esqueleto` · `Tronco` · `Tabuleta` · `FundoDeSeccao` ·
`BandeiraNegra` ·
`Pergaminho` · `RoloEmenta` · `Tabua`, mais `usarVisibilidade.ts` (hook partilhado, não é um
dos 13 — pausa animações contínuas com a aba em segundo plano).

> `Tronco` e `Tabuleta` são os dois mais recentes, e vivem os dois na junta
> entre o Hero e a secção "A casa": a trave atravessa a página de aresta a
> aresta e passa à frente do `Esqueleto`, a apoiar-lhe o baú; a tabuleta
> pendura-se dela por correntes e leva o texto da casa por cima. A `Tabuleta`
> é a única peça do site feita em `border-image` de nove fatias — é o que lhe
> permite crescer com o texto sem esticar as correntes nem os rebites.

> `FundoDeSeccao` acabou com o preto liso: todas as secções menos o Hero
> levam agora uma fotografia de fundo **a 15% de opacidade e desfocada a
> 8px**. Começou em 75% e nítida, que era o pedido inicial; montado, a
> fotografia competia com os pratos. O Gonçalo escolheu os 15 depois de ver
> quatro versões lado a lado, e depois pediu o desfoque para as cinco.
>
> Os cabeçalhos foram para dentro de uma `Tabua` quando o fundo ainda estava a
> 75% e texto solto não se lia. Ficaram: a tábua era escolha dele antes de
> haver problema de contraste, e é o que dá à página o ar de coisa pregada em
> madeira.
>
> | Secção | Fundo |
> |---|---|
> | A casa | `naus-frota.jpg` (desfocada de propósito — 630×420) |
> | Petiscos | `balcao-bandeirinhas.jpg` |
> | O sítio | `tecto-nau.jpg` |
> | O que dizem | `sala-estatuas.jpg` |
> | Encontrar-nos | `mar-por-do-sol.jpg` |
>
> A `Casa`, a `Galeria` e o `Encontrar` tiveram de passar a duas camadas —
> `<section>` larga com o fundo, `<div>` de dentro com o `max-w` e o
> espaçamento. Eram o próprio contentor, e um fundo lá dentro nunca chegava
> às arestas do ecrã.

> `Relampago` e `Mar` foram apagados a pedido do Gonçalo. O primeiro era o
> flash de tempestade no Hero, o segundo as três camadas de onda a deslizar no
> rodapé. A paleta ficou como estava, tirando o `--relampago`, que só o flash
> usava; o `--turquesa` fica, que é cor de sistema e não propriedade do mar.

> `Sardanisca` foi apagada na ronda de afinações com o cliente. A casa real
> tem-nas; o desenho no site não convenceu.
>
> `Barril` também foi apagado. Havia uma fila de seis pendurados no Hero a
> soletrar P·I·R·A·T·A — primeiro em SVG, depois com a fotografia do barril
> real. O cliente não gostou de nenhuma das versões, e nada ficou no lugar:
> a fotografia da fachada, que está por trás, já tem os barris reais dela.
>
> Houve uma ronda em que apareceram um `Caveira.tsx` partilhado, um
> `SeloDeSeccao` nas juntas e um `SeloDeLacre` na ementa. **Foram todos
> retirados** — trabalho decidido sem o Gonçalo, que é o que o `CLAUDE.md`
> agora proíbe. A caveira da casa voltou a viver dentro da `BandeiraNegra`
> e do `Wordmark`, cada uma com o seu desenho.

**Componentes que recebem props** — só quatro. Todos os outros são blocos de
zero props com o texto escrito lá dentro.

| Componente | Props |
|---|---|
| `Nav` | `transparentAtTop?: boolean` |
| `Wordmark` | `size?: "sm" \| "lg"` |
| `Cta` | `href`, `variant?: "primary" \| "secondary"`, `children`, `className?` |
| `Reveal` | `children`, `index?`, `className?`, `as?` |
| `MenuCategoryNav` | `items: { id, title }[]` |

---

## Sistema de design

Tema único, escuro. **Não há modo claro** — o conceito é "noite de tempestade"
e uma versão diurna tornaria-o incoerente.

| Token | Valor | Para quê |
|---|---|---|
| `--breu` | `#080B0D` | fundo — casco molhado à noite |
| `--breu-raso` | `#10161A` | superfície elevada |
| `--madeira` | `#2A1B10` | tábuas |
| `--madeira-luz` | `#6B4A2F` | veio quando a luz bate |
| `--turquesa` | `#2E7E80` | o tecto da casa, dessaturado |
| `--lanterna` | `#F2A33C` | **acento principal** |
| `--sangue` | `#A81E22` | acento secundário (Super Bock, lenço) |
| `--osso` | `#E8DCC4` | texto |
| `--osso-fraco` | `#9A8F7C` | texto secundário |
| `--pergaminho` | `#D9C7A0` | o papel gerado das `Vozes` e do `Encontrar` |

**Regra de raio:** tudo a 4 px (`--radius-card`). Tudo é madeira serrada,
nada é pílula.

**`--sangue` e `--turquesa` nunca tocam em texto.** Fazem 3,3:1 e 4,4:1 sobre
o breu — não passam contraste AA. São para preencher, sublinhar e desenhar.
Para texto turquesa usar `--turquesa-luz` (8,5:1).

**Tipografia**

| Fonte | Papel |
|---|---|
| **Rye** | Títulos e wordmark — wood-type de tabuleta |
| **Alegreya Sans** | Corpo |
| **Special Elite** | Preços, horas, números |
| **IM Fell English SC** | Só dentro do pergaminho da ementa |

**Classes utilitárias** — `.display` (Rye com inclinação e tinta descascada) ·
`.tabua` · `.pergaminho` · `.pendurado` · `.gravado` · `.link-underline` ·
`.map-frame`

---

## Regras que não se partem

1. **`data-reveal`** — o atributo no `Reveal` é o gancho das regras de
   `<noscript>` (em `app/layout.tsx`) e de `prefers-reduced-motion`
   (em `app/globals.css`). As secções são servidas com `opacity: 0` porque o
   servidor não conhece a preferência do visitante; sem estas regras, quem tem
   JavaScript desligado ou movimento reduzido vê uma página em branco.

2. **`destaques` tem exactamente 6 itens** — a grelha do bento em
   `Petiscos.tsx` está calibrada para seis: o primeiro ocupa
   `col-span-4 row-span-2`, os outros cinco `col-span-2`. Sete ou cinco abrem
   buracos na grelha.

3. **Não tocar no `ResizeObserver` do `Mapa.tsx`** — o Leaflet dentro de um
   iframe cross-origin mede o contentor uma vez ao inicializar e nunca mais
   chama `invalidateSize`. A remontagem por `key={w}x{h}` com debounce de
   200 ms é a solução, não uma gambiarra. A altura fixa
   (`h-[420px] lg:h-[600px]`) evita CLS.

4. **Altura da Nav** — `--altura-nav: 68px`. O `MenuCategoryNav` cola-se por
   baixo dela com `sticky top-[var(--altura-nav)]`. Mudar uma implica mudar as
   duas.

5. **Toda a decoração é `aria-hidden` e some com movimento reduzido** — a
   aranha **desaparece**, não congela. Uma aranha parada a meio do ecrã é
   pior do que aranha nenhuma. O mesmo vale para a `Entrada` e a `Travessia`:
   com movimento reduzido não montam de todo, e os links voltam a ser links.

6. **Fotografias são todas locais** — não há `remotePatterns` no
   `next.config.ts` e não deve voltar a haver.

7. **Texturas geram-se com semente determinística** — nunca `Math.random()`
   durante a renderização, senão o HTML do servidor não bate certo com o do
   cliente e o React dá erro de hidratação. As sementes vêm do índice do
   elemento.

8. **Não versionar `.claude/worktrees/` nem `.claude/skills/`** — os primeiros
   são cópias de trabalho, os segundos são symlinks para instalações globais
   que ficariam quebrados noutra máquina.

---

## Fotografias

36 ficheiros em `public/images/`, com nomes descritivos — `fachada-noite.jpg`,
`esqueleto.jpg`, `petisco-ameijoas.jpg`. O inventário completo, com a origem de
cada uma, está em `public/images/README.md`.

**27 são da casa. 9 são ilustrações de fora** — as três naus, as três caveiras,
o tronco e as duas folhas do portão. O campo `origem` em `lib/images.ts` guarda
a distinção, e o rodapé precisa dela: o aviso "as fotografias não são da casa"
deixou de ser verdade para a maioria, mas não para todas.

**Há sete fotografias de pratos servidos** — amêijoas, lapas, lulas, sardinhas,
percebes, navalheira e bacalhau à Brás. As duas últimas chegaram depois, e são
elas que puseram os seis destaques da home todos com fotografia real. **Não há
sapateira nenhuma**: a foto que o plano tomava por sapateira tem uma navalheira
pequena ao lado de um prato de percebes.

**Tratamento:** as fotos diurnas levam duas camadas de gradação por cima do
`<Image>` (`bg-breu/45 mix-blend-multiply` + `bg-lanterna/12 mix-blend-overlay`)
para assentarem na paleta nocturna. Não é filtro CSS no ficheiro — é uma camada
sobreposta, reversível e que não toca no original. As fotos já nocturnas levam
metade.

---

## O que ainda falta

Nada do que estava aqui. O site está publicado em
**https://www.taskuinhapirata.pt** e os três pontos desta lista fecharam-se:

- **Os preços são os da casa**, transcritos do livro da ementa e revistos
  com o dono. A flag `PRECOS_SAO_DEMO` e o aviso que ela ligava já não
  existem.
- **A morada e o horário** foram confirmados com ele.
- **O cartão de partilha não está partido.** Ficava aqui a nota de que o
  `opengraph-image` falhava em desenvolvimento local com `Input buffer
  contains unsupported image format` — um erro do WASM do Resvg que o
  `next/og` usa por baixo, reproduzido com uma rota `ImageResponse`
  mínima, e por isso não do código deste projecto. Pedia-se para confirmar
  num ambiente a sério antes de o dar por partido, e está confirmado: em
  produção o cartão responde `200`, `image/png`, 50 KB. Era mesmo só a
  máquina local.

---

## A letra da casa

O letreiro de madeira sobre a porta lê-se **`TASKUIИHA`** — com o **N ao
contrário**. O comando de mesa em forma de leme, pintado à mão em vermelho,
repete exactamente o mesmo. Duas peças independentes, feitas em alturas
diferentes.

Não é gralha. É a assinatura da casa, e está no `Wordmark.tsx`.

O N invertido é `aria-hidden` — o nome correcto vai num `sr-only` ao lado, para
leitores de ecrã e para o Google.

O símbolo da casa é a bandeira negra pendurada no tecto: caveira com chapéu de
bicorne e sabres cruzados. Está no favicon, no cartão de partilha e no
`BandeiraNegra.tsx`.
