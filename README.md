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
as animações e Phosphor para os ícones. Duas rotas estáticas, sem base de
dados e sem CMS.

```
app/               layout com fontes, metadata e JSON-LD; página inicial e /ementa
components/        uma secção por ficheiro; as que animam são client components
components/decor/  a camada de tralha — aranha, rede, barris, lanternas…
lib/site.ts        morada, telefone, horário, coordenadas e redes
lib/menu.ts        ementa e destaques
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

## O que falta para publicar

1. **Preços verdadeiros** em `lib/menu.ts`, e pôr `PRECOS_SAO_DEMO` a `false`
   para desaparecer o aviso no fim da ementa e do rodapé. Não há preços
   publicados em lado nenhum (nem no site oficial, nem no RestaurantGuru);
   os actuais são inventados, calibrados para o intervalo de 10–20 € por
   pessoa que as avaliações indicam.
2. **Confirmar com o Anselmo** a morada, o telefone e o horário em
   `lib/site.ts`. Foram recolhidos de agregadores públicos em Agosto de 2026.
3. **Confirmar a origem das citações** em `lib/reviews.ts`. Foram lidas
   através de agregadores e a atribuição a cada plataforma pode não estar
   certa.
4. ~~**Domínio real** em `site.url`, que o JSON-LD, o sitemap e os cartões de
   partilha usam.~~ Feito: `https://www.taskuinhapirata.pt`.

## Fora de âmbito

Reservas online, área de gestão, inglês para os peregrinos e sugestões do
dia. Se o site for aprovado, o inglês é o passo seguinte mais útil.
