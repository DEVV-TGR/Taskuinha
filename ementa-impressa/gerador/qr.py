# -*- coding: utf-8 -*-
"""
Um codificador de QR code, do tamanho exacto do problema.

Serve **dois** casos, e só esses: o endereço do site na contracapa da ementa e
o endereço da ementa no cartão de mesa. Trinta e poucos caracteres ASCII,
sempre os mesmos, gerados uma vez por cada geração do papel.

## Porquê aqui dentro e não uma biblioteca

O `LEIA-ME.md` diz, duas vezes, que não entra nada no `package.json` — e o
mesmo vale para o Python: o gerador corre com o que a máquina já tem. Não há
`segno` nem `qrcode` instalados. E ir buscar a imagem a um serviço online era
pior ainda: o gerador deixava de correr sem rede e deixava de dar sempre o
mesmo ficheiro.

Um QR de versão fixa é umas duzentas linhas. Ficam aqui.

## As escolhas, e a razão de cada uma

**Correcção Q, nas duas versões.** Corrige até 25% dos módulos — mais que o M
(15%), que era o que bastaria num ecrã. Isto vai para papel, que se dobra, se
molha e apanha gordura, e é impresso sobre um pergaminho texturado. A folga é
de propósito.

**A versão pede-se, não se adivinha.** Este ficheiro não é uma biblioteca de
QR: são os dois QR desta casa. O `codificar` leva a versão como argumento e
**pára** se o texto não couber nela — não sobe sozinho. Subir de versão muda o
número de módulos e portanto o tamanho de cada um no papel, que é uma decisão
para se tomar a olhar para a folha e com o telemóvel na mão.

Estão aqui as duas versões de que a casa precisa, e é onde a tabela pára:

    versão 3 (29x29)  →  32 bytes   `https://www.taskuinhapirata.pt` tem 30
    versão 4 (33x33)  →  46 bytes   o mesmo com `/ementa` atrás tem 37

A versão 4 entrou por causa do cartão de mesa: o endereço da ementa é sete
caracteres mais comprido que o da casa e não cabia na 3. Foi a razão de este
ficheiro deixar de ter uma versão só — e as duas param na 6, porque a partir
da 7 a norma manda escrever também os bits da versão em dois cantos, que é
código que não existe aqui e não se escreve por antecipação.

**Pára em vez de improvisar.** Um QR que não lê só se descobre depois de
impresso, com mil folhas na gráfica. Todas as verificações aqui levantam
excepção; nenhuma tenta remediar.
"""

import collections

_Versao = collections.namedtuple(
    "_Versao", "numero lado capacidade blocos dados paridade alinhamento")

#  numero  lado  capacidade  blocos  dados  paridade  alinhamento
#
#  `capacidade` é em bytes, modo byte, correcção Q: os bytes de dados menos os
#  dois do cabeçalho (quatro bits de modo e oito de comprimento). `dados` e
#  `paridade` são por bloco, e nestas duas versões os blocos são todos iguais —
#  a partir da 5-Q deixam de ser, e `_entrelacar` teria de saber disso.
#
#  `alinhamento` é o centro do único padrão de alinhamento que estas versões
#  têm. Da 7 em diante são vários, numa grelha.
VERSOES = {
    3: _Versao(3, 29, 32, 2, 17, 18, 22),
    4: _Versao(4, 33, 46, 2, 24, 26, 26),
}

PADRAO = VERSOES[3]     # a da ementa, que foi a primeira e continua a ser


# ---------- GF(256), o campo onde o Reed-Solomon vive ----------
#
# Aritmética módulo o polinómio 0x11d, que é o que a norma do QR manda.
# As duas tabelas trocam multiplicação por soma de logaritmos: sem elas cada
# produto era um ciclo, e há uns milhares deles.

_EXP = [0] * 512
_LOG = [0] * 256
_x = 1
for _i in range(255):
    _EXP[_i] = _x
    _LOG[_x] = _i
    _x <<= 1
    if _x & 0x100:
        _x ^= 0x11D
for _i in range(255, 512):
    _EXP[_i] = _EXP[_i - 255]


def _mul(a, b):
    if a == 0 or b == 0:
        return 0
    return _EXP[_LOG[a] + _LOG[b]]


def _polinomio_gerador(grau):
    """(x - 2^0)(x - 2^1)...(x - 2^(grau-1)), expandido."""
    g = [1]
    for i in range(grau):
        g = _multiplicar_polinomios(g, [1, _EXP[i]])
    return g


