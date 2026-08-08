# Mapa da Taskuinha

Índice de navegação do projecto. Se procuras onde mexer em alguma coisa, é aqui.

> **Estado:** o redesenho "taberna total, noite de tempestade" (ver
> `docs/PLANO.md`) está construído — as 10 fases feitas, incluindo a
> passagem final de acessibilidade e desempenho.
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
| Morada, telefone, horário, redes sociais | `lib/site.ts` |
| Pratos e preços da ementa | `lib/menu.ts` |
| Os 6 destaques da página inicial | `lib/menu.ts` → `highlights` (**têm de ser 6**) |
| Fotografias e textos alternativos | `lib/images.ts` |
| Avaliações e citações | `lib/reviews.ts` |
| Cores, tipos, classes utilitárias | `app/globals.css` |
| Fontes carregadas | `app/layout.tsx` |
| Texturas de madeira / pergaminho / rede | `lib/texturas.ts` |
| Grão de fibra do pergaminho | `public/images/textura-papel.webp`, gerado por `ferramentas/gerar-grao-papel.mjs` |
| Aranha, barris, bandeirinhas, caveiras | `components/decor/` |
| Ecrã de abertura / transição entre páginas | `components/Entrada.tsx`, `components/Travessia.tsx` |
| Como as secções entram no ecrã | `components/Reveal.tsx` |
| **Quanto tudo se mexe** | `lib/movimento.ts` — muda `INTENSIDADE` e mexe nos quatro sítios de uma vez |
| Ordem das secções da homepage | `app/page.tsx` |
| Favicon | `app/icon.svg` |
| Cartão de partilha (WhatsApp, Facebook) | `app/opengraph-image.tsx` |
| Dados estruturados para o Google | `app/layout.tsx` → `StructuredData` |
| O que os motores de busca indexam | `app/robots.ts`, `app/sitemap.ts` |

---

## Rotas

| Rota | Ficheiro | Conteúdo |
|---|---|---|
| `/` | `app/page.tsx` | Hero → Casa → Petiscos → Galeria → Vozes → Encontrar |
| `/ementa` | `app/ementa/page.tsx` | Ementa completa em pergaminho |

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

**Decoração** `components/decor/`
`Tralha` (orquestrador, o único `fixed`; os restantes são `absolute` e
assumem-no como ancestral) · `Aranha` · `Rede` · `Bandeirinhas` ·
`Barril` · `Lanterna` · `Relampago` · `Mar` · `Esqueleto` · `BandeiraNegra` ·
`Pergaminho` · `Tabua`, mais `usarVisibilidade.ts` (hook partilhado, não é um
dos 12 — pausa animações contínuas com a aba em segundo plano).

Da ronda de afinações com o cliente:
`Caveira` (a caveira da casa, num sítio só — antes estava desenhada três
vezes) · `SeloDeSeccao` (a caveira pregada na junta entre secções) ·
`SeloDeLacre` (o selo vermelho que fecha a ementa) · `FundoDeSeccao` (a
fotografia da casa por trás da secção, com tecto de opacidade imposto por
contraste).

O `Esqueleto` deixou de ser um SVG desenhado e passou a ser a estátua real
recortada do fundo (`esqueleto-recorte.webp`), colada por cima da junta da
`Petiscos`. Nunca tinha estado montado em página nenhuma — não é uma
substituição, é a estreia do mascote no site. A ferramenta que fez o
recorte está em `ferramentas/recortar-sujeito.swift`.

> `Sardanisca` foi apagada na mesma ronda. A casa real tem-nas; o desenho no
> site não convenceu.

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
| `--pergaminho` | `#D9C7A0` | só na ementa |

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

2. **`highlights` tem exactamente 6 itens** — a grelha do bento em
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
   elemento. Vale também para as texturas geradas fora do site, em
   `ferramentas/`: mesma semente, mesmo ficheiro.

8. **O `--textura-pergaminho` precisa de `background-size: 100% 100%`** — o
   SVG tem 100×100 e sem isso repete-se de 100 em 100 pixels. A regra está
   em `.pergaminho` (globals.css); qualquer sítio novo que use a textura
   tem de a levar também.

8. **Não versionar `.claude/worktrees/` nem `.claude/skills/`** — os primeiros
   são cópias de trabalho, os segundos são symlinks para instalações globais
   que ficariam quebrados noutra máquina.

---

## Fotografias

30 ficheiros em `public/images/`, com nomes descritivos — `fachada-noite.jpg`,
`esqueleto.jpg`, `petisco-ameijoas.jpg`. O inventário completo, com a origem de
cada uma, está em `public/images/README.md`.

**24 são da casa. 6 são ilustrações de fora** — as três naus e as três caveiras.
O campo `origem` em `lib/images.ts` guarda a distinção, e o rodapé precisa dela:
o aviso "as fotografias não são da casa" deixou de ser verdade para a maioria,
mas não para todas.

**Só há cinco fotografias de pratos servidos** — amêijoas, lapas, lulas,
sardinhas e percebes. E **não há sapateira nenhuma**: a foto que o plano tomava
por sapateira tem uma navalheira ao lado de um prato de percebes. Os seis
destaques têm de contar com isto.

**Tratamento:** as fotos diurnas levam duas camadas de gradação por cima do
`<Image>` (`bg-breu/45 mix-blend-multiply` + `bg-lanterna/12 mix-blend-overlay`)
para assentarem na paleta nocturna. Não é filtro CSS no ficheiro — é uma camada
sobreposta, reversível e que não toca no original. As fotos já nocturnas levam
metade.

---

## O que ainda falta

- **Preços reais.** Os da ementa são inventados, calibrados para o intervalo de
  10–20 € por pessoa que as avaliações indicam. Não há preços publicados em
  lado nenhum — nem no site `eatbu.com` da casa, nem no RestaurantGuru.
  `PRECOS_SAO_DEMO = true` em `lib/menu.ts` faz aparecer o aviso na página.
  Pôr a `false` quando chegarem os verdadeiros.
- Confirmar morada e horário com o Anselmo (dono).
- **`app/opengraph-image.tsx` está a falhar neste ambiente de desenvolvimento
  local** com `Input buffer contains unsupported image format`, num erro do
  WASM do Resvg que o `next/og` usa por baixo — verificado com uma rota
  `ImageResponse` mínima, igual ao exemplo da própria documentação do
  Next.js, sem fontes nem nada de especial: falha da mesma forma. Não é um
  erro do código deste projecto. Confirmar num ambiente de implantação a
  sério (Vercel) antes de assumir que está partido — pode ser específico
  desta máquina/sandbox.

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
