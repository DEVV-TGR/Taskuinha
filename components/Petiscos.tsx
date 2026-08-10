import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { highlights, formatPrice } from "@/lib/menu";

/*
  Inclinação individual e determinística — alterna o sentido por índice para
  o conjunto ler como uma parede de quadros pendurados à mão, e endireita a
  0° no hover. São classes Tailwind a sério (não `style.transform` inline):
  um `transform` inline ganharia sempre a qualquer `group-hover:`, porque
  estilo inline tem mais especificidade do que qualquer classe CSS.

  Os ângulos baixaram para cerca de metade quando a grelha passou a células
  pequenas. Numa célula de 170px, 2° deslocam o canto quase 6px e as folgas
  entre vizinhos ficavam desiguais a olho; em bento, com uma célula de 700px,
  os mesmos 2° liam-se como um toque.
*/
const tilts = [
  "rotate-[-1deg]",
  "rotate-[0.75deg]",
  "rotate-[-0.5deg]",
  "rotate-[1deg]",
  "rotate-[-0.75deg]",
] as const;

export function Petiscos() {
  return (
    <section
      id="petiscos"
      className="border-y border-[var(--madeira-borda)] bg-breu-fundo py-24 sm:py-32"
    >
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

        {/*
          Células todas iguais em todas as resoluções: duas colunas no
          telemóvel, três a partir do tablet. Era um bento — a primeira célula
          ocupava 4 colunas por 2 linhas — e saiu a pedido do Gonçalo, que
          queria as fotografias mais pequenas.

          Cinco pratos numa grelha de três deixam uma folga em baixo à direita.
          Também foi decisão dele: a alternativa era pôr lá o "Ver a ementa",
          que fica solto por baixo da grelha como sempre esteve.
        */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {highlights.map((dish, i) => (
            <Reveal key={dish.name} index={i} as="article" className="group">
              <div
                className={`tabua flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--madeira-borda)] shadow-[0_10px_26px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out group-hover:rotate-0 ${tilts[i % tilts.length]}`}
              >
                {dish.photo ? (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={dish.photo.src}
                        alt={dish.photo.alt}
                        fill
                        /* Tem de acompanhar as células novas: no telemóvel a
                           caixa são ~170px, e o `100vw` de antes mandava para
                           lá a versão de ecrã grande. */
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </div>

                    {/*
                      O nome e o preço descem um degrau no telemóvel: numa
                      célula de duas colunas, "Sardinhas no pão" ao tamanho
                      antigo partia em três linhas.
                    */}
                    <div className="flex flex-col gap-1.5 bg-breu-raso p-3 sm:gap-2 sm:p-5">
                      <div className="flex items-baseline justify-between gap-2 sm:gap-4">
                        <h3 className="display text-sm leading-none text-osso sm:text-base">
                          {dish.name}
                        </h3>
                        <span
                          className="shrink-0 text-xs text-lanterna sm:text-sm"
                          style={{ fontFamily: "var(--font-maquina)" }}
                        >
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-osso-fraco sm:text-sm">
                        {dish.description}
                      </p>
                    </div>
                  </>
                ) : (
                  /*
                    Nenhum dos cinco destaques cai aqui hoje — o Bacalhau à
                    Brás, que era o único sem fotografia, saiu com o bento.
                    O ramo fica porque `photo` continua opcional no tipo
                    `Highlight`: no dia em que entre um prato sem foto, a
                    célula tem por onde se desenhar em vez de rebentar.
                  */
                  <div className="flex flex-1 flex-col justify-between gap-6 bg-breu-raso p-3 sm:p-5">
                    <div>
                      <h3 className="display text-sm leading-none text-osso sm:text-base">
                        {dish.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-osso-fraco sm:text-sm">
                        {dish.description}
                      </p>
                    </div>
                    <span
                      className="text-xl leading-none text-lanterna sm:text-2xl"
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
