# -*- coding: utf-8 -*-
"""O inglês da ementa impressa: o que lá está, e porquê.

    python3 ementa-impressa/gerador/rever_en.py

**Este ficheiro não gera nada.** Nada o importa: o inglês que se imprime vive
no `folhas.json` e vem do `data/ementa.json`, que é o mesmo que serve o site. O
que está aqui é a razão de cada descrição ser a que é — e a lista das que ainda
ninguém confirmou.

Regra de sempre: melhora-se a escrita livremente; **não se inventam factos sobre
a comida**. Onde a melhoria exigiria afirmar o que leva um prato, ou a origem é
a descrição portuguesa do `data/ementa.json` (a palavra da casa), ou vai para o
`PERGUNTAS` e o texto fica como está.

## Porque é que este ficheiro deixou de bater certo, e o que se fez

Houve aqui uma revisão do inglês, escrita neste ficheiro e aplicada ao
`folhas.json`. **Depois veio outra, e essa é do dono** — o commit «O inglês da
ementa passa pela revisão da casa», que fecha o #54: a lista veio dele, prato a
prato, e sobrepôs-se a onze das entradas que estavam aqui.

Não foi engano nenhum. Foi a palavra da casa a chegar depois, que é como tem de
ser. O que ficou por fazer foi **este ficheiro acompanhá-la**: continuou a
propor um texto que já não era o impresso, e uma proposta que não se cumpre é
pior do que não existir — lê-se como se estivesse feita. Nada comparava os dois,
por isso nada avisou.

A correcção não foi mudar a ementa. Foi:

1. **passar isto a descrever o que está impresso**, e não o que se gostaria;
2. **mandar para o `PERGUNTAS` os cinco casos em que o inglês diz mais do que o
   português da casa** — o chouriço, a bifana e as três groselhas. Ficam como
   estão e vão à lista de quem sabe;
3. **acrescentar o `verificar()`** aqui em baixo, que confronta este ficheiro
   com o `folhas.json` e **falha** se voltarem a divergir. É a mesma disciplina
   dos preços e do endereço do QR: uma transcrição sem quem a confira envelhece
   sozinha, e esta envelheceu.

Uma nota sobre o registo, porque volta a aparecer caso a caso. O inglês do site
é escrito para se aguentar sozinho — lá a descrição pode aparecer longe do nome.
No papel o nome está na linha de cima, a 13 pt, e por isso há descrições que se
repetem («Shrimp» por baixo de «Camarão»). **Não se encurtou nenhuma por conta
própria:** mudar o papel sem mudar o site é escolher que os dois digam coisas
diferentes, e essa escolha não é de quem escreve código.
"""

import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
FOLHAS = os.path.join(AQUI, "folhas.json")


# nome do prato -> (o inglês que está na ementa, porque é este)
NA_EMENTA = {
    # ---- vêm da descrição PT do data/ementa.json ----
    "Tábua de presunto e queijo": ("Cured ham, aged cheese, olives and bread",
        "o PT diz que leva azeitonas e pão; o papel antigo omitia-os"),
    "Pataniscas": ("Salt cod fritters, made to order",
        "«cod» → «salt cod»; e o PT diz que são feitas à medida do pedido"),
    "Bacalhau à Brás": ("Shredded salt cod, straw potatoes, egg and black olives",
        "junta as duas fontes: o papel dizia ovo, o PT diz azeitona preta"),
    "Panaché": ("Beer with lime soda",
        "o papel antigo dizia «lemonade»; o PT diz «refrigerante de lima»"),

    # ---- repetem o nome do prato, que no papel está na linha de cima ----
    "Camarão": ("Shrimp (boiled, served warm with coarse salt)",
        "o cozido, o morno e o sal grosso estão no PT. O «Shrimp» do parêntesis "
        "veio da revisão da casa, que escreve para o site — lá a descrição pode "
        "aparecer longe do nome. No papel não, mas não se encurta sem o dono"),
    "Moelas": ("Chicken gizzards, slow-stewed in red wine",
        "o «devagar» está no PT. O «Chicken gizzards» repete o nome, pela mesma "
        "razão do camarão — e a moela é dos pratos em que dizer o que é ajuda"),
    "Bife na pedra": ("Steak served on a sizzling hot stone",
        "«steak on the stone» era literal demais. O «sizzling» não está no PT, "
        "mas é o que uma pedra quente faz — não afirma nada sobre a carne"),
    "Coca-Cola zero": ("No sugar Coca-Cola, canned",
        "distingue-a da lata normal, que dizia o mesmo"),

    # ---- o «French fries (USA) / potato chips (UK)» ----
    #
    #  É decisão do dono, e tem razão de ser: **«chips» sozinho lê-se de duas
    #  maneiras conforme o lado do Atlântico** — um americano à espera de batata
    #  frita recebia um pacote de batata frita de pacote. Está no commit «O
    #  inglês da ementa passa pela revisão da casa», que fecha o #54.
    #
    #  Apanha seis artigos: o Prego no prato, as Lulas ao alho, a Alheira com
    #  ovo, a Salsicha com ovo, o Prato de batata e a Dose de batatas fritas.
    #  No papel a construção é longa, mas é a mesma nos seis e é deliberada.
    #  Quem a quiser encurtar, encurta os seis — e no site também.
    "Lulas ao alho com batata frita": (
        "Garlic squid, grilled to order, with French fries (USA) / potato chips (UK)",
        "o «grelhadas na hora» do PT está lá; o resto é a fórmula que o dono escolheu"),
    "Prato de batata": ("Side of French fries (USA) / potato chips (UK)",
        "o «Side of» contrasta com a dose cheia; o resto é a mesma fórmula"),

    # ---- inglês melhor, sem afirmar nada de novo ----
    "Amendoins sem casca": ("Shelled peanuts", "«sem casca» faltava"),
    "Meia de leite": ("Half coffee, half milk",
        "«flat white» é outra bebida; isto é o que o nome diz"),
    "Carioca de café": ("A weaker, lighter espresso", "«weak short coffee» lia-se mal"),
    "Caneca 0,5 L": ("Half-litre mug", "o tamanho está no nome; «beer mug» não dizia nada"),
    "Cutty Sark": ("Blended Scotch", "três seguidos diziam só «Blended»"),
    "Whiskey Jameson": ("Irish", "idem"),
    "Whiskey Old Parr": ("Aged blended Scotch", "idem, para «Aged» não se repetir"),
    "Ponche": ("Sweet punch liqueur", "para não se confundir com a Poncha, logo acima"),
}


