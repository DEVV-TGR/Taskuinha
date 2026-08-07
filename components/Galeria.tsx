import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { photos } from "@/lib/images";

const shots = [
  photos.salaCheia,
  photos.tectoNauAranha,
  photos.salaEstatuas,
  photos.esplanada,
];

/* Estreita e larga na primeira linha, o inverso na segunda. */
const spans = [
  "sm:col-span-5",
  "sm:col-span-7",
  "sm:col-span-7",
  "sm:col-span-5",
];

/* Inclinação individual — molduras penduradas à mão nunca ficam todas a direito. */
const tilts = ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-1deg]", "rotate-[1.5deg]"];

export function Galeria() {
  return (
    <section
      id="o-sitio"
      className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
          O sítio
        </h2>
        <p className="mt-5 text-base leading-relaxed text-osso-fraco">
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
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-12">
        {shots.map((shot, i) => (
          <Reveal
            key={shot.src}
            index={i}
            as="figure"
            className={`group relative h-64 overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--madeira-borda)] shadow-[0_10px_26px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out hover:rotate-0 sm:h-[26rem] ${spans[i]} ${tilts[i % tilts.length]}`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
              className="object-cover"
            />
            {shot.luz === "dia" ? (
              <>
                <div className="absolute inset-0 bg-breu/45 mix-blend-multiply" />
                <div className="absolute inset-0 bg-lanterna/12 mix-blend-overlay" />
              </>
            ) : (
              <div className="absolute inset-0 bg-breu/22 mix-blend-multiply" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
