# Ementa impressa

**Catorze páginas, uma coluna, A4 depois de cortadas.** O que vai para a
gráfica é o `ementa-coluna-unica.pdf`, e ele **gera-se com quatro comandos** —
não se edita à mão.

Sai em **216 x 303 mm**: o A4 mais 3 mm de sangria de cada lado, que a
guilhotina come. Em **CMYK**, com o perfil que a gráfica nomeia. Quem o abrir no
Preview vê uma folha maior que o A4, com o desenho aparentemente encostado às
bordas — é o ficheiro por cortar, e é assim que tem de ser.

```bash
python3 ementa-impressa/gerador/montar.py          # escreve o HTML
node ementa-impressa/gerador/gerar.mjs \
  "$HOME/.cache/puppeteer/chrome/mac_arm-151.0.7922.71/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
  "file://$PWD/ementa-impressa/ementa-coluna-unica.html" \
  ementa-impressa/ementa-coluna-unica.pdf          # escreve o PDF

# 3 — RGB para CMYK, e as caixas de corte
ICC="/Library/Application Support/Adobe/Color/Profiles/Recommended/CoatedFOGRA39.icc"
gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   --permit-file-read="$ICC" \
   -dCompatibilityLevel=1.4 \
   -sColorConversionStrategy=CMYK -sProcessColorModel=DeviceCMYK \
   -sOutputICCProfile="$ICC" \
   -dAutoRotatePages=/None \
   -dDownsampleColorImages=false -dAutoFilterColorImages=false \
   -dColorImageFilter=/FlateEncode \
   -sOutputFile=/tmp/cmyk.pdf ementa-impressa/ementa-coluna-unica.pdf
python3 ementa-impressa/gerador/caixas.py \
   /tmp/cmyk.pdf ementa-impressa/ementa-coluna-unica.pdf

# 4 — a cópia leve do site, já cortada em A4
python3 ementa-impressa/gerador/caixas.py /tmp/rgb.pdf /tmp/rgb-caixas.pdf
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dUseTrimBox=true \
   -dPDFSETTINGS=/ebook -dDownsampleColorImages=true \
   -dColorImageResolution=144 -dNOPAUSE -dBATCH -dQUIET \
   -sOutputFile=public/ementa-taskuinha.pdf /tmp/rgb-caixas.pdf
```

> O comando 2 escreve um PDF em RGB e com sangria — guarde-se uma cópia em
> `/tmp/rgb.pdf` antes do comando 3, que é dela que sai a do site.

## O `-dSAFER` e o perfil ICC

O comando 3 leva `--permit-file-read` com o caminho do perfil. Sem isso o
Ghostscript corre os catorze páginas todas e **rebenta no fim** com
`Permission denied`, deixando lá um ficheiro do tamanho certo e por acabar. O
`-dSAFER` não deixa ler nada fora da pasta de trabalho, e o perfil está na
biblioteca da Adobe.

## O quarto comando, e porque é que ele existe

O PDF da gráfica pesa **19 MB** — o pergaminho está a 300 DPI, como tem de
estar para imprimir. Mas o site tem um botão **«Levar a ementa»** no fim da
página, e servir 19 MB a quem está na praia com dados móveis não se faz.

O Ghostscript volta a amostrar as imagens a 144 DPI e **corta a sangria** — o
`-dUseTrimBox` faz a folha voltar ao A4, que é o que um cliente espera
descarregar. O mesmo PDF fica em **471 KB**, quarenta vezes mais leve, com as
catorze páginas, o texto carácter a carácter igual e o pergaminho a aguentar
bem a olho. Não entra nada no `package.json`: o `gs` é uma ferramenta do
sistema, como o Chrome.

**O `public/ementa-taskuinha.pdf` não se actualiza sozinho.** Se o dono mexer
nos preços pelo painel, o site muda nesse instante e o PDF do botão fica para
trás até alguém correr os quatro comandos. É a mesma armadilha que o `montar.py`
já apanha entre o site e a gráfica — só que esta ainda não tem quem a apanhe.

## O que está aqui

