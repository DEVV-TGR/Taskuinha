# -*- coding: utf-8 -*-
"""
O cartão de mesa: 74 × 105 mm em pergaminho, com o QR da ementa ao centro.

    python3 ementa-impressa/gerador/mesa.py

Escreve três ficheiros em `ementa-impressa/`:

    cartao-mesa-fundo.jpg        o pergaminho, convertido do `FundoA7`
    cartao-mesa-grafica.html     um cartão — o que vai para a gráfica
    cartao-mesa-a4.html          quatro cartões numa A4, com marcas de corte

A tipografia é a da ementa. O que muda é o tamanho e o que lá está escrito: o
nome da casa, o QR, e «A ementa» nas quatro línguas do site, em duas linhas de
duas.

## O fundo vem pronto, e não se lhe toca

O pergaminho é o **`ementa-impressa/origem/fundo-cartao-a7.png`**: já em A7, já
nas medidas do autocolante, com a moldura onde foi desenhada. O `fundo()` lê-o e
escreve o JPEG que o HTML usa — não recorta, não centra, não estica e não
acrescenta nada.

**Isto é uma decisão, e vale a pena saber contra o quê.** Durante algum tempo o
fundo foi o `origem/fundo-ementa.png`, que é o A4 da ementa, e este ficheiro
tinha três funções a torcê-lo para caber:

  * uma tirava-lhe a faixa que a ementa reserva às argolas, do lado esquerdo,
    porque num autocolante que fica pousado numa mesa essa faixa é uma moldura
    descentrada e vê-se;
  * outra encurtava-o pelo meio quando o formato se afastava da série A;
  * a terceira alargava-o com pergaminho copiado do interior da própria
    fotografia, porque o desenho ia até 2,68 mm da margem e não sobrava folha
    nem para os 3 mm de sangria, quanto mais para a moldura não ficar encostada
    à faca — chegou a estar a **0,13 mm** dela.

Nenhuma delas ficou, e a razão é uma só: **um fundo desenhado para o sítio certo
dispensa o código que o empurra para lá**, e era esse código a origem de tudo o
que se via de errado — a moldura fora de eixo, a faixa de pergaminho postiço nas
bordas e o rasto na sangria.

Se o fundo voltar a ser um A4, isto volta a ser preciso: está no histórico.

## Não tem sangria

O ficheiro mede a área de corte e mais nada, portanto a `SANGRIA` é zero e a
página do PDF sai igual ao autocolante. Inventar 3 mm à volta era mexer no
fundo, que é o que se decidiu não fazer.

Fica escrito porque é o contrário do que a ementa faz, e do que o guia da
gráfica pede por omissão: quem vier a seguir e vir uma TrimBox igual à MediaBox
tem de saber que é de propósito.

## Porque é que mede um A7, e não 90 × 110

Porque é um dos formatos que a 360imprimir vende, e é o melhor dos dois.

Esteve em **90 × 110** por se ter lido a lista dos autocolantes em vinil deles e
se ter concluído que só havia 50 × 80 e 90 × 110. **Havia mais** — os
rectangulares vão dos 21 × 38 aos 100 × 150, e o A7 está lá, nomeado como tal.
Às 50 unidades sai 3 € mais barato.

E ganha-se mais do que os 3 €: um A7 tem a proporção de um A4, e um 90 × 110
não tem — 0,818 contra 0,707. Enquanto o fundo era o A4 da ementa, isso pedia
15,7 % de esticão na horizontal, e quinze por cento achatam os ornamentos dos
cantos, que são folhas e uvas e têm forma que o olho conhece. Foi o Gonçalo que
o apanhou.

## Quatro por folha A4, e em tamanho real

2 × 74 = 148 mm de largura deixa 31 mm de margem de cada lado; 2 × 105 = 210
deixa 43,5 em cima e em baixo. Qualquer impressora de secretária imprime isso,
portanto os cartões da folha de casa **não encolhem** — são do tamanho exacto
dos que vêm da gráfica, que é o que se quer de uma prova.

Oito A7 deitados dariam a folha inteira sem sobrar nada. São quatro ao alto
porque um cartão que não passa por rotação nenhuma é um cartão a menos por onde
a prova de casa se pode afastar do que a gráfica imprime.

## O QR é da versão 4, e o da ementa continua na 3

O endereço da ementa tem sete caracteres a mais que o do site — 37 bytes contra
30 — e não cabia na versão 3, que leva 32. Subiu para a **versão 4**, 33 × 33
módulos, e foi essa a razão de o `qr.py` ter deixado de ter uma versão só.

O quadrado tem 42 mm de lado, zona de silêncio incluída, o que dá **1,02 mm por
módulo** — acima dos 0,92 mm da contracapa da ementa, que é papel já impresso e
que se sabe que lê. Encolheu de 46 para 42 ao voltar o cartão ao A7, e é o que
cabe nos 62 mm úteis sem apertar o resto do desenho: gasta-se aqui a folga toda
que haja.

**Vai impresso sobre vinil brilhante**, que é o único acabamento que a
360imprimir tem neste produto. O brilho é o pior caso para um QR — reflexo
especular num tampo horizontal ao sol — e é por isso que o módulo leva esta
folga toda: o que se perde em contraste ganha-se em tamanho.

## As cores são mais escuras que as da ementa

E de propósito. A ementa é uma página que se pega e se lê de perto, e lá o
cinzento fraco é elegância; isto é um autocolante colado num tampo, lido de pé e
de relance. Os números estão no `CSS`, ao pé de cada um.

Sem dependências, como o resto do gerador: o `sips` do macOS escreve o JPEG e o
`zlib` lê o PNG.

**O JPEG e não o PNG**, e é obrigação e não gosto: o `Page.printToPDF` do Chrome
bloqueia indefinidamente com um PNG grande de fundo. Está medido no `fundo.py`.
"""

