# -*- coding: utf-8 -*-
"""
O último passo do que vai para a gráfica: CMYK e as caixas de corte.

    python3 ementa-impressa/gerador/grafica.py

Lê os dois PDF que o Chrome escreveu — o `ementa-grafica-capa.pdf` e o
`ementa-grafica-miolo.pdf` — e escreve o `ementa-impressa/ementa-grafica-cmyk.pdf`,
que é o ficheiro que se envia.

Faz três coisas. A primeira é do Chrome e as outras duas saem do
`origem/guia-360imprimir.pdf`:

**0. Junta a capa ao miolo.** Vêm separados porque o `printToPDF` bloqueia com
mais do que uma imagem grande no mesmo documento — a nota está no
`montar.py`. Juntam-se aqui, na mesma passagem do `gs` que já corria para a
cor, portanto não custa uma recodificação a mais.

**1. Converte para CMYK com perfil.** O guia diz que um ficheiro em RGB «será
convertido automaticamente, o que poderá gerar variações inesperadas de cores»,
e pede FOGRA39 ou ISO Coated v2 ECI. Converter cá é escolher o resultado em vez
de o receber: o pergaminho é um castanho quente e é exactamente o género de cor
que uma conversão automática desmancha. O perfil procura-se onde o sistema o
costuma ter — ver `PERFIS` — e o gerador **pára** se não encontrar nenhum, que
é melhor do que converter para um CMYK genérico sem ninguém dar por isso.

**2. Escreve a TrimBox, a BleedBox e a ArtBox.** A folha tem 216 × 303 mm e o
produto tem 210 × 297: os 3 mm que sobram de cada lado são sangria e vão ser
aparados. Sem estas caixas isso é uma convenção que se espera que a gráfica
adivinhe pelas medidas; com elas está escrito no ficheiro. O Ghostscript não as
escreve — o `pdfwrite` só as passa se já vierem da entrada, e o Chrome não as
põe — por isso acrescentam-se aqui, numa **actualização incremental**: o PDF
que o `gs` escreveu não se toca, e vai atrás dele uma secção nova com as
páginas corrigidas. É a forma que a norma prevê para acrescentar sem reescrever.

A resolução, as fontes e a sangria já vêm certas de trás e não se mexem aqui:
300 DPI vêm do `fundo.py`, as fontes vão embebidas desde o `fontes.css`, e os
216 × 303 mm são a `@page` do `montar.py --grafica`.
"""

import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(AQUI)
CAPA = os.path.join(BASE, "ementa-grafica-capa.pdf")
MIOLO = os.path.join(BASE, "ementa-grafica-miolo.pdf")
SAIDA = os.path.join(BASE, "ementa-grafica-cmyk.pdf")

SANGRIA_PT = 3.0 / 25.4 * 72        # os 3 mm, em pontos
TRIM_PT = (210.0 / 25.4 * 72, 297.0 / 25.4 * 72)

# Por ordem de preferência: os dois que o guia nomeia, e só depois o genérico
# do sistema — que serve para provar, não para mandar imprimir.
PERFIS = [
    "/Library/Application Support/Adobe/Color/Profiles/Recommended/CoatedFOGRA39.icc",
    "/Library/Application Support/Adobe/Color/Profiles/CoatedFOGRA39.icc",
    "/Library/Application Support/Adobe/Color/Profiles/Recommended/ISOcoated_v2_eci.icc",
    os.path.expanduser("~/Library/ColorSync/Profiles/ISOcoated_v2_eci.icc"),
    "/Library/ColorSync/Profiles/ISOcoated_v2_eci.icc",
]


def perfil():
    for p in PERFIS:
        if os.path.exists(p):
            return p
    raise SystemExit(
        "não há perfil CMYK à mão.\n"
        "O guia da gráfica pede FOGRA39 ou ISO Coated v2 ECI. O FOGRA39 vem com "
        "qualquer Adobe instalado, em\n"
        "  /Library/Application Support/Adobe/Color/Profiles/Recommended/\n"
        "e o ISO Coated v2 ECI descarrega-se de graça em eci.org.\n"
        "Não se converte para o CMYK genérico do sistema: o pergaminho é um "
        "castanho quente e sai de lá com outra cor.")


def converter(icc):
    print(f"a converter para CMYK com {os.path.basename(icc)}…", flush=True)
    subprocess.run([
        "gs",
        # O `-dSAFER` do Ghostscript 10 não deixa ler nada fora da pasta de
        # trabalho, e o perfil está em `/Library`. Sem esta licença explícita
        # o `gs` morre com um «Permission denied» que não diz de quê.
        f"--permit-file-read={icc}",
        "-dSAFER", "-dBATCH", "-dNOPAUSE", "-dQUIET",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",     # sem xref em stream: as caixas entram a seguir
        "-dAutoRotatePages=/None",
        "-sColorConversionStrategy=CMYK",
        "-dOverrideICC=true",
        f"-sOutputICCProfile={icc}",
        "-dEmbedAllFonts=true", "-dSubsetFonts=true",
        "-dDownsampleColorImages=false",       # 300 DPI ficam 300 DPI
        "-dDownsampleGrayImages=false",
        "-dDownsampleMonoImages=false",
        "-dColorImageFilter=/FlateEncode",     # sem JPEG por cima do pergaminho
        "-dGrayImageFilter=/FlateEncode",
        f"-sOutputFile={SAIDA}", CAPA, MIOLO,      # a ordem é a da leitura
    ], check=True)


