# Ementa impressa

- `ementa.pdf` — **é este que vai para a gráfica.** Seis páginas A4
  (capa, quatro de ementa, contracapa), 2,9 MB. Três folhas frente e verso.
- `ementa.html` — a origem. Editar aqui e voltar a gerar o PDF.

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
página inicial (`public/images/esqueleto-grande.png`), também embebido.

## Voltar a fazer o PDF

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
