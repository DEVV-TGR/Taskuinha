# -*- coding: utf-8 -*-
"""
Escreve o fundo da versão da gráfica: `ementa-impressa/fundo-grafica.png`.

    python3 ementa-impressa/gerador/fundo.py

Escreve dois ficheiros: o `fundo-grafica.png`, que é o trabalho, e o
`fundo-grafica.jpg`, que é o que o HTML usa — o Chrome pendura a imprimir com um
PNG grande de fundo, e a nota do `jpeg()` aqui em baixo tem as medições.

O `origem/fundo-ementa.png` é um A4 inteiro: a moldura desenhada começa a
**3,3 mm da borda**, dos quatro lados. Isso serve para um A4 solto e não serve
para o que a casa encomendou — 14 páginas **encadernadas com argolas do lado
esquerdo**. O guia da gráfica (`origem/guia-360imprimir.pdf`) pede 1 cm de área
de segurança, e é exactamente aí que as argolas furam: com o fundo original, o
furo saía **por cima da moldura**.

Este ficheiro resolve isso sem redesenhar nada:

  * a folha passa a 216 × 303 mm — o A4 com os 3 mm de sangria à volta;
  * o desenho inteiro (moldura e ornamentos) é **encolhido 4,76 % na
    horizontal** e encostado ao lado de fora, para caber entre o corte e o
    início da área útil, 10 mm mais para dentro;
  * a tira dos 13 mm que sobra do lado das argolas leva pergaminho **sem
    moldura**, copiado de uma banda limpa do meio da própria fotografia e
    acertado no tom, linha a linha, ao que a moldura tinha nessa altura.

Só se encolhe na horizontal de propósito. Encolher também na vertical mudava a
altura útil da folha, e a altura é o que está no fio: a folha do Bar fecha a
3 mm do ornamento de baixo com `--ar: 3.0mm`. Na horizontal há folga de sobra.

**Não se gera o espelho.** As páginas pares levam a mesma imagem virada por CSS
(`transform: scaleX(-1)`), que é o que põe as argolas do lado direito no verso
de cada folha — ver a nota da encadernação no LEIA-ME. Sai de borda os
ornamentos trocados de canto entre a página par e a ímpar, que é o que um livro
faz desde sempre numa página dupla.

Sem dependências: `zlib` e mais nada. Não entra `Pillow` no sistema, pela mesma
regra que mantém o `package.json` fechado.
"""

import os
import re
import struct
import subprocess
import zlib

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(AQUI)
ORIGEM = os.path.join(BASE, "origem", "fundo-ementa.png")
SAIDA = os.path.join(BASE, "fundo-grafica.png")
SAIDA_JPG = os.path.join(BASE, "fundo-grafica.jpg")
CAPA = os.path.join(BASE, "fundo-capa.png")
CAPA_JPG = os.path.join(BASE, "fundo-capa.jpg")
PIRATA = os.path.join(BASE, "origem", "pirata-capa.png")
MONTAR = os.path.join(AQUI, "montar.py")

# --- as medidas, todas em mm; mudam aqui e em mais lado nenhum ------------
#
#  As da capa são as mesmas que a CSS usa, e têm de continuar a ser: a figura
#  deixa de ser um `<img>` e passa a vir cozida no fundo, mas o vão que ela
#  ocupa continua a ser desenhado pela CSS. Se um destes números mudar num
#  lado e não no outro, o pirata sai deslocado do buraco onde devia estar.

SANGRIA = 3.0     # o guia da gráfica pede 3 mm em todo o redor
ARGOLAS = 10.0    # a área de segurança e de encadernação, também do guia
TRIM_L, TRIM_A = 210.0, 297.0            # o A4 depois de cortado
MEDIA_L = TRIM_L + 2 * SANGRIA           # 216
MEDIA_A = TRIM_A + 2 * SANGRIA           # 303

CAPA_CIMA = 40.0        # o `padding-top` da capa, sem contar a sangria
CAPA_LADO = 18.0        # o `--lado` da capa
CAPA_LARG = 0.58        # o `width: 58%` da figura
SOMBRA_Y = 4.0          # o `drop-shadow(0 4mm 6mm …)`
SOMBRA_RAIO = 6.0
SOMBRA_COR = (43, 29, 14)
SOMBRA_ALFA = 0.34


# ---------------------------------------------------------------------------
#  PNG: ler e escrever à mão
# ---------------------------------------------------------------------------