import os
import subprocess

import fundo as pergaminho
import qr

D = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(D)
ORIGEM = os.path.join(BASE, "origem", "fundo-cartao-a7.png")
FUNDO_JPG = os.path.join(BASE, "cartao-mesa-fundo.jpg")

# --- as medidas, todas em mm; mudam aqui e em mais lado nenhum -------------

#  **74 × 105 mm — um A7**, que é o formato escolhido para o autocolante em
#  vinil da 360imprimir.
#
#  Esteve em 90 × 110 por se ter julgado que a gráfica só vendia esse e o
#  50 × 80. Vende o A7 também, na lista dos rectangulares, e é 3 € mais barato
#  às 50 unidades. Voltar ao A7 traz de volta a vantagem que ele sempre teve:
#  **tem a proporção do A4** — 0,705 contra 0,707 — portanto a fotografia do
#  pergaminho entra sem se deformar e sem se cortar nada. Ver `fundo()`.
TRIM_L = 74.0
TRIM_A = 105.0
#  **Dois milímetros, que é o que a 360imprimir pede neste produto** — o editor
#  deles mostra a folha a 78 × 109 para um autocolante de 74 × 105.
#
#  Esteve a zero, por o fundo vir em 74 × 105 cravados e se ter decidido não lhe
#  tocar. Não chegava: carregado assim, o próprio site avisa **«O seu produto
#  poderá ficar com margens brancas»** — o desenho não chega ao limite da zona de
#  sangria e a faca, ao falhar para fora, encontra papel.
#
#  E não é preciso tocar-lhe. Os 2 mm ficam **inteiramente fora da zona de
#  corte**: o que o cliente vê continua a ser o ficheiro dele, intacto e sem
#  esticão nenhum. A sangria existe só para a faca ter onde falhar, e é aparada
#  em qualquer dos casos — ver o `sangrar()`.
SANGRIA = 2.0
MEDIA_L = TRIM_L + 2 * SANGRIA          # 78
MEDIA_A = TRIM_A + 2 * SANGRIA          # 109

#  Na folha A4 cabem quatro, em duas colunas e duas linhas, e **em tamanho
#  real**: 2 × 74 = 148 mm de largura deixa 31 mm de margem de cada lado, e
#  2 × 105 = 210 deixa 43,5 em cima e em baixo. Qualquer impressora imprime
#  isso, portanto não é preciso encolher nada — o cartão que sai da folha de
#  casa é do tamanho exacto do que vem da gráfica, que é o que se quer de uma
#  prova.
#
#  Oito A7 deitados dariam a folha inteira sem sobrar nada, e já esteve assim.
#  Quatro ao alto é o que se prefere: um cartão que não roda é um cartão a
#  menos por onde a prova de casa se pode afastar da gráfica.
A4_COLUNAS = 2
A4_LINHAS = 2
A4_MARGEM = (210.0 - 2 * TRIM_L) / 2                   # 31
A4_LARG = (210.0 - 2 * A4_MARGEM) / A4_COLUNAS         # 74 — o cartão, tal e qual
A4_ALT = A4_LARG * TRIM_A / TRIM_L                     # 105
A4_CIMA = (297.0 - A4_LINHAS * A4_ALT) / 2             # 43,5
ESCALA = A4_LARG / TRIM_L                              # 1,0

