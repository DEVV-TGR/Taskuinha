import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { photos } from "@/lib/images";

const shots = [photos.passadico, photos.praia, photos.porDoSol, photos.balcao];

/* Estreita e larga na primeira linha, o inverso na segunda. */
const spans = [
  "sm:col-span-5",
  "sm:col-span-7",
  "sm:col-span-7",
  "sm:col-span-5",
];

export function Galeria() {
  return (
    <section
      id="o-sitio"
      className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95]">
          O sítio
        </h2>
        <p className="mt-5 text-base leading-relaxed text-ink-muted">
          Vila Chã é uma aldeia piscatória. Os passadiços de madeira seguem a
          costa nos dois sentidos e o Caminho de Santiago passa aqui à porta,
          todos os dias, aos pés de alguém.
        </p>
      </Reveal>

      {/*
        Grelha de quatro, com as proporções invertidas entre linhas: estreita
        e larga em cima, larga e estreita em baixo. Alturas fixas por linha
        para não abrir buracos, e recorte por object-cover.
      */}
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-12">
        {shots.map((shot, i) => (
          <Reveal
            key={shot.slot}
            index={i}
            as="figure"
            className={`relative h-64 overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-[26rem] ${spans[i]}`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
              className="object-cover"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
