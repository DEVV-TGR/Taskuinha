import Image from "next/image";
import type { Photo } from "@/lib/images";

/*
  A casa por trás da secção. Uma fotografia do interior, graduada e muito
  apagada, no lugar do preto liso que estava aqui.

  ## Porque é que a opacidade não pode subir muito

  O texto secundário (`--osso-fraco`) faz 6,2:1 sobre `--breu` — é ele que
  manda, não o `--osso`, que tem margem de sobra. Uma fotografia por trás
  levanta a luminância do fundo e come essa margem depressa. Daí as duas
  camadas:

  1. `bg-breu/45 mix-blend-multiply` — a mesma gradação das fotografias em
     primeiro plano. Derruba o pixel mais claro antes de a opacidade sequer
     entrar, o que tira o pior caso da equação.
  2. `bg-lanterna/12 mix-blend-overlay` — o âmbar da casa, para a
     fotografia não ficar cinzenta.

  Números medidos sobre as três fotografias em uso, no pixel mais claro de
  cada uma, com a gradação já aplicada (as fórmulas de multiply/overlay
  calculadas à mão, não estimadas):

  | opacidade | pior fundo composto | --osso-fraco |
  |---|---|---|
  | 0,13 (omissão) | rgb(27,29,29) | 5,32:1 ✓ |
  | 0,18 (o tecto) | rgb(35,36,36) | 4,90:1 ✓ |
  | 0,25           | rgb(45,45,45) | 4,31:1 ✗ |

  É por isso que o tecto está em 0,18 e é imposto aqui, e não deixado à
  responsabilidade de quem monta: passar disso chumba AA, e chumba de forma
  invisível — só no ponto mais claro de uma fotografia, por trás de texto
  secundário.

  A opacidade envolve o grupo inteiro, o que cria um contexto de
  empilhamento — as duas misturas resolvem-se dentro do grupo, contra a
  fotografia, e só depois o resultado assenta na cor da secção. É o que se
  quer: sem isso o `multiply` iria buscar o fundo da página.
*/

const OPACIDADE_MAXIMA = 0.18;

type Props = {
  foto: Photo;
  /** `object-position` da fotografia. O enquadramento certo varia com a foto. */
  posicao?: string;
  /** Entre 0 e 0,18. Ver a explicação de contraste acima. */
  opacidade?: number;
  /**
   * A cor da secção, para as bordas esbaterem nela. Tem de bater certo com
   * o fundo real da secção, senão vê-se uma faixa mais clara na junta.
   */
  cor?: string;
};

export function FundoDeSeccao({
  foto,
  posicao = "center",
  opacidade = 0.13,
  cor = "var(--breu)",
}: Props) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ opacity: Math.min(opacidade, OPACIDADE_MAXIMA) }}
      >
        <Image
          src={foto.src}
          alt=""
          fill
          /* Fundo decorativo: nunca precisa da resolução máxima, e é a
             maior imagem da página em área. */
          sizes="100vw"
          quality={60}
          className="object-cover"
          style={{ objectPosition: posicao }}
        />
        <div className="absolute inset-0 bg-breu/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-lanterna/12 mix-blend-overlay" />
      </div>

      {/* Esbatimento no topo e no fundo. Sem isto a fotografia acaba a
          direito na junta entre secções e lê-se como uma faixa colada, não
          como a casa a continuar por trás. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${cor} 0%, transparent 24%, transparent 76%, ${cor} 100%)`,
        }}
      />
    </div>
  );
}
