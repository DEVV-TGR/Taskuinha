# Taskuinha do Pirata

Site da Taskuinha (Rumoceano-Taskuinha), taberna de petiscos em frente à
praia de Vila Chã, Vila do Conde. Duas páginas: a inicial e a ementa.

**Redesenho "taberna total, noite de tempestade"** — ver `docs/PLANO.md` para
a especificação completa e `MAPA.md` para o índice de navegação do projecto.
Fotografia real da casa (30 ficheiros em `public/images/`, inventário em
`public/images/README.md`); tudo o que ainda falta está listado abaixo.

## Correr

```bash
npm install
npm run dev
```

## Como está feito

Next.js 16 com App Router, TypeScript, Tailwind v4 (CSS-first), Motion para
as animações e Phosphor para os ícones. Duas rotas estáticas em quatro
línguas, sem base de dados.

O CMS é o próprio repositório: há um painel em `/painel` onde o dono da casa
muda preços e pratos, e o que ele grava é um commit em `data/*.json` que faz a
Vercel reconstruir o site. Ver `docs/PAINEL.md`.

```
app/               layout com fontes, metadata e JSON-LD; página inicial e /ementa
components/        uma secção por ficheiro; as que animam são client components
components/decor/  a camada de tralha — aranha, rede, barris, lanternas…
data/ementa.json   os pratos, os preços e as descrições nas quatro línguas
data/casa.json     morada, telefone, horário e redes sociais
lib/site.ts        junta o data/casa.json às coordenadas e ao mapa, que ficam em código
lib/menu.ts        lê o data/ementa.json; e os 6 destaques da página inicial
lib/images.ts       fotografia local, com origem e tratamento de cada ficheiro
lib/reviews.ts      notas agregadas e citações recolhidas das plataformas
lib/texturas.ts     geradores de textura (madeira, pergaminho, rede, grão)
```

### Desenho

Tema único, escuro — "noite de tempestade". Não há modo claro: o conceito
não tem versão diurna coerente. Acento principal âmbar (luz de lanterna),
secundário vermelho (Super Bock, o lenço da caveira). Tipografia Rye para
títulos e wordmark, Alegreya Sans para o corpo, Special Elite para preços e
horas, IM Fell English SC só dentro do pergaminho da ementa. Um só raio de
canto: 4px em tudo — nada é pílula, tudo é madeira serrada.

O movimento é contido e sempre justificado: revelação em scroll ("cair e
balançar", com spring e inclinação alternada), parallax curto na fotografia
do cabeçalho, uma camada de tralha decorativa (aranha, rede, lanternas) que
reage ao rato e ao scroll. Tudo colapsa com
`prefers-reduced-motion` e o conteúdo continua visível sem JavaScript.

## Publicado

O site está no ar, em **https://www.taskuinhapirata.pt**.

Esta secção era uma lista de quatro coisas a fazer antes de publicar, e
está toda feita:

- **Os preços são os da casa.** A ementa foi transcrita das fotografias do
  livro que o dono forneceu, e revista com ele. Saíram os preços de
  demonstração e o aviso que os acompanhava — a flag `PRECOS_SAO_DEMO` já
  não existe.
- **A morada, o telefone e o horário** em `data/casa.json` foram confirmados
  com ele. Tinham sido recolhidos de agregadores públicos.
- **As citações** em `lib/reviews.ts` foram revistas.
- **O domínio** em `site.url` é o verdadeiro. Dele saem o `canonical`, o
  `og:image`, o JSON-LD e o sitemap.

## Fora de âmbito

Reservas online, área de gestão e sugestões do dia.

As quatro línguas — português, inglês, francês e espanhol — estavam aqui
como o passo seguinte mais útil, para os peregrinos do Caminho. Deixaram
de estar por fazer.
