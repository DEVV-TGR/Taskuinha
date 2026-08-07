# Recursos visuais a procurar

Lista de apoio ao `PROXIMAS-MELHORIAS.md`. Duas categorias, não misturar:

- **Fotografar no local** — a casa real já tem a coisa. Não faz sentido
  procurar no Google um substituto de algo que existe fisicamente na
  Taskuinha e que podes fotografar terça-feira de manhã.
- **Procurar como referência** — coisas que não existem na casa (uma aranha
  mais realista não é um objecto físico para fotografar; uma textura de
  pergaminho antigo também não).

---

## Fotografar no local (terça-feira)

Não procurar no Google — a casa tem o objecto real, e uma foto a sério bate
sempre uma imagem genérica de stock.

| O quê | Como | Para quê |
|---|---|---|
| **Esqueleto mascote** | De perto, várias distâncias, luz de dia se possível (mais fácil recortar o fundo com boa luz do que à noite). Um ângulo frontal e um de perfil, para escolher depois. | Substituir `components/decor/Esqueleto.tsx` (hoje um SVG desenhado) por um recorte da fotografia real. |
| **Barris da fachada** | De frente, luz do dia, um a um se possível (ou o conjunto todo, para recortar depois). | Substituir `components/decor/Barril.tsx`. |
| **Paredes decoradas (2–3 zonas)** | Enquadramento largo — a parede toda, não um pormenor. Pelo menos: o tecto da nau, o balcão com as bandeirinhas, o canto das estátuas de piratas. | Fundos de secção com opacidade reduzida (ponto 6 do `PROXIMAS-MELHORIAS.md`). Muito do que já está em `public/images/` já serve para isto — só fotografar se quiseres ângulos novos. |

---

## Procurar como referência (Google / bancos de imagens)

Para cada um, o critério é sempre o mesmo: tem de continuar a **combinar com
a paleta existente** (`--madeira`, `--breu`, `--osso`, `--lanterna` — ver
`app/globals.css`), não trazer uma estética completamente diferente para
dentro do site.

- [ ] **Aranha mais realista** — ilustração ou fotografia recortável de uma
      aranha peluda, em silhueta escura, que funcione como decoração pendurada
      (fio de seda por cima). Evitar aranhas "cartoon" ou demasiado
      coloridas — a actual é geométrica de mais; o oposto não deve ser
      infantil, deve ser mais orgânica e um pouco assustadora, como a
      aranha real que está mesmo no tecto da casa (ver
      `public/images/tecto-nau-aranha.jpg` para o que se está a tentar
      aproximar).
- [ ] **Texturas de pergaminho/papel antigo** — várias variantes (bordas
      queimadas, manchas, dobras), em alta resolução, com licença que
      permita uso comercial. É para substituir a textura gerada por SVG em
      `components/decor/Pergaminho.tsx` — a referência que já tínhamos
      usado como inspiração de layout é a ementa do
      [Kalóz Étterem](https://kalozetterem.hu/etlap), mas essa é só
      layout; a textura de papel em si tem de vir de outro lado.
- [ ] **Caveiras decorativas adicionais** — no mesmo espírito da bandeira
      negra que já existe (`components/decor/BandeiraNegra.tsx`) e das
      fotos `caveira-madeira.jpg` / `caveira-lenco.webp` / `caveira-mesa.webp`
      que já estão em `public/images/` por usar. Ver primeiro se essas três
      já chegam antes de procurar mais — podem já resolver o pedido de
      "mais caveiras" sem precisar de nada novo.

---

## Antes de gastar tempo a procurar

Confirma com o cliente, terça-feira, se ele **tem material próprio** —
fotos antigas da abertura da casa, do dia a dia, vídeos — que sirvam melhor
do que qualquer imagem de banco. Ninguém tem mais "essência do lugar" do que
o próprio dono.
