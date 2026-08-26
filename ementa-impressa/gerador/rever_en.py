# -*- coding: utf-8 -*-
"""Revisão do inglês da ementa impressa.

Regra: melhora-se a escrita livremente; **não se inventam factos sobre a comida**.
Onde a melhoria exigiria afirmar o que leva um prato, ou a origem é a descrição
portuguesa do `data/ementa.json` (a palavra da casa), ou vai para a lista de
perguntas e o texto fica como estava.
"""

# nome do prato -> (inglês novo, porquê)
NOVO = {
    # ---- sourced na descrição PT do data/ementa.json ----
    "Tábua de presunto e queijo": ("Cured ham, aged cheese, olives and bread",
        "o PT do site diz que leva azeitonas e pão; o papel omitia-os"),
    "Camarão": ("Boiled, served warm with coarse salt",
        "detalhe que está no PT e faltava"),
    "Lulas ao alho com batata frita": ("Grilled to order, with garlic and chips",
        "o PT diz «grelhadas na hora»"),
    "Pataniscas": ("Salt cod fritters, made to order",
        "«cod» → «salt cod»; e o PT diz que são feitas à medida do pedido"),
    "Moelas": ("Slow-stewed in red wine",
        "o PT sublinha o «devagar»"),
    "Bacalhau à Brás": ("Shredded salt cod, straw potatoes, egg and black olives",
        "junta as duas fontes: o papel dizia ovo, o PT diz azeitona preta"),
    "Chouriço assado": ("Roasted on a clay tile, in front of whoever ordered it",
        "o papel dizia «flamed»; o PT da casa diz «assado na telha»"),
    "Bifana": ("Stewed the day before in its own sauce",
        "o papel dizia «marinated»; o PT diz «estufada de véspera»"),
    "Panaché": ("Beer with lime soda",
        "o papel dizia «lemonade»; o PT diz «refrigerante de lima»"),

    # ---- inglês melhor, sem afirmar nada de novo ----
    "Amendoins sem casca": ("Shelled peanuts", "«sem casca» faltava"),
    "Prato de batata": ("Side of chips", "para contrastar com a dose cheia"),
    "Meia de leite": ("Half coffee, half milk",
        "«flat white» é outra bebida; isto é o que o nome diz"),
    "Carioca de café": ("A weaker, lighter espresso", "«weak short coffee» lia-se mal"),
    "Bife na pedra": ("Served on a hot stone", "«steak on the stone» era literal demais"),
    "Coca-Cola zero": ("Canned, no sugar", "distingue-a da lata normal, que dizia o mesmo"),
    "Caneca 0,5 L": ("Half-litre mug", "o tamanho está no nome; «beer mug» não dizia nada"),
    "Cutty Sark": ("Blended Scotch", "três seguidos diziam só «Blended»"),
    "Whiskey Jameson": ("Irish", "idem"),
    "Whiskey Old Parr": ("Aged blended Scotch", "idem, para «Aged» não se repetir"),
    "Ponche": ("Sweet punch liqueur", "para não se confundir com a Poncha, logo acima"),

    # ---- groselha: uniformizar nos quatro ----
    "Caneca de alumínio tango": ("Tin mug, with blackcurrant syrup", "groselha, uniformizado"),
    "Caneca tango": ("Beer mug, with blackcurrant syrup", "idem"),
    "Tango": ("Beer with blackcurrant syrup", "idem"),
}

# ficam como estão, e porquê — vão para a lista de perguntas
PERGUNTAS = [
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
