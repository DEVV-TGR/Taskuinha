# Taskuinha do Pirata — redesenho total
## "Taberna total, noite de tempestade"

> **Estado:** plano completo, pronto para revisão.
> **Fluxo:** Opus 5 escreveu este plano → **Fable 5 revê e critica** → Opus 5 executa.
> **Para o Fable 5:** as perguntas concretas onde quero a tua opinião estão na **§14**, no fim. Não são retóricas — há decisões que tomei sozinho e que podem estar erradas.

---

## 1. Contexto

### 1.1 O que existe hoje

`/Users/goncalosilva/Documents/GitHub/Taskuinha` — Next.js **16.3.0** (App Router), React **19.2.8**, Tailwind **v4.3.3** (CSS-first, sem ficheiro de config), `motion` **13.0.0** (sucessor do Framer Motion, importado de `motion/react`), Phosphor Icons via `@anthropic-ai/...` não — via `@phosphor-icons/react/dist/ssr`. TypeScript strict. Alias `@/*` → `./*`.

Git: branch `main`, **zero commits**, tudo por versionar. Não há baseline para comparar.

Duas rotas apenas: `/` e `/ementa`. 14 componentes, ~1100 linhas de JSX.

O site actual é um minimalismo náutico escuro e contido: base `#0b1214`, um único acento laranja `#e2622a`, Archivo (eixo `wdth` a 112) + Geist + Geist Mono, revelações de 20px com `cubic-bezier(0.16, 1, 0.3, 1)`, hairlines em vez de sombras, dois raios apenas (4px e `rounded-full`). É competente e coerente.

E é **exactamente o oposto da casa real.**

### 1.2 A casa real

Analisei 7 fotografias enviadas pelo Gonçalo e 24 descarregadas do Facebook da casa. O que está lá:

- Fachada azul-turquesa com **seis barris pendurados por baixo das letras P·I·R·A·T·A**
- Tecto de tábuas turquesa com um **mural de nau à vela em tempestade** pintado por cima
- Lemes de madeira, lanternas, conchas de vieira (Caminho de Santiago), sóis em relevo
- Aros salva-vidas "WELCOME ABOARD", bandeirinhas de países, redes de pesca, cordas
- **Aranhas peludas penduradas do tecto**, sardaniscas de borracha
- **Um esqueleto pirata sentado à porta a beber uma cerveja** — é o mascote, aparece em quase todas as fotos de visitantes
- Bandeira negra com caveira de chapéu e sabres cruzados
- Arca do tesouro, Captain Morgan, estátuas de piratas em tamanho real
- Ementa manuscrita em tábuas de madeira empilhadas na fachada
- Parede de autocolantes de clubes de motards
- Barril pintado de vermelho/amarelo/azul, bancos brancos, calçada portuguesa
- Esplanada com vedação de tábuas coloridas, prancha de salvamento I.S.N., bicicleta velha
- O mar a vinte passos, com pores-do-sol de cortar a respiração

### 1.3 Decisões do cliente (já tomadas, não reabrir)

| Eixo | Escolha | Implicação |
|---|---|---|
| Intensidade | **Taberna total** | Nenhuma secção fica "limpa". Textura em todo o lado. |
| Paleta | **Noite de tempestade** | Escuro, luz de lanterna, sem modo claro. |
| Tipografia | **Tabuleta pintada** | Rye + Alegreya Sans + Special Elite. |
| Ementa | **Pergaminho pregado na madeira** | Estilo Kalóz Étterem sobre parede de tábuas. |
| Hero | **A fachada de noite** | Barris oscilam, lanternas piscam. |
| Partidas | **As quatro** | Aranha, sardaniscas, esqueleto+mar, corda/rede/bandeirinhas. |
| Extra | **Ecrã de entrada** | Sem som de ambiente. Sem cursor de gancho. |

Referência visual da ementa: **https://kalozetterem.hu/etlap** — pergaminho de bordas queimadas sobre fundo preto, duas colunas, serif antiga em versaletes, preços alinhados à direita, ingredientes em letra pequena por baixo. A deles é uma imagem PNG estática de 1100×1545; **a nossa é HTML a sério** — indexável, adaptável, editável no `lib/menu.ts`.

---

## 2. Duas descobertas nas fotografias que mudam o desenho

### 2.1 A casa tem uma assinatura tipográfica própria

O letreiro de madeira sobre a porta lê-se **`TASKUIИHA`** — com o **N ao contrário**. O comando de mesa em forma de leme, pintado à mão em vermelho, repete o mesmo: `ᴀꜱкυιИнᴀ`. Aparece em duas peças independentes, feitas em alturas diferentes. **Não é gralha, é a letra da casa.**

Isto vale mais do que qualquer fonte que eu pudesse escolher. Vai para o `Wordmark.tsx`.

**Implementação obrigatória** — o N invertido é decoração visual, o nome tem de continuar legível para máquinas:

```tsx
<span aria-hidden="true">
  TASKUI<span className="inline-block scale-x-[-1]">N</span>HA
</span>
<span className="sr-only">Taskuinha</span>
```

O `<Link>` que envolve o wordmark já tem `aria-label="Taskuinha do Pirata, ir para a página inicial"` — manter, e nesse caso o `sr-only` é redundante dentro do link mas necessário fora dele (hero, footer com `size="lg"`).

### 2.2 O logótipo existe e está fotografado

`688585202` — bandeira negra, caveira com chapéu de bicorne, sabres cruzados por baixo, uma caveira pequena na aba do chapéu. A mesma imagem aparece na capa do menu de mesa (visível em `618724567`, com "RUMOCEANO" à volta).

É o símbolo da casa. Vai para:
- `app/icon.svg` (redesenhado em vector, substitui o "T" laranja actual)
- `app/opengraph-image.tsx`
- `components/decor/BandeiraNegra.tsx`

---

## 3. Sistema de design — `app/globals.css`

Reescrever o ficheiro inteiro (136 linhas hoje). **Preservar** três coisas: a regra de raio única, o bloco `prefers-reduced-motion` com o `[data-reveal]`, e a regra `.map-frame`.

### 3.1 Tokens

