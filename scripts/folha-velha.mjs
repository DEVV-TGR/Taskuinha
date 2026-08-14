import sharp from "sharp";
import { stat } from "node:fs/promises";

/*
  A folha de papel velho que serve de base às citações e ao painel do mapa.

  ## Porque é que se corre à mão e vai commitado

  Pelo critério do `cartao-fundo.mjs`: o ficheiro muda ao ritmo da casa — se
  aparecer papel novo, ou se chegar a versão licenciada deste — e não ao ritmo
  dos deploys. Corre-se com `npm run folha-velha`, e o que sair vai no commit.

  ## O original não está no repositório

  A `folhavelha.png` de origem tem **5,58 MB** e 1920×1920. Não entra: o que
  entra é o `.webp` de 136 KB que sai daqui. Quem precisar de correr isto outra
  vez pede o original ao Gonçalo.

  ## Os números

  ### O recorte

  A folha ocupa só a faixa central do quadrado. Medido pelo alfa: a caixa útil
  é 1854×1347 a começar em (38, 285) — sobram 285px transparentes em cima e
  288 em baixo, quase 30% da altura do ficheiro.

  Recortar não é para poupar bytes, é para o `border-image` funcionar. As
  fatias contam-se em píxeis do ficheiro a partir da aresta; com a margem
  transparente lá dentro, as fatias caíam todas no vazio e as bordas rasgadas
  apareciam no sítio errado.

  ### A largura

  1200px chega para a maior utilização: o painel do mapa mede ~600px CSS num
  portátil, e 1200 dá-lhe o dobro para ecrãs de densidade 2×. As citações são
  muito menores — num telemóvel a caixa mede ~170px.

  ### A qualidade

  A 82 o papel não perde grão nenhum que se veja, e é a diferença entre 136 KB
  e um ficheiro que se nota a carregar. O alfa é preciso: é o rasgão da borda
  que faz o recorte ler-se como papel e não como rectângulo.
*/

const ORIGEM = "public/images/folhavelha.png";
const DESTINO = "public/images/folhavelha.webp";

/* A caixa útil, medida pelo alfa do original. */
const RECORTE = { left: 38, top: 285, width: 1854, height: 1347 };

const { size: antes } = await stat(ORIGEM);

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(1200)
  .webp({ quality: 82 })
  .toFile(DESTINO);

const { size: depois } = await stat(DESTINO);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`${ORIGEM}  ${kb(antes)}`);
console.log(`${DESTINO}  ${kb(depois)}`);
