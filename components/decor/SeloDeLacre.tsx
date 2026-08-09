import { MarcaCaveira } from "./Caveira";

/*
  Selo de lacre vermelho com a caveira da casa carimbada, a fechar a
  ementa. A página da ementa não tinha caveira nenhuma — é a página que
  mais parece um documento da casa e a que menos a mostrava.

  O contorno é um path irregular, não um círculo: lacre a sério nunca sai
  redondo, e além disso a regra de raio do projecto (4px em tudo, nada é
  pílula) não deixaria uma medalha redonda em CSS. Aqui não há CSS nenhum —
  é uma ilustração, e uma ilustração pode ter a forma que quiser.

  `--sangue` como fundo é seguro: a regra que o proíbe é sobre texto, e não
  há texto nenhum aqui dentro (o bloco todo é aria-hidden).
*/
const LACRE =
  "M50,6 C69,4 85,17 90,36 C94,53 88,73 73,84 " +
  "C59,94 37,94 24,83 C10,71 4,51 10,32 C16,16 33,8 50,6 Z";

/* Duas gotas escorridas, para o lacre parecer derramado e não estampado.
   Sobrepostas à borda de propósito — mais abaixo liam-se como pingos
   soltos ao lado do selo em vez de cera a escorrer dele. */
const GOTAS =
  "M78,78 C83,82 82,88 77,88 C73,88 72,83 78,78 Z " +
  "M27,82 C31,85 30,90 26,89 C23,88 23,84 27,82 Z";

export function SeloDeLacre({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={className}
      /* Torto de propósito: um selo carimbado à mão nunca fica a direito. */
      style={{ transform: "rotate(-7deg)" }}
    >
      <path d={LACRE} fill="var(--sangue)" />
      <path d={GOTAS} fill="var(--sangue)" />
      {/* Aro interior mais escuro: a borda do carimbo a comprimir a cera. */}
      <path d={LACRE} fill="none" stroke="var(--pergaminho-tinta)" strokeWidth="2" opacity="0.35" transform="translate(50,50) scale(0.86) translate(-50,-50)" />
      {/* A caveira vive num viewBox 0 0 100 70; centrar exige encolher e
          empurrar para baixo os 15 que faltam em altura. */}
      <g
        fill="var(--pergaminho-tinta)"
        color="var(--pergaminho-tinta)"
        opacity="0.72"
        transform="translate(50,52) scale(0.62) translate(-50,-35)"
      >
        <MarcaCaveira ossos />
      </g>
    </svg>
  );
}
