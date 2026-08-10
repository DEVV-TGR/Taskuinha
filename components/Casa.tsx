import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Tabuleta } from "@/components/decor/Tabuleta";
import { Lanterna } from "@/components/decor/Lanterna";
import { Esqueleto } from "@/components/decor/Esqueleto";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
import { photos } from "@/lib/images";

/*
  Duas camadas, e não uma. A secção era o próprio contentor
  (`mx-auto max-w-[1400px]`), e um fundo lá dentro nunca chegava às arestas do
  ecrã. Agora a `<section>` é larga e leva a fotografia; o `<div>` de dentro
  guarda o `max-w` e o espaçamento que a secção tinha.

  O `relative` do div de dentro faz duas coisas ao mesmo tempo: põe o conteúdo
  **por cima** da fotografia, e passa a ser o contexto de posicionamento do
  `Esqueleto` e da `Tabuleta`. Como tem exactamente o `px`/`py` que a secção
  tinha antes, o `top-0 right-5` e o `-mt-24 sm:-mt-32` continuam a bater certo
  sem se lhes tocar num número.
*/
export function Casa() {
  return (
    <section id="a-casa" className="relative scroll-mt-20 bg-breu">
      <FundoDeSeccao foto={photos.nausFrota} />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        {/*
          O mascote sentado na junta com o Hero, a subir para dentro dele.

          Está montado AQUI e não no `Hero.tsx` por uma razão dura: o Hero é
          `overflow-hidden`, e lá dentro as pernas dele eram cortadas. Como
          filho da `Casa` — que não corta nada — sobe para cima da fotografia
          da fachada sem ser recortado, porque o `overflow-hidden` do Hero só
          se aplica aos descendentes do Hero.

          `z-10` põe-no à frente da tabuleta (camada automática) e por baixo do
          tronco (z-20, montado em `app/page.tsx`) — é o que dá a leitura de
          trave à frente do esqueleto e correntes por trás dela.
        */}
        <Esqueleto className="top-0 right-5 z-10 sm:right-8" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/*
            `-mt-24 sm:-mt-32` anula exactamente o `py` do contentor e leva o
            topo da tabuleta até à linha da junta, que é onde o tronco está.
            Sem isto as correntes começavam 96px abaixo da trave, penduradas do
            nada. As pontas ficam 2,7% da largura abaixo dessa linha (é a
            margem transparente do ficheiro) — meia espessura de trave,
            portanto escondidas por trás dela.

            Só esta coluna sobe: a fotografia do lado direito fica onde estava,
            e é essa diferença de altura que dá a leitura de coisa pendurada.

            O `max-w` só existe entre os 640px e o `lg`: aí a grelha ainda é de
            uma coluna e a tabuleta ia dos 640 aos 960px de largura, com as
            correntes a crescer na mesma proporção — um painel de estrada, não
            uma tabuleta. No telemóvel ocupa a largura toda (é o que está no
            mockup) e em `lg` manda a coluna da grelha.
          */}
          <Reveal className="-mt-24 sm:-mt-32 sm:max-w-[520px] lg:col-span-5 lg:max-w-none">
            <Tabuleta className="px-4 py-2 sm:px-6">
              <h2 className="display letra-na-madeira text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
                A casa
              </h2>

              <div className="letra-na-madeira mt-6 space-y-4 text-[0.95rem] leading-relaxed text-osso">
                <p>
                  Chamam-lhe o Pirata. O nome pegou-se e ficou, como se pega
                  tudo numa terra pequena.
                </p>
                <p>
                  A Taskuinha é uma taberna de pescadores na Avenida dos Banhos,
                  com o mar do outro lado da estrada. Serve petiscos, não pratos
                  de bandeira: amêijoas, lulas, pataniscas, e percebes quando o
                  mar deixa apanhar.
                </p>
                <p>
                  Há esplanada nas traseiras para quem quer sossego, e há o
                  balcão para quem não quer. A bebida pode sair porta fora e ir
                  ver o pôr do sol contigo.
                </p>
              </div>
            </Tabuleta>
          </Reveal>

          <Reveal index={1} className="relative lg:col-span-7">
            {/* Moldura torta — o quadro pendurado a direito seria estranho
                numa casa onde nada mais está. */}
            <figure
              className="relative aspect-[4/3] -rotate-1 overflow-hidden rounded-[var(--radius-card)] border-[6px] border-[var(--madeira)] shadow-[0_18px_40px_rgb(0_0_0/0.5)] lg:aspect-[3/2]"
              style={{ boxShadow: "inset 0 0 0 1px var(--madeira-borda)" }}
            >
              <Image
                src={photos.balcaoEspingardas.src}
                alt={photos.balcaoEspingardas.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-breu/45 mix-blend-multiply" />
              <div className="absolute inset-0 bg-lanterna/12 mix-blend-overlay" />
            </figure>

            <Lanterna className="-left-6 top-1/3 hidden sm:block" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
