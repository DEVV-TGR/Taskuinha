import Image from "next/image";
import type { Photo } from "@/lib/images";

type Props = {
  foto: Photo;
};

/*
  A fotografia que substitui o fundo preto de uma secção.

  ## Os 15%

  Começou em 75%, que era o número que o Gonçalo tinha dado. Montado, a
  fotografia mandava na secção e competia com os pratos; ele viu quatro
  versões lado a lado — 75, 50, 35 e 20 — e escolheu descer até aos 15.

  A esse valor a fotografia é uma presença, não um assunto: percebe-se que há
  a casa por trás, e nada do que está à frente perde força.

  Fica igual nas cinco secções, por decisão dele. Um valor por fotografia
  compensaria a `naus-frota` ser muito mais clara do que as outras quatro —
  mas era pôr o componente a saber coisas sobre cada ficheiro, e a 15% a
  diferença já não se impõe.

  ## Não leva a gradação nocturna

  As fotografias que estão *dentro* da página levam duas camadas por cima
  (`--breu` multiply + `--lanterna` overlay) para assentarem na paleta. Esta
  não leva nenhuma: os 85% que faltam à opacidade já deixam passar o `--breu`
  da secção, e escurecer mais era escurecer duas vezes.

  Daí a secção que recebe isto precisar de `bg-breu` — a mais escura das três
  bases. É ela que se vê nos 85%, e com `bg-breu-raso` o conjunto ficava
  lavado.

  ## As tábuas do texto ficam

  Os cabeçalhos foram para dentro de uma `Tabua` quando o fundo estava a 75% e
  texto solto deixava de se ler. A 15% já se leria — mas as tábuas ficam:
  foram escolha dele antes de haver problema de contraste nenhum, e são o que
  dá à página o ar de coisa pregada em madeira.

  ## O desfoque é de todas

  Era uma opção — `desfoque?: boolean` — e só a `naus-frota.jpg` a usava, por
  ser pequena de mais (630×420) para o tamanho a que é esticada. O Gonçalo
  pediu-o para as cinco, por isso deixou de ser opção: a prop saiu e o
  desfoque passou a fazer parte do que este componente é.

  **8px e não 3px.** Os 3px que a `naus-frota` levava eram para disfarçar
  ampliação, e a essa força já não se distinguiam de uma fotografia nítida
  quando a opacidade desceu para 15%. A 8px lê-se como profundidade: percebe-se
  que há uma sala por trás sem se conseguir fixar nada nela.

  **O `scale-105` não é enfeite.** Um `blur` sozinho esbate as arestas da
  imagem *para dentro*, e aparece uma orla clara à volta da secção por onde o
  fundo se vê através. A escala empurra essa orla para fora do enquadramento.

  O desfoque é CSS e não uma segunda cópia dos ficheiros. É rasterizado uma
  vez — nada aqui anima nem se move com o scroll — e assim o dia em que o
  valor mudar não obriga a reprocessar cinco imagens.
*/
export function FundoDeSeccao({ foto }: Props) {
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
        className="scale-105 object-cover blur-[8px]"
        style={{ opacity: 0.15 }}
      />
    </div>
  );
}