def ler_png(caminho):
    """Devolve (largura, altura, canais, linhas) com as linhas já sem filtro."""
    d = open(caminho, "rb").read()
    if d[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"{caminho} não é um PNG")
    pos, idat, larg, alt, prof, cor = 8, [], None, None, None, None
    while pos < len(d):
        (n,) = struct.unpack(">I", d[pos:pos + 4])
        tipo = d[pos + 4:pos + 8]
        dados = d[pos + 8:pos + 8 + n]
        if tipo == b"IHDR":
            larg, alt, prof, cor = struct.unpack(">IIBB", dados[:10])
            if dados[12] != 0:
                raise SystemExit("PNG entrelaçado — o gerador não lê Adam7")
        elif tipo == b"IDAT":
            idat.append(dados)
        elif tipo == b"IEND":
            break
        pos += 12 + n
    if prof != 8 or cor not in (2, 6):
        raise SystemExit(f"PNG com profundidade {prof} e tipo {cor}: só se lê RGB/RGBA a 8 bits")

    canais = 3 if cor == 2 else 4
    raw = zlib.decompress(b"".join(idat))
    passo = larg * canais
    linhas = []
    ant = bytearray(passo)
    i = 0
    for _ in range(alt):
        f = raw[i]; i += 1
        lin = bytearray(raw[i:i + passo]); i += passo
        if f == 1:
            for x in range(canais, passo):
                lin[x] = (lin[x] + lin[x - canais]) & 255
        elif f == 2:
            for x in range(passo):
                lin[x] = (lin[x] + ant[x]) & 255
        elif f == 3:
            for x in range(passo):
                a = lin[x - canais] if x >= canais else 0
                lin[x] = (lin[x] + ((a + ant[x]) >> 1)) & 255
        elif f == 4:
            for x in range(passo):
                a = lin[x - canais] if x >= canais else 0
                b = ant[x]
                c = ant[x - canais] if x >= canais else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                lin[x] = (lin[x] + pr) & 255
        elif f != 0:
            raise SystemExit(f"filtro PNG desconhecido: {f}")
        ant = lin
        linhas.append(lin)
    return larg, alt, canais, linhas