# ---------------------------------------------------------------------------
#  As caixas, por actualização incremental
# ---------------------------------------------------------------------------

def dicionario(d, i):
    """Devolve o fim do dicionário que começa em `i` (onde está o `<<`)."""
    n = 0
    while i < len(d):
        if d[i:i + 2] == b"<<":
            n += 1; i += 2
        elif d[i:i + 2] == b">>":
            n -= 1; i += 2
            if n == 0:
                return i
        elif d[i:i + 1] == b"(":                 # saltar cadeias
            i += 1; fuga = 0
            while i < len(d):
                c = d[i:i + 1]
                if fuga: fuga = 0
                elif c == b"\\": fuga = 1
                elif c == b")": break
                i += 1
            i += 1
        else:
            i += 1
    raise SystemExit("dicionário sem fim — o PDF não está como se esperava")


def caixas():
    d = open(SAIDA, "rb").read()

    x0, y0 = SANGRIA_PT, SANGRIA_PT
    x1, y1 = SANGRIA_PT + TRIM_PT[0], SANGRIA_PT + TRIM_PT[1]
    trim = f"[{x0:.5f} {y0:.5f} {x1:.5f} {y1:.5f}]".encode()
    media = re.search(rb"/MediaBox\s*\[([^\]]*)\]", d)
    if not media:
        raise SystemExit("o PDF não declara MediaBox")
    largura, altura = [float(v) for v in media.group(1).split()][2:4]
    if abs(largura - x1 - SANGRIA_PT) > 1 or abs(altura - y1 - SANGRIA_PT) > 1:
        raise SystemExit(f"a folha mede {largura / 72 * 25.4:.1f} × "
                         f"{altura / 72 * 25.4:.1f} mm e devia medir 216 × 303")

    novos = []
    for m in re.finditer(rb"(\d+)\s+(\d+)\s+obj\s*(<<)", d):
        fim = dicionario(d, m.start(3))
        corpo = d[m.start(3):fim]
        if b"/Type" not in corpo or not re.search(rb"/Type\s*/Page\b", corpo):
            continue
        if b"/TrimBox" in corpo:
            continue
        dentro = (corpo[:2] + b"\n/TrimBox " + trim
                  + b"\n/BleedBox [0 0 %s %s]" % (f"{largura:.5f}".encode(),
                                                  f"{altura:.5f}".encode())
                  + b"\n/ArtBox " + trim + b"\n" + corpo[2:])
        novos.append((int(m.group(1)), int(m.group(2)), dentro))

    if len(novos) != 16:
        print(f"  atenção: {len(novos)} páginas, e deviam ser 16")
    if not novos:
        print("  as caixas já lá estavam")
        return

    inicio = d.rfind(b"startxref")
    if inicio < 0:
        raise SystemExit("PDF sem startxref")
    anterior = int(d[inicio + 9:].split()[0])
    fim_trailer = d.rfind(b"trailer", 0, inicio)
    if fim_trailer < 0:
        raise SystemExit("PDF com xref em stream — gerar com -dCompatibilityLevel=1.4")
    t0 = d.index(b"<<", fim_trailer)
    trailer = d[t0:dicionario(d, t0)]
    trailer = re.sub(rb"/Prev\s+\d+", b"", trailer)

    saida = bytearray(d)
    if not saida.endswith(b"\n"):
        saida += b"\n"
    posicoes = {}
    for num, ger, corpo in novos:
        posicoes[num] = len(saida)
        saida += b"%d %d obj\n" % (num, ger) + corpo + b"\nendobj\n"

    novo_xref = len(saida)
    saida += b"xref\n"
    for num in sorted(posicoes):                 # uma subsecção por objecto
        saida += b"%d 1\n" % num
        saida += b"%010d 00000 n \n" % posicoes[num]
    saida += (b"trailer\n" + trailer[:-2]
              + b"\n/Prev %d\n>>\nstartxref\n%d\n%%%%EOF\n" % (anterior, novo_xref))

    open(SAIDA, "wb").write(bytes(saida))
    print(f"  TrimBox, BleedBox e ArtBox escritas em {len(novos)} páginas")


def main():
    for f in (CAPA, MIOLO):
        if not os.path.exists(f):
            raise SystemExit(f"falta {f} — correr primeiro o montar.py --grafica "
                             "e o gerar.mjs, uma vez para cada ficheiro")
    converter(perfil())
    caixas()
    mb = os.path.getsize(SAIDA) / 1048576
    print(f"escrito {SAIDA} — {mb:.1f} MB")


if __name__ == "__main__":
    main()