#  A que distância da faca fica a moldura. **Dois milímetros**, e não é gosto:
#  o `centrar` deixava-a a 0,13 mm do corte do lado direito, porque é só isso
#  que o A4 de origem tem de pergaminho para lá dela. Uma faca desvia mais que
#  treze centésimas, e a moldura saía cortada ao meio num autocolante de 74 mm.
#
#  Os dois milímetros não existem na folha e é o `alargar()` que os faz, com
#  pergaminho liso tirado do interior dela.
MARGEM_MOLDURA = 2.0

QR_MM = 42.0            # o SVG inteiro, zona de silêncio incluída

PPMM = 300 / 25.4       # 300 DPI cravados, que é o que o guia pede


# ---------------------------------------------------------------------------
#  O fundo
# ---------------------------------------------------------------------------

#  Quantas filas se tiram do meio da folha, e o esbatimento da junta.
#
#  **512 e não outro número qualquer.** A onda que corre pela lateral da moldura
#  tem um período de 64 px, e a fila de pontinhos ao lado dela um de ~27: 512 é
#  oito ondas exactas e dezanove pontinhos a menos de um píxel. Tirar um
#  múltiplo do padrão é o que permite voltar a colar as duas metades sem que a
#  onda salte de fase na emenda.
#
#  Não foi calculado e assumido — foi medido. Percorreram-se todos os cortes
#  entre 380 e 600 px comparando as filas que ficariam vizinhas, ao longo das
#  duas faixas laterais, e 512 está entre os três degraus mais pequenos. É o que
#  deles deixa menos deformação para trás.
CORTE_MEIO = 512
CORTE_FADE = 24         # ~2 mm: mata o degrau sem chegar a borrar a moldura


def sangrar(filas, larg, px_x, px_y):
    """Acrescenta a sangria à volta, esticando a fila de píxeis da borda.

    ## O que entra na sangria, e porque é que pode ser esticado

    Uma coluna repetida para fora dá um rasto, e num sítio visível isso seria
    inaceitável. **Aqui não é visível:** a sangria fica toda para lá da linha de
    corte e é aparada, quer a faca caia no sítio quer falhe. O que sobrevive ao
    corte é o ficheiro do Gonçalo, intacto — nem esticado, nem recortado, nem
    misturado com pergaminho de outro sítio.

    É por isso que se estica em vez de se espelhar, que era a outra hipótese: o
    espelho de 2 mm copiava a moldura para dentro da sangria, e aí um corte que
    falhasse 1 mm para fora mostrava uma **moldura fantasma** ao lado da boa.
    A fila da borda, essa, é pergaminho.

    ## Porque é que a sangria voltou

    Esteve a zero, por o fundo medir exactamente a área de corte. Carregado
    assim no site deles, o editor avisa que o produto **pode ficar com margens
    brancas** — o desenho acaba na linha de corte e não há nada para lá dela.
    A 360imprimir pede 2 mm neste produto: 78 × 109 para um autocolante de
    74 × 105.
    """
    alt = len(filas)
    print(f"  sangria de {SANGRIA:.0f} mm: +{px_x} px nos lados e +{px_y} "
          f"em cima e em baixo", flush=True)

    #  Cada linha ganha a sua primeira coluna repetida à esquerda e a última à
    #  direita. Fatiar `bytearray` é o que torna isto rápido: são duas
    #  multiplicações e uma concatenação por linha, e não um ciclo por píxel.
    com_lados = [f[0:3] * px_x + f + f[(larg - 1) * 3:larg * 3] * px_x
                 for f in filas]

    #  E em cima e em baixo repete-se a linha inteira, que já vem com os lados
    #  feitos — assim os cantos ficam preenchidos sem serem um caso à parte.
    return ([bytearray(com_lados[0])] * px_y
            + com_lados
            + [bytearray(com_lados[-1])] * px_y), larg + 2 * px_x


