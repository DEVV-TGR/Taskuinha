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
        style={{ opacity: 0.15 }}
      />
    </div>
  );
}