# ficam como estão, e porquê — são estas as perguntas por responder
PERGUNTAS = [
    # ---- o inglês diz mais do que o português da casa ----
    ("Chouriço assado", "Flame-grilled chorizo on a terracotta roasting dish",
     "o PT diz «assado na telha, à frente de quem o pede». O inglês põe lá uma "
     "chama que o PT não põe, e deita fora o «à frente de quem o pede», que é a "
     "parte que vende o prato. Assa-se mesmo em chama, ou é só na telha?"),
    ("Bifana", "Thinly sliced pork sandwich, stewed the day before in its own marinade",
     "o PT diz «estufada de véspera no seu molho». Estufar não é marinar: "
     "«marinade» diz que a carne esteve num tempero antes de ir ao lume. "
     "É molho da própria carne ou é marinada?"),

    # ---- groselha: qual das duas? ----
    #
    #  Não é estilo nem descuido — é uma decisão que depende do que a casa põe
    #  no copo. O xarope de groselha português é normalmente de cassis, que em
    #  inglês é «blackcurrant»; «redcurrant» é groselha vermelha, outro fruto.
    #  Os três dizem o mesmo, portanto ou se muda os três ou nenhum.
    ("Tango", "Beer with redcurrant syrup",
     "groselha de cassis (blackcurrant) ou groselha vermelha (redcurrant)?"),
    ("Caneca tango", "Beer with redcurrant syrup in a mug", "idem"),
    ("Caneca de alumínio tango", "Beer with redcurrant syrup in a tin mug", "idem"),

    # ---- não descrevem nada, ou levantam dúvida ----
    ("Tosta especial", "Special toastie",
     "diz o nome traduzido e mais nada. O que leva?"),
    ("Amêijoa à pirata", "“Pirate” clams",
     "idem — o que é que faz a amêijoa ser «à pirata»?"),
    ("Licor", "Liqueur",
     "qual licor? Ou é «o que houver», e nesse caso vale a pena dizê-lo"),
    ("Caneca super", "Large beer mug",
     "custa 3,00 e a de 0,5 L custa 4,50 — se a de meio litro é maior, "
     "chamar «large» a esta engana"),
    ("Croft", "Brandy",
     "a Croft é conhecida por vinho do Porto. O PT do site também diz brandy, "
     "por isso não mexi — mas vale confirmar"),
    ("Pingo", "Milk with a drop of coffee",
     "está descrito como o contrário do «café pingado». É mesmo assim na casa?"),
]


def verificar():
    """Confronta este ficheiro com o `folhas.json`, que é o que se imprime.

    Existe porque a alternativa já se provou: sem isto, o inglês do site
    sobrepôs-se a onze descrições e este ficheiro passou meses a dizer o
    contrário do que ia para o papel, sem ninguém reparar.
    """
    dados = json.load(open(FOLHAS, encoding="utf-8"))
    na_ementa = {}

    def andar(o):
        if isinstance(o, dict):
            if o.get("nome") and o.get("en") is not None:
                na_ementa[o["nome"]] = o["en"]
            for v in o.values():
                andar(v)
        elif isinstance(o, list):
            for v in o:
                andar(v)

    andar(dados)

    esperado = {n: t for n, (t, _) in NA_EMENTA.items()}
    esperado.update({n: t for n, t, _ in PERGUNTAS})

    sumido, mudou = [], []
    for nome, texto in esperado.items():
        real = na_ementa.get(nome)
        if real is None:
            sumido.append(nome)
        elif real.rstrip(".") != texto.rstrip("."):
            mudou.append((nome, texto, real))

    for nome in sumido:
        print(f"✗ {nome}: já não está na ementa")
    for nome, texto, real in mudou:
        print(f"✗ {nome}")
        print(f"    aqui:      {texto}")
        print(f"    na ementa: {real}")

    if sumido or mudou:
        raise SystemExit(
            f"\n{len(sumido) + len(mudou)} descrições fora de sítio.\n"
            "Ou o inglês da ementa mudou e este ficheiro tem de o acompanhar, "
            "ou mudou por engano e é a ementa que volta atrás. Não se deixa "
            "assim: foi exactamente por ficar assim que se perdeu a revisão "
            "anterior.")

    print(f"{len(esperado)} descrições conferidas com o folhas.json — todas certas")
    print(f"{len(PERGUNTAS)} por confirmar com o dono")


if __name__ == "__main__":
    verificar()
