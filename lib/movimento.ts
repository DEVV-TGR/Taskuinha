/*
  A intensidade do movimento, num sítio só.

  O cliente pediu para "diminuir uma coisinha" em geral, e disse que quer
  decidir ao vivo, a olhar para o site. Este ficheiro existe para essa
  conversa: em vez de andar a caçar números por cinco componentes com o
  telemóvel dele na mão, muda-se `INTENSIDADE` e vê-se.

  ## Dois eixos, não um

  **Amplitude** — quanto é que a coisa se mexe. É o que a `INTENSIDADE`
  escala, e é a única coisa que faz sentido dar a um botão único: metade da
  rotação, metade do balanço, metade do flicker. Escala linearmente e
  nunca partiu nada.

  **Amortecimento** — quanto é que a coisa abana depois de chegar. Não
  entra na `INTENSIDADE` porque não escala: `damping` a metade não dá meio
  balanço, dá uma mola que oscila o dobro do tempo. Os valores estão
  fixados abaixo, um a um, com a razão de amortecimento calculada ao lado.

  ## Notas de acessibilidade

  Nada disto toca no `prefers-reduced-motion`. Esse caminho não passa por
  aqui: os componentes verificam-no antes e devolvem estado parado. Baixar
  a `INTENSIDADE` a zero NÃO substitui a preferência do sistema — deixaria
  as animações contínuas a correr a amplitude nula, a gastar bateria por
  nada.
*/

/**
 * 1 = a calibração original do redesenho. 0 = tudo quieto.
 *
 * Em 0,6 depois da primeira reacção do cliente. Se na reunião ele disser
 * "ainda é muito", 0,45. Se disser "agora está morto", 0,8.
 */
export const INTENSIDADE = 0.6;

/** Escala uma amplitude pela intensidade actual. */
export function amplitude(original: number): number {
  return original * INTENSIDADE;
}

/*
  Revelação das secções ao entrar no ecrã ("cair e balançar").

  É o candidato número um ao que ele quis dizer com "letras": é o que mexe
  os títulos, e um <h2> largo a rodar 3° desloca os cantos bastantes
  pixels. Metade da rotação tira o efeito de fila torta sem tirar a queda.

  Amortecimento: ζ = damping / (2·√(stiffness·mass)).
  Antes  d=14 → ζ=0,67 → 5,7% de ultrapassagem.
  Agora  d=16 → ζ=0,77 → 2,2%. Continua a haver batida; deixa de haver
  ressalto.
*/
export const REVELACAO = {
  /** Antes: 14. Queda em pixels. */
  deslocamento: amplitude(14),
  /** Antes: 3. Graus, com o lado a alternar por índice. */
  rotacao: amplitude(3),
  mola: { stiffness: 120, damping: 16, mass: 0.9 },
  /** Antes: 0,07 e 0,35. Atraso entre irmãos, e o tecto do atraso. */
  atrasoPorItem: 0.05,
  atrasoMaximo: 0.24,
} as const;

/*
  Barris pendurados da fachada. Balançam mais quanto mais perto o rato
  passa na horizontal.

  Era o mais exagerado dos quatro: 12° de pico mais 11,5% de ultrapassagem
  dá quase 13,5° reais, num objecto que devia oscilar, não abanar.

  Antes  d=8  → ζ=0,58 → 11,5% de ultrapassagem.
  Agora  d=10 → ζ=0,72 → 3,9%.
*/
export const BARRIS = {
  /** Antes: 3. Graus em repouso, com o rato longe. */
  repouso: amplitude(3),
  /** Antes: 9. Graus que se somam ao repouso com o rato em cima. */
  extra: amplitude(9),
  mola: { stiffness: 40, damping: 10, mass: 1.2 },
} as const;

/*
  Flicker da lanterna. A cava era de 18% (1 → 0,82), que a esta escala se
  lê como a luz a falhar, não como chama.

  Os tempos irregulares ficam como estão: são eles que distinguem chama de
  LED, e não têm nada que ver com a intensidade.
*/
export const LANTERNA = {
  /** Antes: 0,18. Quanto a opacidade cai no ponto mais baixo. */
  cava: amplitude(0.18),
} as const;

/*
  As tabuletas da Nav, que balançam com a velocidade do scroll. Nunca foram
  apontadas pelo cliente, mas são o mesmo gesto dos barris e ficariam
  incoerentes se só os barris acalmassem.
*/
export const TABULETAS = {
  /** Antes: 9. Graus no pico da velocidade de scroll. */
  rotacao: amplitude(9),
} as const;
