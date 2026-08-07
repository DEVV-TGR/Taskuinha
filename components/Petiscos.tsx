import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { highlights, formatPrice } from "@/lib/menu";

/*
  Seis pratos, seis células, e a grelha fecha sem sobras:
    linha 1  amêijoas (4) + lulas (2)
    linha 2  amêijoas continua + percebes (2)
    linha 3  pataniscas (2) + prego (2) + bacalhau (2)

  As duas células sem fotografia levam o preço em corpo grande no fundo, para
  ocuparem a altura com intenção em vez de ficarem caixas meio vazias.
*/
const cells = [
  "sm:col-span-4 sm:row-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
];

export function Petiscos() {
  return (
    <section
      id="petiscos"
      className="border-y border-line bg-surface-sunken py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 sm:px-8">
        <Reveal>
          <h2 className="display max-w-2xl text-[clamp(2rem,5vw,3.25rem)] leading-[0.95]">
            O que sai mais da cozinha
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
            Estes são os pratos que mais aparecem nas avaliações de quem cá
            esteve.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-6">
          {highlights.map((dish, i) => (
            <Reveal
              key={dish.name}
              index={i}
              as="article"
              className={`${cells[i]} group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-raised`}
            >
              {dish.photo ? (
                <>
                  {/* As duas células da primeira linha partilham a altura da
                      foto grande, por isso a imagem estica em vez de deixar
                      folga por baixo. */}
                  <div
                    className={`relative overflow-hidden ${
                      i <= 1
                        ? "aspect-[4/3] sm:aspect-auto sm:min-h-52 sm:flex-1"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={dish.photo.src}
                      alt={dish.photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 p-5 sm:p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className={`display leading-none ${
                          i === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}
                      >
                        {dish.name}
                      </h3>
                      <span className="font-mono text-sm text-accent">
                        {formatPrice(dish.price)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {dish.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col justify-between gap-8 p-5 sm:p-6">
                  <div>
                    <h3 className="display text-base leading-none sm:text-lg">
                      {dish.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {dish.description}
                    </p>
                  </div>
                  <span className="font-mono text-2xl leading-none text-accent sm:text-3xl">
                    {formatPrice(dish.price)}
                  </span>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal index={2} className="mt-10">
          <a
            href="/ementa"
            className="group inline-flex items-center gap-3 text-base font-medium text-ink transition-colors hover:text-accent"
          >
            <span className="link-underline">Ver a ementa</span>
            <ArrowRight
              size={18}
              weight="bold"
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
