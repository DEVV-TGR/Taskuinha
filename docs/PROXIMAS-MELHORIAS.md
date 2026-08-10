# Próximas melhorias — depois da reunião de terça

> Recolhido depois de mostrares o redesenho ao cliente (ele gostou, sobretudo
> da ideia de o site ter mesmo a essência da casa). São as tuas notas de
> reacção, organizadas em tarefas, para levares para a reunião de **terça de
> manhã, ~10h, na Taskuinha**, sentados os dois à mesa.
>
> **Ainda não implementado.** Isto é o guião da reunião, não um plano já
> executado — ao contrário do `docs/PLANO.md`, que já está feito.

---

## O objectivo, em uma frase

> "Quero que o site pareça algo feito exactamente para aquele restaurante —
> um complemento, não uma coisa à parte. Que quem entra sinta a vibe, sinta
> que está dentro da casa."

Isto é o critério para julgar cada item abaixo: **aproxima da casa real ou
afasta?** Sempre que houver dúvida entre "mais bonito em abstracto" e "mais
parecido com a Taskuinha a sério", ganha a segunda.

---

## O que muda

### 1. Loader de página — em cada navegação, não só na entrada

Hoje só há o ecrã de abertura (`Entrada.tsx`), e só uma vez por dia. Passa a
haver dois momentos distintos, não confundir:

- [ ] **Loader de transição entre páginas** — sempre que se navega dentro do
      site (ex.: da inicial para `/ementa`), mostrar um ecrã de carregamento
      breve antes da página seguinte aparecer. Não existe hoje: a navegação
      é instantânea (é uma *single-page app* por baixo). Implica um
      componente novo ligado ao Next.js (`loading.tsx` ou uma transição
      controlada por JS) — a decidir na implementação qual dá melhor
      resultado sem atrasar a navegação a sério.
- [ ] **O ecrã de abertura passa a aparecer sempre**, não uma vez por dia.
      Hoje o `Entrada.tsx` guarda a data em `localStorage` e só volta a
      mostrar-se no dia seguinte — isso foi uma decisão minha no plano
      original, não um pedido teu. Vou tirar essa condição.
      **A perguntar ao cliente:** ele confirma que quer isto sempre, mesmo
      sabendo que vai atrasar ligeiramente cada visita a quem já conhece o
      site? É a troca directa: mais imersão vs. mais fricção para quem volta.

### 2. Tralha decorativa — o que sai, o que muda, o que fica

| Elemento | Decisão |
|---|---|
| **Sardaniscas** (as lagartixas) | ✅ **Feito.** Componente apagado e as três instâncias fora do `Tralha.tsx`. Nada entrou no lugar. |
| **Aranha** | **Fica, mas re-desenhada.** Gostas da ideia, não do desenho actual (é um SVG simples, geométrico). Substituir por uma ilustração mais realista — ver `RECURSOS-A-PROCURAR.md`. |
| **Esqueleto** | **Fica, mas passa a ser a fotografia real da casa**, não o SVG desenhado à mão que está lá agora. Ver ponto 3. |
| **Barris** | **Ficam, mas passam a fotografia real**, não SVG. Ver ponto 4. |
| **Caveiras** | **Mais.** Está só uma (a `BandeiraNegra`, na bandeira) e o favicon. Acrescentar mais pontos de caveira decorativa — a definir onde durante a implementação (rodapé? separadores de secção? cantos?). |
| Rede, Bandeirinhas, Lanterna, Relâmpago, Mar | Sem feedback — presume-se que ficam como estão. Confirmar na reunião se algum incomoda. |

### 3. Esqueleto — fotografia real, recortada, "estilo 3D"

O mascote da casa é uma estátua a sério, sentada à porta com uma garrafa. Em
vez do SVG genérico que está no site:

- [ ] Tirar uma fotografia nova, de perto, bem enquadrada e com boa luz —
      **terça-feira é a oportunidade** (ver `RECURSOS-A-PROCURAR.md`).
- [ ] Recortar o fundo (remover o fundo da foto, ficar só a estátua com
      transparência).
- [ ] Posicionar no site como um elemento "solto" por cima do layout — o
      exemplo que deste foi as pernas penduradas para fora da borda de uma
      secção, como um autocolante 3D colado por cima do design, não uma
      imagem dentro de uma caixa. É o mesmo princípio visual dos ícones
      "die-cut" que se vêem em sites com produto real fotografado — aqui
      aplicado ao mascote.
- [ ] Decidir em que secção(ões) aparece. Um só sítio bem feito bate cinco
      sítios genéricos.

### 4. Barris reais, não ilustrados

- [ ] Fotografar os barris reais da fachada (ou usar as fotos que já
      existem em `public/images/fachada-noite.jpg` e semelhantes) para
      substituir os SVGs de `components/decor/Barril.tsx`.
