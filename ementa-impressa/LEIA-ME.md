# Ementa impressa

- `ementa.pdf` — **é este que vai para a gráfica.** Doze páginas A4
  (capa, dez de ementa, contracapa), 5,2 MB. Seis folhas frente e verso.
- `ementa.html` — a origem. Editar aqui e voltar a gerar o PDF.

## O desenho vem do site

O papel é uma fotografia, não uma cor: `public/images/fundo-ementa.png`, um
pergaminho de 2475×3500 a 300 dpi — exactamente uma A4 — com textura,
vincos, manchas e uma moldura ornamentada de tinta sépia. Vai embebido em
JPEG q88 nas doze páginas. Por baixo continua a cor lisa `--pergaminho`
#d9c7a0, como rede de segurança: quem imprimir com os "gráficos de fundo"
desligados perde a fotografia mas não fica com uma folha branca. A tinta
(#2b1d0e) e o queimado (#6b4517) dos gradientes das arestas são os do site,
de `app/globals.css`.

> **Cuidado ao mexer no CSS do papel.** A data URI da fotografia tem 3 MB, e
> o Chrome descarta qualquer declaração que passe um valor deste tamanho por
> `var()` — a declaração inteira cai, cor de segurança incluída, e o fundo
> desaparece sem erro nenhum. Por isso o `background` está partido em
> propriedades separadas, com a imagem sozinha em `background-image`.

As fontes são três, todas do site e todas **embebidas no ficheiro** em
base64 — **IM Fell English SC** em tudo o que é nome, categoria, preço ou
etiqueta; **Alegreya Sans** no inglês descritivo e nos parágrafos da
contracapa, que em versaletes não se leriam; **Rye** só no TASKUIИHA da
capa, que é o letreiro de madeira sobre a porta. A Special Elite, a máquina
de escrever dos preços, saiu. As fontes embebidas mais a fotografia do
papel são o que faz o HTML pesar 4,6 MB, e é de propósito: assim abre igual
em qualquer computador, na gráfica inclusive, sem rede e sem fontes
instaladas.

A IM Fell English SC já é versaletes — não se lhe põe `text-transform:
uppercase` por cima, que anula o efeito e devolve caixa alta chapada.

Na capa está o pirata que recebe à porta, o mesmo recorte que está na
página inicial (`public/images/esqueleto-grande.png`), também embebido.

## Voltar a fazer o PDF

Abrir `ementa.html` no Chrome e **Imprimir**:

- destino: **Guardar como PDF**
- tamanho: **A4**
- margens: **Nenhuma** (as margens estão no ficheiro, 28 mm em cima e em
  baixo, 40 mm aos lados)
- ligar **Gráficos de fundo** — sem isto o papel sai branco, sem o
  pergaminho nem as arestas queimadas, e a ementa perde metade do que é

Confirmar sempre que dá **doze** páginas. Se der mais, alguma coisa fez
as folhas medirem mais de 297 mm — foi o que aconteceu na primeira versão,
e está explicado no comentário do `@media print`.

## A caixa é uma só, igual em todas as folhas

O texto vive numa caixa de 130 × 226 mm, a mesma nas doze páginas: 40 mm de
margem aos lados, 28 mm em cima e em baixo. Os 40 mm dos lados não são
desperdício — são o que põe as duas flores do pergaminho fora do caminho. A
flor de baixo à esquerda só ocupa os primeiros 40 mm de largura; a de cima à
direita, os últimos 40 mm. Com esta margem nenhuma das duas chega ao texto,
em altura nenhuma da folha.

Uma coluna só, largura fixa, sem cantos comidos e sem colunas de tamanhos
diferentes. Quando os pratos não cabem, abre-se outra folha — foi assim que
seis páginas passaram a doze.

O `--ar` entre pratos é agora **um valor só, 1,2 mm**, no `:root`. Não é
uma conta por folha: é uma escolha de desenho, e mexer-lhe muda todas as
folhas ao mesmo tempo.

**Se acrescentares ou tirares pratos, a repartição pelas folhas deixa de
estar equilibrada.** Diz e volto a reparti-los — mede-se a altura real de
cada prato no browser e procura-se a divisão que deixa as folhas com o
mesmo peso, sem categorias a virar a página por dois pratos.

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

De `lib/menu.ts`, o mesmo ficheiro que serve a ementa do site, transcrito a
**13 de Agosto de 2026**. São 154 linhas e conferem uma a uma com o site:
mesmos nomes, mesmos preços. A única diferença deliberada é a **Sangria**,
que no papel diz "Sangria, jarro" para não se confundir com o copo, que
está logo por cima.

Regra do dono: **o que não tem preço não entra.** Ficaram de fora as
etiquetas em branco do livro antigo (Baguete, Bacalhau c/ grão, Atum c/
feijão frade, Sardinhas c/ salada, Caldo verde, Sopa, os extras de presunto
e queijo, Água Carvalhelhos, Irish Coffee), as linhas riscadas a marcador
(três cervejas, os dois ice teas, o Refrigerante) e os preços apagados
(Veros, Veros Reserva e o terceiro vinho verde, que ficou sem nome).

**Ainda a faltar:** o **Baileys**. O preço está borratado na fotografia e
nunca foi confirmado, por isso não está nem no site nem aqui.

> Isto é uma transcrição, não uma ligação automática. Quando um preço
> mudar, tem de mudar nos dois sítios. O comando que confere os dois está
> na conversa que gerou este ficheiro e volta a correr em segundos.

## Coisas para o dono confirmar antes de ir para a gráfica

Nomes que estão como no livro antigo e que podem estar mal escritos:

| Está | Provavelmente é |
|---|---|
| Gin Hendricks | Gin Hendrick's |
| Whiskey (em todos) | Whisky, para o Old Parr e o Cutty Sark, que são escoceses |
| Desespero | o nome manuscrito por cima do "Chaminé" riscado — confirmar mesmo |

Não os corrigi por conta própria para o papel não passar a dizer uma coisa
e o site outra. Diz qual é a versão boa e mudo nos dois.