| | |
|---|---|
| `ementa-coluna-unica.pdf` | **o que vai para a gráfica** |
| `ementa-coluna-unica.html` | gerado. Não editar — perde-se na geração seguinte |
| `gerador/` | de onde tudo sai |
| `origem/` | as imagens e o material de referência |

E fora desta pasta:

| | |
|---|---|
| `public/ementa-taskuinha.pdf` | a cópia leve que o botão do site descarrega |

## Os preços vêm do site, e o gerador pára se algo não bater certo

O `montar.py` lê os preços do **`data/ementa.json`** a cada geração — o mesmo
ficheiro que serve o site e onde o painel escreve — e confere as **duas
direcções**:

- um artigo do papel que já não exista no site → **pára**;
- um artigo do site que o papel não tenha → **pára**.

A segunda faltava, e é a que interessa mais. Sem ela o gerador corria, dizia
«155 artigos, preços conferidos», e imprimia 154: **o prato novo desaparecia em
silêncio entre o painel e a gráfica.** Foi o que quase aconteceu ao Baileys.

> Antes disto o papel era uma transcrição, e uma transcrição envelhece sozinha.
> Os preços foram copiados a 13 de Agosto de 2026; a 14 o dono subiu seis, e o
> papel ficou a cobrar menos 1,00 € na francesinha durante uma semana.

O `folhas.json` guarda a ordem, os nomes e o inglês — o desenho. **Não guarda a
verdade sobre preços**, mesmo tendo lá números: são sobrepostos a cada geração.

## A pasta `gerador/`

| | |
|---|---|
| `montar.py` | monta o HTML: a CSS toda, as doze secções, os vãos da capa |
| `folhas.json` | a ordem dos 155 artigos por folha, os nomes e o inglês |
| `rever_en.py` | **as revisões do inglês, com a razão de cada uma**, e as perguntas por responder |
| `fontes.css` | as quatro tipografias em base64 |
| `qr.py` | **o QR code da contracapa**, codificado aqui e não por uma biblioteca |
| `caixas.py` | escreve o `TrimBox` e o `BleedBox`, e refaz o xref |
| `gerar.mjs` | gera o PDF pelo Chrome, por DevTools Protocol |
| `foto.mjs` | fotografa uma página, para se poder olhar sem imprimir |

Sem dependências: o Node traz `WebSocket` nativo e o Chrome está em cache do
Puppeteer. Não entra nada no `package.json`.

## O QR code da contracapa

A contracapa tem um QR para **`https://www.taskuinhapirata.pt`**, e o endereço
vem do **`lib/site.ts`** — o `montar.py` lê-o de lá e **pára** se não o
encontrar. É a mesma disciplina dos preços, pela mesma razão: um endereço
transcrito à mão envelhece sozinho, e um endereço errado não se corrige depois
de mil folhas impressas.

O código é **gerado em Python, aqui dentro** (`gerador/qr.py`), e sai em **SVG
vector**. Não entra `segno` nem `qrcode` no sistema — pela mesma regra do
`package.json` — nem se vai buscar a imagem a um serviço online, que era pior:
o gerador deixava de correr sem rede e deixava de dar sempre o mesmo ficheiro.
Versão 3 (29×29) com correcção **Q**, que corrige 25% dos módulos: isto vai
para papel que se dobra e apanha gordura, impresso sobre pergaminho texturado.

**Os 34 mm são do SVG inteiro, zona de silêncio incluída.** O quadrado escuro
que se vê mede 26,6 mm — 29 dos 37 módulos — e cada módulo 0,92 mm. Esteve nos
28 mm, que davam módulos de 0,76 mm, da ordem da textura do fundo. Quem lê a
zona de silêncio como se fosse margem engana-se em quase um quinto do tamanho.

### Como se confere que lê

Uma matriz pode passar em todas as verificações internas e na mesma não ler.
O que conta é um leitor:

```bash
python3 ementa-impressa/gerador/qr.py            # escreve qr.png
```