def fundo():
    """Escreve o `cartao-mesa-fundo.jpg`: o `FundoA7` com a sangria à volta.

    O fundo vem **já em A7 e já pronto**: 74 × 105 mm cravados, a moldura na
    posição em que foi desenhada. Não há nada a recortar, a centrar nem a
    esticar, e esta função não faz nenhuma dessas coisas — lê o PNG, põe-lhe os
    `SANGRIA` mm à volta e escreve o JPEG.

    **A sangria não é mexer no fundo.** Fica toda para lá da linha de corte, e é
    aparada quer a faca caia no sítio quer falhe; o que fica no autocolante é o
    ficheiro tal e qual. O `sangrar()` explica como se enche.

    ## Porque é que houve aqui código a mais, e já não há

    Enquanto o fundo era o `origem/fundo-ementa.png`, um A4 desenhado para a
    ementa, este ficheiro tinha três funções a remendá-lo: uma para lhe tirar o
    espaço que a ementa reserva às argolas, outra para o encurtar quando o
    formato se afastava da série A, e uma terceira para lhe acrescentar
    pergaminho nas bordas, porque o desenho ia até quase à margem e não sobrava
    folha para a sangria.

    Saíram todas. **Um fundo desenhado para o sítio certo dispensa código que o
    empurre para lá**, e o código que empurrava era a origem de tudo o que se
    via de errado: a moldura descentrada, a faixa de pergaminho postiço nas
    bordas e o rasto na sangria.

    Se o fundo voltar a ser um A4, isto volta a ser preciso: está no histórico.

    ## O JPEG e não o PNG

    É obrigação e não gosto: o `Page.printToPDF` do Chrome bloqueia
    indefinidamente com um PNG grande de fundo. Está medido no `fundo.py`.
    """
    if not os.path.exists(ORIGEM):
        raise SystemExit(f"falta {ORIGEM}")
    if subprocess.run(["which", "sips"], capture_output=True).returncode:
        raise SystemExit("falta o `sips` — é do macOS e é ele que escreve o JPEG")

    print("a ler o pergaminho…", flush=True)
    larg, alt, canais, linhas = pergaminho.ler_png(ORIGEM)
    dpi = larg / (TRIM_L / 25.4)
    print(f"  {os.path.basename(ORIGEM)}: {larg} × {alt} px "
          f"= {TRIM_L:.0f} × {TRIM_A:.0f} mm a {dpi:.0f} DPI", flush=True)

    #  A proporção é a única coisa que se confere, e confere-se porque um
    #  ficheiro trocado por engano passaria despercebido até chegar à gráfica.
    if abs(larg / alt - TRIM_L / TRIM_A) / (TRIM_L / TRIM_A) > 0.01:
        raise SystemExit(f"o fundo está a {larg / alt:.4f} e o cartão é a "
                         f"{TRIM_L / TRIM_A:.4f} — não é o ficheiro certo")

    filas = [bytearray(l[:larg * 3]) if canais == 3
             else bytearray(b for x in range(larg)
                            for b in l[x * canais:x * canais + 3])
             for l in linhas]

    #  A sangria mede-se em píxeis do próprio ficheiro, e não a 300 DPI: a
    #  resolução dele é a que é, e reduzi-la para uma conta redonda era deitar
    #  fora detalhe que a gráfica sabe usar.
    px_x = round(SANGRIA * larg / TRIM_L)
    px_y = round(SANGRIA * alt / TRIM_A)
    filas, larg = sangrar(filas, larg, px_x, px_y)

    tmp = os.path.join(BASE, "cartao-mesa-sangrado.png")
    pergaminho.escrever_png(tmp, larg, len(filas), filas)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "95",
                    "--out", FUNDO_JPG, tmp], check=True, capture_output=True)
    os.remove(tmp)
    print(f"escrito {FUNDO_JPG} — {os.path.getsize(FUNDO_JPG) // 1024} KB, "
          f"{larg} × {len(filas)} px = {MEDIA_L:.0f} × {MEDIA_A:.0f} mm "
          f"(é este que o HTML usa)")


# ---------------------------------------------------------------------------
#  O cartão
# ---------------------------------------------------------------------------

SITE = qr.endereco_do_site()
EMENTA = SITE + "/ementa"

#  `/ementa` e não `/pt/ementa`: o português é a língua da casa e é a única sem
#  prefixo no endereço — ver o `defaultLocale` do `lib/i18n.ts`. Quem chega de
#  fora troca de língua no selector que está na própria página, e o endereço
#  fica sete caracteres mais curto, que num QR são módulos maiores.

#  Duas linhas de duas, e não as quatro seguidas: num cartão de 74 mm a linha
#  corrida saía a corpo 5 e meio para caber, que é letra de rodapé de contrato.
#  Em duas linhas o corpo sobe para 8,5 pt e lê-se de pé, ao lado da mesa.
LINGUAS = [("A ementa", "The menu"), ("La carte", "La carta")]


def cartao():
    return f"""      <div class="miolo">
        <div class="mesa-nome">TASKUI<span class="virado">N</span>HA</div>
        <div class="mesa-sub">do Pirata</div>
        <div class="mesa-risco"></div>

        <div class="mesa-qr">{qr.svg(EMENTA, QR_MM, versao=4, classe="mesa-qr-codigo")}</div>

        <div class="mesa-linguas">{"<br>".join(" &middot; ".join(par) for par in LINGUAS)}</div>
        <div class="mesa-pe">{EMENTA.replace("https://www.", "")}</div>
      </div>"""


