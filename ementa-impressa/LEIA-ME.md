# Ementa impressa

**Dezasseis páginas de 216 × 303 mm, uma coluna, encadernadas com argolas do
lado esquerdo.** O que vai para a gráfica é o `ementa-grafica-cmyk.pdf`, e ele
**gera-se com estes comandos** — não se edita à mão.

```bash
CHROME="$HOME/chrome/mac_arm-151.0.7922.71/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"

python3 ementa-impressa/gerador/fundo.py            # os dois fundos, 216 × 303 a 300 DPI
python3 ementa-impressa/gerador/montar.py --grafica # escreve os dois HTML

for f in capa miolo; do                             # e os dois PDF, ainda em RGB
  node ementa-impressa/gerador/gerar.mjs "$CHROME" \
    "file://$PWD/ementa-impressa/ementa-grafica-$f.html" \
    "ementa-impressa/ementa-grafica-$f.pdf"
done

python3 ementa-impressa/gerador/grafica.py          # junta, converte para CMYK,
                                                    # e escreve as caixas de corte
```

E a quinta, que é a do site e não a da gráfica:

```bash
python3 ementa-impressa/gerador/montar.py           # o mesmo miolo, em A4 solto
node ementa-impressa/gerador/gerar.mjs "$CHROME" \
  "file://$PWD/ementa-impressa/ementa-coluna-unica.html" \
  ementa-impressa/ementa-coluna-unica.pdf

gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 \
   -dPDFSETTINGS=/ebook -dDownsampleColorImages=true \
   -dColorImageResolution=144 -dNOPAUSE -dBATCH -dQUIET \
   -sOutputFile=public/ementa-taskuinha.pdf \
   ementa-impressa/ementa-coluna-unica.pdf          # escreve a cópia do site
```

### Tem de ser o Chrome for Testing, e não o Chrome do sistema

O caminho aqui em cima já apontou à cache do Puppeteer, em
`~/.cache/puppeteer/`. Essa cache desapareceu da máquina e a tentação óbvia é
usar o Chrome normal, que até estava na mesma versão — **151.0.7922.175** contra
os **151.0.7922.71** do de testes, mesmo *build*, mesmo Skia.

**Não funciona.** Com o Chrome do sistema, o `Page.printToPDF` aceita a chamada
e nunca responde: o processo fica a 0 % de CPU e 1,3 GB de memória, indefinido,
e não devolve erro nenhum. Não é do ficheiro — o `ementa-coluna-unica.html`, que
já tinha sido impresso com êxito, pendura exactamente da mesma maneira. É do
binário.

Volta-se a buscar assim, e demora um minuto:

```bash
npx @puppeteer/browsers install chrome@151.0.7922.71
```

## Duas ementas, e não uma

| | |
|---|---|
| `ementa-grafica-cmyk.pdf` | **o que vai para a gráfica.** 16 páginas, 216 × 303 mm, CMYK, com sangria e com a goteira das argolas |
| `ementa-coluna-unica.pdf` | o mesmo miolo em **A4 solto**, 12 páginas, RGB. Serve para provar no ecrã e é de onde sai a cópia do site |

São o mesmo `montar.py` e o mesmo `folhas.json`: muda a `@page`, as margens e o
fundo, e mais nada. Os preços, os artigos e a tipografia são os mesmos nos dois,
pela mesma razão de sempre — duas fontes de verdade dessincronizam-se sozinhas.

## O comando do Ghostscript no fim, e porque é que ele existe

O PDF da gráfica pesa **19 MB** — o pergaminho está a 300 DPI, como tem de
estar para imprimir. Mas o site tem um botão **«Levar a ementa»** no fim da
página, e servir 19 MB a quem está na praia com dados móveis não se faz.

O Ghostscript volta a amostrar as imagens a 144 DPI e o mesmo PDF fica em
**516 KB** — trinta e sete vezes mais leve, com as doze páginas, o texto
carácter a carácter igual e o pergaminho a aguentar bem a olho. Não entra nada
no `package.json`: o `gs` é uma ferramenta do sistema, como o Chrome do
Puppeteer.

**O `public/ementa-taskuinha.pdf` não se actualiza sozinho.** Se o dono mexer
nos preços pelo painel, o site muda nesse instante e o PDF do botão fica para
trás até alguém correr os três comandos. É a mesma armadilha que o `montar.py`
já apanha entre o site e a gráfica — só que esta ainda não tem quem a apanhe.

## O que está aqui