Aponta-se o telemóvel ao ficheiro. Foi assim que se apanhou o engano que deu
origem a este parágrafo: os bits do formato estavam a assentar na grelha do
menos significativo para o mais, o código parecia um QR perfeito, o valor de 15
bits batia certo com a tabela da norma — e **não lia**. Só apareceu ao comparar
os 841 módulos, um a um, com o gerador do próprio macOS (`CIQRCodeGenerator`,
correcção Q, que dá exactamente esta versão): batiam todos menos oito, e os oito
eram os do formato.

## A pasta `origem/`

- **`fundo-ementa.png`** — o pergaminho como veio, 2475 × 3500 px. Esteve muito
  tempo só na máquina do Gonçalo. **Já não é ele que o CSS usa**, desde que a
  folha cresceu com a sangria.
- **`fundo-ementa-sangria.png`** — o mesmo, reamostrado para 2600 × 3640 px.
  É o que dá 303 DPI na folha de 216 × 303 mm. Ver acima porque é que uma
  reamostragem serve aqui e não serviria noutro sítio.
- **`pirata-capa.png`** — a figura da capa, 723 × 1079 px com transparência.
  Recortada do `public/images/Esqueleto_Qualidade.jpg`, que trazia o xadrez
  pintado nos pixéis em vez de canal alfa. O recorte é por cor: o fundo é
  cinzento neutro e claro, e nada do pirata cai nesse critério — o crânio, a
  parte mais clara dele, tem saturação 36.
- **`livro-antigo/`** — as sete fotografias do livro de ementas plastificado, de
  onde tudo foi transcrito. São a única forma de responder ao que fica em aberto
  no fim deste ficheiro.
- **`product-guide.pdf`** — o **Guia de Construção da gráfica**, três páginas.
  É ele que manda no ficheiro que se entrega: sangria, área de segurança,
  cores, resolução, fontes e ordem das páginas. Estava numa pasta de
  transferências de outro projecto, que é o mesmo que não estar em lado nenhum:
  quem quisesse conferir uma medida tinha de ir pedi-lo. Fica aqui, ao lado do
  que ele julga.

**Não estão em `public/` de propósito**, e o `public/images/README.md` explica a
regra: o que está em `public/` é servido ao visitante e o CSS não o optimiza.
Nenhum destes é usado pelo site.

## A leitura errada dos metadados — para não se repetir

Este ficheiro já disse que o `Ementa_Final.pdf` tinha sido **desenhado no Canva**
e que não havia origem dele no repositório. **Metade disso era falso.**

```
xmp:CreatorTool   Canva (Renderer) doc=DAHSTRHoWtk
Producer          Quartz PDFContext, AppendMode 1.1   ← Preview do macOS
Creator           HeadlessChrome/151 · Skia/PDF m151
```

O `xmp:CreatorTool` do Canva **não é do documento — é da imagem de fundo.** O
`origem/fundo-ementa.png` foi exportado do Canva e traz o XMP colado; um PDF
impresso pelo Chrome a partir daqui, sem Canva nenhum pelo meio, sai com
exactamente a mesma linha.

A origem do `Ementa_Final.pdf` era o `ementa.html` do primeiro commit do PR #39,
e batia ficheiro a ficheiro.

O que se mantém verdadeiro é o **Preview**: `Quartz` e `AppendMode` só aparecem
no `Ementa_Final.pdf`, e continua a valer a regra de **não voltar a abrir e
gravar um PDF por lá** — pode perder tipografias pelo caminho.

## As medidas, e de onde vieram

Saem de medições feitas ao `Ementa_Final.pdf`, não de gosto:

| | |
|---|---|
| Margens do texto | 40 mm de cada lado |
| Coluna dos preços | à direita, a acabar aos 170 mm |
| Categoria | 18 pt · nome do prato 13 pt · **preço 12,5 pt** · inglês 8,8 pt |
| Cabeçalho corrido | 9,5 pt |
| Fios horizontais | 40 → 170,1 mm, 0,26 mm |
| Rótulo inglês da categoria | 9,5 pt itálico, à direita |

O **preço subiu de 11,5 para 12,5 pt** face ao original, a pedido.

### O ar entre artigos: `--ar: 3.0mm`

