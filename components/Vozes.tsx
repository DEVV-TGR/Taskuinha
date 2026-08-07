import { Reveal } from "@/components/Reveal";
import { ratings, quotes } from "@/lib/reviews";

/*
  Os logótipos vêm dos ficheiros oficiais da Simple Icons em /public/logos.
  Aplicados como máscara para herdarem a cor do tema em vez de trazerem uma
  cor fixa que só funciona num dos modos.
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

/* Deslocamentos diferentes por citação, para o bloco ler como um mural. */
const offsets = ["sm:mr-auto", "sm:ml-auto", "sm:mx-auto"];

export function Vozes() {
  return (
    <section className="border-y border-line bg-surface-sunken py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95]">
            O que dizem
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Chegam avaliações em várias línguas, o que faz sentido numa casa
            onde há sempre alguém a caminho de Santiago.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-4">
          {ratings.map((rating, i) => (
            <Reveal
              key={rating.platform}
              index={i}
              className="flex-1 basis-64 rounded-[var(--radius-card)] border border-line bg-surface-raised p-6"
            >
              <a
                href={rating.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <span className="mt-1 text-ink-muted transition-colors group-hover:text-accent">
                  <PlatformLogo icon={rating.icon} />
                </span>
                <span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl leading-none text-ink">
                      {rating.score}
                    </span>
                    <span className="font-mono text-sm text-ink-muted">
                      / {rating.outOf}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm text-ink-muted">
                    {rating.platform}, {rating.count}
                    {rating.note ? `. ${rating.note}` : ""}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 space-y-12">
          {quotes.map((quote, i) => (
            <Reveal
              key={quote.text}
              index={i}
              as="figure"
              className={`max-w-xl ${offsets[i % offsets.length]}`}
            >
              <blockquote
                lang={quote.lang}
                className="text-[clamp(1.15rem,2.4vw,1.5rem)] leading-snug text-ink"
              >
                <span aria-hidden className="text-accent">
                  “
                </span>
                {quote.text}
                <span aria-hidden className="text-accent">
                  ”
                </span>
              </blockquote>
              <figcaption className="mt-4 text-sm text-ink-muted">
                {quote.source}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
