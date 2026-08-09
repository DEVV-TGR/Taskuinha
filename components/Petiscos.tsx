import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { SeloDeSeccao } from "@/components/decor/SeloDeSeccao";
import { highlights, formatPrice } from "@/lib/menu";

/*
  Seis pratos, seis células, e a grelha fecha sem sobras:
    linha 1  amêijoas (4) + lapas (2)
    linha 2  amêijoas continua + lulas (2)
    linha 3  sardinhas (2) + percebes (2) + bacalhau (2)

  A célula sem fotografia (bacalhau à Brás) leva o preço em corpo grande no
  fundo, para ocupar a altura com intenção em vez de ficar uma caixa meio
  vazia. `highlights` tem de continuar a ter exactamente 6 itens — ver o
  comentário em lib/menu.ts.
*/
const cells = [
  "sm:col-span-4 sm:row-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
];

/*
  Inclinação individual e determinística — alterna o sentido por índice para
  o conjunto ler como uma parede de quadros pendurados à mão, e endireita a
  0° no hover. São classes Tailwind a sério (não `style.transform` inline):
  um `transform` inline ganharia sempre a qualquer `group-hover:`, porque
  estilo inline tem mais especificidade do que qualquer classe CSS.
*/
const tilts = [
  "rotate-[-2deg]",
  "rotate-[1.5deg]",
  "rotate-[-1deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[1deg]",
] as const;

export function Petiscos() {
  return (
    <section
      id="petiscos"
      className="relative border-y border-[var(--madeira-borda)] bg-breu-fundo py-24 sm:py-32"
    >
      <SeloDeSeccao semente={3} />
      <div className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 sm:px-8">
        <Reveal>
          <h2 className="display max-w-2xl text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
            O que sai mais da cozinha
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-osso-fraco">
            Estes são os pratos que mais aparecem nas avaliações de quem cá
            esteve.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-6">
          {highlights.map((dish, i) => (
            <Reveal
              key={dish.name}
              index={i}
              as="article"
              className={`${cells[i]} group`}
            >
              <div
                className={`tabua flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--madeira-borda)] shadow-[0_10px_26px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out group-hover:rotate-0 ${tilts[i % tilts.length]}`}
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

                    <div className="flex flex-col gap-2 bg-breu-raso p-5 sm:p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3
                          className={`display leading-none text-osso ${
                            i === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                          }`}
                        >
                          {dish.name}
                        </h3>
                        <span
                          className="text-sm text-lanterna"
                          style={{ fontFamily: "var(--font-maquina)" }}
                        >
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-osso-fraco">
                        {dish.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col justify-between gap-8 bg-breu-raso p-5 sm:p-6">
                    <div>
                      <h3 className="display text-base leading-none text-osso sm:text-lg">
                        {dish.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-osso-fraco">
                        {dish.description}
                      </p>
                    </div>
                    <span
                      className="text-2xl leading-none text-lanterna sm:text-3xl"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    >
                      {formatPrice(dish.price)}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal index={2} className="mt-10">
          <a
            href="/ementa"
            className="group inline-flex items-center gap-3 text-base font-medium text-osso transition-colors hover:text-lanterna"
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