É o único número desta ementa que foi escolhido e não medido. A folha mais cheia
é a do Bar, com **18 artigos** desde que o Baileys entrou, e este valor é o que a
faz fechar **acima da moldura desenhada no fundo**, que começa aos 274,4 mm.

Esteve nos 4,1 mm enquanto a folha mais cheia tinha 17. Com 18 a última linha ia
parar aos ~281 mm, por cima do ornamento. A 3,4 mm ficava a 3 mm dele, que é
pouco; a 3,0 mm sobra folga que se vê.

> **Atenção ao que a verificação não apanha.** O `overflow: hidden` corta
> *pixéis*, mas o texto continua no stream do PDF e a extracção encontra-o na
> mesma. **Contar artigos não prova que nada foi cortado** — é preciso olhar
> para a folha mais cheia com o `foto.mjs`.

### O fundo transborda 1 mm, **para lá da sangria**

Com `cover` puro a folga saía em 0,05 mm — a fotografia e a folha têm quase a
mesma proporção — e cinco centésimos não sobrevivem ao arredondamento de quem
desenha os píxeis: aparecia um fio branco na borda. O `--folga-fundo: 2mm` dá
1 mm de cada lado.

Isto é **outra coisa** que a sangria, e as duas convivem: a sangria são 3 mm de
desenho para lá do corte, e esta folga é 1 mm para lá da própria sangria, contra
o fio branco. O fio, se aparecesse, cairia agora a 4 mm do corte — bem dentro do
que se deita fora.

## O que a gráfica exige, e onde estamos

O guia é o **`origem/product-guide.pdf`**, três páginas. Isto foi medido no
`ementa-coluna-unica.pdf` a 26 de Agosto de 2026, com o `pdfinfo`, o `pdffonts`
e o `pdfimages`:

| O guia pede | Estado |
|---|---|
| PDF sem protecção por password | ✓ |
| Páginas individuais, por ordem de leitura | ✓ catorze, sem *spreads* |
| Fontes incorporadas ou em curvas | ✓ as quatro, em subset |
| Área de segurança de 1 cm | ✓ a caixa mais apertada é o pé do miolo, a 17 mm da linha de corte |
| 300 DPI ou superior | ✓ **303** — o fundo tem 2600 x 3640 px |
| Sangria de 3 mm | ✓ folha de 216 x 303 mm, com `TrimBox` no A4 e `BleedBox` na folha inteira |
| CMYK, FOGRA39 ou ISO Coated v2 ECI | ✓ **zero** objectos `DeviceRGB`; convertido com o `CoatedFOGRA39.icc` |

O número de páginas comprado é o **máximo** que a gráfica imprime, e o ficheiro
tem **catorze**. Comprar o escalão de **16** serve: imprime as catorze e fica-se
por aí.

### O fundo teve de crescer com a folha

Com a sangria a folha passou a 216 x 303 mm, e o fundo desenha-se numa caixa de
218 x 305 mm. Os 2475 x 3500 px de origem dariam aí **288 DPI**, abaixo do
mínimo — por isso existe o **`origem/fundo-ementa-sangria.png`**, com
2600 x 3640 px, que dá **303**.

**É uma reamostragem, e diz-se que é.** Não há original maior no repositório: o
`fundo-ementa.png` é o que veio do Canva. São 5% de aumento numa textura de
pergaminho, que é o caso em que isso não se vê — não seria assim num texto ou
numa linha fina. Se um dia aparecer o ficheiro grande, é trocar o caminho no
`montar.py` e voltar a gerar.

### O QR da contracapa, medido no ficheiro

| | |
|---|---|
| destino lido do PDF | `https://www.taskuinhapirata.pt` |
| lê a 300 e a 150 DPI | ✓ no PDF da gráfica **e** na cópia leve do site |
| quadrado escuro | **26,7 mm** (34 mm contando a zona de silêncio) |
| módulo | 0,92 mm |
| contraste sobre o pergaminho | **11,6:1** — `#2D1F10` sobre `#EBDAB9` |
| aresta mais próxima | 91,5 mm — muito para lá do 1 cm exigido |