CSS = f"""
/*
  O cartão de mesa. A tipografia é a da ementa e as medidas são as da capa
  reduzidas — ver o `mesa.py`, que é de onde isto sai.
*/

:root {{
  --tinta:       #241708;
  --queimado:    #4a2c0d;
  --pergaminho:  #d9c7a0;
  --tinta-fraca: rgb(36 23 8 / 0.88);
  --linha:       rgb(36 23 8 / 0.55);

  /*
    **Mais escuro que na ementa, e de propósito.** A ementa é uma página que se
    pega e se lê de perto, e lá o cinzento fraco é elegância. Isto é um
    autocolante colado num tampo, lido de pé, de relance e muitas vezes contra
    o reflexo do vinil brilhante — e aí o mesmo cinzento é só letra que não se
    vê. A tinta desceu de #2b1d0e para #241708, o queimado dos subtítulos de
    #6b4517 para #4a2c0d, o pé de 60 % para 88 % de opacidade e os riscos de
    30 % para 55 %.

    O véu branco por cima da fotografia **sobe** em vez de descer: clarear o
    pergaminho afasta-o da tinta, e é contraste ganho do outro lado.
  */
  --clarear: .18;

  --trim-l: {TRIM_L}mm;
  --trim-a: {TRIM_A}mm;
  --media-l: {MEDIA_L}mm;
  --media-a: {MEDIA_A}mm;
}}

* {{ box-sizing: border-box; margin: 0; padding: 0; }}

html {{ background: #555; }}

body {{
  font-family: "Pergaminho", "IM Fell English SC", Georgia, serif;
  color: var(--tinta);
  -webkit-font-smoothing: antialiased;
}}

/*
  Três caixas, e a do meio é a que faz o trabalho:

      .cartao   o lugar na folha — é só ele que sabe onde o cartão está
      .pose     o cartão inteiro, e é a **única** que roda ou encolhe
      .fundo    o pergaminho, e .miolo o que está escrito

  O fundo tem de estar **dentro** da caixa que roda. Esteve fora, ao lado do
  miolo, enquanto o cartão ficava sempre ao alto; com os oito da folha
  A4 deitados, um fundo por rodar deixava o pergaminho ao alto por baixo de um
  texto deitado — e como a moldura é quase simétrica, isso vê-se pelos
  ornamentos dos cantos e não pelo resto.

  O que muda entre as duas folhas é a `--pose` desta caixa, e mais nada. O
  desenho lá dentro é o mesmo objecto nos dois ficheiros.
*/
.cartao {{
  position: relative;
  overflow: hidden;
  background-color: var(--pergaminho);
}}

.pose {{
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  transform: var(--pose, none);
}}

.fundo {{
  position: absolute;
  inset: 0;
  /* o véu branco por cima da fotografia, como na ementa */
  background-image:
    linear-gradient(rgba(255,255,255,var(--clarear)), rgba(255,255,255,var(--clarear))),
    url("cartao-mesa-fundo.jpg");
  background-repeat: no-repeat;
  background-position: center, center;
}}

.miolo {{
  position: absolute;
  width: var(--trim-l);
  height: var(--trim-a);
  padding: 10mm 6mm 9mm;
  display: flex;
  flex-direction: column;
  /*
    O bloco centra-se no que sobra, em vez de o pé ser empurrado para o fundo
    com um `margin-top: auto`. Com o `auto`, a folga toda — vinte e tal
    milímetros — caía num sítio só, entre as línguas e o endereço, e o cartão
    ficava com um buraco a meio. Centrado, a mesma folga reparte-se pelas duas
    pontas e não se vê.
  */
  justify-content: center;
  align-items: center;
  text-align: center;
}}

.mesa-nome {{
  font-family: "Tabuleta", "Rye", Georgia, serif;
  font-size: 17pt;
  line-height: 1;
  letter-spacing: 0.02em;
}}
/* o N ao contrário — a assinatura do letreiro sobre a porta, como na capa */
.virado {{ display: inline-block; transform: scaleX(-1); }}

.mesa-sub {{
  font-family: "Maquina", "Special Elite", "Courier New", monospace;
  font-size: 6pt;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  text-transform: uppercase;
  color: var(--queimado);
  margin-top: 2.5mm;
}}

.mesa-risco {{
  width: 22mm;
  height: 0;
  border-top: 0.3mm solid var(--linha);
  margin: 5mm auto 0;
}}

/*
  O quadrado é **vector e sem fundo branco**: o pergaminho passa por baixo e os
  módulos são a tinta da folha, como o resto do texto. A zona de silêncio já
  vem dentro do SVG — não se acrescenta margem a fingir que é ela.
*/
.mesa-qr {{ margin-top: 5.5mm; color: var(--tinta); }}
.mesa-qr-codigo {{ display: block; }}

.mesa-linguas {{
  margin-top: 5mm;
  font-size: 8.5pt;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--queimado);
}}

.mesa-pe {{
  margin-top: 6mm;
  width: 72%;
  border-top: 0.3mm solid var(--linha);
  padding-top: 2.5mm;
  font-family: "Maquina", "Special Elite", "Courier New", monospace;
  font-size: 5.5pt;
  letter-spacing: 0.14em;
  text-transform: lowercase;
  color: var(--tinta-fraca);
}}
"""

