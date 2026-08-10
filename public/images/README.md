# Fotografias

Trinta e três ficheiros. Os nomes descrevem o conteúdo — não voltar aos identificadores
do Facebook. O registo em código, com texto alternativo e dimensões, é o
`lib/images.ts`; este ficheiro guarda a proveniência.

Não há imagens remotas. O `next.config.ts` já não tem `remotePatterns` e não
deve voltar a ter.

## Da casa (25)

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
| `esqueleto.jpg` | 1536×2048 | O esqueleto pirata sentado na arca, de perto. |
| `esqueleto-corpo.jpg` | 1080×1440 | Corpo inteiro, com as ripas da ementa manuscrita atrás. |
| **`esqueleto-grande.png`** | 1200×1367 | **A que está no site.** Recortada, com fundo transparente. Fornecida já assim. |

> As duas primeiras têm a parede, a calçada e a floreira atrás — servem de
> galeria e de referência, não de autocolante. É a terceira que o
> `components/decor/Esqueleto.tsx` monta.
>
> Chegou com 3228×3678 e 8,8 MB, reduzida a 1200 px. O git guarda ficheiros
> grandes para sempre, mesmo depois de apagados.
>
> **Se um dia for substituída:** reconfirmar o `ASSENTO` nesse componente.
> É a fracção da altura por onde a régua da secção lhe passa (86% nesta — a
> arca fica pousada em cima da linha). Um recorte com outro enquadramento
> muda o número.

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

## Ilustrações de fora (8)

Não são da casa. São imagens externas usadas como decoração, e é por isso que
`lib/images.ts` marca cada fotografia com `origem`.

| Ficheiro | Dim. | Uso |
|---|---|---|
| `nau-cruz.jpg` | 401×453 | Nau portuguesa com a cruz de Cristo. |
| `nau-armada.webp` | 800×547 | Nau das armadas do século XVI. |
| **`naus-frota.jpg`** | 630×420 | **Fundo da secção "A casa".** Frota à vela. |
| `caveira-madeira.jpg` | 570×713 | **Ecrã de entrada.** Já vem com fundo preto. |
| `caveira-lenco.webp` | 410×500 | Decoração. |
| `caveira-mesa.webp` | 500×500 | Decoração. |
| **`tronco.png`** | 6000×1563 | **A trave da junta.** Recorte transparente; a madeira ocupa só a faixa dos 33% aos 68% da altura. |
| **`tableta.webp`** | 1800×1800 | **A tabuleta do "A casa".** Tábua, ferragens e correntes na mesma imagem, recortadas. |

> **A `tableta.webp` tem uma marca de água da Dreamstime** gravada nas ripas
> do meio — lê-se por baixo do texto. Precisa de ser trocada pela versão
> licenciada antes de isto ir para o ar.
>
> **Se for trocada:** remedir as sete fronteiras que o
> `components/decor/Tabuleta.tsx` tem escritas no comentário do topo. São as
> únicas coisas que esse componente sabe da imagem, e é delas que sai o
> recorte em nove fatias.
>
> A `tronco.png` tem o mesmo tipo de dependência: os 35,5% de madeira estão
> escritos no `Tronco.tsx` e é de lá que sai a espessura da trave.

## Fundos de secção

Cinco fotografias deixaram de ser só conteúdo e passaram a ser o fundo de uma
secção inteira, a 15% de opacidade (`components/decor/FundoDeSeccao.tsx`).

| Secção | Ficheiro |
|---|---|
| A casa | `naus-frota.jpg` |
| Petiscos | `balcao-bandeirinhas.jpg` |
| O sítio | `tecto-nau.jpg` |
| O que dizem | `sala-estatuas.jpg` |
| Encontrar-nos | `mar-por-do-sol.jpg` |

> A `naus-frota.jpg` vai **desfocada de propósito**. Tem 630×420, é a mais
> pequena da pasta, e como fundo de secção num ecrã largo é ampliada quase 3×.
> O desfoque assume a falta de nitidez em vez de a tentar esconder — foi
> decisão do Gonçalo, com o problema em cima da mesa. Uma versão maior deste
> ficheiro deixa tirar o `desfoque` no `Casa.tsx`.
>
> A opacidade desceu de 75% para 15% depois desta decisão, e a essa altura a
> falta de nitidez já quase não se vê — o `desfoque` ficou por não ser meu o
> voto que o pôs lá.
>
> A `sala-estatuas.jpg` aparece **duas vezes**: é o fundo da secção "O que
> dizem" e é uma das quatro molduras da galeria, em "O sítio". Como as duas
> secções são vizinhas, vale a pena confirmar no ecrã se não fica a repetir-se
> de mais.

## Formato

Ficam em JPEG e WebP como chegaram, sem reconversão. O `next/image` já serve
WebP redimensionado em tempo de execução, por isso o visitante não descarrega
estes ficheiros; voltar a comprimir os originais só acrescentava uma geração de
perda ao que já é material comprimido, para poupar cerca de 5 MB num
repositório que os aguenta bem.

**A `tableta.webp` é a excepção, e o motivo é o que confirma a regra.** Não
passa pelo `next/image`: é consumida por `url()` dentro de um `border-image`,
e o CSS não tem optimizador nenhum — o que estiver no ficheiro é o que o
visitante descarrega. Chegou com 6000×6000 e **39 MB**. Está aqui a 1800 px em
WebP, 418 KB, que é o triplo da maior caixa em que alguma vez aparece.