```css
:root {
  color-scheme: dark;

  /* Superfícies — casco molhado à noite */
  --breu:          #080B0D;   /* fundo base */
  --breu-raso:     #10161A;   /* superfície elevada (cartões) */
  --breu-fundo:    #05080A;   /* superfície afundada (faixas) */

  /* Madeira — as tábuas da casa */
  --madeira:       #2A1B10;
  --madeira-luz:   #6B4A2F;   /* veio quando a luz bate */
  --madeira-borda: #1A1008;

  /* Turquesa — o tecto da casa, dessaturado pela noite */
  --turquesa:      #2E7E80;
  --turquesa-luz:  #4FBFC4;   /* quando a lanterna bate */

  /* Acentos */
  --lanterna:      #F2A33C;   /* âmbar — ACENTO PRINCIPAL */
  --sangue:        #A81E22;   /* Super Bock, lenço da caveira — secundário */
  --sobre-acento:  #0A0705;   /* texto sobre --lanterna */

  /* Texto */
  --osso:          #E8DCC4;   /* caveiras, texto principal */
  --osso-fraco:    #9A8F7C;   /* texto secundário */

  /* Pergaminho — só na ementa */
  --pergaminho:      #D9C7A0;
  --pergaminho-tinta: #2B1D0E;
  --pergaminho-queimado: #6B4517;

  /* Linhas e véus */
  --linha:         rgb(232 220 196 / 0.14);
  --linha-forte:   rgb(232 220 196 / 0.28);
  --veu:           rgb(5 8 10 / 0.72);
  --relampago:     #CFE6F0;

  --radius-card: 4px;
}
```

**Contraste verificado** (WCAG AA precisa de 4.5:1 para texto normal):

| Par | Rácio | Estado |
|---|---|---|
| `--osso` #E8DCC4 sobre `--breu` #080B0D | **16.0:1** | AAA |
| `--osso-fraco` #9A8F7C sobre `--breu` | **7.3:1** | AAA |
| `--lanterna` #F2A33C sobre `--breu` | **9.7:1** | AAA |
| `--sobre-acento` #0A0705 sobre `--lanterna` | **9.4:1** | AAA |
| `--pergaminho-tinta` #2B1D0E sobre `--pergaminho` #D9C7A0 | **9.9:1** | AAA |
| `--sangue` #A81E22 sobre `--breu` | **3.3:1** | ✗ — **só para superfícies e ícones grandes, nunca texto de corpo** |
| `--turquesa` #2E7E80 sobre `--breu` | **4.4:1** | limítrofe — **só decoração**; para texto usar `--turquesa-luz` (**8.5:1**) |

> **Regra que fica escrita no CSS:** `--sangue` e `--turquesa` não tocam em texto. Existem para preencher, sublinhar e desenhar.

### 3.2 Mapa Tailwind v4

```css
@theme inline {
  --color-breu: var(--breu);
  --color-breu-raso: var(--breu-raso);
  --color-breu-fundo: var(--breu-fundo);
  --color-madeira: var(--madeira);
  --color-madeira-luz: var(--madeira-luz);
  --color-turquesa: var(--turquesa);
  --color-turquesa-luz: var(--turquesa-luz);
  --color-lanterna: var(--lanterna);
  --color-sangue: var(--sangue);
  --color-sobre-acento: var(--sobre-acento);
  --color-osso: var(--osso);
  --color-osso-fraco: var(--osso-fraco);
  --color-pergaminho: var(--pergaminho);
  --color-pergaminho-tinta: var(--pergaminho-tinta);
  --color-linha: var(--linha);
  --color-linha-forte: var(--linha-forte);

  --font-tabuleta: var(--font-rye);
  --font-corpo: var(--font-alegreya);
  --font-maquina: var(--font-elite);
  --font-pergaminho: var(--font-imfell);

  --radius-card: 4px;
}
```

### 3.3 Modo claro: eliminado

Apagar o bloco `@media (prefers-color-scheme: light)` (linhas 33–48 do ficheiro actual). *Noite de tempestade* não tem versão diurna — um modo claro tornaria o conceito incoerente e duplicaria o custo de teste de cada uma das 30 fotografias tratadas.

Consequências a tratar:
- `<meta name="theme-color">` em `layout.tsx` passa de `#0b1214` para `#080B0D`.
- A regra `.map-frame` está dentro de `@media (prefers-color-scheme: dark)` — **tirar o media query**, passa a aplicar-se sempre.

### 3.4 Classes utilitárias novas

```css
/* Tabuleta pintada: Rye com inclinação individual e tinta descascada. */
.display {
  font-family: var(--font-rye), Georgia, serif;
  font-weight: 400;              /* Rye só tem 400 */
  letter-spacing: 0.01em;        /* Rye é apertada de origem; abrir um pouco */
  text-transform: uppercase;
  transform: rotate(var(--tilt, 0deg));
  text-shadow:
    0 1px 0 rgb(0 0 0 / 0.6),
    0 0 24px rgb(242 163 60 / 0.15);
}

/* Superfície de tábuas. Ver §4 para o gerador do SVG. */
.tabua {
  background-color: var(--madeira);
  background-image: var(--textura-madeira);
  background-size: 320px 100%;
  box-shadow: inset 0 0 60px rgb(0 0 0 / 0.55);
}

/* Pergaminho com bordas rasgadas e queimadas. */
.pergaminho {
  background-color: var(--pergaminho);
  background-image: var(--textura-pergaminho);
  color: var(--pergaminho-tinta);
  filter: drop-shadow(0 8px 24px rgb(0 0 0 / 0.7));
  /* A borda rasgada é feita por mask-image, não por border-radius. */
  mask-image: var(--mascara-rasgada);
  mask-size: 100% 100%;
}

/* Tudo o que está pendurado balança a partir do topo. */
.pendurado {
  transform-origin: 50% 0%;
  will-change: transform;
}

/* Letra entalhada na madeira. */
.gravado {
  text-shadow:
    0 -1px 0 rgb(0 0 0 / 0.8),
    0 1px 0 rgb(232 220 196 / 0.14);
}

.link-underline {
  background-image: linear-gradient(var(--lanterna), var(--lanterna));
  /* resto igual ao actual */
}
```

`.display-tight` desaparece — nunca foi usado em lado nenhum.

### 3.5 Foco visível

```css
:where(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--lanterna);
  outline-offset: 3px;
  border-radius: 2px;
}
```

Manter tal e qual, só a variável muda. **Atenção:** sobre o pergaminho claro, o âmbar `#F2A33C` só faz 2.0:1 contra `#D9C7A0`. Acrescentar:

```css
.pergaminho :where(a, button):focus-visible {
  outline-color: var(--pergaminho-tinta);
}
```

### 3.6 Movimento reduzido

