import { Star } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { Pergaminho } from "@/components/decor/Pergaminho";
import { Tabua } from "@/components/decor/Tabua";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
import { photos } from "@/lib/images";
import { ratings, quotes } from "@/lib/reviews";

/*
  Os logótipos vêm dos ficheiros oficiais em /public/logos. Aplicados como
  máscara para herdarem a cor do tema em vez de trazerem uma cor fixa.
*/
function PlatformLogo({ icon }: { icon: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-6 w-6 shrink-0 bg-current"
      style={{
        maskImage: `url(/logos/${icon}.svg)`,
        WebkitMaskImage: `url(/logos/${icon}.svg)`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

function Estrelas({ score }: { score: string }) {
  const valor = Math.round(parseFloat(score.replace(",", ".")));
  return (
    <span className="flex gap-0.5 text-osso" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} weight={i < valor ? "fill" : "regular"} />
      ))}
    </span>
  );
}

/*
  Semente da borda rasgada, uma por citação. Era uma lista de três à mão
  (`[4, 9, 12]`), o que obrigava a inventar um número novo sempre que
  entrasse uma citação — e a repetir recortes assim que passassem de três.
  Uma conta a partir do índice serve qualquer quantidade.
*/
const semente = (i: number) => 4 + i * 5;

export function Vozes() {
  return (
    /* O `border-y border-linha` saiu: as traves passaram a ser a divisória. */
    <section className="relative bg-breu py-24 sm:py-32">
      <FundoDeSeccao foto={photos.salaEstatuas} />

      {/* `relative` obrigatório: sem ele o conteúdo fica por baixo do fundo. */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Tabua semente={7} className="p-6 sm:p-8">
            <h2 className="display letra-na-madeira text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
              O que dizem
            </h2>
            <p className="letra-na-madeira mt-5 text-base leading-relaxed text-osso">
              Chegam avaliações em várias línguas, o que faz sentido numa casa
              onde há sempre alguém a caminho de Santiago.
            </p>
          </Tabua>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-4">
          {ratings.map((rating, i) => (
            <Reveal
              key={rating.platform}
              index={i}
              className="flex-1 basis-64 rounded-[var(--radius-card)] border border-linha bg-breu-raso p-6"
            >
              <a
                href={rating.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <span className="mt-1 text-osso-fraco transition-colors group-hover:text-lanterna">
                  <PlatformLogo icon={rating.icon} />
                </span>
                <span>
                  <span className="flex items-baseline gap-1.5">
                    <span
                      className="text-3xl leading-none text-osso"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    >
                      {rating.score}
                    </span>
                    <span
                      className="text-sm text-osso-fraco"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    >
                      / {rating.outOf}
                    </span>
                  </span>
                  <Estrelas score={rating.score} />
                  <span className="mt-2 block text-sm text-osso-fraco">
                    {rating.platform}, {rating.count}
                    {rating.note ? `. ${rating.note}` : ""}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/*
          Grelha de duas colunas em todas as resoluções, a pedido do Gonçalo.
          Eram três pergaminhos soltos numa coluna, cada um encostado a um lado
          diferente (`mr-auto`, `ml-auto`, `mx-auto`) para lerem como um mural
          espalhado — era isso que ele não queria.

          `items-stretch` é o que faz a uniformidade: sem ele cada pergaminho
          tinha a altura do seu texto e a linha ficava desalinhada em baixo. O
          `h-full` tem de descer até ao `Pergaminho`, senão quem estica é só a
          `<figure>` e o papel fica a meio dela.
        */}
        <div className="mt-16 grid grid-cols-2 items-stretch gap-4 sm:gap-6">
          {quotes.map((quote, i) => (
            <Reveal key={quote.text} index={i} as="figure" className="h-full">
              <Pergaminho semente={semente(i)} className="h-full">
                <blockquote
                  lang={quote.lang}
                  /*
                    O mínimo desceu de 1,1rem para 0,9rem. Em duas colunas de
                    telemóvel a caixa de texto mede ~125px, e a 1,1rem cabiam
                    dez caracteres por linha.
                  */
                  className="text-[clamp(0.9rem,2.2vw,1.35rem)] leading-snug"
                  style={{ fontFamily: "var(--font-imfell)" }}
                >
                  <span aria-hidden className="text-[var(--pergaminho-queimado)]">
                    “
                  </span>
                  {quote.text}
                  <span aria-hidden className="text-[var(--pergaminho-queimado)]">
                    ”
                  </span>
                </blockquote>
                <figcaption className="mt-4 text-xs opacity-70 sm:text-sm">
                  {quote.source}
                </figcaption>
              </Pergaminho>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
