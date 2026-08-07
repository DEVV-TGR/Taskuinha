import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { MenuCategoryNav } from "@/components/MenuCategoryNav";
import { menu, formatPrice, PRECOS_SAO_DEMO } from "@/lib/menu";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ementa",
  description:
    "Petiscos do mar e da terra, sandes, pratos e doces da Taskuinha do Pirata, em Vila Chã.",
};

export default function EmentaPage() {
  return (
    <>
      <Nav />

      <main id="conteudo" className="flex-1 pt-[68px]">
        <header className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9]">
            Ementa
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
            Casa de petiscos, não de pratos de bandeira. O que há hoje depende
            do que o mar deu de manhã.
          </p>
        </header>

        <MenuCategoryNav
          items={menu.map(({ id, title }) => ({ id, title }))}
        />

        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          {menu.map((category, categoryIndex) => (
            <section
              key={category.id}
              id={category.id}
              className={`scroll-mt-32 py-14 sm:py-20 ${
                categoryIndex > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-4">
                  <h2 className="display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[0.95]">
                    {category.title}
                  </h2>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                    {category.intro}
                  </p>
                </Reveal>

                <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-8">
                  {category.dishes.map((dish, i) => (
                    <Reveal key={dish.name} index={i} as="article">
                      <div className="flex items-baseline justify-between gap-5">
                        <h3 className="text-base font-medium text-ink">
                          {dish.name}
                          {dish.note ? (
                            <span className="ml-2 align-middle font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
                              {dish.note}
                            </span>
                          ) : null}
                        </h3>
                        <span className="shrink-0 font-mono text-sm text-accent">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      {dish.description ? (
                        <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
                          {dish.description}
                        </p>
                      ) : null}
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="border-t border-line bg-surface-sunken py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-lg space-y-3 text-sm leading-relaxed text-ink-muted">
              <p>
                Se tiveres alergias ou intolerâncias, diz à mesa antes de pedir.
                Quase tudo passa por marisco.
              </p>
              {PRECOS_SAO_DEMO ? (
                <p>
                  Os preços desta página são exemplos de demonstração e ainda
                  não são os da casa.
                </p>
              ) : null}
            </div>

            <Cta href={`tel:${site.phone.tel}`}>Reservar mesa</Cta>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
