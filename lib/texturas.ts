/*
  Geradores de textura, servidos como data-URI de SVG.

  Nenhuma textura é um ficheiro PNG: tudo é gerado aqui e atribuído a uma
  custom property (--textura-madeira, --textura-pergaminho, --mascara-rasgada)
  via `style` inline no elemento — nunca em globals.css, porque cada instância
  precisa da sua própria semente.

  Duas restrições não negociáveis:

  1. **Determinismo.** Todas as funções são puras: a mesma semente produz
     sempre o mesmo SVG. Nunca `Math.random()` — o HTML do servidor tem de
     bater certo com o do cliente, senão o React acusa erro de hidratação.
     Onde é preciso "ruído", ou vem de um PRNG semeado (`pseudoAleatorio`) ou
     do atributo `seed` do próprio `feTurbulence` do SVG, que é determinístico
     por natureza.

  2. **Cores em valor literal, nunca `var(--token)`.** Um data-URI de SVG é um
     recurso externo aos olhos do CSS — não herda custom properties do
     documento que o usa. Por isso `cor` é sempre uma string hexadecimal; os
     valores por omissão aqui replicam os tokens de `globals.css` à mão.
*/

/** PRNG determinístico (mulberry32). Nunca `Math.random()`. */
function pseudoAleatorio(semente: number) {
  let s = semente >>> 0;
  return function proximo() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paraDataUri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Veio de madeira: linhas verticais irregulares + nós ocasionais.
 * Pensado para `.tabua`, que o repete a `background-size: 320px 100%`.
 */
export function veioMadeira(opts?: { cor?: string; semente?: number }): string {
  const corClara = opts?.cor ?? "#6B4A2F"; // --madeira-luz
  const corEscura = "#150C05";
  const rnd = pseudoAleatorio(opts?.semente ?? 1);
  const largura = 320;
  const altura = 240;

  const veios: string[] = [];
  const numVeios = 16;
  for (let i = 0; i < numVeios; i++) {
    const x = (largura / numVeios) * (i + 0.5) + (rnd() * 12 - 6);
    const desvio = rnd() * 20 - 10;
    const escuro = rnd() > 0.5;
    const largTraco = (0.5 + rnd() * 1.3).toFixed(2);
    const opacidade = (0.06 + rnd() * 0.12).toFixed(2);
    const c1x = (x + desvio * 0.35).toFixed(1);
    const c1y = (altura * 0.33).toFixed(1);
    const c2x = (x - desvio * 0.35).toFixed(1);
    const c2y = (altura * 0.66).toFixed(1);
    const xf = (x + desvio).toFixed(1);
    veios.push(
      `<path d="M${x.toFixed(1)},0 C${c1x},${c1y} ${c2x},${c2y} ${xf},${altura}" ` +
        `stroke="${escuro ? corEscura : corClara}" stroke-width="${largTraco}" ` +
        `fill="none" opacity="${opacidade}" />`,
    );
  }

  const nos: string[] = [];
  const numNos = 2 + Math.floor(rnd() * 2);
  for (let i = 0; i < numNos; i++) {
    const cx = (rnd() * largura).toFixed(1);
    const cy = (rnd() * altura).toFixed(1);
    const r = 4 + rnd() * 5;
    nos.push(
      `<ellipse cx="${cx}" cy="${cy}" rx="${r.toFixed(1)}" ry="${(r * 0.55).toFixed(1)}" ` +
        `fill="none" stroke="${corEscura}" stroke-width="1" opacity="0.22" />` +
        `<ellipse cx="${cx}" cy="${cy}" rx="${(r * 0.45).toFixed(1)}" ry="${(r * 0.25).toFixed(1)}" ` +
        `fill="${corEscura}" opacity="0.16" />`,
    );
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" ` +
    `viewBox="0 0 ${largura} ${altura}">${veios.join("")}${nos.join("")}</svg>`;
  return paraDataUri(svg);
}

/*
  Aqui viveu a `bordaPergaminho()`: manchas de queimado e um contorno
  entalhado, gerados por semente, que faziam o papel das citações e do painel
  do mapa. Saiu quando o `decor/Pergaminho.tsx` passou a usar a fotografia
  `folhavelha.webp` — a folha traz a sua própria borda rasgada, e rasgar por
  cima de um rasgão não fazia sentido nenhum.
*/

/**
 * Malha de rede de pesca em losango, com nós nos cruzamentos.
 * Devolve um único mosaico (`passo` × `passo`) para repetir via
 * `background-repeat`.
 */
export function malhaRede(opts?: { passo?: number; cor?: string }): string {
  const passo = opts?.passo ?? 40;
  const cor = opts?.cor ?? "#E8DCC4"; // --osso
  const meio = passo / 2;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${passo}" height="${passo}" viewBox="0 0 ${passo} ${passo}">` +
    // Duas diagonais que, repetidas, desenham losangos.
    `<path d="M0,${meio} L${meio},0" stroke="${cor}" stroke-width="1" opacity="0.6" fill="none" />` +
    `<path d="M${meio},0 L${passo},${meio}" stroke="${cor}" stroke-width="1" opacity="0.6" fill="none" />` +
    `<path d="M${passo},${meio} L${meio},${passo}" stroke="${cor}" stroke-width="1" opacity="0.6" fill="none" />` +
    `<path d="M${meio},${passo} L0,${meio}" stroke="${cor}" stroke-width="1" opacity="0.6" fill="none" />` +
    // Nós nos quatro cruzamentos do mosaico.
    [
      [0, meio],
      [meio, 0],
      [passo, meio],
      [meio, passo],
    ]
      .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.6" fill="${cor}" opacity="0.75" />`)
      .join("") +
    `</svg>`;
  return paraDataUri(svg);
}

/**
 * Juntas entre tábuas de largura variável — o `Tabua.tsx` usa isto por cima
 * do `veioMadeira()`: o veio dá a fibra, isto dá as ripas em si.
 */
export function ripasMadeira(semente: number, opts?: { cor?: string }): string {
  const corJunta = "#0d0703";
  const corBrilho = opts?.cor ?? "#6B4A2F";
  const rnd = pseudoAleatorio(semente);
  // Mesmas dimensões de mosaico que veioMadeira(), para as duas texturas
  // poderem partilhar o `background-size: 320px 100%` de `.tabua` sem distorcer.
  const largura = 320;
  const altura = 240;

  const juntas: string[] = [];
  let x = 0;
  while (x < largura) {
    x += 48 + rnd() * 56; // ripas entre ~48 e ~104px
    if (x >= largura) break;
    juntas.push(
      `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${altura}" ` +
        `stroke="${corJunta}" stroke-width="1.5" opacity="0.5" />` +
        `<line x1="${(x + 1).toFixed(1)}" y1="0" x2="${(x + 1).toFixed(1)}" y2="${altura}" ` +
        `stroke="${corBrilho}" stroke-width="1" opacity="0.25" />`,
    );
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" ` +
    `viewBox="0 0 ${largura} ${altura}">${juntas.join("")}</svg>`;
  return paraDataUri(svg);
}

/**
 * Grão de filme, para assentar sobre as fotografias tratadas.
 * `feTurbulence` com `seed` fixo — ruído determinístico nativo do SVG, sem
 * gerar milhares de pontos à mão.
 */
export function granulado(opacidade: number = 0.05): string {
  const lado = 180;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">` +
    `<filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.9" ` +
    `numOctaves="2" seed="7" stitchTiles="stitch" /><feColorMatrix type="matrix" ` +
    `values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${opacidade} 0" /></filter>` +
    `<rect width="100%" height="100%" filter="url(#grao)" /></svg>`;
  return paraDataUri(svg);
}