def _multiplicar_polinomios(a, b):
    r = [0] * (len(a) + len(b) - 1)
    for i, ca in enumerate(a):
        for j, cb in enumerate(b):
            r[i + j] ^= _mul(ca, cb)
    return r


def _paridade(dados, quantos):
    """Os bytes de correcção de erro: o resto da divisão pelo gerador."""
    gerador = _polinomio_gerador(quantos)
    resto = list(dados) + [0] * quantos
    for i in range(len(dados)):
        coef = resto[i]
        if coef == 0:
            continue
        for j, g in enumerate(gerador):
            resto[i + j] ^= _mul(g, coef)
    return resto[len(dados):]


# ---------- os bits: modo, comprimento, texto, enchimento ----------

def _bits_de_dados(texto, v):
    bytes_ = texto.encode("ascii")          # o URL é ASCII; ver `codificar`
    if len(bytes_) > v.capacidade:
        raise ValueError(
            "O texto tem %d bytes e a versão %d-Q só leva %d.\n"
            "Não se sobe a versão sozinha: o QR muda de tamanho na folha e "
            "isso é uma decisão de desenho — ver o cabeçalho deste ficheiro."
            % (len(bytes_), v.numero, v.capacidade)
        )

    bits = []

    def junta(valor, quantos):
        for k in range(quantos - 1, -1, -1):
            bits.append((valor >> k) & 1)

    junta(0b0100, 4)              # modo byte
    junta(len(bytes_), 8)         # comprimento (8 bits nas versões 1 a 9)
    for b in bytes_:
        junta(b, 8)

    total = v.blocos * v.dados * 8
    junta(0, min(4, total - len(bits)))     # terminador
    while len(bits) % 8:                    # alinhar ao byte
        bits.append(0)

    # Enchimento: 0xEC e 0x11 à vez, até encher a capacidade.
    enchimentos = (0xEC, 0x11)
    i = 0
    while len(bits) < total:
        junta(enchimentos[i % 2], 8)
        i += 1

    return [int("".join(str(b) for b in bits[i:i + 8]), 2)
            for i in range(0, len(bits), 8)]


def _entrelacar(bytes_dados, v):
    """Os blocos alternam byte a byte — é assim que um borrão se reparte.

    Nas versões 3 e 4 os blocos são todos do mesmo tamanho, e é por isso que
    isto é uma fatia regular. A partir da 5-Q a norma reparte os dados por dois
    grupos com um byte de diferença, e aí este `for` deixa de servir — é a
    segunda razão, além dos bits de versão, para a tabela parar onde pára.
    """
    blocos = [bytes_dados[i * v.dados:(i + 1) * v.dados]
              for i in range(v.blocos)]
    paridades = [_paridade(b, v.paridade) for b in blocos]

    saida = []
    for i in range(v.dados):
        for b in blocos:
            saida.append(b[i])
    for i in range(v.paridade):
        for p in paridades:
            saida.append(p[i])
    return saida


# ---------- a grelha ----------

def _grelha_vazia(v):
    # None = ainda por preencher; distingue-se de um módulo branco (False),
    # e é isso que diz ao percurso onde pode escrever.
    return [[None] * v.lado for _ in range(v.lado)]


def _por_fixos(m, v):
    LADO = v.lado
    ALINHAMENTO = v.alinhamento

    def finder(lin, col):
        # O quadrado de 7x7 mais o separador branco de um módulo à volta.
        # O separador conta: sem ele o olho do leitor não fecha o canto, e a
        # tentação de escrever `i in (0, 6) or j in (0, 6)` acende a linha
        # inteira, separador incluído.
        for i in range(-1, 8):
            for j in range(-1, 8):
                y, x = lin + i, col + j
                if not (0 <= y < LADO and 0 <= x < LADO):
                    continue
                dentro = 0 <= i <= 6 and 0 <= j <= 6
                borda = dentro and (i in (0, 6) or j in (0, 6))
                miolo = 2 <= i <= 4 and 2 <= j <= 4
                m[y][x] = borda or miolo

    finder(0, 0)
    finder(0, LADO - 7)
    finder(LADO - 7, 0)

    # Alinhamento: 5x5, anel cheio à volta de um centro cheio.
    for i in range(-2, 3):
        for j in range(-2, 3):
            m[ALINHAMENTO + i][ALINHAMENTO + j] = max(abs(i), abs(j)) != 1

    # Temporização: a alternância que dá a escala ao leitor.
    for i in range(8, LADO - 8):
        m[6][i] = m[i][6] = (i % 2 == 0)

    # O módulo escuro, sempre aceso, sempre no mesmo sítio.
    m[LADO - 8][8] = True

    # Reservar as duas cópias da informação de formato.
    for i in range(9):
        if m[8][i] is None:
            m[8][i] = False
        if m[i][8] is None:
            m[i][8] = False
    for i in range(8):
        m[8][LADO - 1 - i] = False
        m[LADO - 1 - i][8] = False