CSS_GRAFICA = f"""
/* ---------- a folha da gráfica: um cartão ---------- */

@page {{ size: {MEDIA_L / 25.4 * 72:.2f}pt {MEDIA_A / 25.4 * 72:.2f}pt; margin: 0; }}

/*
  O cartão mede a folha, e o fundo mede o cartão. Nada transborda.

  **Esteve a transbordar**, para tapar a fresta branca que o Chrome deixa numa
  aresta ao arredondar a página, e foi pior: ele apara o conteúdo na caixa da
  CSS antes de arredondar a folha, portanto a fresta ficava na mesma — e o que
  passava da borda ia parar a uma **segunda página**. A fresta resolve-se na
  TrimBox, e a explicação está no `trim_alinhada()`.
*/
.cartao {{
  width: var(--media-l);
  height: var(--media-a);
}}

/* a caixa que roda é, aqui, a folha inteira — e não roda nem encolhe */
.pose {{
  width: var(--media-l);
  height: var(--media-a);
}}

/*
  O fundo **cola-se à folha impressa**, e não à caixa do cartão.

  O Chrome não desenha o cartão do tamanho que a CSS pede: numa folha de
  105,18 mm, um `.cartao` de 105 mm sai com **104,60** — quatro décimas a menos,
  e nem sempre repartidas pelas duas pontas. Fica papel por pintar numa aresta,
  e num autocolante sem sangria isso é uma linha branca no produto.

  Com `position: fixed` o fundo passa a medir-se pela página e não pelo cartão,
  e o milímetro a mais de cada lado garante que a cobre inteira, dê o Chrome a
  medida que der. **Fixed e não absolute**: um elemento fixo não empurra o
  fluxo, e por isso o que passa da borda não gera uma segunda página — que foi
  o que aconteceu quando isto se tentou com margens negativas.

  O `.miolo` não é tocado: continua na caixa do cartão, que é onde as medidas do
  desenho fazem sentido.
*/
.fundo {{
  position: fixed;
  top: -1mm;
  left: -1mm;
  right: -1mm;
  bottom: -1mm;
  background-size: 100% 100%, 100% 100%;
}}

/* e o miolo é a área de corte, {SANGRIA}mm para dentro de cada lado */
.miolo {{ top: {SANGRIA}mm; left: {SANGRIA}mm; }}

@media screen {{
  .cartao {{ margin: 12mm auto; box-shadow: 0 2mm 8mm rgba(0,0,0,.45); }}
}}
"""

# A imagem do fundo tem a sangria lá dentro e a folha A4 não a quer: mostra-se
# só a área de corte, ampliando a imagem na proporção entre as duas e
# centrando-a. É a mesma conta nas duas direcções, mas não dá o mesmo número —
# 3 mm pesam mais em 74 do que em 105.
_FX = 100 * MEDIA_L / TRIM_L
_FY = 100 * MEDIA_A / TRIM_A