**Manter o bloco actual sem alterações** (linhas 116–136). É a rede de segurança de todo o site: com movimento reduzido, o Motion não chega a animar e o conteúdo servido com `opacity: 0` ficaria invisível para sempre. Acrescentar as novas marcas:

```css
@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  [data-pendurado],
  [data-tralha] {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  [data-tralha-movel] { display: none !important; }
}
```

`[data-tralha-movel]` é para a aranha e as sardaniscas: com movimento reduzido não devem aparecer paradas no ecrã (uma aranha imóvel a meio da página é pior do que aranha nenhuma) — desaparecem por completo.

---

## 4. Texturas — `lib/texturas.ts` (ficheiro novo)

Nenhuma textura entra como PNG. Tudo gerado em SVG e servido como data-URI, para (a) não pesar, (b) recolorir a partir dos tokens, (c) variar por semente sem gerar ficheiros.

```ts
/** Veio de madeira: linhas verticais irregulares + nós ocasionais. */
export function veioMadeira(opts?: { cor?: string; semente?: number }): string

/** Borda rasgada + manchas de queimado, para o Pergaminho. */
export function bordaPergaminho(semente: number): { fundo: string; mascara: string }

/** Malha de rede de pesca em losango, com nós nos cruzamentos. */
export function malhaRede(opts?: { passo?: number; cor?: string }): string

/** Grão de filme, para assentar as fotografias tratadas. */
export function granulado(opacidade?: number): string
```

**Restrição de implementação:** todas estas funções são puras e determinísticas — recebem semente, nunca chamam `Math.random()`. Senão o HTML do servidor não bate certo com o do cliente e o React dá erro de hidratação. As sementes vêm do índice do elemento.

As data-URI resultantes são atribuídas a custom properties (`--textura-madeira`, `--textura-pergaminho`, `--mascara-rasgada`) via `style` inline no elemento, não em `globals.css`, para poderem variar por instância.

---

## 5. Tipografia — `app/layout.tsx`

### 5.1 Fontes

```tsx
import { Rye, Alegreya_Sans, Special_Elite, IM_Fell_English_SC } from "next/font/google";

/* Títulos e wordmark. Wood-type de tabuleta de doca. Só tem peso 400. */
const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* Corpo. Humanista, boa em pt-PT, tem acentuação completa. */
const alegreya = Alegreya_Sans({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/* Preços, horas e números fora do pergaminho. Máquina de escrever gasta. */
const elite = Special_Elite({
  variable: "--font-elite",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* Só dentro do pergaminho da ementa. Prensa inglesa do séc. XVII. */
const imfell = IM_Fell_English_SC({
  variable: "--font-imfell",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
```

### 5.2 Riscos tipográficos que tenho de verificar em execução

| Risco | Verificação |
|---|---|
| **Rye não tem acentos suficientes.** É uma display face americana; pode faltar-lhe `Ç`, `Ã`, `Õ`. | Renderizar `AÇÃOÕÊÁ` em Rye antes de a adoptar. **Se falhar, o plano B é `Ewert` ou `Bowlby One SC`.** O nome da casa não tem acentos, mas "O QUE SAI MAIS DA COZINHA" e "ENCONTRAR-NOS" não são problema; "A CASA" também não. O risco real é baixo mas tem de ser confirmado. |
| **IM Fell English SC não tem minúsculas verdadeiras** (é small-caps). | Só usar em títulos de categoria e nomes de prato. As descrições em minúscula dentro do pergaminho usam `IM Fell English` (a variante regular) ou caem para Alegreya. **Decisão: usar Alegreya Sans a 0.78rem para as descrições dentro do pergaminho** — menos "época", muito mais legível, e o Kalóz também alterna. |
| **Quatro famílias = ~125 kB de fontes.** | `preload` só na Rye (aparece no hero, é LCP). As outras `display: swap` sem preload. |

### 5.3 Aplicação no `<html>`

```tsx
<html lang="pt-PT" className={`${rye.variable} ${alegreya.variable} ${elite.variable} ${imfell.variable} h-full antialiased`}>
```

E `body { font-family: var(--font-alegreya), Georgia, serif; }` em `globals.css`.

### 5.4 A camada de tralha entra aqui

`<Tralha />` é montada **uma vez** no `layout.tsx`, dentro do `<body>`, depois de `{children}`. É `position: fixed`, `inset: 0`, `z-index: 60` (acima da Nav em `z-40`, abaixo do ecrã de entrada em `z-100`), `pointer-events: none`.

`<Entrada />` também entra no `layout.tsx`, antes de `{children}`.

---

## 6. Fotografias — inventário completo

30 ficheiros. Todos os nomes actuais do Facebook são ilegíveis (`518408998_10226355038856709_...`) e têm de ser renomeados.

### 6.1 Tabela de renomeação