Lido com o detector de QR do próprio macOS, o mesmo que a câmara do telemóvel
usa, a partir das páginas renderizadas — não da matriz em memória, que é onde
um erro de codificação se esconde.

**Duas coisas do #50 continuam por fazer.** O issue pede o quadrado com
**≥ 30 mm** e o que está tem 26,7; e pede uma **legenda curta em português e
inglês** por baixo, que não existe — o que lá está é a morada. Nenhuma das duas
impede que leia, e as medições acima foram refeitas no ficheiro com sangria e
já em CMYK: lê a 300 e a 150 DPI, na mesma.

> O comentário do `montar.py`, na linha 689, ainda diz «lado do quadrado 28mm»
> na mesma linha em que cita `qr_svg(SITE, 34)`. Fica para quem regenerar a
> seguir: corrigi-lo sozinho desencontrava o HTML commitado do PDF, e é preciso
> ter o Chrome for Testing e o `gs` para refazer os dois.

## Verificar antes de mandar imprimir

1. **14 páginas**, folha de 216 x 303 mm, `TrimBox` no A4.
2. **155 artigos e as descrições inglesas todas** presentes.
3. **Preços a bater certo** com o `data/ementa.json` — o gerador já pára se não
   baterem, nas duas direcções.
4. **A contracapa** confere com o `data/casa.json`: morada, telefone, horário,
   Instagram.
5. **Nenhuma fonte Type3** — é assim que um emoji se denuncia.
6. **`Producer: Skia/PDF`**, e não `Quartz`.
7. **Olhar para a folha 11**, a mais cheia, e para a capa. Há coisas que nenhuma
   medição apanha.

## Por decidir

- **O pirata da capa está a 185 DPI.** Aparece com 99 mm de largura e o recorte
  tem 723 px; a gráfica pede 300. Com a fotografia original em ~1200 px de
  largura resolvia-se sem mexer no desenho.
- **O `drop-shadow` da capa** obriga o Chrome a rasterizar a figura a 1623 px, o
  que engorda o PDF sem acrescentar detalhe.
- **A quebra de linha do aviso de alergias** deixa o «Quase» sozinho no fim da
  primeira linha.

## Para o dono confirmar

Nomes que estão como no livro antigo e que podem estar mal escritos. As
fotografias em `origem/livro-antigo/` são o que permite responder:

| Está | Provavelmente é |
|---|---|
| Gin Hendricks | Gin Hendrick's |
| Whiskey (em todos) | Whisky no Old Parr e no Cutty Sark, que são escoceses. O Jameson é irlandês e fica *whiskey* |
| Desespero | o nome manuscrito por cima do "Chaminé" riscado |
| Quinta Termos | Quinta dos Termos, o produtor da Beira Interior |

**O Baileys já não está nesta lista.** Entrou a 26 de Agosto de 2026, a 4,00 € —
o preço estava borratado na fotografia e nunca tinha sido confirmado.

E seis descrições inglesas que não descrevem nada, ou que levantam dúvida —
listadas com a razão no `gerador/rever_en.py`: **Tosta especial**, **Amêijoa à
pirata**, **Licor**, **Caneca super**, **Croft** e **Pingo**.

Nenhuma foi corrigida por conta própria, para o papel não passar a dizer uma
coisa e o site outra.

## Uma coisa que fica por fazer no site

O aviso de alergias em inglês foi corrigido aqui — dizia *"Almost everything here
**meets** shellfish"*, um decalque do «passa por marisco» que em inglês não quer
dizer nada.

**O site tem o mesmo defeito com outras palavras.** Em `lib/dicionario/en.ts`, na
chave `alergias`, diz *"Almost everything here **passes through** shellfish"*.
Está no ar.

O francês e o espanhol são outra conversa: «passer par» e «pasar por» têm um
alcance idiomático mais próximo do português, por isso podem estar bem. Quem
souber que confirme.

Se se mexer no site, respeitar o registo: o site trata por **tu** («se tiveres»,
«diz») e o papel por **você** («se tiver», «diga»).
