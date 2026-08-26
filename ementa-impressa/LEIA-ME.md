# Ementa impressa

## O ficheiro bom é o `Ementa_Aprovada_2026-08-23.pdf`

Se só se ler uma linha deste ficheiro, que seja esta. São três PDFs de doze
e seis páginas com nomes parecidos, e só um está certo:

| Ficheiro | Páginas | O que é |
|---|---|---|
| **`Ementa_Aprovada_2026-08-23.pdf`** | 12 | **O documento da casa.** Fechado pelo Tomás a 23 de Agosto, depois da prova desse dia |
| `Ementa_Final.pdf` | 12 | A versão anterior, de 22 de Agosto. Foi a que a prova mediu — está ultrapassada |
| `Ementa_Teste.pdf` | 6 | Outro documento, o de seis páginas, que sai do `ementa.html` que está aqui ao lado |

O aprovado bate certo com o site nos **154 preços** — comparei-os um a um
com o `data/ementa.json`. As duas únicas diferenças são de nome e ambas
deliberadas: a "Sangria, jarro", para não se confundir com o copo, e a
etiqueta "ÉPOCA" ao lado dos percebes.

**O que ele já resolve** da prova de pré-impressão: o pirata deixou de
estar esticado (1623 × 2212 em vez de 1323 × 2376), o fundo passou a PNG
sem perdas, o emoji Type3 desapareceu, a Special Elite voltou, e os
preços ficaram todos certos.

**O que falta lá dentro**, e é o que o próximo trabalho tem de apanhar:

- a **sangria** — não tem `BleedBox` nem `TrimBox`, e a caixa é A4 exacto
  (209,89 × 297,01 mm): o corte da gráfica apanha branco;
- a **contracapa fora do meio** — 35 mm de margem à esquerda contra 52 mm
  à direita;
- o **aviso de alergénios em inglês**, que ainda diz "everything here meets
  shellfish";
- **catorze descrições inglesas** que continuam a divergir do site (17 das
  31 batem certo) — por exemplo "Roasted on a clay tile" no papel contra
  "on a roof tile" no site;
- a **amêijoa a 16,90** e o **Baileys a 4,00**, ambos confirmados pelo dono
  a 26 de Agosto e já no site — o papel é que ainda não os tem. O Baileys
  é uma linha nova na folha do Bar, que já leva 39: o `--ar` dessa folha
  tem de ser reafinado.

> **O HTML que gerou este PDF não está aqui.** Está na máquina de quem o
> fez, e foi pedido. Sem ele, mudar uma linha da ementa obriga a refazer o
> documento a partir de uma versão anterior — que é precisamente o que este
> aviso existe para evitar que se faça por distracção. O PDF fica aqui
> versionado porque, até esse dia, era o único sítio onde a ementa aprovada
> existia: a pasta de transferências de uma pessoa.

## Os outros dois documentos

- `ementa.html` — a origem do de seis páginas, 1,5 MB. Imprimindo-a pelo
  Chrome sai o `Ementa_Teste.pdf`: **seis páginas A4**, 2,9 MB (capa,
  quatro de ementa, contracapa). Três folhas frente e verso.
- `Ementa_Teste.pdf` — o resultado dessa impressão. É o que este ficheiro
  descreve daqui para baixo.
- `Ementa_Final.pdf` — **doze páginas**, 5,5 MB (a prova chama-lhe 5,2, que
  é o mesmo número contado em MiB). **Não sai deste HTML.** Ver a secção
  seguinte.

## De onde vem o `Ementa_Final.pdf` — e a leitura errada dos metadados

Este ficheiro dizia aqui que o `Ementa_Final.pdf` tinha sido **desenhado no
Canva** e montado no Preview, e que por isso não havia no repositório
origem nenhuma para ele. **Metade disso era falso**, e vale a pena deixar
registado porquê, para não se repetir a leitura.

Os metadados são estes:

```
xmp:CreatorTool   Canva (Renderer) doc=DAHSTRHoWtk
                  user=UACa7xUfBtg brand=BACa7567IRU
Producer          Quartz PDFContext, AppendMode 1.1   ← Preview do macOS
Creator           HeadlessChrome/151 · Skia/PDF m151
```