| Novo nome | Origem | Dimensões | Uso |
|---|---|---|---|
| `fachada-noite.jpg` | `707965177_10229312648315097_1968270869756246520_n.jpg` | 1536×2048 | **HERO** — lanternas acesas, PIRATA iluminado, esqueleto, calçada |
| `fachada-noite-2.jpg` | `574326403_10227294304937774_7050499640895100241_n.jpg` | 1536×2048 | alternativa / galeria |
| `fachada-por-do-sol.jpg` | `518408998_10226355038856709_7228725276210306259_n.jpg` | 2048×1536 | galeria, secção "a casa" |
| `esqueleto.jpg` | `657364195_10228730190354012_418562580524896932_n.jpg` | 1536×2048 | **recorte do mascote** |
| `esqueleto-corpo.jpg` | `644703120_1679612813055783_5758553946020778859_n.jpg` | 1080×1440 | corpo inteiro + tábuas da ementa manuscrita |
| `bandeira-caveira.jpg` | `688585202_4469785043266558_4583852262713201919_n.jpg` | 2048×1536 | **o símbolo** — base do favicon e do OG |
| `leme-taskuinha.jpg` | `729089541_995606476587378_7547984037809511243_n.png.jpeg` | 1536×2048 | **a caligrafia da casa** — referência do wordmark |
| `tecto-nau.jpg` | `685844358_4469784366599959_6450491523383514305_n.jpg` | 2048×1536 | fundo de secção — o mural da nau |
| `tecto-nau-aranha.jpg` | `520105075_122136247838832142_1190173308918753573_n.jpg` | 1152×2048 | **a aranha real** — referência do `Aranha.tsx` |
| `sala-cheia.jpg` | `634837641_10228325604559620_2642047227162757818_n.jpg` | 2048×1536 | ambiente nocturno com gente |
| `balcao-bandeirinhas.jpg` | `684884674_4469784839933245_4919408792511060562_n.jpg` | 2048×1536 | **as bandeiras reais** — referência do `Bandeirinhas.tsx` |
| `balcao-espingardas.jpg` | `688061339_4469785429933186_8264760275636695475_n.jpg` | 2048×1536 | secção "a casa" |
| `sala-estatuas.jpg` | `687686152_4469785576599838_5186433251577930178_n.jpg` | 2048×1536 | galeria — Captain Morgan, arca |
| `esplanada.jpg` | `743081973_10229724386648298_7073759782216577783_n.jpg` | 2048×1536 | galeria |
| `esplanada-2.jpg` | `741613613_10229724387328315_1749387461793238319_n.jpg` | 2048×1536 | galeria |
| `mar-por-do-sol.jpg` | `746493862_27750324414599538_8362557183343833308_n.jpg` | 2048×1536 | rodapé, secção "o sítio" |
| `mar-cao.jpg` | `748597617_10229775676010500_4145202323473779531_n.jpg` | 1536×2048 | galeria |
| `petisco-ameijoas.jpg` | `748311800_27927452626895021_777971708985165135_n.jpg` | 1536×2048 | destaque 1 |
| `petisco-percebes.jpg` | `748053516_10229774423899198_3282490917910578164_n.jpg` | 1536×2048 | destaque 2 |
| `petisco-lapas.jpg` | `641299818_26165805559718106_1209065968005064136_n.jpg` | 1536×2048 | destaque 3 |
| `petisco-lulas.jpg` | `749286216_27927454273561523_783540569916813950_n.jpg` | 1536×2048 | destaque 4 |
| `petisco-sardinhas.jpg` | `529350764_10226523063737226_305546037947919850_n.jpg` | 1536×2048 | destaque 5 |
| `petisco-sapateira.jpg` | `618724567_26165806193051376_5484974001514720936_n.jpg` | 1536×2048 | destaque 6 |
| `petisco-lapas-cruas.jpg` | `744820988_10229775676250506_2319099391667412227_n.jpg` | 1536×2048 | reserva |
| `nau-cruz.jpg` | `Nau.jpg` | 401×453 | ilustração |
| `nau-armada.webp` | `Nau-que-pertenceu-as-armadas-...webp` | 800×547 | ilustração |
| `naus-frota.jpg` | `images.jpeg` | 630×420 | ilustração |
| `caveira-madeira.jpg` | `il_570xN.7173722712_1d2m.jpg` | 570×713 | **ecrã de entrada** (já vem com fundo preto) |
| `caveira-lenco.webp` | `D_NQ_NP_602027-MLB110720370867_042026-O.webp` | 410×500 | decoração (fundo branco, recortável) |
| `caveira-mesa.webp` | `D_NQ_NP_659646-MLA109826481800_042026-O.webp` | 500×500 | decoração |

### 6.2 Tratamento

Todas as fotografias diurnas (`fachada-por-do-sol`, `balcao-*`, `sala-estatuas`, `esplanada*`, os petiscos) precisam de assentar na paleta nocturna. **Não com um filtro CSS aplicado em runtime** — isso não é recortável e sabe a Instagram. Em vez disso, uma camada de gradação por cima de cada `<Image>`:

```tsx
<div className="absolute inset-0 bg-[var(--breu)]/45 mix-blend-multiply" />
<div className="absolute inset-0 bg-[var(--lanterna)]/12 mix-blend-overlay" />
```

Escurece, aquece, e não toca no ficheiro original. As fotos que já são nocturnas (`fachada-noite*`, `sala-cheia`) levam só metade da primeira camada.

### 6.3 Recorte do esqueleto

`esqueleto.jpg` tem o mascote sobre uma parede de madeira. Para o `Esqueleto.tsx` preciso dele **sem fundo**. Duas hipóteses:

- **A** — recorte manual num editor, guardado como `esqueleto-recortado.png` com alfa. Melhor resultado, exige trabalho fora do código.
- **B** — `clip-path` com um `polygon()` desenhado à mão sobre a silhueta, mais uma máscara radial suave. Fica no código, aproximado, e a parede de fundo do site é madeira escura na mesma, portanto a costura pouco se nota.

**Decisão: começar por B.** Se ficar mau, o A é uma substituição de ficheiro sem tocar em código. *(Fable: concordas? Ver §14.)*

### 6.4 Peso

30 ficheiros a ~350 kB = **~9 MB no repositório**. O `next/image` serve WebP redimensionado em runtime, portanto o utilizador final não descarrega isto. Mas o repositório fica pesado e há zero commits até agora. Correr `sips` para converter os JPEG a WebP com qualidade 80 antes de commitar reduz a ~4 MB sem perda visível.

---

## 7. A camada de tralha — `components/decor/`

Pasta nova, 13 ficheiros. **Regras que se aplicam a todos:**

1. `aria-hidden="true"` — nada disto é conteúdo.
2. `pointer-events: none` por omissão. Excepção: os elementos que reagem ao rato usam um listener no `window`, não uma hit area — assim nunca roubam cliques.
3. Todos consultam `useReducedMotion()` e desaparecem ou congelam.
4. Todas as animações contínuas param com `document.visibilityState === "hidden"`, senão comem bateria em segundo plano.
5. Nenhum usa `Math.random()` durante a renderização — só dentro de `useEffect`, depois da hidratação.

