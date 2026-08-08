/*
  Gera public/images/textura-papel.webp — o grão de fibra do pergaminho.

    node ferramentas/gerar-grao-papel.mjs

  Porque é que isto é um ficheiro e não mais um SVG gerado: o
  `lib/texturas.ts` já fazia a textura do pergaminho por SVG, e lia-se como
  ilustração — foi o que o cliente apontou. Um SVG de manchas geométricas
  nunca vai ter fibra; fibra é ruído, e ruído a sério são pixels.

  O ficheiro é SEM EMENDAS (o lattice do ruído dá a volta com módulo), por
  isso repete-se sem costura visível e chega um mosaico pequeno para
  cobrir um painel de qualquer tamanho.

  Só leva o GRÃO. As manchas grandes e a queimadura das bordas continuam
  em `lib/texturas.ts`, por instância: se viessem neste mosaico
  repetiam-se de forma óbvia num painel largo, que é o defeito clássico de
  fundos de papel de banco de imagens.

  Determinista: mesma semente, mesmo ficheiro. Ver a regra 7 do MAPA.md.
*/

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LADO = 512;
const SEMENTE = 20260809;
const SAIDA = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "textura-papel.webp",
);

/* mulberry32 — o mesmo PRNG de lib/texturas.ts. */
function prng(semente) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Ruído de valor numa grelha que dá a volta: o módulo em `passo` é o que
   torna o mosaico contínuo entre a margem direita e a esquerda. */
function grelha(passo, rnd) {
  const g = new Float32Array(passo * passo);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  return g;
}

function suavizar(t) {
  return t * t * (3 - 2 * t);
}

function amostrar(g, passo, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = suavizar(x - x0), fy = suavizar(y - y0);
  const ix = (a, b) => g[(((b % passo) + passo) % passo) * passo + (((a % passo) + passo) % passo)];
  const a = ix(x0, y0), b = ix(x0 + 1, y0);
  const c = ix(x0, y0 + 1), d = ix(x0 + 1, y0 + 1);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

/* fBm: várias oitavas de ruído somadas com amplitude decrescente. É o que
   dá à fibra detalhe a mais do que uma escala ao mesmo tempo — grão fino
   por cima de variação larga. */
function fbm(x, y, oitavas) {
  let valor = 0, amplitude = 1, total = 0;
  for (const { g, passo } of oitavas) {
    valor += amostrar(g, passo, x * passo, y * passo) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
  }
  return valor / total;
}

const rnd = prng(SEMENTE);
const oitavas = [8, 16, 32, 64, 128, 256].map((passo) => ({ passo, g: grelha(passo, rnd) }));

/* Fibra: o mesmo fBm esticado no eixo x, para as fibras correrem numa
   direcção como no papel prensado, em vez de darem um granulado uniforme. */
const fibra = [24, 48, 96, 192].map((passo) => ({ passo, g: grelha(passo, rnd) }));

/* Salpico de um pixel, por cima de tudo. As oitavas mais finas do fBm são
   interpoladas e por isso lêem-se sempre suaves; papel a sério tem
   pontinhos duros. Semente própria para não correlacionar com o resto. */
const salpico = prng(SEMENTE ^ 0x5bf03635);

const dados = Buffer.alloc(LADO * LADO * 3);
for (let y = 0; y < LADO; y++) {
  for (let x = 0; x < LADO; x++) {
    const u = x / LADO, v = y / LADO;

    const base = fbm(u, v, oitavas);
    /*
      Multiplicadores INTEIROS nos dois eixos, sem excepção. Com `v * 0.7`
      a grelha deixa de dar a volta no eixo y — a coordenada do lattice em
      v=1 cai a meio de uma célula em vez de fechar o ciclo — e o mosaico
      abre uma costura horizontal visível a cada repetição. Custou uma
      geração a apanhar. 6 em x contra 1 em y é o que estica a fibra.
    */
    const veio = fbm(u * 6, v * 1, fibra);

    // Centrado em 128 e com amplitude curta: isto é uma camada de
    // modulação, não a cor do papel. A cor vem do CSS por baixo.
    let n = 128 + (base - 0.5) * 46 + (veio - 0.5) * 30 + (salpico() - 0.5) * 12;
    n = Math.max(0, Math.min(255, n));

    const i = (y * LADO + x) * 3;
    dados[i] = dados[i + 1] = dados[i + 2] = n;
  }
}

await sharp(dados, { raw: { width: LADO, height: LADO, channels: 3 } })
  .webp({ quality: 88, effort: 6 })
  .toFile(SAIDA);

console.log(`escrito ${SAIDA} — ${LADO}x${LADO}, semente ${SEMENTE}`);
