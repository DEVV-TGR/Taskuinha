/*
  A caveira da casa, num sítio só.

  Estava desenhada três vezes — na `BandeiraNegra`, no `Wordmark` e (a
  partir da ronda de transições) na `Travessia`. Três desenhos ligeiramente
  diferentes do mesmo símbolo é o princípio de deixarem de ser o mesmo
  símbolo, e o cliente pediu mais caveiras, não mais versões da caveira.

  Órbitas e nariz são buracos a sério, por `fill-rule="evenodd"` num único
  path — não manchas pintadas com a cor do fundo. As versões antigas
  enchiam os olhos com `var(--breu)`, o que só funciona sobre o breu: sobre
  o pergaminho da ementa, ou sobre uma fotografia, davam duas bolas escuras
  em vez de duas órbitas. Assim vê-se o que estiver por trás.

  O osso é `currentColor`: quem monta define a cor com `text-*`.
*/

/* Coordenadas em viewBox 0 0 100 70 — o mesmo espaço da BandeiraNegra, para
   as duas peças poderem ser comparadas lado a lado sem redesenhar nada. */
const CRANIO_E_ORBITAS =
  // Calote
  "M37,32 a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 Z " +
  // Maxilar
  "M39,38 Q50,50 61,38 L58,42 Q50,46 42,42 Z " +
  // Órbita esquerda (buraco)
  "M41.6,32 a3.6,3.6 0 1,0 7.2,0 a3.6,3.6 0 1,0 -7.2,0 Z " +
  // Órbita direita (buraco)
  "M51.2,32 a3.6,3.6 0 1,0 7.2,0 a3.6,3.6 0 1,0 -7.2,0 Z " +
  // Nariz (buraco)
  "M50,34.5 L47.2,39.4 L52.8,39.4 Z";

/* O bicorne assenta na calote em vez de flutuar por cima: a aresta de baixo
   (y≈23–27) entra dentro do arco do crânio. Verificado a renderizar — com o
   chapéu solto lê-se como um bigode, não como um chapéu. */
const BICORNE = "M28,27 Q33,12 50,14 Q67,12 72,27 Q62,23 50,24 Q38,23 28,27 Z";

type Props = {
  className?: string;
  /** O chapéu de bicorne. Sem ele é uma caveira lisa, para usos pequenos. */
  chapeu?: boolean;
  /** Os dois ossos cruzados por baixo do maxilar. */
  ossos?: boolean;
};

export function Caveira({ className, chapeu = true, ossos = false }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 70"
      className={className}
      fill="currentColor"
    >
      <MarcaCaveira chapeu={chapeu} ossos={ossos} />
    </svg>
  );
}

/*
  Os traços em bruto, sem `<svg>` à volta. É o que a `BandeiraNegra` monta
  dentro do pano dela, que já tem o seu próprio viewBox 0 0 100 70 — nesse
  caso as órbitas deixam ver o pano preto por trás, que é exactamente o que
  se quer.
*/
export function MarcaCaveira({ chapeu = true, ossos = false }: Omit<Props, "className">) {
  return (
    <>
      {chapeu ? <path d={BICORNE} /> : null}
      <path d={CRANIO_E_ORBITAS} fillRule="evenodd" />
      {/*
        Ossos em dois traços grossos de ponta redonda, sem os nós separados
        que um jolly roger a sério tem. Tentei com nós — quatro círculos nas
        pontas — e sobre o fundo escuro liam-se descolados do X: o
        anti-aliasing come as ligações finas em claro-sobre-escuro, e este
        site é todo claro-sobre-escuro. Uma peça só não tem costuras.
      */}
      {ossos ? (
        <g stroke="currentColor" strokeWidth="4.2" strokeLinecap="round">
          <line x1="36" y1="52" x2="64" y2="63" />
          <line x1="36" y1="63" x2="64" y2="52" />
        </g>
      ) : null}
    </>
  );
}

/*
  A versão de 12px do wordmark. Não é a de cima em ponto pequeno: a esta
  escala as órbitas de 3,4 unidades fecham-se em anti-aliasing e a caveira
  vira uma bolha. Menos detalhe, buracos proporcionalmente maiores.
*/
export function CaveiraMinima({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={className} fill="currentColor">
      <path
        d={
          "M2,5.5 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 Z " +
          "M3.3,8 Q6,10 8.7,8 L8,9 Q6,10.2 4,9 Z " +
          "M3.4,5.3 a1.1,1.1 0 1,0 2.2,0 a1.1,1.1 0 1,0 -2.2,0 Z " +
          "M6.4,5.3 a1.1,1.1 0 1,0 2.2,0 a1.1,1.1 0 1,0 -2.2,0 Z"
        }
        fillRule="evenodd"
      />
    </svg>
  );
}