| Ficheiro | Especificação |
|---|---|
| `Tralha.tsx` | Orquestrador. `fixed inset-0 z-[60] pointer-events-none`. Monta `Rede`, `Bandeirinhas`, `Aranha`, e 2–3 `Sardanisca`. Faz o *scheduling* da aranha. |
| `Aranha.tsx` | SVG de aranha peluda + fio de seda. Desce de `y: -120` a `y: 220` em ~1.2 s com `ease: [0.34, 1.56, 0.64, 1]`, abana com `rotate` ±6° em loop de 2.4 s, e sobe em 0.5 s quando o cursor entra num raio de 140 px. Dispara: (a) ao entrar em `#a-casa`, (b) depois em intervalos aleatórios de 45–120 s, no máximo 3 vezes por sessão. |
| `Sardanisca.tsx` | Lagartixa SVG com 4 patas animadas. Percurso restrito a uma faixa de **48 px** junto às bordas do viewport — nunca sobre texto. Ciclo: correr 1–3 s → parar 2–5 s (cabeça a rodar) → fugir se o cursor entrar a menos de 120 px. Props: `borda: "cima" \| "baixo" \| "esquerda" \| "direita"`, `atraso`. |
| `Rede.tsx` | Rede em losango via `malhaRede()`, nos 4 cantos, com conchas de vieira e nós. `opacity: 0.28`. Estática. |
| `Bandeirinhas.tsx` | As bandeiras reais da casa, pela ordem em que estão penduradas: **Brasil, Espanha, Alemanha, Gana, Argentina, Costa Rica, Camarões, Chile, Austrália, Coreia do Sul** (lidas em `balcao-bandeirinhas.jpg`). Cada uma abana com `rotate` ±4°, desfasadas em `i * 0.12 s`, período 3.2 s. |
| `Barril.tsx` | Barril de madeira em SVG, pendurado por corda. Pêndulo amortecido: `rotate` de ±(3 + intensidade)° com `spring` `{ stiffness: 40, damping: 8, mass: 1.2 }`. Props: `letra`, `indice`. Reage à posição horizontal do rato: quanto mais perto, mais oscila. |
| `Lanterna.tsx` | `radial-gradient` âmbar + `mix-blend-mode: screen`. Flicker: `opacity` entre 0.82 e 1.0 com passos irregulares (keyframes com tempos não uniformes — um flicker uniforme lê-se como pulsação de LED, não como chama). |
| `Relampago.tsx` | Flash de `--relampago` a 0.35 de opacidade, duas descargas rápidas (80 ms + 140 ms com 60 ms de intervalo), depois nada durante 15–40 s. Só no hero. |
| `Mar.tsx` | 3 camadas de onda SVG com `translateX` em loop infinito, velocidades 40 s / 62 s / 88 s, amplitudes decrescentes. Hero e rodapé. |
| `Esqueleto.tsx` | O mascote. Animação: braço da garrafa sobe à boca e desce, ciclo de 9 s com 6 s de pausa. |
| `BandeiraNegra.tsx` | A caveira de chapéu e sabres, com ondulação de tecido (`skewY` + `scaleX` em ciclo de 4 s). |
| `Pergaminho.tsx` | Recebe `children`. Moldura com `mask-image` de borda rasgada (semente pelo índice), manchas de queimado, e 4 pregos de ferro em SVG nos cantos. |
| `Tabua.tsx` | Superfície de tábuas. Recebe `children`. Ripas de largura variável (semente determinística), veio, nós, e sombra interna forte. |

---

## 8. Movimento — `components/Reveal.tsx`

Este é o ficheiro mais perigoso do redesenho: é usado em **todos** os blocos de conteúdo das duas páginas. Mudar aqui muda tudo.

**Hoje:** `opacity 0→1` + `y: 20→0`, 600 ms, `ease: [0.16, 1, 0.3, 1]`, stagger `min(index * 0.07, 0.35)`.

**Passa a:** "cair e balançar" — como algo que foi pendurado num prego.

```tsx
initial={reduce ? false : { opacity: 0, y: -14, rotate: tilt }}
whileInView={{ opacity: 1, y: 0, rotate: 0 }}
viewport={{ once: true, amount: 0.25 }}
transition={{
  type: "spring",
  stiffness: 120,
  damping: 14,
  mass: 0.9,
  delay: reduce ? 0 : Math.min(index * 0.07, 0.35),
}}
```

Onde `tilt = (index % 2 === 0 ? -3 : 3)` — alterna o lado para o conjunto ler como um mural desalinhado, não como uma fila.

**Obrigatório manter:**
- O atributo `data-reveal=""`. É o gancho das regras de `<noscript>` (em `layout.tsx`) e de `prefers-reduced-motion` (em `globals.css`). Sem ele, o site fica em branco para quem tem JS desligado.
- A prop `as` com o mesmo union type (`"div" | "li" | "section" | "article" | "figure"`).
- A prop `index` para o stagger.

**Nota sobre `spring` + `rotate`:** um `spring` com `damping: 14` faz *overshoot*. Com `rotate` isso lê-se como balanço — é o que queremos. Mas em elementos largos (o `<h2>` de uma secção) 3° de rotação desloca os cantos vários pixels e pode causar reflow visível. **Aplicar `will-change: transform` e confirmar em telemóvel.**

### 8.1 Ecrã de entrada — `components/Entrada.tsx` (novo)

```
t=0.0s   ecrã a --breu, opacidade 1
t=0.2s   lanterna acende (radial-gradient a crescer de 0 a 1)
t=0.6s   caveira-madeira.jpg entra com scale 1.06 → 1
t=1.0s   TASKUIИHA aparece por baixo
t=1.5s   cortina abre (clip-path a subir) e o componente desmonta
```

Regras:
- `z-index: 100`. Acima de tudo.
- Uma vez por dia: `localStorage.setItem("tsk-entrada", new Date().toDateString())`.
- **Nunca** com `prefers-reduced-motion`.
- **Nunca** bloqueia a leitura: o conteúdo por baixo já está renderizado e indexado; isto é uma camada por cima, não um gate. Se o JS falhar, não aparece de todo.
- Botão invisível de escape: qualquer tecla ou clique salta.

---

## 9. Secções — especificação por componente

### 9.1 `Hero.tsx` + `HeroMedia.tsx`

A foto `fachada-noite.jpg` **já é** o hero escolhido: lanternas acesas, letreiro PIRATA iluminado, esqueleto sentado, calçada molhada, porta aberta com luz a sair.

Camadas, de trás para a frente:

```
z-0   céu (gradiente breu → breu-raso) + <Relampago />
z-10  <Image src="/images/fachada-noite.jpg" fill priority /> com parallax 10%
z-20  gradação nocturna (§6.2, versão suave)
z-30  <Bandeirinhas />
z-40  seis <Barril letra="P|I|R|A|T|A" /> alinhados com os da foto
z-50  scrim de leitura (o gradiente actual, mantido)
z-60  texto: TASKUIИHA em Rye + "O mar fica a vinte passos." + 2 CTA
```

**Reaproveitar** o padrão de parallax que já existe em `HeroMedia.tsx` (`useScroll` com `offset: ["start start", "end start"]` + `useTransform` para `y: 0% → 10%`). Funciona bem e já respeita `useReducedMotion`.