- [ ] Provavelmente recortados (como o esqueleto) para poderem ser
      reposicionados livremente, mantendo a física do pêndulo que já existe
      no componente — só troca o desenho, não o comportamento.

### 5. Ementa — pergaminho a sério, não ilustrado

O `Pergaminho.tsx` actual gera a textura por SVG (determinístico, leve, sem
ficheiros) — funciona, mas lê-se como ilustração, não como pergaminho a
sério. Queres:

- [ ] Texturas de papel antigo/pergaminho reais (fotografadas ou de banco de
      imagens de alta qualidade), para ficar com o acabamento "profissional"
      que referiste — ver `RECURSOS-A-PROCURAR.md`.
- [ ] Isto troca o **acabamento visual**, não a estrutura: continua a ser
      HTML a sério (indexável, editável), só a superfície muda de gerada
      para fotografada.

### 6. Fundos das secções — não mais preto liso

Hoje cada secção assenta em `--breu` ou `--breu-fundo` (cor sólida escura).
Queres:

- [ ] Fotos do ambiente real da casa (paredes cheias de decoração, tecto da
      nau, etc.) como fundo de secção, com opacidade reduzida — para a
      secção de conteúdo ler-se por cima, sem competir, mas com a casa
      sempre presente atrás.
- [ ] Já há material que serve para isto nas fotos existentes
      (`tecto-nau.jpg`, `balcao-bandeirinhas.jpg`, `sala-estatuas.jpg` —
      ver `public/images/README.md` para o inventário completo). Pode não
      ser preciso fotografar nada de novo, só reaproveitar em fundo do que
      hoje só aparece na galeria.
- [ ] Cuidado a rever na implementação: contraste de texto por cima destas
      fotos tem de continuar a passar AA (a mesma regra que já está a valer
      nas fotos em primeiro plano — duas camadas de gradação, `--breu`
      multiply + `--lanterna` overlay).

### 7. Animação — afinar a intensidade

Referiste querer "diminuir uma coisinha" em geral, e mencionaste letras.
Vago de propósito — a decidir olhando para o site ao vivo:

- [ ] Rever com o cliente ao vivo (talvez terça-feira mesmo, no telemóvel
      dele) o balanço dos barris, o *overshoot* do `Reveal` (o efeito de
      "cair e balançar" das secções), e o *flicker* da lanterna — apontar
      quais parecem "a mais".
- [ ] **Não mexer** no que já colapsa com `prefers-reduced-motion` — é
      acessibilidade, separado do gosto estético.

### 8. Ementa com os dados verdadeiros

Já estava assinalado no `MAPA.md` como pendente, mas a reunião de terça é
literalmente a oportunidade de resolver isto ao vivo:

- [ ] Preços reais de cada prato (`lib/menu.ts`, `PRECOS_SAO_DEMO` passa a
      `false` quando estiverem todos).
- [ ] Confirmar morada, telefone e horário (`lib/site.ts`) — vêm de
      agregadores públicos, nunca confirmados directamente com o Anselmo.
- [ ] Perguntar se algum prato da ementa actual está errado, em falta, ou
      descontinuado.

---

## O que fica (não reabrir)

Para não perder tempo a rediscutir o que já está fechado:

- A paleta "noite de tempestade" e a ausência de modo claro.
- A tipografia (Rye, Alegreya Sans, Special Elite, IM Fell English SC).
- O N invertido no wordmark (`TASKUIИHA`) — é a assinatura real da casa, não
  um capricho de design.
- A estrutura das duas páginas e a navegação.
- O sistema de acessibilidade (movimento reduzido, sem JavaScript, foco de
  teclado) — qualquer mudança de estilo tem de continuar a passar por estas
  regras, não as substitui.

---

## Checklist para levar terça-feira

Coisas para fazer **fisicamente no local**, não só para conversar:

- [ ] Fotografar o esqueleto de perto, boa luz, ângulo que sirva para
      recorte de fundo.
- [ ] Fotografar os barris reais da fachada, de frente, luz do dia.
- [ ] Fotografar 2–3 paredes/zonas decoradas por inteiro (para fundos de
      secção) — enquadramento largo, não close-up.
- [ ] Perguntar ao Anselmo os preços de cada prato da ementa.
- [ ] Confirmar morada exacta, horário (incluindo se "segunda-feira,
      folga" está mesmo certo) e telefone.
- [ ] Mostrar o site ao vivo no telemóvel dele e apontar, ao vivo, qual
      animação parece "a mais".
- [ ] Decidir, os dois, se o ecrã de entrada aparece mesmo sempre ou se
      volta a ser só a primeira vez do dia.

Leva este ficheiro (ou o `RECURSOS-A-PROCURAR.md` ao lado) aberto no
telemóvel ou impresso — é para isso que existe.
