import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { MenuCategoryNav } from "@/components/MenuCategoryNav";
import { RoloEmenta } from "@/components/decor/RoloEmenta";
import { formatPrice } from "@/lib/menu";
import { ementaEm } from "@/lib/menu-linguas";
import { site } from "@/lib/site";
import { caminho, alternativas } from "@/lib/i18n";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await linguaActual();
  const dic = await dicionario();

  return {
    title: dic.meta.ementaTitulo,
    description: dic.meta.ementaDescricao,
    alternates: {
      canonical: caminho(lang, "/ementa"),
      languages: alternativas("/ementa"),
    },
    /*
      O `openGraph` do layout não se funde campo a campo com o daqui: sem
      estas três linhas, o cartão de partilha da ementa saía com o título,
      a descrição e o endereço da página inicial.
    */
    openGraph: {
      title: `${dic.meta.ementaTitulo} · ${site.fullName}`,
      description: dic.meta.ementaDescricao,
      url: caminho(lang, "/ementa"),
    },
  };
}

export default async function EmentaPage() {
  const lang = await linguaActual();
  const dic = await dicionario();
  const menu = ementaEm(lang);

  return (
    <>
      <Nav
        lang={lang}
        texto={{ nav: dic.nav, geral: dic.geral, linguas: dic.linguas }}
      />

      {/* tabIndex={-1}: o skip link salta para aqui, e sem isto o
          "salto" é só scroll — o foco do teclado não vem atrás. */}
      <main id="conteudo" tabIndex={-1} className="flex-1 pt-[var(--altura-nav)] focus:outline-none">
        <header className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] text-osso">
            {dic.ementa.titulo}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-osso-fraco">
            {dic.ementa.frase}
          </p>
        </header>

        {/* Sem traves nesta página. Chegaram a estar cá duas — uma a fechar o
            título, outra antes do rodapé — e o Gonçalo mandou tirar as duas.
            As divisórias de madeira ficaram só na inicial. */}
        <MenuCategoryNav
          items={menu.map(({ id, title }) => ({ id, title }))}
          etiqueta={dic.ementa.categorias}
        />

        {/*
          Um rolo só, do princípio ao fim da ementa.

          Foram seis pergaminhos pregados à parede, um por categoria — a nota
          antiga argumentava que seis categorias com nome próprio pediam seis
          folhas, contra a referência do plano (kalozetterem.hu/etlap), que é
          uma folha única. O Gonçalo decidiu o contrário: um rolo só, esticado
          até a ementa acabar, e as categorias separadas só por espaço.

          `py-14 sm:py-20` saiu daqui: quem afasta o texto das varas agora é o
          `padding` do próprio `RoloEmenta`, medido no desenho do rolo. O que
          fica é o `px`, para o rolo não encostar à aresta do ecrã, e o
          `space-y`, que é o ar entre categorias dentro da mesma folha.
        */}
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-14 sm:px-8 sm:pb-20">
          <RoloEmenta>
            <div className="space-y-10 sm:space-y-14">
              {menu.map((category, categoryIndex) => (
                <section key={category.id} id={category.id} className="scroll-mt-32">
                  <Reveal index={categoryIndex}>
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                      <div className="lg:col-span-4">
                        <h2
                          className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[0.95]"
                          style={{ fontFamily: "var(--font-pergaminho)" }}
                        >
                          {category.title}
                        </h2>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-75">
                          {category.intro}
                        </p>
                      </div>

                      <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2 lg:col-span-8">
                        {category.dishes.map((dish) => (
                          <article key={dish.name}>
                            <div className="flex items-baseline justify-between gap-5">
                              <h3
                                className="text-lg leading-tight"
                                style={{ fontFamily: "var(--font-pergaminho)" }}
                              >
                                {dish.name}
                                {dish.note ? (
                                  <span
                                    className="ml-2 align-middle text-[0.65rem] uppercase tracking-[0.16em] text-[var(--pergaminho-queimado)]"
                                    style={{ fontFamily: "var(--font-maquina)" }}
                                  >
                                    {dish.note}
                                  </span>
                                ) : null}
                              </h3>
                              <span
                                className="shrink-0 text-sm"
                                style={{ fontFamily: "var(--font-maquina)" }}
                              >
                                {formatPrice(dish.price)}
                              </span>
                            </div>
                            {dish.description ? (
                              <p className="mt-1.5 max-w-[42ch] text-[0.8rem] leading-relaxed opacity-80">
                                {dish.description}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </section>
              ))}
            </div>
          </RoloEmenta>
        </div>

        <section className="border-t border-linha bg-breu-fundo py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-lg space-y-3 text-sm leading-relaxed text-osso-fraco">
              <p>{dic.ementa.alergias}</p>
            </div>

            <Cta href={`tel:${site.phone.tel}`}>{dic.geral.reservar}</Cta>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
