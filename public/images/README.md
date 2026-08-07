# Fotografia da casa

Nenhuma foto do site é da Taskuinha. Todas vêm do Unsplash e existem só para
o demo ficar credível. Estes são os slots a preencher com fotografia real.

Para substituir:

1. colocar o ficheiro nesta pasta com o nome exacto indicado abaixo
2. em `lib/images.ts`, trocar o `src` de `u("photo-...", w)` por `/images/<nome>`
3. quando não sobrar nenhum URL do Unsplash, apagar o bloco `images.remotePatterns`
   de `next.config.ts`

| Ficheiro | Onde aparece | Enquadramento | Mínimo |
| --- | --- | --- | --- |
| `hero-mar.jpg` | cabeçalho da página inicial | vertical, mar ao fim da tarde, com céu livre no terço superior para o texto assentar | 2000 x 3000 |
| `casa-interior.jpg` | secção "A casa" | horizontal, interior da taberna com luz quente e as mesas visíveis | 1600 x 1067 |
| `petisco-ameijoas.jpg` | destaque grande em "O que sai mais da cozinha" | horizontal, prato de amêijoas visto de cima | 1200 x 900 |
| `petisco-lulas.jpg` | destaques | horizontal, lulas fritas na mesa da esplanada | 1200 x 900 |
| `petisco-pataniscas.jpg` | destaques | horizontal, pataniscas acabadas de fritar | 1200 x 900 |
| `petisco-prego.jpg` | destaques | horizontal, prego no pão | 1200 x 900 |
| `sitio-passadico.jpg` | galeria "O sítio" | vertical, passadiço de madeira a caminho da praia | 1200 x 1600 |
| `sitio-praia.jpg` | galeria | vertical, praia de Vila Chã | 1200 x 1600 |
| `sitio-por-do-sol.jpg` | galeria | vertical, pôr do sol visto da esplanada | 1200 x 1600 |
| `sitio-balcao.jpg` | galeria | horizontal, o balcão e a decoração da casa | 1200 x 800 |

A foto do cabeçalho é a que mais pesa no tempo de carregamento. Guardá-la
com qualidade 70 a 75 e menos de 400 kB.
