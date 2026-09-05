# -*- coding: utf-8 -*-
import json, os, sys, html, re
# tudo o que este ficheiro precisa vive ao lado dele
D = os.path.dirname(os.path.abspath(__file__))
folhas = json.load(open(f"{D}/folhas.json"))

# ---------------------------------------------------------------------------
#  Os preços vêm SEMPRE do data/ementa.json, nunca do folhas.json.
#
#  O `folhas.json` guarda a ordem, os nomes e o inglês — o desenho. Os preços
#  são do site, e o site é a única fonte deles: é lá que o painel escreve.
#
#  Sem isto, o papel voltava a ser uma transcrição, e uma transcrição envelhece
#  sozinha. Foi assim que a ementa impressa passou uma semana a cobrar menos
#  1,00 € na francesinha do que a casa cobrava.
# ---------------------------------------------------------------------------
import unicodedata

def _chave(nome):
    n = unicodedata.normalize("NFD", nome.lower())
    n = "".join(c for c in n if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", n).strip()

_raiz = os.path.dirname(os.path.dirname(D))
_site = json.load(open(os.path.join(_raiz, "data", "ementa.json"), encoding="utf-8"))
_precos = {_chave(p["nome"]): p["preco"]
           for c in _site["categorias"] for p in c["pratos"]}
# os dois artigos cujo nome no papel leva um acrescento
_precos[_chave("Percebes Época")] = _precos[_chave("Percebes")]
_precos[_chave("Sangria, jarro")] = _precos[_chave("Sangria")]


# ---------------------------------------------------------------------------
#  O endereço do QR da contracapa vem do lib/site.ts, pela mesma razão que os
#  preços vêm do data/ementa.json: uma cópia transcrita envelhece sozinha, e
#  um endereço errado no papel não se corrige depois de impresso.
#
#  Quem o lê é o `qr.py`, e o desenho do SVG também. Viviam aqui enquanto a
#  ementa era a única coisa desta casa com um QR; o cartão de mesa é a segunda,
#  e duas cópias do mesmo endereço era exactamente o que se estava a evitar.
# ---------------------------------------------------------------------------
import qr

SITE = qr.endereco_do_site()


# --- 1ª direcção: o papel tem artigos que o site já não tem? ---
_mudou, _orfaos = [], []
for _bl in folhas:
    for _it in _bl:
        if _it["t"] != "art":
            continue
        _k = _chave(_it["nome"])
        if _k not in _precos:
            _orfaos.append(_it["nome"]); continue
        if abs(_precos[_k] - _it["preco"]) > 0.001:
            _mudou.append((_it["nome"], _it["preco"], _precos[_k]))
        _it["preco"] = _precos[_k]

for _n, _a, _b in _mudou:
    print(f"  preço actualizado: {_n} — {_a:.2f} → {_b:.2f}")
if _orfaos:
    raise SystemExit(
        "Estes artigos do papel já não existem no data/ementa.json:\n  "
        + "\n  ".join(_orfaos)
        + "\n\nOu foram tirados da ementa, ou mudaram de nome. Resolver antes de gerar."
    )

# --- 2ª direcção: o site tem artigos que o papel não tem? ---
#
#  Esta faltava, e é a que interessa mais. Sem ela o gerador corria, dizia
#  "155 artigos, preços conferidos", e imprimia 154 — o prato novo desaparecia
#  em silêncio entre o painel e a gráfica. Foi o que quase aconteceu ao Baileys.
_no_papel = {_chave(_it["nome"]) for _bl in folhas for _it in _bl if _it["t"] == "art"}
# os dois nomes que no papel levam um acrescento deliberado
_no_papel.add(_chave("Percebes"))
_no_papel.add(_chave("Sangria"))

_faltam = [(_p["nome"], _p["preco"], _c["id"])
           for _c in _site["categorias"] for _p in _c["pratos"]
           if _chave(_p["nome"]) not in _no_papel]
if _faltam:
    raise SystemExit(
        "O site tem artigos que o papel não tem:\n  "
        + "\n  ".join(f"{n} — {v:.2f} — categoria {c}" for n, v, c in _faltam)
        + "\n\nAcrescentar ao folhas.json, na folha e na subsecção certas.\n"
          "Cuidado: a folha mais cheia pode não ter espaço — ver o `--ar` no LEIA-ME."
    )
print(f"  {len(_precos) and len([1 for bl in folhas for it in bl if it['t']=='art'])} "
      f"artigos, preços conferidos com o data/ementa.json")
fontes = open(f"{D}/fontes.css", encoding="utf-8").read()

def esc(s): return html.escape(s, quote=False)
def preco(v):
    return f"{v:.2f}".replace(".", ",")

def artigo(it):
    nome = it["nome"]; nota = ""
    m = re.match(r"^(Percebes)\s+(Época)$", nome)
    if m: nome, nota = m.group(1), m.group(2)
    n = f'<span class="nome">{esc(nome)}</span>'
    if nota: n += f'<span class="nota">{esc(nota)}</span>'
    en = f'\n        <p class="en">{esc(it["en"])}</p>' if it["en"] else ""
    return (f'      <li>\n        <span class="linha">{n}'
            f'<span class="pontos"></span>'
            f'<span class="preco">{preco(it["preco"])}</span></span>{en}\n      </li>')

def folha(bloco, num):
    out = ['  <section class="folha">',
           '    <header class="corrida"><span>Taskuinha do Pirata</span>'
           '<span>Praia de Vila Chã</span></header>',
           '    <div class="corpo">']
    aberto = False
    for it in bloco:
        if it["t"] in ("cat", "sub"):
            if aberto: out.append("    </ul>"); aberto = False
            if it["t"] == "cat":
                out.append(f'    <h2 class="categoria"><span class="pt">{esc(it["pt"])}</span>'
                           f'<span class="en">{esc(it["en"])}</span></h2>')
            else:
                out.append(f'    <h3 class="sub">{esc(it["pt"])}</h3>')
        else:
            if not aberto: out.append('    <ul class="artigos">'); aberto = True
            out.append(artigo(it))
    if aberto: out.append("    </ul>")
    out.append("    </div>")
    out.append("  </section>")
    return "\n".join(out)

capa = """  <section class="folha capa">
    <div class="capa-pirata">
      <img src="origem/pirata-capa.png" alt="">
    </div>

    <div class="capa-titulo">
      <div class="capa-nome">TASKUI<span class="virado">N</span>HA</div>
      <div class="capa-sub">do Pirata</div>
      <div class="capa-risco"></div>
      <div class="capa-ementa">Ementa</div>
    </div>

    <div class="capa-pe">Praia de Vila Ch&atilde; &middot; Vila do Conde</div>
  </section>"""
contra = """  <section class="folha contracapa">
    <div class="fim-miolo">
      <h2 class="fim-titulo">Bom proveito</h2>
      <p class="fim-lead">
        Se tiver alergias ou intoler&acirc;ncias, diga-nos antes de pedir.
        Quase tudo c&aacute; passa por marisco.
        <span class="en-nota">If you have any allergies or intolerances, please tell
        us before you order. Almost everything here comes into contact with
        shellfish.</span>
      </p>

      <div class="fim-blocos">
        <div>
          <h3>Hor&aacute;rio</h3>
          <dl class="horario">
            <dt>Segunda</dt><dd>Encerrado</dd>
            <dt>Ter&ccedil;a a s&aacute;bado</dt><dd>10h00 &ndash; 23h00</dd>
            <dt>Domingo</dt><dd>10h00 &ndash; 20h00</dd>
          </dl>
        </div>
        <div>
          <h3>Encontrar-nos</h3>
          <p>Av. dos Banhos 185<br>4485-691 Vila Ch&atilde;, Vila do Conde</p>
          <p>229 285 079</p>
          <p>@taskuinhadopirata</p>
        </div>
      </div>

      <div class="fim-qr">
        __QR__
        <span class="fim-qr-morada">__MORADA__</span>
      </div>
    </div>

    <div class="fim-pe">O Caminho de Santiago passa &agrave; porta</div>
  </section>"""

# 34 mm, e o número é o do SVG **inteiro** — zona de silêncio incluída. O
# quadrado escuro que se vê na folha é menor: 29 dos 37 módulos, ou seja
# 26,6 mm, o que dá **0,92 mm por módulo**.
#
# Foi por isto que não ficou nos 28 mm que pareciam chegar: aí o código
# impresso media 22 mm e cada módulo 0,76 mm, que é da ordem da textura do
# pergaminho. Quem mede a zona de silêncio como se fosse margem engana-se em
# quase um quinto do tamanho — e só dá por isso com o papel na mão.
contra = (contra
          .replace("__QR__", qr.svg(SITE, 34, classe="fim-qr-codigo"))
          .replace("__MORADA__", html.escape(re.sub(r"^https?://", "", SITE))))

CSS = """
/*
  A ementa impressa — dez folhas de conteúdo, uma coluna.

  Refaz em HTML o desenho que vivia num documento do Canva, e que por isso não
  se conseguia corrigir a partir daqui. A ordem dos artigos, o corte entre
  folhas e os tamanhos de letra saem todos de medições feitas ao
  `Ementa_Final.pdf`; os **preços** vêm do `data/ementa.json`, que é a mesma
  fonte que serve o site — é isso que faz o papel deixar de se dessincronizar.

  A capa e a contracapa são as folhas 1 e 12, por fazer.
*/

@page { size: A4; margin: 0; }

:root {
  --tinta:      #2b1d0e;   /* o texto */
  --queimado:   #6b4517;   /* categorias e inglês */
  --pergaminho: #d9c7a0;   /* a cor por baixo, se a imagem faltar */
  --tinta-fraca: rgb(43 29 14 / 0.60);
  --linha:       rgb(43 29 14 / 0.30);

  /* Medidas tiradas do Ementa_Final.pdf */
  --margem-lado:  40mm;
  --margem-cima:  20mm;
  --margem-baixo: 17mm;

  --clarear: .12;         /* o véu branco sobre o fundo — só este número */
  --folga-fundo: 2mm;     /* o fundo transborda 1mm de cada lado */

  --t-categoria: 18pt;
  --t-nome:      13pt;
  --t-preco:     12.5pt;
  --t-en:        8.8pt;
  --t-corrida:   9.5pt;
  --t-cat-en:    9.5pt;   /* o rótulo inglês da categoria, à direita */

  --traco: .26mm;         /* os fios horizontais, medidos no Ementa_Final */

  --ar: 3.0mm;             /* o ar entre artigos — ver nota no fim */
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { background: #555; }

body {
  font-family: "Pergaminho", "IM Fell English SC", Georgia, serif;
  color: var(--tinta);
  -webkit-font-smoothing: antialiased;
}

.folha {
  position: relative;
  width: 210mm;
  height: 297mm;
  padding: var(--margem-cima) var(--margem-lado) var(--margem-baixo);
  background-color: var(--pergaminho);
  /*
    Duas camadas: um véu branco por cima da fotografia, e a fotografia.
    O véu clareia o pergaminho sem tocar no ficheiro de origem — e fica por
    baixo do texto, que continua a ser desenhado à cor cheia.
  */
  background-image:
    linear-gradient(rgba(255,255,255,var(--clarear)), rgba(255,255,255,var(--clarear))),
    url("origem/fundo-ementa.png");
  /*
    A imagem transborda a página em 1mm de cada lado.

    Com `cover` puro a folga saía em 0,05mm — a fotografia e o A4 têm quase a
    mesma proporção (0,70714 contra 0,70667) — e cinco centésimos não sobrevivem
    ao arredondamento de quem desenha os píxeis: aparecia um fio branco na borda.
  */
  background-size:
    calc(100% + var(--folga-fundo)) calc(100% + var(--folga-fundo)),
    calc(100% + var(--folga-fundo)) calc(100% + var(--folga-fundo));
  background-position: center, center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  break-after: page;
  page-break-after: always;
}
.folha:last-child { break-after: auto; page-break-after: auto; }

/* no ecrã, folhas soltas com sombra; na impressão, nada disto */
@media screen {
  .folha { margin: 12mm auto; box-shadow: 0 2mm 8mm rgba(0,0,0,.45); }
}

/* ---------- cabeçalho corrido ---------- */

.corrida {
  display: flex;
  justify-content: space-between;
  font-size: var(--t-corrida);
  line-height: 1;
  color: var(--queimado);
  letter-spacing: .02em;
  padding-bottom: 2.4mm;
  border-bottom: var(--traco) solid var(--queimado);
  margin-bottom: 6mm;
  flex: none;
}

/*
  O corpo da folha — tudo menos o cabeçalho corrido.

  Encosta ao topo, e é deliberado. Chegou a centrar-se na altura, para as folhas
  mais leves não ficarem com um vazio em baixo — mas empurrava tudo para o meio
  da página e lia-se pior. Uma ementa lê-se de cima para baixo: o primeiro prato
  tem de estar onde o olho começa, e o ar que sobra fica no fim.
*/
.corpo {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
}

/* ---------- categorias ---------- */

.categoria {
  font-size: var(--t-categoria);
  font-weight: 400;
  line-height: 1.1;
  color: var(--queimado);
  margin-top: 8mm;
  padding-bottom: 2.2mm;
  border-bottom: var(--traco) solid var(--queimado);
  margin-bottom: 3.4mm;
  display: flex;
  align-items: baseline;
  justify-content: space-between;   /* o rótulo inglês encosta à direita */
  gap: 6mm;
  flex: none;
}
/*
  A primeira categoria da folha não leva ar por cima — já o tem do cabeçalho.

  O selector aponta ao `.corpo` e não à `.folha`: quando o corpo passou a ser um
  bloco próprio, a categoria deixou de ser filha directa da folha e esta regra
  deixou de casar em silêncio. O resultado foi 8mm a mais no topo de cada folha,
  que empurraram o texto todo para baixo.
*/
.corpo > .categoria:first-child { margin-top: 0; }

/*
  O rótulo inglês da categoria: 9,5 pt, itálico, encostado à direita — medido
  no Ementa_Final, onde acaba sempre aos 170 mm, como os preços. Não é o mesmo
  corpo das descrições dos pratos (8,8 pt), e por isso tem variável própria.
*/
.categoria .en {
  font-family: "Corpo", "Alegreya Sans", system-ui, sans-serif;
  font-size: var(--t-cat-en);
  font-style: italic;
  line-height: 1;
  flex: none;
}

.sub {
  font-size: calc(var(--t-nome) - .5pt);
  font-weight: 400;
  font-style: italic;
  color: var(--queimado);
  margin: 2.8mm 0 1.4mm;
  flex: none;
}

/* ---------- artigos ---------- */

.artigos { list-style: none; flex: none; }
.artigos li { margin-bottom: var(--ar); }
.artigos li:last-child { margin-bottom: 0; }

.linha {
  display: flex;
  align-items: baseline;
  width: 100%;
}

.nome {
  font-size: var(--t-nome);
  line-height: 1.15;
  flex: none;
  max-width: 105mm;
}

/* a nota do prato — só os Percebes a têm */
.nota {
  font-family: "Corpo", "Alegreya Sans", system-ui, sans-serif;
  font-size: 7pt;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--queimado);
  margin-left: 2.5mm;
  flex: none;
}

/* o fio que liga o nome ao preço, como nas ementas de sempre */
.pontos {
  flex: 1 1 auto;
  min-width: 4mm;
  margin: 0 2mm;
  border-bottom: .18mm dotted color-mix(in srgb, var(--queimado) 55%, transparent);
  transform: translateY(-.9mm);
}

.preco {
  font-size: var(--t-preco);
  font-variant-numeric: tabular-nums;
  flex: none;
  white-space: nowrap;
}

.en {
  font-family: "Corpo", "Alegreya Sans", system-ui, sans-serif;
  font-size: var(--t-en);
  font-style: italic;
  line-height: 1.3;
  color: var(--queimado);
  margin-top: .5mm;
  max-width: 118mm;
}

/* ---------- a capa ---------- */

/*
  Copiada do `ementa.html`, a folha por folha. Só muda a figura, que passa a ser
  o recorte novo (`origem/pirata-capa.png`) em vez do que lá estava embebido.

  O pirata vem em cima e ocupa o espaço que sobra; o título, o risco e o
  «Ementa» ficam no meio; a morada assenta no pé, com filete a toda a largura.
  O `justify-content: space-between` da folha é o que os separa.
*/

/*
  A margem de baixo é 26mm e não os 14mm do `ementa.html`.

  O `ementa.html` assentava em pergaminho liso; este fundo tem uma moldura
  desenhada que ocupa **23,8mm em cima e 22,6mm em baixo** — medidos no
  `origem/fundo-ementa.png`. Com 14mm, a morada caía dentro do ornamento e
  praticamente não se lia.

  Como a folha distribui com `space-between`, aumentar a margem de baixo sobe
  a morada e, com ela, o bloco do título — sem mexer na centragem horizontal.
*/
.capa {
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 40mm 18mm 26mm;
}

/*
  Os três vãos da capa são números explícitos, e não sobras de um
  `space-between`. Foi o que permitiu mexer nos três ao mesmo tempo sem que um
  empurrasse o outro:

      padding-top da capa   40mm   ← sobe ou desce a figura
      .capa-titulo margin-top 4mm  ← afasta o título do pé do pirata
      .capa-pe margin-top    10mm  ← aproxima a morada do resto

  Enquanto a caixa da figura era `flex: 1`, subir a imagem obrigava a alargar o
  vão de baixo, e os pedidos entravam em conflito uns com os outros.
*/
.capa-pirata {
  flex: none;
  display: flex;
  justify-content: center;
  width: 100%;
}

.capa-pirata img {
  width: 58%;
  height: auto;
  filter: drop-shadow(0 4mm 6mm rgb(43 29 14 / 0.34));
}

/*
  O bloco do título sobe 8mm e passa a desenhar-se **por cima** da fotografia.

  O `z-index` é o que decide: sem ele, a sobreposição punha o pé do pirata
  em cima das letras. Assim a bota entra ligeiramente atrás do TASKUIИHA, que
  é o efeito pedido.
*/
.capa-titulo {
  position: relative;
  z-index: 1;
  margin-top: 4mm;
  width: 100%;
}

.capa-nome {
  font-family: "Tabuleta", "Rye", Georgia, serif;
  font-size: 40pt;
  line-height: 1;
  letter-spacing: 0.02em;
}
/* o N ao contrário — a assinatura do letreiro sobre a porta */
.virado { display: inline-block; transform: scaleX(-1); }

.capa-sub {
  font-family: "Maquina", "Special Elite", "Courier New", monospace;
  font-size: 10pt;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  text-transform: uppercase;
  color: var(--queimado);
  margin-top: 4mm;
}

.capa-risco {
  width: 42mm;
  height: 0;
  border-top: 0.3mm solid var(--linha);
  margin: 7mm auto;
}

.capa-ementa {
  font-family: "Pergaminho", "IM Fell English SC", Georgia, serif;
  font-size: 30pt;
  line-height: 1;
}

.capa-pe {
  /*
    Dois terços da largura da caixa — 116mm em vez de 174. É o filete que
    separa o «Ementa» da morada; a toda a largura competia com o risco de 42mm
    que está mais acima.

    A capa alinha ao centro, por isso estreitar o bloco centra-o sozinho.
  */
  width: 66.667%;
  margin-top: 10mm;
  border-top: 0.3mm solid var(--linha);
  padding-top: 3.5mm;
  font-family: "Maquina", "Special Elite", "Courier New", monospace;
  font-size: 7.5pt;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
}

/* ---------- a contracapa ---------- */

/*
  O conteúdo é o do `ementa.html`, palavra a palavra. Duas diferenças, ambas
  pedidas:

  1. **Sem a caveira.** O `ementa.html` abre com um SVG de caveira; foi tirado.
  2. **Uma letra só.** Lá dentro conviviam três famílias — IM Fell no título,
     Alegreya no texto, Special Elite nos rótulos e no horário. Passa a ser
     tudo **IM Fell English SC**, a do «Bom proveito».

  A margem de baixo é 26mm e não os 14mm do original, pela mesma razão da capa:
  a moldura desenhada neste fundo ocupa 22,6mm, e com 14 o pé caía lá dentro.
*/

.contracapa {
  align-items: center;
  text-align: center;
  padding: 24mm 20mm 26mm;
}

.fim-miolo {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* a família de toda a contracapa — a do «Bom proveito» */
.contracapa,
.fim-titulo,
.fim-lead,
.fim-blocos,
.fim-blocos h3,
.horario dd,
.fim-pe {
  font-family: "Pergaminho", "IM Fell English SC", Georgia, serif;
}

.fim-titulo {
  font-size: 22pt;
  line-height: 1;
  margin: 7mm 0 3mm;
  font-weight: 400;
}

.fim-lead {
  font-size: 10.5pt;
  line-height: 1.5;
  max-width: 105mm;
  margin: 0 auto;
}

.fim-lead .en-nota {
  font-style: italic;
  color: var(--tinta-fraca);
  display: block;
  margin-top: 2mm;
}

.fim-blocos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9mm 12mm;
  margin-top: 12mm;
  width: 100%;
  max-width: 140mm;
  text-align: left;
  font-size: 9.5pt;
  line-height: 1.45;
}
.fim-blocos p { margin: 0; }

.fim-blocos h3 {
  font-size: 8.5pt;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--queimado);
  margin: 0 0 2mm;
  padding-bottom: 1.5mm;
  border-bottom: 0.2mm solid var(--linha);
}

/* duas colunas: o dia à esquerda, as horas à direita — como no ementa.html */
.horario {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 4mm;
  margin: 0;
}
.horario dt { margin: 0; color: var(--tinta-fraca); }
.horario dd {
  margin: 0;
  font-size: 9.5pt;
  line-height: 1.45;
  font-variant-numeric: tabular-nums;
}

/*
  ## O QR

  Os vãos são números escolhidos, como os da capa — não sobras:

      .fim-qr margin-top   11mm  ← afasta o quadrado dos dois blocos
      lado do quadrado     28mm  ← no `qr_svg(SITE, 34)`, não aqui
      morada margin-top     3mm

  O quadrado é **vector e sem fundo branco**: o pergaminho passa por baixo e os
  módulos são a tinta da folha, como o resto do texto. A zona de silêncio já
  vem dentro do SVG — não se acrescenta margem a fingir que é ela.
*/

.fim-qr {
  margin-top: 11mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--tinta);
}

.fim-qr-codigo {
  display: block;
}

.fim-qr-morada {
  margin-top: 3mm;
  font-size: 8.5pt;
  letter-spacing: 0.14em;
  color: var(--tinta-fraca);
}

.fim-pe {
  margin-top: auto;
  padding-top: 5mm;
  width: 66.667%;
  border-top: 0.3mm solid var(--linha);
  font-size: 8.5pt;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
}

/* ---------- placeholder, se voltar a ser preciso ---------- */

.porfazer { align-items: center; justify-content: center; }
.porfazer .marca {
  font-family: "Corpo", "Alegreya Sans", system-ui, sans-serif;
  font-size: 11pt;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--queimado);
  opacity: .5;
}

/*
  ## O ar entre artigos

  O `--ar` é o único número desta folha que foi escolhido e não medido: a folha
  mais cheia tem **18** artigos — a do Bar, desde que o Baileys entrou — e este
  valor é o que a faz fechar **acima da moldura desenhada no fundo**, que começa
  aos 274,4 mm.

  Esteve nos 4,1 mm enquanto a folha mais cheia tinha 17. Com 18 a última linha
  ia parar aos ~281 mm, por cima do ornamento. A 3,4 mm ficava a 3 mm dele, que
  é pouco; a 3,0 mm sobra folga que se vê.

  **Atenção ao que a verificação não apanha:** o `overflow: hidden` corta
  *pixéis*, mas o texto continua no stream do PDF e a extracção encontra-o na
  mesma. Contar artigos **não prova** que nada foi cortado — é preciso olhar
  para a folha mais cheia, com o `foto.mjs`.

  Se um dia se acrescentarem ou tirarem pratos, é este número que deixa de
  servir. Conta-se as páginas depois de gerar: **têm de ser doze**.
*/
"""

# ---------------------------------------------------------------------------
#  A versão da gráfica: 216 × 303 mm, sangria de 3 mm e a goteira das argolas
# ---------------------------------------------------------------------------
#
#  `python3 ementa-impressa/gerador/montar.py --grafica`
#
#  Sai um segundo HTML — `ementa-grafica.html` — que só difere deste em três
#  coisas. Todas elas vêm do `origem/guia-360imprimir.pdf`, que é o guia de
#  construção da gráfica onde isto foi encomendado:
#
#  1. **A folha cresce para 216 × 303 mm.** São os 3 mm de sangria em todo o
#     redor. Tudo o que é margem passa a contar a partir do corte, e não da
#     borda do papel — daí o `--sangria` somado a cada `padding`.
#
#  2. **Aparece uma goteira de 10 mm do lado da encadernação.** É a área de
#     segurança que o guia pede, e é por onde as argolas furam. O desenho todo
#     — moldura, ornamentos, texto — encolhe `--k` (200/210) na horizontal e
#     encosta-se ao lado de fora. Na vertical não se mexe em nada: a folha do
#     Bar fecha a 3 mm do ornamento de baixo e não tem folga para dar.
#
#  3. **A goteira troca de lado a cada página.** A encadernação é à esquerda e
#     a impressão é frente e verso, portanto o verso de cada folha tem as
#     argolas à direita — é a página dupla do guia, `A | B` com a perfuração
#     ao meio. As ímpares levam `impar`, as pares levam `par`, e o fundo das
#     pares é o mesmo ficheiro virado com `scaleX(-1)`.
#
#  E são **catorze** páginas, não doze: o guia manda enviar as páginas todas,
#  soltas e por ordem de leitura, e o miolo leva o verso da capa e a frente da
#  contracapa em branco. Sem elas a paridade saía trocada da página 2 em diante
#  e as argolas apareciam do lado errado em metade da ementa.
#
#  O fundo vem do `fundo.py` e não deste ficheiro. Ver lá porquê.

CSS_GRAFICA = """
/* ---------- a folha da gráfica ---------- */

@page { size: 216mm 303mm; margin: 0; }

:root {
  --sangria: 3mm;
  --argolas: 10mm;
  --k: 0.952381;       /* 200/210: o que sobra da largura depois das argolas */
}

.folha {
  width: 216mm;
  height: 303mm;
  --lado: var(--margem-lado);
  padding-top:    calc(var(--sangria) + var(--margem-cima));
  padding-bottom: calc(var(--sangria) + var(--margem-baixo));
  padding-left:   calc(var(--sangria) + var(--argolas) + var(--lado) * var(--k));
  padding-right:  calc(var(--sangria) + var(--lado) * var(--k));
  background-image: none;              /* o fundo passa a ser um elemento */
}

.capa { --lado: 18mm; }
.contracapa { --lado: 20mm; }

.capa {
  padding-top:    calc(var(--sangria) + 40mm);
  padding-bottom: calc(var(--sangria) + 26mm);
}
.contracapa {
  padding-top:    calc(var(--sangria) + 24mm);
  padding-bottom: calc(var(--sangria) + 26mm);
}

/*
  As pares são o verso de cada folha: a mesma argola, vista do outro lado.
  Duas classes, portanto ganha isto ao `.folha` e ao `.capa` de cima.
*/
.folha.par {
  padding-left:  calc(var(--sangria) + var(--lado) * var(--k));
  padding-right: calc(var(--sangria) + var(--argolas) + var(--lado) * var(--k));
}

/*
  O fundo deixa de estar na folha e passa a ser um elemento por baixo de tudo,
  só para se poder virar nas pares. O `background-size: 100% 100%` é exacto e
  não `cover`: o `fundo-grafica.jpg` já tem 216 × 303 mm a 300 DPI, medida a
  medida. Também já não precisa da `--folga-fundo` — o rebordo branco da
  fotografia foi cortado no `fundo.py` em vez de ser empurrado para fora.

  E **não leva o véu do `--clarear`**: ele vem cozido na imagem, também do
  `fundo.py`, que o lê daqui. Tinha de sair da CSS por causa da capa — lá o
  pirata está dentro da mesma imagem, e um véu por cima do `.fundo` clareava-o
  a ele também.
*/
.fundo {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("fundo-grafica.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.folha.par .fundo { transform: scaleX(-1); }
.folha > *:not(.fundo) { position: relative; z-index: 1; }

/*
  A capa tem fundo próprio, com o pirata e a sombra já lá dentro.

  Não é gosto: o `printToPDF` do Chrome bloqueia indefinidamente numa página
  que tenha o fundo grande **e** uma segunda imagem, e a capa tinha as duas. A
  nota com as medições está no `gerador/fundo.py`.

  A figura sai do HTML mas o **vão que ela ocupava tem de ficar**, senão o
  título sobe 143 mm: a capa distribui-se por vãos explícitos e o `.capa-titulo`
  desenha-se por cima da figura com um `margin-top` negativo. O `::before`
  reserva exactamente a mesma caixa — 58 % da largura, na proporção do
  `pirata-capa.png` — e o `fundo.py` desenha o pirata nessa mesma medida.
*/
.capa .fundo { background-image: url("fundo-capa.jpg"); }
.capa-pirata::before {
  content: "";
  display: block;
  width: 58%;
  aspect-ratio: 723 / 1079;
}

/* a medida do texto encolhe com o resto, para a mancha ficar como estava */
.nome { max-width: calc(105mm * var(--k)); }
.en   { max-width: calc(118mm * var(--k)); }

/* o verso da capa e a frente da contracapa: pergaminho e mais nada */
.branca { padding: 0; }

/*
  A folha que vai ao lixo. Branca, sem fundo nenhum, com a palavra ao meio.
  O cinzento é deliberado: em CMYK sai um cinzento composto e não um preto
  chapado, o que deixa claro a quem estiver a montar que aquilo é uma marca de
  produção e não conteúdo.
*/
.corte {
  padding: 0;
  background: #fff;
  align-items: center;
  justify-content: center;
}
.corte span {
  font-family: "Corpo", "Alegreya Sans", system-ui, sans-serif;
  font-size: 14pt;
  letter-spacing: .38em;
  text-transform: uppercase;
  color: #8a8a8a;
}

@media screen {
  .folha { outline: .2mm dashed rgb(255 0 120 / .55); outline-offset: -3mm; }
}
"""

BRANCA = '  <section class="folha branca"></section>'

# ---------------------------------------------------------------------------
#  A folha a deitar fora
# ---------------------------------------------------------------------------
#
#  A gráfica não vende catorze páginas: o degrau é aos **dezasseis**. Em vez de
#  se encomendar dezasseis e receber duas em branco de graça — que ficavam
#  encadernadas e ninguém sabia porquê — encomendam-se dezasseis e uma das
#  folhas vem com **«Cortar» ao meio, dos dois lados, em papel branco**.
#
#  Branca a sério, sem pergaminho: é para se ver de fora do livro que aquela
#  folha não é da ementa, e para não se gastar tinta numa folha que vai ao lixo.
#
#  Fica em **último lugar do miolo**, logo antes da branca da contracapa: é o
#  sítio onde menos incomoda se alguém se esquecer de a cortar, e cortá-la
#  devolve exactamente a ementa de catorze páginas.
CORTE = ('  <section class="folha corte"><span>Cortar</span></section>\n'
         '  <section class="folha corte"><span>Cortar</span></section>')


def vestir(sec, i):
    """Põe a classe da paridade e mete o fundo por baixo do conteúdo.

    A folha de corte não leva fundo: é branca de propósito."""
    # a pergunta faz-se **antes** de a classe da paridade entrar, senão o
    # `folha corte` deixa de casar e a folha branca vem com pergaminho
    branca_de_corte = "folha corte" in sec
    cls = "par" if i % 2 else "impar"
    sec = sec.replace('<section class="folha', f'<section class="folha {cls}', 1)
    if branca_de_corte:
        return sec
    fim = sec.index(">") + 1
    return sec[:fim] + '\n    <div class="fundo" aria-hidden="true"></div>' + sec[fim:]


GRAFICA = "--grafica" in sys.argv


def documento(partes, extra=""):
    return f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>Ementa da Taskuinha</title>
<style>
{fontes}
{CSS}{extra}
</style>
</head>
<body>
{chr(10).join(partes)}
</body>
</html>
"""


def escrever(nome, texto, quantas):
    caminho = os.path.join(os.path.dirname(D), nome)
    open(caminho, "w", encoding="utf-8").write(texto)
    print(f"escrito {caminho} — {os.path.getsize(caminho)//1024} KB, {quantas} secções")


if GRAFICA:
    # a figura vem no fundo; ver a nota da `.capa .fundo` na CSS_GRAFICA
    capa = capa.replace('<img src="origem/pirata-capa.png" alt="">', "")
    paginas = ([capa, BRANCA]
               + [folha(bl, i + 2) for i, bl in enumerate(folhas)]
               + CORTE.split("\n")
               + [BRANCA, contra])
    paginas = [vestir(sec, i) for i, sec in enumerate(paginas)]

    if len(paginas) != 16:
        raise SystemExit(f"{len(paginas)} páginas, e a gráfica só vende 16")

    if len(paginas) % 2:
        raise SystemExit(f"{len(paginas)} páginas: a impressão é frente e verso e o "
                         "número tem de ser par, senão a última sai sozinha")

    for f in ("fundo-grafica.jpg", "fundo-capa.jpg"):
        caminho = os.path.join(os.path.dirname(D), f)
        if not os.path.exists(caminho):
            raise SystemExit(f"falta o {f} — correr primeiro o gerador/fundo.py")
        if os.path.getmtime(caminho) < os.path.getmtime(os.path.join(
                os.path.dirname(D), "origem", "fundo-ementa.png")):
            raise SystemExit(f"o {f} é mais velho que o pergaminho de origem "
                             "— voltar a correr o gerador/fundo.py")

    # ------------------------------------------------------------------
    #  Dois ficheiros, e é por obrigação do Chrome
    # ------------------------------------------------------------------
    #
    #  O `Page.printToPDF` bloqueia indefinidamente quando o documento tem
    #  **mais do que uma imagem grande** — e o limite é do documento inteiro,
    #  não da página. Medido:
    #
    #      13 páginas de miolo, um fundo de 9 Mpx      imprime em 6 s
    #      a capa sozinha, um fundo de 9 Mpx           imprime em 4 s
    #      capa + uma página de miolo, dois fundos     pendura
    #      tudo num só ficheiro de 18 Mpx (os dois
    #        fundos empilhados e apanhados por
    #        `background-position`)                    pendura
    #
    #  A capa tem fundo próprio porque o pirata vem cozido lá dentro, e por
    #  isso não há maneira de o documento ter um fundo só. Separam-se: cada
    #  ficheiro leva **uma** imagem, imprime-se cada um, e o `grafica.py` junta
    #  os dois no mesmo `gs` que já corria para o CMYK — sem passo a mais e sem
    #  segunda recodificação.
    escrever("ementa-grafica-capa.html", documento(paginas[:1], CSS_GRAFICA), 1)
    escrever("ementa-grafica-miolo.html", documento(paginas[1:], CSS_GRAFICA),
             len(paginas) - 1)
else:
    paginas = [capa] + [folha(bl, i + 2) for i, bl in enumerate(folhas)] + [contra]
    escrever("ementa-coluna-unica.html", documento(paginas), len(paginas))