| | |
|---|---|
| `ementa-grafica-cmyk.pdf` | **o que vai para a gráfica** |
| `ementa-grafica-capa.pdf` · `-miolo.pdf` | gerados, intermédios. Em RGB e separados — ver abaixo porquê |
| `ementa-grafica-capa.html` · `-miolo.html` | gerados. Não editar — perdem-se na geração seguinte |
| `fundo-grafica.jpg` · `fundo-capa.jpg` | gerados pelo `fundo.py`. 216 × 303 mm a 300 DPI. São estes que o HTML usa |
| `fundo-grafica.png` · `fundo-capa.png` | gerados, intermédios. O trabalho em PNG, antes de passar a JPEG |
| `ementa-coluna-unica.pdf` | o A4 solto, para provar e para a cópia do site |
| `ementa-coluna-unica.html` | gerado. Não editar |
| `gerador/` | de onde tudo sai |
| `origem/` | as imagens e o material de referência |

E fora desta pasta:

| | |
|---|---|
| `public/ementa-taskuinha.pdf` | a cópia leve que o botão do site descarrega |

Só o `ementa-grafica-cmyk.pdf` está no repositório. Os fundos e os PDF
intermédios **não estão**: pesam quase 40 MB entre todos e regeneram-se sempre
iguais. Estão no `.gitignore`.

## A encadernação com argolas, e tudo o que ela mudou

O guia da gráfica está aqui dentro: **`origem/guia-360imprimir.pdf`**. Vale a
pena lê-lo antes de mexer nas medidas, porque quase todos os números desta
secção saem de lá e não de gosto.

O que ele pede:

| | |
|---|---|
| Sangria | **3 mm** em todo o redor → a folha passa de 210 × 297 a **216 × 303 mm** |
| Área de segurança **e de encadernação** | **1 cm**, e é por aí que as argolas furam |
| Cor | **CMYK**, de preferência **FOGRA39** ou **ISO Coated v2 ECI** |
| Resolução | **300 DPI ou superior** |
| Fontes | embebidas ou convertidas em curvas |
| Páginas | **soltas e por ordem de leitura**, e em número par |

E foi isto que obrigou a mexer no desenho:

### A moldura estava a 8 mm da borda, e as argolas furam nos primeiros 10

O `origem/fundo-ementa.png` é um A4 inteiro com uma moldura desenhada que
começa a **8 mm da borda**. Num A4 solto isso é bonito. Encadernado, o furo
saía **por cima do ornamento** — e um ornamento furado não tem emenda depois de
mil folhas impressas.

O `gerador/fundo.py` resolve isso sem redesenhar nada: encolhe o desenho todo
**4,77 % na horizontal** e encosta-o 10 mm para dentro, deixando uma tira limpa
onde as argolas passam. A moldura fica a **17,7 mm do corte** do lado da
encadernação e nos mesmos 8 mm dos outros três — que é o que "centrar o desenho
no que sobra depois das argolas" quer dizer.

**Só se encolhe na horizontal.** Na vertical não há folga nenhuma para dar: a
folha do Bar fecha a 3 mm do ornamento de baixo com `--ar: 3.0mm`, e mexer na
altura punha o último artigo por cima do desenho. Na horizontal a mancha tinha
40 mm de margem de cada lado e perder 6 mm de medida não se vê.

### A tira das argolas é pergaminho inventado, e vale a pena saber como

A moldura andou para dentro, mas a fotografia não cresceu: **sobram 13 mm de
folha por encher** do lado da encadernação. O `fundo.py` enche-os com uma banda
de pergaminho tirada do **meio da própria fotografia**, onde não há moldura
nenhuma, com duas correcções:

- **o tom acerta-se linha a linha.** O meio da folha é bem mais claro do que a
  borda — luminância 215 contra 135 — e uma banda clara colada à borda escura
  denunciava a emenda de longe. Mede-se a mediana dos dois lados em cada linha e
  desloca-se a banda pela diferença. Mediana e não média: os ornamentos dos
  cantos chegam à borda e uma média puxava o tom para o escuro;
- **a junta esbate-se ao longo de 4 mm.** Só o tom não chegava — duas texturas
  nunca casam à coluna e ficava um fio à vista. Os 4 mm caem todos em pergaminho
  liso, que a moldura só começa 7 mm mais à frente.

Também se corta, aqui, o **rebordo branco de 1 mm** que a fotografia traz nos
lados. Não é pergaminho, é um resto da exportação, e era a razão de ser do
`--folga-fundo: 2mm` da CSS do A4: lá empurrava-se para fora da página, aqui
apaga-se. A versão A4 continua com o truque antigo, que lá funciona.

