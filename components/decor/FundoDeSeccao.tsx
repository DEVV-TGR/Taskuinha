import Image from "next/image";
import type { Photo } from "@/lib/images";

type Props = {
  foto: Photo;
  /**
   * Desfoque assumido, para fotografias pequenas de mais para o tamanho a que
   * são esticadas. Ver a `naus-frota` em baixo.
   */
  desfoque?: boolean;
};

/*
  A fotografia que substitui o fundo preto de uma secção.

  ## Os 75%

  O Gonçalo pediu as fotografias de fundo "a 75%" e as de cima — os pratos, o
  texto — "a 100%". É **opacidade**: a fotografia está bem presente e o preto
  entra só nos 25% que faltam. Não é uma fotografia esbatida a servir de
  textura.

  É por isso que quem monta isto tem de pôr o texto da secção numa `Tabua`. A
  legibilidade passou a vir de uma superfície opaca por baixo da letra, e não
  de escurecer a fotografia — escurecê-la era desfazer os 75% que ele pediu.

  ## Não leva a gradação nocturna

  As fotografias que estão *dentro* da página levam duas camadas por cima
  (`--breu` multiply + `--lanterna` overlay) para assentarem na paleta. Esta
  não leva nenhuma: os 25% que faltam à opacidade já deixam passar o `--breu`
  da secção, e é essa a conta. Somar as camadas era escurecer duas vezes.

  Daí a secção que recebe isto precisar de `bg-breu` — a mais escura das três
  bases. É ela que se vê nos 25%, e com `bg-breu-raso` a fotografia ficava
  lavada.

  ## O desfoque leva escala

  Um `blur` sozinho esbate as arestas da imagem **para dentro**, e aparece uma
  orla clara à volta da secção onde o fundo se vê através. O `scale-105`
  empurra essa orla para fora do enquadramento.

  Só a `naus-frota.jpg` o usa, e não é correcção de estilo: tem 630×420, é a
  mais pequena da pasta, e num ecrã largo é ampliada quase 3×. O desfoque
  assume a falta de nitidez em vez de a tentar esconder. Decisão do Gonçalo,
  depois de eu lhe dizer o problema.
*/
export function FundoDeSeccao({ foto, desfoque = false }: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Image
        src={foto.src}
        alt=""
        fill
        sizes="100vw"
        className={`object-cover ${desfoque ? "scale-105 blur-[3px]" : ""}`}
        style={{ opacity: 0.75 }}
      />
    </div>
  );
}
