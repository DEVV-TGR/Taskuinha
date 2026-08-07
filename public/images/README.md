# Fotografias

Trinta ficheiros. Os nomes descrevem o conteúdo — não voltar aos identificadores
do Facebook. O registo em código, com texto alternativo e dimensões, é o
`lib/images.ts`; este ficheiro guarda a proveniência.

Não há imagens remotas. O `next.config.ts` já não tem `remotePatterns` e não
deve voltar a ter.

## Da casa (24)

Fotografadas na Taskuinha, vindas do Facebook da casa e de fotografias enviadas
pelo Gonçalo.

### Fachada

| Ficheiro | Dim. | O que tem |
|---|---|---|
| `fachada-noite.jpg` | 1536×2048 | **A foto do hero.** PIRATA iluminado, os seis barris pendurados, porta aberta, esqueleto, calçada. |
| `fachada-noite-2.jpg` | 1536×2048 | A mesma fachada noutra noite, mais de frente. |
| `fachada-por-do-sol.jpg` | 2048×1536 | Sol rasante. **A melhor prova do letreiro** `TASKUIИHA` e do cartaz do horário. |

### O mascote

| Ficheiro | Dim. | O que tem |
|---|---|---|
| `esqueleto.jpg` | 1536×2048 | O esqueleto pirata sentado na arca, de perto. Base do recorte. |
| `esqueleto-corpo.jpg` | 1080×1440 | Corpo inteiro, com as ripas da ementa manuscrita atrás. |

### Interior

| Ficheiro | Dim. | O que tem |
|---|---|---|
| `bandeira-caveira.jpg` | 2048×1536 | **O símbolo da casa.** Base do favicon e do cartão de partilha. |
| `leme-taskuinha.jpg` | 1536×2048 | O comando de mesa em forma de leme — a letra da casa, com o N invertido. |
| `tecto-nau.jpg` | 2048×1536 | O mural da nau em tempestade, e a parede de miniaturas por baixo. |
| `tecto-nau-aranha.jpg` | 1152×2048 | **A aranha real**, pendurada sobre o mural. |
| `sala-cheia.jpg` | 2048×1536 | Sala cheia de noite, cachecóis de clubes, lanternas de papel. |
| `balcao-bandeirinhas.jpg` | 2048×1536 | **As bandeirinhas reais**, pela ordem em que estão penduradas. |
| `balcao-espingardas.jpg` | 2048×1536 | Espingardas e remos cruzados sobre o balcão. |
| `sala-estatuas.jpg` | 2048×1536 | Os piratas em tamanho real, a arca do tesouro, o Captain Morgan. |

### Esplanada e mar

| Ficheiro | Dim. | O que tem |
|---|---|---|
| `esplanada.jpg` | 2048×1536 | Vedação de tábuas às cores, prancha do I.S.N., bicicleta velha. |
| `esplanada-2.jpg` | 2048×1536 | As mesas vermelhas, mais de frente. |
| `mar-por-do-sol.jpg` | 2048×1536 | O Atlântico em maré vazia, do murete da marginal. |
| `mar-cao.jpg` | 1536×2048 | Um homem e o cão a ver o sol pôr-se. |

### Petiscos

Cinco são pratos servidos à mesa. Dois são produto acabado de chegar.

| Ficheiro | Dim. | O que é mesmo |
|---|---|---|
| `petisco-ameijoas.jpg` | 1536×2048 | Amêijoas em azeite e orégãos, com limão. Servido. |
| `petisco-lapas.jpg` | 1536×2048 | Lapas ao alho sobre pão torrado. Servido. Apanha o leme na mesa. |
| `petisco-lulas.jpg` | 1536×2048 | Lulas **grelhadas** com batata frita. Servido. |
| `petisco-sardinhas.jpg` | 1536×2048 | Sardinhas assadas sobre **pão de trigo** — não é broa. Servido. |
| `petisco-percebes.jpg` | 1536×2048 | Percebes cozidos e uma navalheira, com cerveja. Servido. |
| `percebes-crus.jpg` | 1536×2048 | Percebes crus num alguidar. Produto, não prato. |
| `lapas-cruas.jpg` | 1536×2048 | Lapas cruas numa tábua. Produto, não prato. |

> **Não há fotografia de sapateira.** O plano do redesenho supunha que
> `petisco-percebes.jpg` fosse uma — é uma navalheira pequena, ao lado de um
> prato de percebes. A escolha dos seis destaques tem de contar com isto.

## Ilustrações de fora (6)

Não são da casa. São imagens externas usadas como decoração, e é por isso que
`lib/images.ts` marca cada fotografia com `origem`.

| Ficheiro | Dim. | Uso |
|---|---|---|
| `nau-cruz.jpg` | 401×453 | Nau portuguesa com a cruz de Cristo. |
| `nau-armada.webp` | 800×547 | Nau das armadas do século XVI. |
| `naus-frota.jpg` | 630×420 | Frota à vela. |
| `caveira-madeira.jpg` | 570×713 | **Ecrã de entrada.** Já vem com fundo preto. |
| `caveira-lenco.webp` | 410×500 | Decoração. |
| `caveira-mesa.webp` | 500×500 | Decoração. |

## Formato

Ficam em JPEG e WebP como chegaram, sem reconversão. O `next/image` já serve
WebP redimensionado em tempo de execução, por isso o visitante não descarrega
estes ficheiros; voltar a comprimir os originais só acrescentava uma geração de
perda ao que já é material comprimido, para poupar cerca de 5 MB num
repositório que os aguenta bem.
