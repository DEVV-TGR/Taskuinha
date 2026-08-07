# Taskuinha do Pirata

Demonstração de site para a Taskuinha (Rumoceano-Taskuinha), taberna de
petiscos em frente à praia de Vila Chã, Vila do Conde. Duas páginas: a
inicial e a ementa.

**Isto é um demo.** As fotografias não são da casa e os preços da ementa são
inventados. Tudo o que é substituível está assinalado no código.

## Correr

```bash
npm install
npm run dev
```

## Como está feito

Next.js 16 com App Router, TypeScript, Tailwind v4, Motion para as animações
e Phosphor para os ícones. Duas rotas estáticas, sem base de dados e sem CMS.

```
app/            layout com fontes, metadata e JSON-LD; página inicial e /ementa
components/     uma secção por ficheiro; as que animam são client components
lib/site.ts     morada, telefone, horário, coordenadas e redes
lib/menu.ts     ementa e destaques
lib/images.ts   fotografia, com o nome do ficheiro local que a vai substituir
lib/reviews.ts  notas agregadas e citações recolhidas das plataformas
```

### Desenho

Tema escuro como identidade da casa, com uma variante clara coerente para
quem tem o sistema em modo claro. Um único acento, laranja de farol, igual
nos dois modos. Tipografia Archivo em largura expandida para os títulos,
Geist para o corpo e Geist Mono para preços e horas. Um só raio de canto:
4px nas superfícies, pill nos botões.

O movimento é contido e sempre justificado: revelação em scroll a marcar a
ordem de leitura, parallax curto na fotografia do cabeçalho e resposta
física nos botões. Tudo colapsa com `prefers-reduced-motion` e o conteúdo
continua visível sem JavaScript.

## O que falta para publicar

1. **Fotografia real da casa.** Ver `public/images/README.md` para a lista de
   slots, enquadramentos e dimensões. Depois de substituir todas, apagar o
   bloco `images.remotePatterns` de `next.config.ts`.
2. **Preços verdadeiros** em `lib/menu.ts`, e pôr `PRECOS_SAO_DEMO` a `false`
   para desaparecer o aviso no fim da ementa.
3. **Confirmar com o Anselmo** a morada, o telefone e o horário em
   `lib/site.ts`. Foram recolhidos de agregadores públicos em Agosto de 2026.
4. **Confirmar a origem das citações** em `lib/reviews.ts`. Foram lidas
   através de agregadores e a atribuição a cada plataforma pode não estar
   certa.
5. **Domínio real** em `site.url`, que o JSON-LD, o sitemap e os cartões de
   partilha usam.
6. Apagar a linha de aviso de demonstração no fim de `components/Footer.tsx`.

## Fora de âmbito

Reservas online, área de gestão, inglês para os peregrinos e sugestões do
dia. Se o demo for aprovado, o inglês é o passo seguinte mais útil.
