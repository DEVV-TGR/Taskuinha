import sharp from "sharp";
import { stat } from "node:fs/promises";

/*
  O fundo do cartão de partilha, desfocado.

  ## Porque é um ficheiro e não uma linha de CSS

  O cartão não é desenhado por um browser: é desenhado pelo Satori, dentro do
  `next/og`, e o Satori não tem `filter`. Não é que o desfoque fique feio —
  não existe. (Há um `feGaussianBlur` no código dele, mas serve só ao
  `box-shadow`.) Ou o desfoque vem já na imagem, ou não há desfoque.

  ## Porque é que se corre à mão e vai commitado

  Pelo mesmo critério do PDF da ementa: isto muda ao ritmo da casa — quando
  houver fotografia nova da fachada — e não ao ritmo dos deploys. Correr no
  build seria pagar o mesmo trabalho outra vez em cada push para gerar
  exactamente os mesmos bytes.

  Corre-se com `npm run cartao-fundo`, e o que sair vai no commit.

  ## Os números

  1200×630 é o tamanho do cartão. O `cover` é preciso porque a fotografia é
  4:3 e o cartão é quase 2:1 — corta em cima e em baixo, e o meio, que é onde
  está a porta e o letreiro, é o que fica.

  O desfoque é generoso (24) de propósito: por cima disto vai texto, e uma
  fachada que ainda se lê como fachada rouba-lhe a atenção. O que se quer é a
  cor e a luz do fim da tarde, não a fotografia.

  A qualidade a 70 não se nota em nada que está desfocado, e é a diferença
  entre um cartão que pesa uns quilobytes e um que pesa umas centenas.
*/

const ORIGEM = "public/images/fachada-por-do-sol.jpg";
const DESTINO = "public/images/fachada-por-do-sol-cartao.jpg";

const { size: antes } = await stat(ORIGEM);

await sharp(ORIGEM)
  .resize(1200, 630, { fit: "cover" })
  .blur(24)
  .jpeg({ quality: 70 })
  .toFile(DESTINO);

const { size: depois } = await stat(DESTINO);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`${ORIGEM}  ${kb(antes)}`);
console.log(`${DESTINO}  ${kb(depois)}`);
