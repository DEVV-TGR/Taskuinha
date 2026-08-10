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

/* Deslocamentos diferentes por citação, para o bloco ler como um mural. */
const offsets = ["sm:mr-auto", "sm:ml-auto", "sm:mx-auto"];
const sementes = [4, 9, 12];

export function Vozes() {
  return (
    <section className="relative border-y border-linha bg-breu py-24 sm:py-32">
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

        <div className="mt-16 flex flex-col gap-10 sm:gap-8">
          {quotes.map((quote, i) => (
            <Reveal
              key={quote.text}
              index={i}
              as="figure"
              className={`max-w-xl ${offsets[i % offsets.length]}`}
            >
              <Pergaminho semente={sementes[i % sementes.length]}>
                <blockquote
                  lang={quote.lang}
                  className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-snug"
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
                <figcaption className="mt-4 text-sm opacity-70">
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