**Alinhamento dos barris:** a foto tem os barris numa faixa horizontal a ~28% da altura. Os barris SVG têm de assentar por cima dos reais, não ao lado. Isto é posicionamento percentual afinado à mão contra a imagem — **é o detalhe mais provável de correr mal e o que mais tempo vai levar a acertar.**

*Alternativa mais segura, se o alinhamento não sair:* os barris SVG ficam numa faixa própria por cima do topo da foto, como uma segunda fila. Perde-se o truque, ganha-se robustez em todos os tamanhos de ecrã.

### 9.2 `Nav.tsx`

Os quatro links (`A casa`, `Petiscos`, `O sítio`, `Ementa`) passam a placas de madeira penduradas por corda, com balanço ao scroll.

**Manter:** o `motion.div` de backdrop cuja opacidade vem de `useTransform(scrollY, [0, 120], [0, 1])`. É bom — não há re-render por frame.

**Corrigir um buraco que já existe:** hoje o `<ul>` é `hidden md:flex` e abaixo de `md` sobrevive apenas um link de texto "Ementa" ao lado do botão de telefone. **Não há menu de telemóvel.** Acrescentar uma gaveta que desce como escotilha, com:
- botão hambúrguer que é uma argola de latão
- `aria-expanded`, `aria-controls`
- fecho com `Escape`
- *focus trap* enquanto aberta
- `overflow: hidden` no `<body>` enquanto aberta

**Altura:** manter os `68px` exactos. `MenuCategoryNav` tem `sticky top-[68px]` codificado — se a altura mudar, mudam as duas. Melhor: extrair para `--altura-nav: 68px` em `globals.css` e usar `top-[var(--altura-nav)]` nos dois sítios.

### 9.3 `Wordmark.tsx`

```
TASKUIИHA     ← Rye, .gravado, N invertido (§2.1)
DO PIRATA     ← Special Elite, tracking 0.34em / 0.28em
```

Com uma caveira pequena (SVG, 12 px) entre as duas linhas. Manter a API `size?: "sm" | "lg"` — o Footer usa `size="lg"`.

### 9.4 `Cta.tsx`

Tabuletas de madeira com pregos e texto gravado, em vez de pílulas.

**Manter a API intacta:** `href`, `variant?: "primary" | "secondary"`, `children`, `className`, e o auto-switch entre `<a>` e `next/link` conforme o `href` começa por `tel:`/`http`. É usado em **cinco** sítios (`Hero` ×2, `Nav`, `Encontrar` ×2, `ementa/page`) e o `Nav` passa-lhe overrides de tamanho por `className` (`px-4 py-2 text-sm sm:px-6 sm:py-3`) — esse padrão tem de continuar a funcionar.

```
primary:   fundo --lanterna, texto --sobre-acento, 4 pregos, sombra interna
secondary: contorno --linha-forte, fundo --breu/70, hover a --lanterna
```

`border-radius` passa a `var(--radius-card)` (4px) em vez de `rounded-full` — uma tabuleta de madeira não é uma pílula. **Isto quebra a regra de raio actual do sistema** ("interactivos totalmente arredondados"). É deliberado: reescrever o comentário no topo de `globals.css` para a nova regra — *tudo a 4 px, porque tudo é madeira serrada*.

### 9.5 `Casa.tsx`

Texto sobre `<Tabua>`, foto `balcao-espingardas.jpg` numa moldura torta, `<Lanterna>` a iluminar de lado. Manter o texto — é bom (*"Chamam-lhe o Pirata. O nome pegou-se e ficou, como se pega tudo numa terra pequena."*).

É aqui que a `<Aranha>` dispara pela primeira vez.

### 9.6 `Petiscos.tsx`

Os seis destaques passam a quadros pendurados tortos numa parede de tábuas; endireitam-se no hover (`rotate: 0`, 300 ms).

**Restrição estrutural que se mantém:** o array `cells` codifica uma grelha de 6 colunas onde o primeiro item ocupa `col-span-4 row-span-2` e os restantes `col-span-2`. **`highlights` tem de continuar a ter exactamente 6 itens.** Deixar o comentário no `lib/menu.ts`.

**Melhoria que o novo material permite:** hoje dois dos seis destaques não têm fotografia e renderizam um ramo alternativo com o preço em corpo grande a preencher a célula. Com fotos reais de todos os seis, **esse ramo `else` desaparece** e o componente fica mais simples.

### 9.7 `Galeria.tsx`

Molduras de madeira presas com rede, inclinação individual. Quatro fotos: `sala-cheia`, `tecto-nau-aranha`, `sala-estatuas`, `esplanada`.

Manter a grelha de 12 colunas com `spans = [5, 7, 7, 5]` e as alturas fixas `h-64 sm:h-[26rem]` — evitam CLS e o ritmo invertido entre linhas funciona.

**Atenção:** o `key` actual é `shot.slot`. O campo `slot` vai desaparecer do tipo `Photo` (§10.1) — trocar para `shot.src`.

### 9.8 `Vozes.tsx`

Opiniões em pequenos `<Pergaminho>` pregados, estrelas desenhadas em osso, e os deslocamentos alternados que já existem (`sm:mr-auto`, `sm:ml-auto`, `sm:mx-auto`) para ler como mural.

**Manter a técnica de máscara CSS** dos logótipos das plataformas (`maskImage: url(/logos/${icon}.svg)` sobre `bg-current`). Funciona, herda a cor do tema, e é a solução certa.

**Corrigir:** `site.links.restaurantGuru` é usado como `href` do rating do Google mas **não existe `restaurantguru.svg`** em `/public/logos` — só `google`, `instagram` e `tripadvisor`. O `instagram.svg` está lá e **não é usado por nada** (o Footer usa o componente Phosphor `InstagramLogo`). Decidir: ou apagar o SVG órfão, ou passar o Footer a usá-lo. **Recomendo apagar** — menos um ficheiro por manter.

### 9.9 `Encontrar.tsx` + `Mapa.tsx`

O mapa vira mapa do tesouro: `<Mapa />` embrulhado em `<Pergaminho>`, com X a marcar o sítio e uma bússola no canto.

**NÃO MEXER na lógica de `Mapa.tsx`.** O `ResizeObserver` com debounce de 200 ms que remonta o `<iframe>` por `key={`${w}x${h}`}` existe por uma razão real e bem documentada no ficheiro: o Leaflet dentro de um iframe cross-origin mede o contentor uma vez e nunca mais chama `invalidateSize`. Só se pode mexer no invólucro visual e na altura fixa (`h-[420px] lg:h-[600px]`, que evita CLS).

