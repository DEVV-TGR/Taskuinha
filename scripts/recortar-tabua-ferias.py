"""
Tira o xadrez desenhado da tábua das férias.

O `public/images/imagem_ferias.jpg` é um PNG 800×800 com canal alfa, mas o
xadrez cinzento e branco que "mostra" a transparência está **pintado** no
ficheiro — alfa 255 em toda a parte. Por cima do breu do Hero apareceria um
quadrado de xadrez à volta da tábua.

## Como se distingue o xadrez do resto

Não é pela cor sozinha: as correntes são cinzentas e têm reflexos claros.
É pela cor **no sítio certo**. O xadrez são casas de 20px, exactamente 235
e 255, alternadas; para cada píxel sabe-se que cor o xadrez teria ali. Um
píxel só sai se:

1. tiver essa cor (±4, e neutro — sem puxar a castanho), e
2. estiver ligado à margem da imagem por outros píxeis assim, **ou** fizer
   parte de uma mancha grande (o vão dentro de um elo da corrente, que o
   metal fecha e a margem não alcança).

Depois, uma orla de um píxel à volta do recorte: os píxeis claros e neutros
que tocam no fundo apagado são a mistura anti-aliased com o xadrez, e ficam
meio transparentes em vez de fazerem um contorno branco.

Uso: python3 scripts/recortar-tabua-ferias.py
"""

from collections import deque

from PIL import Image, ImageFilter

ORIGEM = "public/images/imagem_ferias.jpg"
DESTINO = "public/images/tabua-ferias.webp"

CASA = 20
TOLERANCIA = 4
MANCHA_MINIMA = 12

im = Image.open(ORIGEM).convert("RGB")
L, A = im.size
px = im.load()


def neutro(p):
    return max(p) - min(p) <= 3


def fase():
    """O desvio (dx, dy) das casas, e qual das duas cores cai na casa par."""
    melhor = None
    amostra = [(x, y) for x in range(L) for y in list(range(40)) + list(range(A - 40, A))]
    for dx in range(CASA):
        for dy in range(CASA):
            for par in (235, 255):
                impar = 490 - par
                certos = 0
                for x, y in amostra[::7]:
                    esperado = par if ((x + dx) // CASA + (y + dy) // CASA) % 2 == 0 else impar
                    if abs(px[x, y][0] - esperado) <= TOLERANCIA:
                        certos += 1
                if melhor is None or certos > melhor[0]:
                    melhor = (certos, dx, dy, par)
    return melhor[1:]


dx, dy, par = fase()


def perto_da_fronteira(v, desvio):
    resto = (v + desvio) % CASA
    return resto <= 1 or resto >= CASA - 2


def e_xadrez(x, y):
    p = px[x, y]
    if not neutro(p):
        return False
    # Na fronteira entre duas casas a compressão misturou as duas cores, e
    # o píxel pode ter qualquer valor entre elas.
    if perto_da_fronteira(x, dx) or perto_da_fronteira(y, dy):
        return 235 - TOLERANCIA <= p[0] <= 255
    esperado = par if ((x + dx) // CASA + (y + dy) // CASA) % 2 == 0 else 490 - par
    return abs(p[0] - esperado) <= TOLERANCIA


candidato = [[e_xadrez(x, y) for y in range(A)] for x in range(L)]
fundo = [[False] * A for _ in range(L)]
visto = [[False] * A for _ in range(L)]


def mancha(x0, y0):
    fila = deque([(x0, y0)])
    visto[x0][y0] = True
    pontos = []
    toca_margem = False
    while fila:
        x, y = fila.popleft()
        pontos.append((x, y))
        if x in (0, L - 1) or y in (0, A - 1):
            toca_margem = True
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < L and 0 <= ny < A and not visto[nx][ny] and candidato[nx][ny]:
                visto[nx][ny] = True
                fila.append((nx, ny))
    return pontos, toca_margem


for x in range(L):
    for y in range(A):
        if candidato[x][y] and not visto[x][y]:
            pontos, toca_margem = mancha(x, y)
            if toca_margem or len(pontos) >= MANCHA_MINIMA:
                for a, b in pontos:
                    fundo[a][b] = True

alfa = Image.new("L", (L, A), 255)
pa = alfa.load()
for x in range(L):
    for y in range(A):
        if fundo[x][y]:
            pa[x, y] = 0

# A orla: claro e neutro, encostado ao fundo → meio transparente.
for x in range(L):
    for y in range(A):
        if fundo[x][y]:
            continue
        p = px[x, y]
        if min(p) < 190 or max(p) - min(p) > 12:
            continue
        vizinhos = [
            fundo[nx][ny]
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))
            if 0 <= nx < L and 0 <= ny < A
        ]
        if any(vizinhos):
            # Quase branco é quase só xadrez; o resto é mais metade madeira.
            pa[x, y] = 0 if min(p) >= 225 else 90

alfa = alfa.filter(ImageFilter.GaussianBlur(0.5))

saida = im.convert("RGBA")
saida.putalpha(alfa)
saida = saida.crop(saida.getbbox())
saida.save(DESTINO, "WEBP", quality=90, method=6)
print(f"fase dx={dx} dy={dy} par={par} · {saida.size[0]}×{saida.size[1]} → {DESTINO}")