def escrever_png(caminho, larg, alt, linhas):
    """Escreve RGB a 8 bits. Filtro Sub — encolhe o ficheiro para menos de
    metade do que dava sem filtro, e é o único que se faz num `translate`
    barato sobre a linha já pronta."""
    corpo = bytearray()
    for lin in linhas:
        corpo.append(1)                       # filtro Sub
        sub = bytearray(lin)
        for x in range(len(lin) - 1, 2, -1):
            sub[x] = (lin[x] - lin[x - 3]) & 255
        corpo += sub

    def bloco(tipo, dados):
        return (struct.pack(">I", len(dados)) + tipo + dados
                + struct.pack(">I", zlib.crc32(tipo + dados) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", larg, alt, 8, 2, 0, 0, 0)
    # 300 DPI declarados no próprio ficheiro: 11811 píxeis por metro.
    phys = struct.pack(">IIB", 11811, 11811, 1)
    with open(caminho, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(bloco(b"IHDR", ihdr))
        f.write(bloco(b"pHYs", phys))
        f.write(bloco(b"IDAT", zlib.compress(bytes(corpo), 6)))
        f.write(bloco(b"IEND", b""))


# ---------------------------------------------------------------------------

def clarear():
    """O `--clarear` da CSS, lido do `montar.py` para não existir em dois sítios.

    O véu branco por cima do pergaminho estava na CSS, sobre o `.fundo`. Passa a
    ser cozido aqui porque a capa deixou de o poder ter lá: se o véu ficasse na
    CSS, clareava também o pirata, que agora vem dentro da mesma imagem.
    """
    t = open(MONTAR, encoding="utf-8").read()
    m = re.search(r"--clarear:\s*\.?(\d*\.?\d+);", t)
    if not m:
        raise SystemExit("não achei o --clarear no montar.py")
    v = m.group(0).split(":")[1].strip(" ;")
    return float(v if v[0] != "." else "0" + v)


def veu(linhas, k):
    """Aplica o véu branco, linha a linha, no sítio."""
    for lin in linhas:
        for i in range(len(lin)):
            lin[i] = int(lin[i] + (255 - lin[i]) * k)


# ---------------------------------------------------------------------------
#  A capa: o pirata cozido no fundo
# ---------------------------------------------------------------------------
#
#  Não é gosto — é a única forma de a capa se conseguir imprimir.
#
#  O `Page.printToPDF` do Chrome **bloqueia indefinidamente** quando a página
#  tem o fundo grande **e** uma segunda imagem. Medido, com este pergaminho e
#  este pirata:
#
#      fundo grande sozinho            imprime em 4 s
#      pirata sozinho, sem fundo       imprime em 4 s
#      fundo grande + pirata           pendura, sempre
#      fundo grande + pirata a 300 px  pendura   ← não é o tamanho do segundo
#      dois PNG de 120 px              imprime em 4 s
#
#  Não é intermitente: três tentativas seguidas, três bloqueios. Não é o
#  `--disable-gpu`, nem o `--force-color-profile`, nem o `--virtual-time-budget`,
#  nem o `--run-all-compositor-stages-before-draw` — testados todos.
#
#  Cozer a figura no fundo deixa a capa com **uma imagem só**, que é o caso que
#  se sabe imprimir. E de caminho resolve o que estava em «Por decidir»: o
#  `drop-shadow` obrigava o Chrome a rasterizar o pirata a 1623 px e engordava
#  o PDF sem acrescentar detalhe. Agora a sombra é desenhada aqui, uma vez.

def redimensionar(linhas, sl, sa, dl, da, canais):
    """Bilinear. A figura cresce ~1,6× e o vizinho mais próximo dava serrilha
    no recorte, que é justamente onde ela se nota."""
    saida = []
    for y in range(da):
        fy = (y + 0.5) * sa / da - 0.5
        y0 = int(fy) if fy >= 0 else 0
        y1 = min(sa - 1, y0 + 1)
        ty = fy - y0
        if ty < 0: ty = 0.0
        la, lb = linhas[y0], linhas[y1]
        lin = bytearray(dl * canais)
        for x in range(dl):
            fx = (x + 0.5) * sl / dl - 0.5
            x0 = int(fx) if fx >= 0 else 0
            x1 = min(sl - 1, x0 + 1)
            tx = fx - x0
            if tx < 0: tx = 0.0
            oa, ob = x0 * canais, x1 * canais
            d = x * canais
            for c in range(canais):
                v = (la[oa + c] * (1 - tx) + la[ob + c] * tx) * (1 - ty) + \
                    (lb[oa + c] * (1 - tx) + lb[ob + c] * tx) * ty
                lin[d + c] = int(v + 0.5)
        saida.append(lin)
    return saida


def desfocar(alfa, larg, alt, sigma):
    """Três caixas seguidas, que é a aproximação de sempre à gaussiana.

    Faz-se a um oitavo da resolução e volta a subir: com sigma de 35 px o
    desfoque não tem detalhe nenhum acima dessa escala, e a oito vezes menos
    píxeis isto corre em segundos em vez de minutos."""
    r = 8
    pl, pa = max(1, larg // r), max(1, alt // r)
    peq = [[0.0] * pl for _ in range(pa)]
    for y in range(pa):
        fy = y * r
        linha = peq[y]
        for x in range(pl):
            linha[x] = alfa[min(alt - 1, fy)][min(larg - 1, x * r)]

    lado = max(1, int(sigma / r * 2.236 + 0.5)) | 1
    meio = lado // 2
    for _ in range(3):
        for y in range(pa):                       # horizontal
            f = peq[y]
            acc = sum(f[:meio + 1]) + f[0] * meio
            nova = [0.0] * pl
            for x in range(pl):
                nova[x] = acc / lado
                acc += f[min(pl - 1, x + meio + 1)] - f[max(0, x - meio)]
            peq[y] = nova
        for x in range(pl):                       # vertical
            col = [peq[y][x] for y in range(pa)]
            acc = sum(col[:meio + 1]) + col[0] * meio
            for y in range(pa):
                peq[y][x] = acc / lado
                acc += col[min(pa - 1, y + meio + 1)] - col[max(0, y - meio)]

    grande = []                                   # e volta a subir, bilinear
    for y in range(alt):
        fy = y / r
        y0 = min(pa - 1, int(fy)); y1 = min(pa - 1, y0 + 1); ty = fy - y0
        a, b = peq[y0], peq[y1]
        lin = [0.0] * larg
        for x in range(larg):
            fx = x / r
            x0 = min(pl - 1, int(fx)); x1 = min(pl - 1, x0 + 1); tx = fx - x0
            lin[x] = (a[x0] * (1 - tx) + a[x1] * tx) * (1 - ty) + \
                     (b[x0] * (1 - tx) + b[x1] * tx) * ty
        grande.append(lin)
    return grande


def capa(fundo_linhas, LARG, ALT, PPMM):
    print("a cozer o pirata na capa…", flush=True)
    pl, pa, pc, plin = ler_png(PIRATA)
    if pc != 4:
        raise SystemExit("o pirata-capa.png devia ter canal alfa")

    # o vão, exactamente como a CSS o desenha
    esq = SANGRIA + ARGOLAS + CAPA_LADO * (TRIM_L - ARGOLAS) / TRIM_L
    dir_ = SANGRIA + CAPA_LADO * (TRIM_L - ARGOLAS) / TRIM_L
    conteudo = MEDIA_L - esq - dir_
    larg_mm = conteudo * CAPA_LARG
    alt_mm = larg_mm * pa / pl
    x = round((esq + (conteudo - larg_mm) / 2) * PPMM)
    y = round((SANGRIA + CAPA_CIMA) * PPMM)
    dl, da = round(larg_mm * PPMM), round(alt_mm * PPMM)
    print(f"  vão: {larg_mm:.2f} × {alt_mm:.2f} mm a partir de "
          f"({esq + (conteudo - larg_mm) / 2:.2f}, {SANGRIA + CAPA_CIMA:.2f}) mm", flush=True)

    fig = redimensionar(plin, pl, pa, dl, da, 4)
    alfa = [[fig[j][i * 4 + 3] / 255.0 for i in range(dl)] for j in range(da)]

    # a sombra: o alfa desfocado, deslocado, na cor e na opacidade da CSS
    sigma = SOMBRA_RAIO / 2 * PPMM
    margem = int(sigma * 3)
    sl2, sa2 = dl + 2 * margem, da + 2 * margem
    tela = [[0.0] * sl2 for _ in range(sa2)]
    for j in range(da):
        linha = tela[j + margem]
        origem = alfa[j]
        for i in range(dl):
            linha[i + margem] = origem[i]
    sombra = desfocar(tela, sl2, sa2, sigma)
    desloc = round(SOMBRA_Y * PPMM)

    saida = [bytearray(l) for l in fundo_linhas]

    for j in range(sa2):                          # primeiro a sombra
        yy = y - margem + j + desloc
        if not 0 <= yy < ALT:
            continue
        lin = saida[yy]
        linha = sombra[j]
        for i in range(sl2):
            a = linha[i] * SOMBRA_ALFA
            if a < 0.004:
                continue
            xx = x - margem + i
            if not 0 <= xx < LARG:
                continue
            o = xx * 3
            for c in range(3):
                lin[o + c] = int(lin[o + c] * (1 - a) + SOMBRA_COR[c] * a)

    for j in range(da):                           # e depois a figura
        yy = y + j
        if not 0 <= yy < ALT:
            continue
        lin = saida[yy]
        f = fig[j]
        for i in range(dl):
            a = f[i * 4 + 3] / 255.0
            if a < 0.004:
                continue
            xx = x + i
            if not 0 <= xx < LARG:
                continue
            o = xx * 3
            for c in range(3):
                lin[o + c] = int(lin[o + c] * (1 - a) + f[i * 4 + c] * a)
    return saida


def main():
    if not os.path.exists(ORIGEM):
        raise SystemExit(f"falta {ORIGEM}")
    print("a ler o pergaminho…", flush=True)
    sl, sa, canais, linhas = ler_png(ORIGEM)
    print(f"  {sl} × {sa}, {canais} canais", flush=True)

    # --- o rebordo branco -------------------------------------------------
    #
    # A fotografia traz cerca de 1 mm de **branco puro** nos lados. É um resto
    # da exportação, não é pergaminho, e é a razão de ser do `--folga-fundo:
    # 2mm` da CSS: o A4 mandava-o para fora da página em vez de o apagar. Aqui
    # não dá para o empurrar — a folha cresceu e a moldura andou para dentro —
    # por isso corta-se, e o número sai da própria imagem. Em cima e em baixo
    # não há nenhum, e é por isso que se mede em vez de se assumir.
    def branca(vals):
        v = sorted(vals)
        return v[len(v) // 2] > 244

    ay = range(sa // 4, 3 * sa // 4, 37)
    ax = range(sl // 4, 3 * sl // 4, 37)
    cx0 = 0
    while cx0 < 40 and branca([linhas[y][cx0 * canais + c] for y in ay for c in range(3)]):
        cx0 += 1
    cx1 = sl
    while cx1 > sl - 40 and branca([linhas[y][(cx1 - 1) * canais + c] for y in ay for c in range(3)]):
        cx1 -= 1
    cy0 = 0
    while cy0 < 40 and branca([linhas[cy0][x * canais + c] for x in ax for c in range(3)]):
        cy0 += 1
    cy1 = sa
    while cy1 > sa - 40 and branca([linhas[cy1 - 1][x * canais + c] for x in ax for c in range(3)]):
        cy1 -= 1
    print(f"  rebordo branco: {cx0} / {sl - cx1} px nos lados, "
          f"{cy0} / {sa - cy1} px em cima e em baixo — cortado", flush=True)
    linhas = linhas[cy0:cy1]
    sl_util, sa_util = cx1 - cx0, cy1 - cy0

    # --- a grelha de saída ------------------------------------------------
    #
    # 300 DPI cravados, que é o que o guia pede. A fotografia dá 297 depois de
    # cortado o rebordo, e 297 não é "300 ou superior": estica-se os 3 DPI que
    # faltam, o que na vertical é repetir uma linha em cada 437.
    PPMM = 300 / 25.4
    LARG = round(MEDIA_L * PPMM)
    ALT = round(MEDIA_A * PPMM)
    x0 = round((SANGRIA + ARGOLAS) * PPMM)     # onde o desenho começa
    x1 = round((MEDIA_L - SANGRIA) * PPMM)     # e onde acaba: no corte da direita
    y0 = round(SANGRIA * PPMM)
    y1 = round((MEDIA_A - SANGRIA) * PPMM)
    dl, da = x1 - x0, y1 - y0
    print(f"  folha {MEDIA_L:.0f} × {MEDIA_A:.0f} mm a 300 DPI → {LARG} × {ALT} px")
    print(f"  desenho encolhido {100 * (1 - dl / (TRIM_L * PPMM)):.2f} % na horizontal, "
          f"e encostado {ARGOLAS:.0f} mm para dentro", flush=True)

    # --- o mapa horizontal, em fatias -------------------------------------
    #
    # Vizinho mais próximo, mas escrito como fatias contíguas: das ~2360
    # colunas de destino só uma em cada vinte quebra a sequência, portanto
    # copiam-se ~120 pedaços de linha em vez de 2360 píxeis. É a diferença
    # entre isto correr em segundos ou em minutos, e o resultado é o mesmo
    # píxel a píxel.
    FADE = round(4.0 * PPMM)          # a junta entre a tira e o desenho
    def mapa(n_dest, n_orig, base):
        fatias, ini, ant = [], None, -2
        for d in range(n_dest):
            o = base + min(n_orig - 1, int(d * n_orig / n_dest))
            if o != ant + 1:
                if ini is not None:
                    fatias.append((ini * canais, (ant + 1) * canais))
                ini = o
            ant = o
        fatias.append((ini * canais, (ant + 1) * canais))
        return fatias

    fatias = mapa(dl, sl_util, cx0)
    filas = [min(sa_util - 1, int(d * sa_util / da)) for d in range(da)]

    # --- a banda que vai encher a tira das argolas -------------------------
    #
    # Vem do meio da fotografia, onde não há moldura nenhuma, e é do tamanho da
    # tira mais a junta — não se repete nem se estica. Só lhe falta o tom: o
    # meio da folha é mais claro do que a borda, e um degrau de luz na costura
    # denunciava a emenda mesmo com o pergaminho a disfarçar. Por isso mede-se
    # a mediana da borda e a mediana da banda **em cada linha** e desloca-se a
    # banda pela diferença. A mediana e não a média, que os ornamentos dos
    # cantos chegam à borda e uma média puxava o tom para o escuro.
    #
    # O tom certo ainda deixava um fio à vista, porque duas texturas nunca
    # casam à coluna. Por isso a junta é esbatida ao longo de 4 mm — e esses
    # 4 mm caem todos em pergaminho liso, que a moldura só começa aos 7 mm.
    tira = x0
    banda = tira + FADE
    banda_ini = cx0 + (sl_util - banda) // 2
    borda = max(1, round(6.0 * PPMM * sl_util / (TRIM_L * PPMM)))

    def mediana(lin, xi, xf, c):
        v = sorted(lin[x * canais + c] for x in range(xi, xf))
        return v[len(v) // 2]

    print("a compor…", flush=True)
    saida = []
    for d in range(da):
        lin = linhas[filas[d]]

        desenho = bytearray()
        for a, b in fatias:
            desenho += lin[a:b]
        if canais == 4:                       # deitar fora o alfa
            desenho = bytearray(b for i, b in enumerate(desenho) if i % 4 != 3)

        desloc = [mediana(lin, cx0, cx0 + borda, c)
                  - mediana(lin, banda_ini, banda_ini + banda, c) for c in range(3)]
        pedaco = bytearray()
        for x in range(banda_ini, banda_ini + banda):
            o = x * canais
            for c in range(3):
                v = lin[o + c] + desloc[c]
                pedaco.append(0 if v < 0 else (255 if v > 255 else v))

        # a junta: a tira apaga-se enquanto o desenho aparece
        for i in range(FADE):
            t = (i + 1) / (FADE + 1)
            for c in range(3):
                a_ = pedaco[(tira + i) * 3 + c]
                b_ = desenho[i * 3 + c]
                desenho[i * 3 + c] = int(a_ * (1 - t) + b_ * t)

        # e a sangria da direita, que é aparada e por isso basta espelhar
        sobra = LARG - x1
        espelho = bytearray()
        for i in range(1, sobra + 1):
            o = len(desenho) - 3 * i
            espelho += desenho[o:o + 3]

        saida.append(pedaco[:tira * 3] + desenho + espelho)
        if d % 500 == 0:
            print(f"  linha {d}/{da}", flush=True)

    # a sangria de cima e de baixo: espelhada, que também é aparada
    # cópias, e não referências: o véu é aplicado no sítio e uma linha
    # partilhada entre a sangria e o desenho apanhava-o duas vezes.
    saida = ([bytearray(saida[min(da - 1, y0 - i)]) for i in range(y0)] + saida
             + [bytearray(saida[max(0, da - 1 - i)]) for i in range(ALT - y1)])

    k = clarear()
    print(f"a aplicar o véu do --clarear ({k})…", flush=True)
    veu(saida, k)

    print("a escrever…", flush=True)
    escrever_png(SAIDA, LARG, ALT, saida)
    print(f"escrito {SAIDA} — {os.path.getsize(SAIDA) // 1024} KB, {LARG} × {ALT} px")

    escrever_png(CAPA, LARG, ALT, capa(saida, LARG, ALT, PPMM))
    print(f"escrito {CAPA} — {os.path.getsize(CAPA) // 1024} KB")

    jpeg()


# ---------------------------------------------------------------------------
#  E depois passa-se a JPEG, que não é gosto — é obrigação
# ---------------------------------------------------------------------------

def jpeg():
    """O HTML aponta ao JPEG e não ao PNG. Ver a nota no LEIA-ME.

    Em resumo: o `Page.printToPDF` do Chrome **bloqueia indefinidamente** com um
    PNG grande de fundo. Não devolve erro, não gasta CPU, fica pendurado. Medido
    aqui, com este pergaminho:

        PNG 2551 × 3579   pendura
        PNG 1274 × 1800   pendura
        PNG  636 ×  900   imprime em 4 s
        JPEG 2551 × 3579  imprime em 4 s

    O mesmo se passa com o `origem/fundo-ementa.png` e o A4, portanto não é
    coisa deste ficheiro nem do encolhimento: é o PNG. A qualidade fica em 95,
    que num pergaminho fotografado não se distingue do original e ainda deixa o
    ficheiro em menos de um terço.
    """
    if subprocess.run(["which", "sips"], capture_output=True).returncode:
        raise SystemExit("falta o `sips` — é do macOS e é ele que escreve o JPEG")
    for origem, destino in ((SAIDA, SAIDA_JPG), (CAPA, CAPA_JPG)):
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "95",
                        "--out", destino, origem],
                       check=True, capture_output=True)
        print(f"escrito {destino} — {os.path.getsize(destino) // 1024} KB "
              f"(é este que o HTML usa)")


if __name__ == "__main__":
    main()