**Alerta:** o `<Pergaminho>` usa `mask-image`. Aplicar uma máscara a um contentor com um `<iframe>` dentro cria um *stacking context* e, em Safari, pode fazer o iframe desaparecer. **Aplicar a máscara a uma moldura irmã posicionada por cima, nunca ao elemento que contém o iframe.**

Os horários numa tabuleta pendurada, com o "SEGUNDA — FOLGA" manuscrito, como o cartaz real da fachada.

### 9.10 `Footer.tsx`

Casco de navio, `<Mar>` a bater por baixo, cordame, o barco RUMO OCEANO.

**Apagar o aviso:** *"Sítio de demonstração. As fotografias não são da casa..."* — a primeira metade deixa de ser verdade. Fica só a nota dos preços, condicionada a `PRECOS_SAO_DEMO`.

---

## 10. `lib/` e configuração

### 10.1 `lib/images.ts`

Reescrever por completo. Apagar o helper `u()` do Unsplash e as 10 URLs remotas.

```ts
export type Photo = {
  src: string;      // caminho local, /images/*.jpg
  alt: string;
  width: number;
  height: number;
  /** "noite" não leva gradação; "dia" leva a gradação completa de §6.2 */
  luz: "dia" | "noite";
};
```

O campo `slot` desaparece — existia só para dizer que ficheiro local iria substituir a foto de stock. Já não há foto de stock. **Verificar todos os usos de `.slot`** (`Galeria.tsx` usa-o como `key`).

**Preservar o registo dos `alt`** existentes — estão em português, são descritivos e bem escritos. Escrever os novos no mesmo tom.

### 10.2 `lib/menu.ts`

**Trocar os seis `highlights`** pelos que agora têm fotografia real:

| # | Prato | Foto | Estado hoje |
|---|---|---|---|
| 1 | Amêijoas ao alho | `petisco-ameijoas.jpg` | já é destaque |
| 2 | Percebes | `petisco-percebes.jpg` | era destaque **sem foto** |
| 3 | Lapas ao alho no pão | `petisco-lapas.jpg` | **prato novo** |
| 4 | Lulas grelhadas | `petisco-lulas.jpg` | está em `pratos`, não é destaque |
| 5 | Sardinhas na broa | `petisco-sardinhas.jpg` | **prato novo** |
| 6 | Sapateira | `petisco-sapateira.jpg` | **prato novo** |

Saem dos destaques: *Lulas fritas*, *Pataniscas de bacalhau*, *Prego no pão*, *Bacalhau à Brás* — continuam todos na ementa.

**Acrescentar à categoria `do-mar`:** Lapas ao alho, Sardinhas na broa, Sapateira. Os três estão fotografados e a sapateira é citada nas avaliações do RestaurantGuru.

**Manter:** `formatPrice()` com vírgula decimal e sufixo `€`, o tipo `Dish` com `note` opcional, e a flag `PRECOS_SAO_DEMO = true`.

**Preços:** procurei em `tasquinha-rumoceano.eatbu.com` (site oficial da casa) e no RestaurantGuru. **Não há preços publicados em lado nenhum.** Os actuais continuam inventados e o aviso mantém-se. Os três pratos novos levam preços calibrados pelo mesmo critério (10–20 € por pessoa).

### 10.3 `lib/reviews.ts`

Números verificados hoje (7 de Agosto de 2026) na página do RestaurantGuru:

| Plataforma | No ficheiro | Verificado |
|---|---|---|
| Google | 4,6 / 1350 avaliações | 4,6 / **1348** |
| TripAdvisor | 4,4 / 96 avaliações | 4,4 / **100** |

Existe também Facebook 5/5 (43) e Zomato 3,5/5 (4) — não vale a pena acrescentar.

O `aggregateRating` no JSON-LD de `layout.tsx` também diz `ratingCount: 1350` — actualizar para 1348, senão o schema contradiz a página.

### 10.4 `next.config.ts`

Remover o bloco `remotePatterns` inteiro. Continha `images.unsplash.com` (já sem uso) e `cdn.simpleicons.org` (sem uso desde que os logótipos foram guardados em `/public/logos`). O comentário no próprio ficheiro pede exactamente isto quando as fotos reais chegarem.

### 10.5 `app/opengraph-image.tsx` e `app/icon.svg`

Ambos têm a paleta antiga **escrita à mão** (`#0b1214`, `#f2ede4`, `#e2622a`, `#9aa8aa`) e iam ficar a destoar do site sem que ninguém desse por isso.

- `icon.svg`: o "T" laranja sai; entra a caveira da bandeira negra, simplificada a duas cores (`--breu` de fundo, `--osso` de traço). Tem de ler-se a 16 px — **desenhar para esse tamanho, não reduzir um desenho grande.**
- `opengraph-image.tsx`: fundo `--breu`, TASKUIИHA em grande, "DO PIRATA" espaçado, a caveira ao lado, morada em baixo. **Nota:** este ficheiro usa `fontFamily: "sans-serif"` — o `next/font` não chega ao `ImageResponse`. Para ter Rye no cartão é preciso carregar o `.ttf` explicitamente com `fetch` e passá-lo em `fonts: [...]`. Se isso complicar, usar uma serif do sistema e aceitar a diferença — é um cartão de partilha, não a página.

### 10.6 Documentação

- **`README.md`** — hoje é o boilerplate intacto do `create-next-app`, não diz nada sobre a Taskuinha. Substituir.
- **`public/images/README.md`** — hoje é a especificação dos 10 slots de foto que já não existem. Substituir pelo inventário da §6.1.
- **`MAPA.md`** (novo, na raiz) — o mapa de navegação do projecto. Conteúdo completo no **Anexo A**.

---

## 11. Acessibilidade — a lista que não pode falhar

Este redesenho põe o site inteiro a depender de animação e textura. É aí que costuma partir.

