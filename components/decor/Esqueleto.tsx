import Image from "next/image";
import { photos } from "@/lib/images";

/*
  O mascote da casa — a estátua a sério, recortada do fundo e colada por
  cima do layout como um autocolante. Senta-se na junta entre duas secções,
  com as pernas penduradas para dentro da de baixo.

  Era um SVG desenhado à mão que nunca chegou a ser montado em página
  nenhuma. Ninguém o viu, e é por isso que isto não é uma substituição: é a
  primeira vez que o mascote aparece no site. O desenho antigo tinha um
  braço articulado que levava a garrafa à boca de nove em nove segundos;
  perde-se, e não é pena nenhuma — o cliente quer menos animação, não mais,
  e uma estátua de cimento não mexe o braço.

  ## Como o recorte foi feito

  Pela API de Visão do macOS (`VNGenerateForegroundInstanceMaskRequest`, o
  mesmo motor do "Copiar Sujeito" do Preview), a partir da
  `esqueleto-corpo.jpg` que já estava no repositório. O plano contava com
  uma fotografia nova tirada de propósito; não foi preciso.

  Se aparecer uma fotografia melhor, trocar o ficheiro chega — ver
  public/images/README.md para o que ela precisa de ter.

  ## Posicionamento

  `--assento` é a fracção da altura da imagem onde o rabo dele assenta:
  acima disso é tronco, abaixo são as pernas. O componente puxa-se para
  cima nessa fracção para que a junta da secção lhe passe exactamente pelo
  assento — mudar a fotografia implica reajustar este número.

  Escondido abaixo de `lg`: num ecrã estreito não há margem lateral onde
  ele caiba sem tapar texto, e um mascote em cima do texto não é imersão, é
  um erro.
*/

/** Fracção da altura da imagem onde o assento fica. Medido nesta foto. */
const ASSENTO = 0.63;

export function Esqueleto({
  className,
  largura = 300,
}: {
  className?: string;
  largura?: number;
}) {
  const foto = photos.esqueletoRecorte;
  const altura = Math.round((largura * foto.height) / foto.width);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden lg:block ${className ?? ""}`}
      style={{ width: largura, top: -Math.round(altura * ASSENTO) }}
    >
      <Image
        src={foto.src}
        alt=""
        width={foto.width}
        height={foto.height}
        sizes={`${largura}px`}
        className="h-auto w-full"
        /* A sombra vai no filtro, não numa caixa: `box-shadow` desenharia
           um rectângulo à volta da imagem e o recorte deixava de se ler
           como recorte. O `drop-shadow` segue o alfa. */
        style={{ filter: "drop-shadow(0 18px 26px rgb(0 0 0 / 0.55))" }}
      />
    </div>
  );
}
