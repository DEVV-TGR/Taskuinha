# -*- coding: utf-8 -*-
"""Escreve o TrimBox e o BleedBox nas páginas de um PDF, e refaz o xref.

Sem estas duas caixas a gráfica recebe uma folha de 216 x 303 mm e tem de
adivinhar onde está o A4 lá dentro. O **TrimBox** diz onde a guilhotina corta;
o **BleedBox** diz até onde o desenho vai. São elas que fazem a sangria ser
sangria e não uma folha maior.

Inserir bytes empurra tudo o que vem a seguir, e a tabela de referências passa
a apontar ao lado — por isso ela é **reconstruída do zero**, varrendo os
cabeçalhos dos objectos. Só funciona sem `/ObjStm`, e o ficheiro pára se os
encontrar em vez de escrever um PDF partido.
"""
import re, sys

ENTRADA, SAIDA = sys.argv[1], sys.argv[2]
SANGRIA_PT = 3 / 25.4 * 72          # 3 mm em pontos = 8,5039

bruto = open(ENTRADA, "rb").read()
if b"/ObjStm" in bruto:
    raise SystemExit("este PDF usa fluxos de objectos; o xref não se refaz assim")

mediabox = re.compile(rb"/MediaBox\s*\[\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*\]")

saida, pos, feitas = bytearray(), 0, 0
for m in re.finditer(rb"/Type\s*/Page[^s]", bruto):
    ini, fim = max(0, m.start() - 800), min(len(bruto), m.end() + 800)
    mb = mediabox.search(bruto, ini, fim)
    if not mb or mb.end() < pos:
        continue
    x0, y0, x1, y1 = (float(v) for v in mb.groups())
    t = (x0 + SANGRIA_PT, y0 + SANGRIA_PT, x1 - SANGRIA_PT, y1 - SANGRIA_PT)
    saida += bruto[pos:mb.end()]
    saida += (b"/TrimBox [%.4f %.4f %.4f %.4f] /BleedBox [%.4f %.4f %.4f %.4f]"
              % (t + (x0, y0, x1, y1)))
    pos = mb.end()
    feitas += 1
saida += bruto[pos:]

# --- refazer o xref ---
d = bytes(saida)
objs = {}
for m in re.finditer(rb"(?:^|[\r\n>])\s*(\d+)\s+(\d+)\s+obj\b", d):
    objs[int(m.group(1))] = m.start(1)
maior = max(objs)

velho = d.rfind(b"trailer")
if velho == -1:
    raise SystemExit("não encontrei o trailer")
fim_dic = d.find(b">>", velho)
dic = d[velho + len(b"trailer"):fim_dic + 2]
dic = re.sub(rb"/Size\s+\d+", b"/Size %d" % (maior + 1), dic)
if b"/Size" not in dic:
    dic = dic.replace(b"<<", b"<< /Size %d " % (maior + 1), 1)
if b"/Prev" in dic:
    dic = re.sub(rb"/Prev\s+\d+", b"", dic)

corpo = bytearray(d[:velho])
if not corpo.endswith(b"\n"):
    corpo += b"\n"
inicio_xref = len(corpo)
corpo += b"xref\n0 %d\n" % (maior + 1)
corpo += b"0000000000 65535 f \n"
for i in range(1, maior + 1):
    corpo += (b"%010d 00000 n \n" % objs[i]) if i in objs else b"0000000000 65535 f \n"
corpo += b"trailer\n" + dic + b"\nstartxref\n%d\n%%%%EOF\n" % inicio_xref

open(SAIDA, "wb").write(bytes(corpo))
print(f"{feitas} páginas com TrimBox e BleedBox; xref refeito com {maior} objectos")