CSS_A4 = f"""
/* ---------- a folha de casa: oito cartões e as marcas de corte ---------- */

@page {{ size: A4; margin: 0; }}

.folha {{
  position: relative;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
}}

.grelha {{
  position: absolute;
  top: {A4_CIMA:.2f}mm;
  left: {A4_MARGEM}mm;
  display: grid;
  grid-template-columns: repeat({A4_COLUNAS}, {A4_LARG}mm);
  grid-template-rows: repeat({A4_LINHAS}, {A4_ALT:.2f}mm);
}}

.cartao {{
  width: {A4_LARG}mm;
  height: {A4_ALT:.2f}mm;
}}

/*
  Aqui o cartão fica ao alto e em tamanho real, portanto a pose é a identidade
  — não roda nem encolhe. Rodava enquanto os cartões eram A7 e iam oito por
  folha; com 90 × 110 cabem quatro ao alto, com margem de sobra, e um cartão
  que não passa por transformação nenhuma é um cartão a menos por onde a prova
  de casa se pode afastar do que a gráfica imprime.
*/
.pose {{
  width: var(--trim-l);
  height: var(--trim-a);
}}

/* da imagem só se vê a área de corte — a sangria fica de fora */
.fundo {{ background-size: {_FX:.3f}% {_FY:.3f}%, {_FX:.3f}% {_FY:.3f}%; }}

/*
  As marcas de corte ficam **fora** dos cartões, na margem, e param a 1,5 mm
  das arestas: uma marca que encostasse ao cartão ficava impressa nele se a
  faca passasse do lado de dentro.
*/
.marca {{
  position: absolute;
  background: rgb(43 29 14 / 0.55);
}}
.marca.v {{ width: 0.2mm; height: 4mm; }}
.marca.h {{ height: 0.2mm; width: 4mm; }}

@media screen {{
  .folha {{ margin: 12mm auto; box-shadow: 0 2mm 8mm rgba(0,0,0,.45); background: #fff; }}
}}
"""


def marcas():
    """As marcas de corte, duas por cada linha de corte, nas duas margens.

    São três verticais e cinco horizontais — uma por cada aresta da grelha, contando
    as de fora. Quem corta segue-as de ponta a ponta.
    """
    xs = [A4_MARGEM + i * A4_LARG for i in range(A4_COLUNAS + 1)]
    ys = [A4_CIMA + i * A4_ALT for i in range(A4_LINHAS + 1)]
    fora, comp = 1.5, 4.0
    out = []
    for x in xs:
        out.append(f'      <div class="marca v" style="left:{x:.2f}mm;'
                   f'top:{ys[0] - fora - comp:.2f}mm"></div>')
        out.append(f'      <div class="marca v" style="left:{x:.2f}mm;'
                   f'top:{ys[-1] + fora:.2f}mm"></div>')
    for y in ys:
        out.append(f'      <div class="marca h" style="top:{y:.2f}mm;'
                   f'left:{xs[0] - fora - comp:.2f}mm"></div>')
        out.append(f'      <div class="marca h" style="top:{y:.2f}mm;'
                   f'left:{xs[-1] + fora:.2f}mm"></div>')
    return "\n".join(out)


def documento(corpo, extra):
    fontes = open(f"{D}/fontes.css", encoding="utf-8").read()
    return f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>Cartão de mesa da Taskuinha</title>