| # | Requisito | Como verificar |
|---|---|---|
| 1 | Com `prefers-reduced-motion: reduce`, **todo** o conteúdo visível e nada em movimento | DevTools → Rendering → Emulate CSS media feature. Percorrer as duas rotas de cima a baixo. |
| 2 | Sem JavaScript, todo o conteúdo visível | DevTools → Settings → Debugger → Disable JavaScript. O `<noscript>` em `layout.tsx` cobre `[data-reveal]`; **acrescentar as novas marcas ao mesmo bloco.** |
| 3 | Aranha e sardaniscas **desaparecem** com movimento reduzido, não congelam | Uma aranha parada a meio do ecrã é pior do que aranha nenhuma. |
| 4 | Contraste ≥ 4.5:1 em todo o texto | Tabela da §3.1. **Vigiar o texto sobre fotografia** — os scrims têm de garantir o mínimo em cima de qualquer zona da foto. |
| 5 | O wordmark anuncia "Taskuinha", não "T-A-S-K-U-I-Ê-N-H-A" | VoiceOver no macOS. |
| 6 | Toda a tralha é `aria-hidden` | Inspeccionar a árvore de acessibilidade. |
| 7 | Menu de telemóvel: `aria-expanded`, fecho com `Escape`, focus trap | Navegação só com teclado. |
| 8 | Anel de foco visível **também sobre o pergaminho** | §3.5 — outline escuro dentro de `.pergaminho`. |
| 9 | Ecrã de entrada não aparece com movimento reduzido e salta a qualquer tecla | — |
| 10 | Skip link continua a funcionar | Já existe em `layout.tsx`; confirmar que a `<Tralha>` em `z-60` não o tapa. **O skip link é `focus:z-50` — vai ficar por baixo da tralha. Subir para `z-[70]`.** |

---

## 12. Ordem de execução

Trabalhar em fases commitáveis. O repositório tem zero commits — **fazer um commit inicial do estado actual antes de começar**, para haver a que voltar.

| Fase | O que | Verificação |
|---|---|---|
| **0** | `git add -A && git commit` do estado actual. Criar `MAPA.md`. | `git log` tem 1 commit |
| **1** | Renomear e converter as 30 fotos. Reescrever `lib/images.ts` e `public/images/README.md`. Remover `remotePatterns`. | `npm run build` passa; imagens carregam |
| **2** | `globals.css` novo + fontes no `layout.tsx` + `lib/texturas.ts`. | Site fica feio mas funcional; verificar Rye com acentos |
| **3** | `components/decor/` — os 13 ficheiros, isolados, sem os ligar ainda. | Página de teste temporária |
| **4** | `Reveal.tsx` + `Wordmark.tsx` + `Cta.tsx` — os três primitivos. | Tudo continua a renderizar |
| **5** | `Nav.tsx` com menu de telemóvel + `Footer.tsx`. | Navegação por teclado |
| **6** | `Hero.tsx` + `HeroMedia.tsx`. **A fase mais demorada** (alinhamento dos barris). | Visual a 390/768/1440 |
| **7** | `Casa`, `Petiscos`, `Galeria`, `Vozes`, `Encontrar`. `lib/menu.ts` e `lib/reviews.ts`. | — |
| **8** | `/ementa` — pergaminho pregado + `MenuCategoryNav`. | Contraste, telemóvel |
| **9** | `Entrada.tsx`, `icon.svg`, `opengraph-image.tsx`, `README.md`. | — |
| **10** | Passagem completa de acessibilidade (§11) e de desempenho. | Lighthouse |

---

## 13. Verificação final

1. `npm run build` limpo. **Vigiar o `layout.tsx`** — quatro `next/font` numa página é onde isto parte primeiro.
2. `npm run lint` limpo.
3. `npm run dev` e percorrer `/` e `/ementa` a **390 px**, **768 px** e **1440 px**.
4. A lista de acessibilidade da §11, ponto por ponto.
5. Lighthouse: LCP abaixo de 2,5 s. O hero é uma imagem de 1536×2048 com `priority` — se o LCP escorregar, servir uma variante recortada a 1200 px de largura para telemóvel via `sizes`.
6. Verificar que o mapa continua a redimensionar sem cortar (rodar o telemóvel no simulador).
7. Verificar o JSON-LD em https://search.google.com/test/rich-results.

---

## 14. Perguntas ao Fable 5

Estas são as decisões onde não tenho certeza. Não são retóricas.

1. **§6.3 — recorte do esqueleto.** Escolhi `clip-path` em código (B) em vez de recorte manual com alfa (A), porque o fundo do site é madeira escura na mesma e a costura pouco se nota. É a escolha certa, ou o mascote da casa merece o recorte a sério?

2. **§9.1 — alinhamento dos barris no hero.** O plano é sobrepor barris SVG animados exactamente por cima dos barris reais da fotografia. É o truque mais bonito do site e o mais frágil: um desalinhamento de 2% em certos viewports lê-se como bug. A alternativa segura é pô-los numa faixa própria acima da foto. Arrisco?

3. **§9.4 — quebrar a regra de raio.** O sistema actual tem uma regra explícita: superfícies a 4 px, interactivos totalmente arredondados. Vou pôr tudo a 4 px porque uma tabuleta de madeira não é uma pílula. É coerência ou é perder uma distinção útil entre "isto clica-se" e "isto não"?

4. **§5.2 — quatro famílias tipográficas.** Rye + Alegreya Sans + Special Elite + IM Fell English SC. São ~125 kB e quatro vozes diferentes. Consigo cortar o IM Fell e usar Special Elite dentro do pergaminho, ficando com três. Vale a pena a quarta só para a ementa parecer-se com o Kalóz?

5. **§7 — quantidade de tralha simultânea.** Rede nos 4 cantos + bandeirinhas no topo + aranha + 2–3 sardaniscas + lanterna, tudo em simultâneo por cima de qualquer secção. "Taberna total" foi pedido explicitamente, mas há um ponto em que isto deixa de ser imersivo e passa a ser ilegível. Onde é que cortarias?

6. **§8 — `spring` no `Reveal`.** `stiffness: 120, damping: 14` faz overshoot com rotação, o que é o efeito pretendido. Mas isto corre em **todos** os blocos de conteúdo das duas páginas. Em telemóveis fracos, dezenas de springs simultâneos com `rotate`? Devia usar `tween` com `ease` de mola simulada?

7. **Preços inventados.** O site vai para o ar com preços falsos e um aviso a dizê-lo. Aceitável, ou devia esconder os preços por completo até haver os verdadeiros?

8. **Qualquer coisa que não vi.** É o que mais me interessa.

---

## Anexo A — `MAPA.md`

Já criado na raiz do repositório (Fase 0). É o índice de navegação do projecto:
onde mexer em quê, rotas, componentes, tokens de design, e as oito regras que
não se partem.

Ler **antes** de tocar em código.
