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

/**
 * Manchas, queimadura de borda e vincos de dobra + borda rasgada, para o
 * `Pergaminho`.
 *
 * `mascara` vai para `mask-image` (a transparência fora do rasgão vem do
 * alfa do SVG, não de preto/branco); `fundo` vai para `background-image`,
 * em `multiply` por cima da cor base e do grão de papel.
 *
 * **O `fundo` tem de ser esticado com `background-size: 100% 100%`.** Sem
 * isso repete-se de 100 em 100 pixels — era o que acontecia, e um padrão
 * de manchas a repetir-se doze vezes num painel é metade da razão por que
 * o pergaminho se lia como ilustração em vez de papel.
 */
export function bordaPergaminho(semente: number): { fundo: string; mascara: string } {
  const rnd = pseudoAleatorio(semente);
  const queimado = "#6B4517"; // --pergaminho-queimado

  /*
    Manchas: contornos fechados irregulares, não círculos. Uma nódoa de
    café ou de água nunca tem raio constante, e doze círculos de opacidade
    baixa lêem-se como doze círculos, por mais desmaiados que estejam.

    Cada uma é um polígono de 9 lados com o raio a variar 45% em cada
    vértice, fechado com curvas. O desfoque vem do filtro, não de um
    gradiente por mancha.
  */
  function manchaIrregular(cx: number, cy: number, raio: number): string {
    const lados = 9;
    const pontos: string[] = [];
    for (let i = 0; i < lados; i++) {
      const ang = (i / lados) * Math.PI * 2;
      const r = raio * (0.72 + rnd() * 0.56);
      pontos.push(`${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`);
    }
    return `M${pontos[0]} ` + pontos.slice(1).map((p) => `L${p}`).join(" ") + " Z";
  }

  const manchas: string[] = [];
  const numManchas = 10 + Math.floor(rnd() * 6);
  for (let i = 0; i < numManchas; i++) {
    const naBorda = rnd() > 0.4;
    const cx = naBorda ? (rnd() > 0.5 ? rnd() * 14 : 100 - rnd() * 14) : rnd() * 100;
    const cy = naBorda ? (rnd() > 0.5 ? rnd() * 14 : 100 - rnd() * 14) : rnd() * 100;
    const raio = 3 + rnd() * 9;
    manchas.push(
      `<path d="${manchaIrregular(cx, cy, raio)}" fill="${queimado}" ` +
        `opacity="${(0.05 + rnd() * 0.12).toFixed(2)}" />`,
    );
  }

  /*
    Queimadura de borda: quatro faixas em gradiente a escurecer para fora.
    A borda rasgada da máscara corta o papel, mas um corte limpo não chega
    — papel velho escurece na margem antes de se desfazer.
  */
  const queimaduraBordas =
    `<rect width="100" height="100" fill="url(#qv)" />` +
    `<rect width="100" height="100" fill="url(#qh)" />`;

  /*
    Vincos: duas dobras verticais, como um papel guardado dobrado em três.
    Cada uma é uma sombra fina com um fio de luz ao lado — é o par
    escuro/claro que faz ler como relevo em vez de risco.
  */
  const vincos = [30 + rnd() * 8, 64 + rnd() * 8]
    .map(
      (x) =>
        `<rect x="${(x - 0.5).toFixed(1)}" y="0" width="0.5" height="100" fill="${queimado}" opacity="0.1" />` +
        `<rect x="${x.toFixed(1)}" y="0" width="0.4" height="100" fill="#FFFFFF" opacity="0.14" />`,
    )
    .join("");

  const fundo = paraDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">` +
      `<defs>` +
      `<linearGradient id="qv" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${queimado}" stop-opacity="0.22" />` +
      `<stop offset="0.12" stop-color="${queimado}" stop-opacity="0" />` +
      `<stop offset="0.88" stop-color="${queimado}" stop-opacity="0" />` +
      `<stop offset="1" stop-color="${queimado}" stop-opacity="0.22" />` +
      `</linearGradient>` +
      `<linearGradient id="qh" x1="0" y1="0" x2="1" y2="0">` +
      `<stop offset="0" stop-color="${queimado}" stop-opacity="0.2" />` +
      `<stop offset="0.1" stop-color="${queimado}" stop-opacity="0" />` +
      `<stop offset="0.9" stop-color="${queimado}" stop-opacity="0" />` +
      `<stop offset="1" stop-color="${queimado}" stop-opacity="0.2" />` +
      `</linearGradient>` +
      `<filter id="esbater" x="-20%" y="-20%" width="140%" height="140%">` +
      `<feGaussianBlur stdDeviation="1.6" />` +
      `</filter>` +
      `</defs>` +
      `<g filter="url(#esbater)">${manchas.join("")}</g>` +
      `${queimaduraBordas}${vincos}</svg>`,
  );

  // Máscara: um rectângulo com entalhes aleatórios em cada lado, para o
  // contorno ler como rasgado em vez de cortado a direito.
  //
  // Profundidade deliberadamente contida: a máscara stica a 100%×100% da
  // caixa (mask-size: 100% 100%), por isso "5 unidades" não é um valor
  // fixo em pixels — é 5% da largura ou altura reais, o que em painéis
  // largos pode passar de 50px. Verificado: entalhes fundos perto da
  // margem esquerda tornavam texto ilegível (ficava sobre o fundo escuro
  // da página, exposto pelo recorte). Entalhes rasos + padding generoso em
  // Pergaminho.tsx é o par que resolve isto.
  //
  // Passou de 7 pontos por lado para 18, com a MESMA amplitude. Sete
  // pontos ao longo de um painel de 1200px dão um entalhe a cada 170px, e
  // a essa distância o olho lê um polígono, não um rasgão. Dezoito dão um
  // a cada 65px. A amplitude não sobe justamente por causa do parágrafo
  // acima: mais frequência é de graça, mais profundidade não é.
  function ladoEntalhado(fixo: number, eixoFixo: "x" | "y", inicio: number, fim: number) {
    const pontos: number[] = [];
    const passos = 18;
    for (let i = 0; i <= passos; i++) {
      const t = inicio + ((fim - inicio) * i) / passos;
      const jitter = i === 0 || i === passos ? 0 : (rnd() * 2 - 1) + (rnd() > 0.85 ? rnd() * 1.5 : 0);
      pontos.push(eixoFixo === "x" ? fixo + jitter : t, eixoFixo === "x" ? t : fixo + jitter);
    }
    return pontos;
  }

  const margem = 1.5;
  const cima = ladoEntalhado(margem, "y", margem, 100 - margem);
  const direita = ladoEntalhado(100 - margem, "x", margem, 100 - margem);
  const baixo = ladoEntalhado(100 - margem, "y", 100 - margem, margem);
  const esquerda = ladoEntalhado(margem, "x", 100 - margem, margem);

  const todosPontos = [...cima, ...direita, ...baixo, ...esquerda];
  const pathD =
    `M${todosPontos[0].toFixed(1)},${todosPontos[1].toFixed(1)} ` +
    Array.from({ length: todosPontos.length / 2 - 1 }, (_, i) => {
      const x = todosPontos[(i + 1) * 2];
      const y = todosPontos[(i + 1) * 2 + 1];
      return `L${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") +
    " Z";

  const mascara = paraDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">` +
      `<path d="${pathD}" fill="#fff" /></svg>`,
  );

  return { fundo, mascara };
}

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