def _percurso(m, bytes_finais, v):
    """Duas colunas de cada vez, da direita para a esquerda, aos ziguezagues."""
    LADO = v.lado
    bits = []
    for b in bytes_finais:
        for k in range(7, -1, -1):
            bits.append((b >> k) & 1)

    i = 0
    col = LADO - 1
    subir = True
    while col > 0:
        if col == 6:        # a coluna de temporização não conta
            col -= 1
        linhas = range(LADO - 1, -1, -1) if subir else range(LADO)
        for lin in linhas:
            for c in (col, col - 1):
                if m[lin][c] is None:
                    m[lin][c] = bool(bits[i]) if i < len(bits) else False
                    i += 1
        col -= 2
        subir = not subir


def _mascarar(m, fixos, padrao, v):
    LADO = v.lado
    regras = (
        lambda y, x: (y + x) % 2 == 0,
        lambda y, x: y % 2 == 0,
        lambda y, x: x % 3 == 0,
        lambda y, x: (y + x) % 3 == 0,
        lambda y, x: (y // 2 + x // 3) % 2 == 0,
        lambda y, x: (y * x) % 2 + (y * x) % 3 == 0,
        lambda y, x: ((y * x) % 2 + (y * x) % 3) % 2 == 0,
        lambda y, x: ((y + x) % 2 + (y * x) % 3) % 2 == 0,
    )
    regra = regras[padrao]
    saida = [linha[:] for linha in m]
    for y in range(LADO):
        for x in range(LADO):
            if not fixos[y][x] and regra(y, x):
                saida[y][x] = not saida[y][x]
    return saida


def _penalizacao(m):
    """As quatro regras da norma. Menos pontos, melhor máscara."""
    LADO = len(m)
    total = 0

    # 1. corridas de cinco ou mais da mesma cor
    for linhas in (m, list(zip(*m))):
        for linha in linhas:
            corrida, anterior = 1, linha[0]
            for celula in linha[1:]:
                if celula == anterior:
                    corrida += 1
                else:
                    if corrida >= 5:
                        total += 3 + (corrida - 5)
                    corrida, anterior = 1, celula
            if corrida >= 5:
                total += 3 + (corrida - 5)

    # 2. quadrados 2x2 de uma cor só
    for y in range(LADO - 1):
        for x in range(LADO - 1):
            if m[y][x] == m[y][x + 1] == m[y + 1][x] == m[y + 1][x + 1]:
                total += 3

    # 3. o padrão que se parece com um finder
    alvo = [True, False, True, True, True, False, True,
            False, False, False, False]
    for linhas in (m, list(zip(*m))):
        for linha in linhas:
            linha = list(linha)
            for i in range(LADO - 10):
                janela = linha[i:i + 11]
                if janela == alvo or janela == alvo[::-1]:
                    total += 40

    # 4. desequilíbrio entre escuro e claro
    escuros = sum(sum(1 for c in linha if c) for linha in m)
    proporcao = escuros * 100 // (LADO * LADO)
    total += 10 * min(abs(proporcao - 50) // 5, abs(proporcao - 50 + 4) // 5)

    return total


def _por_formato(m, padrao):
    """Correcção Q (0b11) + máscara: BCH(15,5) e depois a máscara 0x5412.

    As duas cópias existem para o código continuar a ler com um dos cantos
    estragado.

    **O bit mais significativo é o primeiro a assentar**, em (8,0). Ao
    contrário dá uma grelha que parece um QR perfeito, passa em qualquer
    verificação de «o valor está certo» — e não lê. Foi assim que esta
    função esteve escrita até se comparar módulo a módulo com o gerador do
    macOS: os 841 módulos batiam certo menos oito, e os oito eram estes.
    """
    LADO = len(m)
    dados = (0b11 << 3) | padrao
    valor = dados << 10
    while valor.bit_length() >= 11:
        valor ^= 0b10100110111 << (valor.bit_length() - 11)
    formato = (((dados << 10) | valor) ^ 0b101010000010010)

    def bit(i):
        return bool((formato >> (14 - i)) & 1)

    # Primeira cópia: à volta do finder de cima à esquerda.
    for i in range(6):
        m[8][i] = bit(i)
    m[8][7] = bit(6)
    m[8][8] = bit(7)
    m[7][8] = bit(8)
    for i in range(9, 15):
        m[14 - i][8] = bit(i)

    # Segunda cópia: repartida pelos outros dois cantos.
    #
    # **Sete módulos na coluna e oito na linha, e não oito e sete.** O módulo
    # escuro fica em (LADO-8, 8), que é logo a seguir aos sete da coluna: com
    # oito, o bit 7 era escrito lá e apagado pelo módulo escuro na linha
    # seguinte, e a casa dele na linha 8 — a coluna LADO-8 — ficava no False
    # com que `_por_fixos` a reservou.
    #
    # Esteve assim desde o princípio e **não se via na versão 3**: com a máscara
    # que ela escolhe, o bit 7 calha ser zero, e um zero por escrever é igual a
    # um zero escrito. Na versão 4 a máscara é outra, o bit 7 é um, e o módulo
    # apareceu à primeira comparação com o gerador do macOS. É a segunda vez que
    # esta função engana uma verificação interna e só cai à frente de um leitor.
    for i in range(7):
        m[LADO - 1 - i][8] = bit(i)
    for i in range(7, 15):
        m[8][LADO - 15 + i] = bit(i)

    m[LADO - 8][8] = True       # o módulo escuro, que a máscara não apaga


def codificar(texto, versao=3):
    """O texto em matriz de booleanos, `True` = módulo escuro.

    Sem zona de silêncio: quem desenha é que sabe quanta margem tem. O `svg`
    aqui em baixo acrescenta os quatro módulos que a norma pede.

    A `versao` é um argumento e não uma adivinha: ver o cabeçalho.
    """
    if versao not in VERSOES:
        raise ValueError(
            "Versão %r desconhecida. Estão aqui as %s, que são as que a casa "
            "usa — acrescentar outra é acrescentar uma linha à tabela e "
            "conferir que os blocos dela são todos do mesmo tamanho."
            % (versao, " e as ".join(str(n) for n in sorted(VERSOES)))
        )
    v = VERSOES[versao]

    try:
        texto.encode("ascii")
    except UnicodeEncodeError:
        raise ValueError(
            "Este codificador só leva ASCII — o comprimento em modo byte "
            "conta bytes, e um acento passaria a valer dois. O endereço do "
            "site não tem acentos; se um dia tiver, isto é para rever."
        )

    m = _grelha_vazia(v)
    _por_fixos(m, v)
    fixos = [[c is not None for c in linha] for linha in m]

    _percurso(m, _entrelacar(_bits_de_dados(texto, v), v), v)

    melhor, melhor_pontos = None, None
    for padrao in range(8):
        candidato = _mascarar(m, fixos, padrao, v)
        _por_formato(candidato, padrao)
        pontos = _penalizacao(candidato)
        if melhor_pontos is None or pontos < melhor_pontos:
            melhor, melhor_pontos = candidato, pontos

    if len(melhor) != v.lado or any(len(l) != v.lado for l in melhor):
        raise AssertionError("A matriz não saiu %dx%d." % (v.lado, v.lado))
    if any(c is None for l in melhor for c in l):
        raise AssertionError("Ficaram módulos por preencher.")

    return [[bool(c) for c in linha] for linha in melhor]


# ---------------------------------------------------------------------------
#  De matriz a folha: o SVG, e o endereço de onde ele sai
# ---------------------------------------------------------------------------
#
#  Estas duas viveram no `montar.py` enquanto a ementa era a única coisa com um
#  QR. O cartão de mesa é a segunda, e quem tem duas fontes de verdade acaba com
#  duas — por isso mudaram-se para aqui, ao pé do codificador, e o `montar.py`
#  passou a chamá-las.

import html as _html
import os as _os
import re as _re

_RAIZ = _os.path.dirname(_os.path.dirname(
    _os.path.dirname(_os.path.abspath(__file__))))


def endereco_do_site():
    """O `url:` do `lib/site.ts`, que é a única morada escrita do projecto.

    Vem de lá pela mesma razão que os preços vêm do `data/ementa.json`: uma
    cópia transcrita envelhece sozinha, e um endereço errado no papel não se
    corrige depois de impresso.

    O `lib/site.ts` explica lá porque é que o valor leva `www.`: o domínio sem
    ele responde 308 para o `www`, portanto o `www` é a morada e não o atalho.
    Mandar mil ementas apontar para o redireccionamento era mandar toda a gente
    dar uma volta antes de chegar.
    """
    caminho = _os.path.join(_RAIZ, "lib", "site.ts")
    m = _re.search(r'^\s*url:\s*"([^"]+)"',
                   open(caminho, encoding="utf-8").read(), _re.M)
    if not m:
        raise SystemExit(
            "Não encontrei o `url:` no lib/site.ts.\n"
            "O endereço dos QR sai de lá e de mais lado nenhum — se o ficheiro "
            "mudou de forma, é para actualizar aqui, não para escrever o "
            "endereço à mão."
        )
    return m.group(1)


def svg(texto, lado_mm, silencio=4, versao=3, classe="qr-codigo"):
    """O QR em SVG, vector, sem fundo — o pergaminho passa por baixo.

    A **zona de silêncio** de quatro módulos entra no `viewBox` em vez de ser
    margem em CSS: é parte do código, não do espaçamento da folha, e sobre um
    fundo texturado é ela que faz a diferença entre ler e não ler.

    **O `lado_mm` é o do SVG inteiro, zona de silêncio incluída.** O quadrado
    escuro que se vê na folha é menor — na versão 3 são 29 dos 37 módulos, ou
    seja quatro quintos. Quem lê a zona de silêncio como se fosse margem
    engana-se em quase um quinto do tamanho, e só dá por isso com o papel na
    mão.

    Um `<path>` só, e não um `<rect>` por módulo: são umas quatrocentas formas,
    e o Chrome escreve-as todas no stream do PDF.
    """
    grelha = codificar(texto, versao)
    n = len(grelha)
    partes = []
    for y, linha in enumerate(grelha):
        x = 0
        while x < n:
            if linha[x]:
                largura = 1
                while x + largura < n and linha[x + largura]:
                    largura += 1
                partes.append("M%d %dh%dv1h-%dz" % (x + silencio, y + silencio,
                                                    largura, largura))
                x += largura
            else:
                x += 1
    lado = n + 2 * silencio
    return (
        '<svg class="%s" viewBox="0 0 %d %d" width="%smm" '
        'height="%smm" shape-rendering="crispEdges" role="img" '
        'aria-label="%s"><path d="%s" fill="currentColor"></path></svg>'
        % (classe, lado, lado, lado_mm, lado_mm,
           _html.escape(texto), "".join(partes))
    )


if __name__ == "__main__":
    # Escreve um PNG para se poder apontar o telemóvel ao ecrã. É o único
    # teste que conta: uma matriz pode estar certa em todas as verificações
    # internas e na mesma não ler, porque o que lê é um leitor.
    #
    #     python3 qr.py [endereço] [saida.png] [versão]
    #
    # Sem argumentos escreve o da contracapa. O do cartão de mesa é
    #
    #     python3 qr.py "$(python3 -c 'import qr; print(qr.endereco_do_site())')/ementa" \
    #                   qr-mesa.png 4
    #
    import struct, sys, zlib

    alvo = sys.argv[1] if len(sys.argv) > 1 else endereco_do_site()
    saida = sys.argv[2] if len(sys.argv) > 2 else "qr.png"
    versao = int(sys.argv[3]) if len(sys.argv) > 3 else 3

    grelha = codificar(alvo, versao)
    LADO = len(grelha)
    escala, silencio = 12, 4
    px = (LADO + 2 * silencio) * escala

    def modulo(y, x):
        y, x = y // escala - silencio, x // escala - silencio
        return 0 <= y < LADO and 0 <= x < LADO and grelha[y][x]

    linhas = b"".join(
        bytes([0]) + bytes(0 if modulo(y, x) else 255 for x in range(px))
        for y in range(px)
    )

    def bloco(tipo, dados):
        corpo = tipo + dados
        return (struct.pack(">I", len(dados)) + corpo
                + struct.pack(">I", zlib.crc32(corpo)))

    with open(saida, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(bloco(b"IHDR", struct.pack(">IIBBBBB", px, px, 8, 0, 0, 0, 0)))
        f.write(bloco(b"IDAT", zlib.compress(linhas, 9)))
        f.write(bloco(b"IEND", b""))

    print("%s  ->  %s (%dx%d)" % (alvo, saida, px, px))