### A goteira troca de lado a cada página, e por isso são 14 e não 12

A impressão é **frente e verso** e a encadernação é à esquerda: o verso de cada
folha tem as argolas **à direita**. É a página dupla do guia, `A | B` com a
perfuração ao meio.

Por isso as páginas ímpares levam a classe `impar` e as pares `par`, e o fundo
das pares é **o mesmo ficheiro virado** com `transform: scaleX(-1)`. Como os
ornamentos dos cantos são simétricos por rotação e não por espelho, virá-lo
troca-os de canto entre a página par e a ímpar — o que numa página dupla é o
que um livro faz desde sempre.

E é isto que obriga às **catorze** páginas: o verso da capa e a frente da
contracapa entram em branco, com pergaminho e mais nada. Sem elas a paridade
saía trocada da página 2 em diante e **metade da ementa levava as argolas do
lado errado**. O `montar.py --grafica` insere-as e pára se o total for ímpar.

### O CMYK converte-se aqui e não lá

O guia diz que um ficheiro em RGB «será convertido automaticamente, o que
poderá gerar variações inesperadas de cores». O pergaminho é um castanho quente
e é exactamente o género de cor que uma conversão automática desmancha, por
isso o `gerador/grafica.py` converte cá, com **FOGRA39**, e **pára** se não
encontrar o perfil em vez de cair no CMYK genérico do sistema.

O mesmo ficheiro escreve a **TrimBox**, a **BleedBox** e a **ArtBox**: sem elas,
onde estão os 3 mm de sangria é uma convenção que se espera que a gráfica
adivinhe pelas medidas. O Ghostscript não as escreve — o `pdfwrite` só as passa
se já vierem da entrada, e o Chrome não as põe.

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
| `montar.py` | monta o HTML: a CSS toda, as secções, os vãos da capa. Com `--grafica`, a folha de 216 × 303 e as catorze páginas |
| `fundo.py` | **o fundo da gráfica**: a moldura para dentro e a tira das argolas |
| `grafica.py` | **o CMYK e as caixas de corte** — o último passo antes de enviar |
| `folhas.json` | a ordem dos 155 artigos por folha, os nomes e o inglês |
| `rever_en.py` | **o inglês que está impresso, com a razão de cada descrição**, e as onze perguntas por responder. Corre-se e confere-se contra o `folhas.json` |
| `fontes.css` | as quatro tipografias em base64 |
| `qr.py` | **o QR code da contracapa**, codificado aqui e não por uma biblioteca |
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

- **`fundo-ementa.png`** — o pergaminho, 2475 × 3500 px, que a 300 DPI dá
  exactamente um A4. Esteve muito tempo só na máquina do Gonçalo.
- **`pirata-capa.png`** — a figura da capa, 723 × 1079 px com transparência.
  Recortada do `public/images/Esqueleto_Qualidade.jpg`, que trazia o xadrez
  pintado nos pixéis em vez de canal alfa. O recorte é por cor: o fundo é
  cinzento neutro e claro, e nada do pirata cai nesse critério — o crânio, a
  parte mais clara dele, tem saturação 36.
- **`livro-antigo/`** — as sete fotografias do livro de ementas plastificado, de
  onde tudo foi transcrito. São a única forma de responder ao que fica em aberto
  no fim deste ficheiro.
- **`guia-360imprimir.pdf`** — o guia de construção da gráfica. É de onde saem a
  sangria, o centímetro das argolas, o CMYK e a ordem das páginas. Está aqui
  dentro de propósito: era o único documento do processo que vivia fora do
  repositório, e sem ele nenhum dos números acima se explica.

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

### O fundo transborda 1 mm

Com `cover` puro a folga saía em 0,05 mm — a fotografia e o A4 têm quase a mesma
proporção — e cinco centésimos não sobrevivem ao arredondamento de quem desenha
os píxeis: aparecia um fio branco na borda. O `--folga-fundo: 2mm` dá 1 mm de
cada lado.

Não é sangria a sério, e só vale para o **A4 solto**. A versão da gráfica não
usa nada disto: o `fundo.py` corta o rebordo branco em vez de o empurrar, e a
sangria a sério está nos 216 × 303 mm da folha.

## Verificar antes de mandar imprimir

Sobre o `ementa-grafica-cmyk.pdf`, que é o que se envia:

1. **16 páginas**, **216 × 303 mm** cada uma. A conta inclui as duas em branco e
   as duas do «Cortar»: se forem 12 ou 14, a paridade está trocada e metade das
   argolas sai do lado errado.
