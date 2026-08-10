import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Tabua } from "@/components/decor/Tabua";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
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
    <section id="o-sitio" className="relative scroll-mt-20 bg-breu">
      {/*
        Fotografia atrás de fotografia — é a secção onde isto mais arrisca ficar
        carregado, e é deliberado: o `tecto-nau` é o mural do tecto da casa, e
        as quatro molduras por cima têm borda de madeira e sombra própria, que
        é o que as descola do fundo.
      */}
      <FundoDeSeccao foto={photos.tectoNau} />

      {/* `relative` obrigatório: sem ele o conteúdo fica por baixo do fundo. */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-2xl">
          <Tabua semente={5} className="p-6 sm:p-8">
            <h2 className="display letra-na-madeira text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
              O sítio
            </h2>
            <p className="letra-na-madeira mt-5 text-base leading-relaxed text-osso">
              Vila Chã é uma aldeia piscatória. Os passadiços de madeira seguem
              a costa nos dois sentidos e o Caminho de Santiago passa aqui à
              porta, todos os dias, aos pés de alguém.
            </p>
          </Tabua>
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
      </div>
    </section>
  );
}
