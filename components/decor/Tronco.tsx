import Image from "next/image";
import { photos } from "@/lib/images";

/*
  A trave que atravessa a página de aresta a aresta, na junta entre o Hero e a
  secção "A casa" — a mesma linha onde o esqueleto já se senta. Passa **por
  trás** dele: entra e sai por detrás do baú, e é o esqueleto inteiro, pernas
  incluídas, que fica à vista por cima da madeira. É dela que a tabuleta do
  "A casa" fica pendurada.

  ## Porque é que a caixa é muito mais alta do que a trave

  O ficheiro tem 6000×1563 e a madeira ocupa só a faixa central: 32,9% de
  transparente em cima, 35,5% de madeira, 31,6% de transparente em baixo. A
  espessura que se vê é `ALTURA × 0,355` — a caixa é quase três vezes a trave.

  ## Porque é `object-fill` e não `object-cover`

  Uma trave de 6000×1563 esticada aos 1400 px do contentor daria 364 px de
  altura de caixa, ou seja ~130 px de madeira: um cepo, não uma viga.
  `object-cover` resolveria a altura mas cortava a faixa de madeira ao meio e
  perdia-se-lhe a silhueta redonda — ficava uma barra chata.

  `object-fill` esmaga a imagem na vertical e mantém as duas arestas curvas
  intactas. Numa casca de árvore isso lê-se como uma trave mais longa e mais
  fina, que é exactamente o que se quer; e o ficheiro é um padrão que já se
  repete ao longo dos 6000 px, por isso a distorção não tem nada onde se
  denunciar.

  ## Onde está montada

  Não é filha do Hero — o Hero é `overflow-hidden` e cortava-a nas pontas — nem
  da `Casa`, que é `max-w-[1400px]` e nunca chega às arestas do ecrã sem
  `w-screen` (que conta a barra de scroll e abre scroll horizontal). Vive num
  irmão directo do `<main>`, em `app/page.tsx`, que já é largura total.

  O `-translate-y-1/2` é que a **centra** na junta em vez de a pendurar dela.

  Sem `Reveal`: uma trave que cai a balançar contradiz o que uma trave é.
*/

/*
  Altura da caixa, não da trave. A espessura visível sai daqui a 35,5%:

  | Ecrã | Caixa | Trave |
  |---|---|---|
  | telemóvel 390 | 112px (mínimo) | 40px |
  | 1024 | 133px | 47px |
  | 1440 | 187px | 66px |
  | ≥1770 | 230px (tecto) | 82px |

  Os extremos vêm dos dois mockups do Gonçalo: ~42 px de trave no telemóvel,
  ~82 px no ecrã largo. Trocar o ficheiro implica reconfirmar os 35,5% — é
  medido NESTE recorte. Na passagem da madeira clara para a escura foram
  remedidos e não mudaram: as duas têm a faixa nos mesmos 32,8%–69,3%.
*/
const ALTURA_CAIXA = "clamp(112px, 13vw, 230px)";

/*
  Quanto da caixa fica acima da junta. A 56% a trave sobe um sexto da própria
  espessura acima da linha, e cruza o baú a meio — que é o que o Gonçalo pediu.

  O número nasceu de um problema que já não existe: com a trave à frente do
  esqueleto, os 50% que a centravam na junta comiam-lhe as pernas, que só
  descem 14% da altura dele abaixo da linha (é o `ASSENTO = 86%` do
  `Esqueleto.tsx`). Agora que ele passou para a frente, a madeira já não lhe
  tapa nada. Os 56% ficam à mesma, por decisão dele — é onde a trave cruza o
  baú a meio.

  Não pode subir muito mais, e essa razão continua de pé: a aresta de baixo da
  madeira tem de ficar sempre abaixo da junta, senão as pontas das correntes da
  tabuleta, que nascem exactamente nessa linha, aparecem à vista em vez de
  virem de trás da trave.
*/
const ACIMA_DA_JUNTA = "56%";

export function Tronco() {
  const foto = photos.tronco;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0"
      style={{ height: ALTURA_CAIXA, transform: `translateY(-${ACIMA_DA_JUNTA})` }}
    >
      <Image
        src={foto.src}
        alt=""
        fill
        sizes="100vw"
        className="object-fill"
        /*
          A sombra vai no filtro e não em `box-shadow`, pela mesma razão que
          está escrita no `Esqueleto.tsx`: o `box-shadow` desenha o rectângulo
          da caixa, e a caixa aqui é quase três vezes a trave — desenhava uma
          mancha muito acima e muito abaixo dela. O `drop-shadow` segue o alfa.
        */
        style={{ filter: "drop-shadow(0 12px 20px rgb(0 0 0 / 0.55))" }}
      />
    </div>
  );
}