O `xmp:CreatorTool` do Canva **não é do documento — é da imagem de fundo**.
O `origem/fundo-ementa.png` foi exportado do Canva e traz o XMP colado; um
PDF impresso pelo Chrome a partir do `ementa.html` deste repositório, sem
Canva nenhum pelo meio, sai com exactamente a mesma linha. Confirmou-se
imprimindo o ramo `ementa/pergaminho-e-letra` (PR #39) e comparando.

O que se mantém verdadeiro é o **Preview**: `Quartz` e `AppendMode` só
aparecem no `Ementa_Final.pdf`, e nesse continua a valer a regra de não
voltar a abrir e gravar um PDF por lá.

**E a origem existe.** O `Ementa_Final.pdf` é o `ementa.html` do primeiro
commit do PR #39 (`406a8ac`), impresso pelo Chrome. Bate ficheiro a
ficheiro: doze páginas, a mesma caixa de 594,96 × 841,92, o mesmo fundo de
2475 × 3500, as mesmas três fontes sem a Special Elite, e o pirata nas
mesmas 1323 × 2376 — que só esse commit produz, porque o seguinte
(`b3d1a16`) corrige a deformação e passa-o a 1714 × 2376.

O que **não** tem origem aqui é o `Ementa_Aprovada_2026-08-23.pdf`, que veio
depois e é o bom. Ver a secção do topo.

O `ementa.html` que está aqui tem seis `<section>` e gera seis páginas. É
um documento anterior e autónomo, não uma versão desactualizada do outro.

## O desenho vem do site

Papel, tinta e letra são os do pergaminho do site, tirados de
`app/globals.css`: `--pergaminho` #d9c7a0, `--pergaminho-tinta` #2b1d0e e
`--pergaminho-queimado` #6b4517. As arestas queimadas são dois gradientes
por cima da cor lisa.

As quatro fontes são as mesmas quatro do site — **Rye** no nome da capa,
**IM Fell English SC** nos pratos e nas categorias, **Special Elite** nos
preços e nas etiquetas, **Alegreya Sans** no inglês — e vão **embebidas no
ficheiro** em base64. É o que faz o HTML pesar 1,5 MB, e é de propósito:
assim abre igual em qualquer computador, na gráfica inclusive, sem rede e
sem fontes instaladas.

Na capa está o pirata que recebe à porta, o mesmo recorte que está na
página inicial (`public/images/esqueleto-grande.png`, 1200 × 1367),
também embebido.

## A pasta `origem/`

Tudo o que é preciso para voltar a fazer a ementa e para conferir o que
lá está vive aqui ao lado, e não em `public/`:

- `origem/fundo-ementa.png` — o fundo de pergaminho do `Ementa_Final.pdf`,
  2475 × 3500 px, que a 300 DPI dá exactamente um A4. Esteve muito tempo só
  na máquina do Gonçalo.
- `origem/livro-antigo/` — as sete fotografias do livro de ementas
  plastificado, que é de onde tudo foi transcrito. São a única forma de
  responder às perguntas que ficam em aberto no fim deste ficheiro: o
  "Desespero" manuscrito por cima do "Chaminé" e a grafia do Gin
  Hendrick's. O preço borratado do Baileys era a terceira, e essa foi o
  dono que a respondeu.

**Não estão em `public/` de propósito.** O `public/images/README.md`
explica a regra: os originais grandes ficam fora, porque o que está em
`public/` é servido ao visitante e o CSS não o optimiza. Estes ficheiros
não são usados pelo site — são material de trabalho da ementa impressa, e
o sítio deles é este.

A figura da capa é a excepção, e está onde sempre esteve: é o
`public/images/esqueleto-grande.png`, que o site também usa.

## Voltar a fazer o PDF de seis páginas

Abrir `ementa.html` no Chrome e **Imprimir**:

- destino: **Guardar como PDF**
- tamanho: **A4**
- margens: **Nenhuma** (as margens estão no ficheiro, 15 mm em cima e 14 mm
  aos lados)
- ligar **Gráficos de fundo** — sem isto o papel sai branco, sem o
  pergaminho nem as arestas queimadas, e a ementa perde metade do que é

Confirmar sempre que dá **seis** páginas. Se der mais, alguma coisa fez
as folhas medirem mais de 297 mm — foi o que aconteceu na primeira versão,
e está explicado no comentário do `@media print`.

**Não voltar a abrir e gravar o resultado no Preview.** É o que estragou o
`Ementa_Final.pdf`: passar um PDF pelo Preview pode perder tipografias pelo
caminho. O ficheiro que vai para a gráfica sai do Chrome e não é tocado
mais. Vê-se nos metadados — tem de dizer `Skia/PDF`, e não `Quartz`.

## O ar entre pratos é medido, não escolhido

Cada folha tem o seu `--ar`, no atributo `style` da própria `<section>`:

| Folha | `--ar` |
|---|---|
| 2 · Entradas, Snack, Extras | 2,95 mm |
| 3 · Sandes, Cafetaria, Bebidas | 1,03 mm |
| 4 · Cerveja, Vinho | 1,87 mm |
| 5 · Bar | 1,89 mm |

A capa e a contracapa não têm `--ar`: não têm lista nenhuma para afinar.

As categorias têm tamanhos muito diferentes — o Bar tem 39 linhas, os
Extras têm 3 — e com um valor único umas folhas fechavam cheias e outras
ficavam com um terço em branco. Estes quatro números foram encontrados a
medir onde acaba o último prato de cada folha, até todas fecharem a 6-8 mm
do fundo da caixa.

**Se acrescentares ou tirares pratos, estes números deixam de servir.** Diz
e volto a afiná-los.

## O que falta

**O logótipo.** Na capa está a letra do letreiro de madeira sobre a porta
— TASKUIИHA em Rye, com o N ao contrário, que é a assinatura da casa e a
mesma letra que o site usa. Se o dono quiser lá a caveira azul do
RUMOCEANO, é preciso o ficheiro **vetorial** (`.ai`, `.eps`, `.svg` ou um
`.pdf` que não seja uma fotografia): trocar o `<div class="capa-nome">`
por um `<img>`.

O logótipo azul só existe fotografado através do plástico riscado do livro
antigo. Nessa resolução dá uns 3 cm impressos, torto e com os riscos todos
— não serve para uma ementa nova.

## De onde vêm os pratos e os preços

Os **nomes, descrições e fotografias** estão em `lib/menu.ts`. Os **preços
já não** — mudaram-se para o `data/ementa.json`, que é o que o painel
edita e escreve directamente no GitHub. Passaram a ter um dono só,
justamente para o site não poder dizer um número e outro sítio dizer outro.
O comentário longo em `lib/menu.ts` explica porquê.

O papel foi transcrito a **13 de Agosto de 2026**. São 154 linhas e, à
data, conferiam uma a uma com o site. A única diferença deliberada é a
**Sangria**, que no papel diz "Sangria, jarro" para não se confundir com o
copo, que está logo por cima.

Regra do dono: **o que não tem preço não entra.** Ficaram de fora as
etiquetas em branco do livro antigo (Baguete, Bacalhau c/ grão, Atum c/
feijão frade, Sardinhas c/ salada, Caldo verde, Sopa, os extras de presunto
e queijo, Água Carvalhelhos, Irish Coffee), as linhas riscadas a marcador
(três cervejas, os dois ice teas, o Refrigerante) e os preços apagados
(Veros, Veros Reserva e o terceiro vinho verde, que ficou sem nome).

**O Baileys entrou a 26 de Agosto de 2026.** O preço está borratado na
fotografia do livro e nunca tinha sido confirmado; o dono disse que são
**4,00 €**. Está no site — no papel, ainda não.

> Isto é uma transcrição, não uma ligação automática. Quando um preço
> mudar, tem de mudar nos dois sítios — e agora que o painel mexe nos
> preços sozinho, o papel envelhece sem ninguém dar por isso. Foi o que
> aconteceu a seis deles a 14 de Agosto.

## A prova de pré-impressão

Há uma revisão do `Ementa_Final.pdf` feita a 22 de Agosto de 2026 —
`PROVA-EMENTA.pdf`, nove pontos, cada um com o que foi medido dentro do
ficheiro. Não está neste repositório. Em resumo:

| # | O quê | Estado |
|---|---|---|
| 1 | Sem sangria: o fundo fica 0,14 mm curto e o corte apanha branco | a corrigir |
| 2 | O pirata da capa está esticado 58% e a ≈172 DPI | a corrigir |
| 3 | O fundo está a 300 DPI mas com compressão JPEG a mais | a corrigir |
| 4 | **Seis preços desactualizados** | os cinco primeiros estão corrigidos no documento de seis páginas, mas **não** no de doze, que é o que vai para a gráfica; o sexto é a amêijoa, agora a 16,90 |
| 5 | Quatro traduções inglesas divergem do site; o aviso de alergias diz "meets shellfish" em vez de "comes into contact with" | a corrigir |
| 6 | Um emoji na contracapa, embebido como fonte Type3 | trocar por imagem |
| 7 | As duas colunas da contracapa estão 6 mm fora do meio | decisão, não defeito |
| 8 | Os preços são 1,5 pt mais pequenos que os nomes dos pratos | a decidir |
| 9 | A Special Elite não aparece em nenhuma das 12 páginas | a decidir |

O ponto 4 é o único que impede mesmo a impressão. E tem uma armadilha
registada na prova: três dos seis valores antigos repetem-se noutros
artigos que **não** mudaram — as Lulas ao alho a 12,40, o Bacardi limão a
5,90 e a Tosta especial a 7,40, esta última com o preço antigo do cachorro.
Cada troca tem de ser ancorada ao nome do prato, nunca ao valor.

**Os seis são para corrigir**, e o sexto deu uma volta pelo meio. A prova
diz que a Amêijoa à pirata devia passar de 15,20 para 16,90. Durante
algumas horas pareceu engano dela: a 22 de Agosto de 2026, às 09:56, o
preço tinha sido baixado de 16,90 para 15,20 pelo painel (commit
`8940031`), e a prova, escrita nesse mesmo dia, apanhou o valor de antes.

A 26 de Agosto o dono confirmou que o preço da casa é **16,90** — a
descida de dia 22 é que era para desfazer. O `data/ementa.json` já o diz,
e o papel tem de acompanhar.

## Coisas para o dono confirmar antes de ir para a gráfica

Nomes que estão como no livro antigo e que podem estar mal escritos:

| Está | Provavelmente é |
|---|---|
| Gin Hendricks | Gin Hendrick's |
| Whiskey (em todos) | Whisky, para o Old Parr e o Cutty Sark, que são escoceses. O Jameson é irlandês e fica *whiskey* |
| Desespero | o nome manuscrito por cima do "Chaminé" riscado — confirmar mesmo |
| Quinta Termos | Quinta dos Termos, o produtor da Beira Interior |

Não os corrigi por conta própria para o papel não passar a dizer uma coisa
e o site outra. Diz qual é a versão boa e mudo nos dois.