2. **A TrimBox mede 210 × 297 mm** e está a 3 mm de cada borda.
3. **Nenhum `/DeviceRGB`** no ficheiro. Se aparecer, a conversão não pegou.
4. **155 artigos e as descrições inglesas todas** presentes.
5. **Preços a bater certo** com o `data/ementa.json` — o gerador já pára se não
   baterem, nas duas direcções.
6. **A contracapa** confere com o `data/casa.json`: morada, telefone, horário,
   Instagram.
7. **Nenhuma fonte Type3** — é assim que um emoji se denuncia.
8. **`Producer: GPL Ghostscript`** e `Quartz` em lado nenhum: o Preview do
   macOS perde tipografias, e não se volta a abrir e gravar um PDF por lá.
9. **Olhar para a página 12**, a folha do Bar, que é a mais cheia — era a 11 no
   A4 e andou uma com a branca do verso da capa. E olhar para a capa, onde o
   pirata deixou de ser um `<img>` e passou a vir dentro do fundo.
10. **Olhar para uma página par e uma ímpar lado a lado.** É a única forma de
    ver que a goteira troca de lado. Se as duas tiverem a tira do mesmo lado, o
    `scaleX(-1)` não pegou e a ementa vem furada pelo texto. Medido nas páginas
    3 e 4 do ficheiro enviado: o texto começa aos 48,2 mm do corte esquerdo na
    ímpar e aos 38,1 mm na par, e os 10 mm de diferença são a goteira a trocar.
11. **As páginas 13 e 14 dizem «Cortar»** e são brancas. Se tiverem pergaminho,
    o `.corte` da CSS não pegou.

## Por decidir

- **O pirata da capa está a 185 DPI.** Aparece com 96 mm de largura e o recorte
  tem 723 px; a gráfica pede 300. O `fundo.py` já o desenha na grelha dos 300
  DPI, mas isso é interpolação — o detalhe que lá está continua a ser o de 185.
  Com a fotografia original em ~1200 px de largura resolvia-se sem mexer no
  desenho, e sem mexer em mais nada: era só substituir o `pirata-capa.png`.
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

E **onze descrições inglesas**, listadas com a razão no `gerador/rever_en.py`.
Correm-se com:

```bash
python3 ementa-impressa/gerador/rever_en.py
```

São de três tipos:

- **duas em que o inglês diz mais do que o português da casa** — o **Chouriço
  assado** («flame-grilled», quando o PT diz só «assado na telha», e sem o «à
  frente de quem o pede») e a **Bifana** («marinade», quando o PT diz «estufada
  de véspera no seu molho»);
- **as três groselhas** — Tango, Caneca tango e Caneca de alumínio tango — que
  dizem *redcurrant*. O xarope português é normalmente de cassis, que em inglês
  é *blackcurrant*; *redcurrant* é groselha vermelha, outro fruto. Ou se mudam
  os três ou nenhum;
- **seis que não descrevem nada, ou levantam dúvida** — **Tosta especial**,
  **Amêijoa à pirata**, **Licor**, **Caneca super**, **Croft** e **Pingo**.

Nenhuma foi corrigida por conta própria, para o papel não passar a dizer uma
coisa e o site outra.

### Duas revisões do inglês, e a que ficou por acompanhar

Houve uma primeira revisão, escrita no `rever_en.py` e aplicada ao
`folhas.json`. Depois veio outra, **do dono** — o commit «O inglês da ementa
passa pela revisão da casa», que fecha o #54 — e sobrepôs-se a onze entradas do
`rever_en.py`. É dela que vem, por exemplo, o «French fries (USA) / potato chips
(UK)»: «chips» sozinho lê-se de duas maneiras conforme o lado do Atlântico.

Não foi engano. O que ficou por fazer foi o `rever_en.py` acompanhá-la: passou
a propor texto que já não era o impresso, e nada comparava os dois, por isso
nada avisou. E o `ementa-coluna-unica.html` commitado ainda mostra o inglês
anterior, porque é mais velho do que essa revisão — quem correr o `montar.py`
vê-o mudar, e isso é o gerador a ter razão.

O `rever_en.py` passou a **descrever o que está impresso** em vez de propor o
que se gostaria, e ganhou um `verificar()` que confronta as 29 descrições com o
`folhas.json` e **falha** se voltarem a divergir. É a mesma disciplina dos
preços e do endereço do QR, pela mesma razão: uma transcrição sem quem a
confira envelhece sozinha.

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