<style>
{fontes}
{CSS}{extra}
</style>
</head>
<body>
{corpo}
</body>
</html>
"""


def escrever(nome, texto):
    caminho = os.path.join(BASE, nome)
    open(caminho, "w", encoding="utf-8").write(texto)
    print(f"escrito {caminho} — {os.path.getsize(caminho) // 1024} KB")


def html():
    if not os.path.exists(FUNDO_JPG):
        raise SystemExit(f"falta o {os.path.basename(FUNDO_JPG)} — correr o "
                         "`mesa.py` sem argumentos, que o gera antes do HTML")
    if os.path.getmtime(FUNDO_JPG) < os.path.getmtime(ORIGEM):
        raise SystemExit(f"o {os.path.basename(FUNDO_JPG)} é mais velho que o "
                         "pergaminho de origem — voltar a gerar o fundo")

    um = ('  <div class="cartao">\n'
          '    <div class="pose">\n'
          '      <div class="fundo"></div>\n'
          f'{cartao()}\n'
          '    </div>\n'
          '  </div>')

    # a classe `folha` a mais é para o `foto.mjs`, que é por ela que procura o
    # que há-de fotografar; na A4 quem a leva é a folha inteira
    escrever("cartao-mesa-grafica.html",
             documento(um.replace('class="cartao"', 'class="cartao folha"'), CSS_GRAFICA))

    quantos = A4_COLUNAS * A4_LINHAS
    folha = ("  <div class=\"folha\">\n    <div class=\"grelha\">\n"
             + "\n".join(um for _ in range(quantos))
             + "\n    </div>\n" + marcas() + "\n  </div>")
    escrever("cartao-mesa-a4.html", documento(folha, CSS_A4))

    print(f"  {quantos} cartões na folha A4, {A4_LARG:.0f} × {A4_ALT:.1f} mm cada")
    print(f"  o QR aponta para {EMENTA} — {len(EMENTA)} bytes, versão 4")


# ---------------------------------------------------------------------------
#  O CMYK e as caixas de corte, que são as do `grafica.py`
# ---------------------------------------------------------------------------

GRAFICA_PDF = os.path.join(BASE, "cartao-mesa-grafica.pdf")
CMYK_PDF = os.path.join(BASE, "cartao-mesa-cmyk.pdf")


def trim_centrada():
    """Onde fica a área de corte na folha: ao meio, e conferida.

    Com `SANGRIA` a mais de zero isto é geometria e mais nada — a área de corte
    fica no centro da folha e sobra a sangria dos quatro lados. Mede-se a folha
    em vez de se assumir, porque o Chrome não a escreve exactamente do tamanho
    que se lhe pede: arredonda para píxeis do dispositivo, e essa décima de
    milímetro passa a cair dentro da sangria em vez de ir para a conta.

    ## Houve aqui uma versão que media o desenho, e correu mal

    Enquanto o fundo não tinha sangria, a área de corte era o desenho todo e não
    havia folga nenhuma: a TrimBox tinha de ir buscar o desenho onde ele
    estivesse, rasterizando a folha e procurando onde acabava o papel por
    pintar. Funcionava, mas é frágil — **o pergaminho tem cantos claros**, e a
    busca dava-os por papel: media o desenho 1,5 mm mais estreito do que era e
    deslocava a área de corte outro tanto.

    Com 2 mm de sangria o problema desaparece, porque já não é preciso adivinhar
    nada. O que fica é uma **verificação**: se sobrar menos sangria do que a
    gráfica pede, avisa-se.

    Devolve o canto inferior esquerdo da TrimBox, em pontos.
    """
    import re

    larg_pt = TRIM_L / 25.4 * 72
    alt_pt = TRIM_A / 25.4 * 72

    d = open(CMYK_PDF, "rb").read()
    m = re.search(rb"/MediaBox\s*\[([^\]]*)\]", d)
    if not m:
        raise SystemExit("o PDF não declara MediaBox")
    _, _, larg, alt = [float(v) for v in m.group(1).split()][:4]

    if larg < larg_pt - 0.5 or alt < alt_pt - 0.5:
        raise SystemExit(f"a folha mede {larg / 72 * 25.4:.2f} × "
                         f"{alt / 72 * 25.4:.2f} mm e a área de corte pede "
                         f"{TRIM_L} × {TRIM_A} — não cabe")

    x0, y0 = (larg - larg_pt) / 2, (alt - alt_pt) / 2
    sx, sy = x0 / 72 * 25.4, y0 / 72 * 25.4
    print(f"  folha de {larg / 72 * 25.4:.2f} × {alt / 72 * 25.4:.2f} mm; área "
          f"de corte ao centro, com {sx:.2f} mm de sangria nos lados e "
          f"{sy:.2f} em cima e em baixo", flush=True)
    if min(sx, sy) < SANGRIA - 0.3:
        print(f"  atenção: a gráfica pede {SANGRIA:.0f} mm de sangria",
              flush=True)
    return x0, y0


def cmyk():
    """O último passo do cartão da gráfica, e é o mesmo da ementa.

    O `grafica.py` faz as duas coisas que faltam a um PDF que saiu do Chrome —
    converter para FOGRA39 e escrever a TrimBox, a BleedBox e a ArtBox — e as
    razões das duas estão explicadas lá. Chamam-se as funções dele em vez de se
    repetir o comando: uma segunda cópia divergia na primeira vez que se
    afinasse um parâmetro num dos lados.
    """
    import grafica

    if not os.path.exists(GRAFICA_PDF):
        raise SystemExit(
            f"falta o {os.path.basename(GRAFICA_PDF)} — correr primeiro o "
            "`gerar.mjs` sobre o cartao-mesa-grafica.html; ver o LEIA-ME")

    grafica.converter(grafica.perfil(), entradas=[GRAFICA_PDF], saida=CMYK_PDF)
    grafica.caixas(saida=CMYK_PDF,
                   trim_pt=(TRIM_L / 25.4 * 72, TRIM_A / 25.4 * 72),
                   paginas_esperadas=1,
                   origem_pt=trim_centrada())
    print(f"escrito {CMYK_PDF} — "
          f"{os.path.getsize(CMYK_PDF) / 1048576:.1f} MB")


if __name__ == "__main__":
    import sys
    if "--cmyk" in sys.argv:              # depois de o Chrome ter escrito o PDF
        cmyk()
    else:
        if "--html" not in sys.argv:      # `--html` para quando só se mexeu no desenho
            fundo()
        html()
