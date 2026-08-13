import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { Tabua } from "@/components/decor/Tabua";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
import { fotosEm } from "@/lib/images-linguas";
import { formatPrice } from "@/lib/menu";
import { destaquesEm } from "@/lib/menu-linguas";
import { caminho } from "@/lib/i18n";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";

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

/*
  Tinha `border-y border-[var(--madeira-borda)]` a marcar onde começava e onde
  acabava. As traves passaram a fazer esse trabalho em todas as divisórias da
  página, e duas divisórias no mesmo sítio — madeira e um fio de 1px — lêem
  como sobra. O `bg-breu` fica: tirou-se o traço, não a mudança de fundo.
*/
export async function Petiscos() {
  const lang = await linguaActual();
  const dic = await dicionario();
  const fotos = fotosEm(lang);
  const highlights = destaquesEm(lang);

  return (
    <section id="petiscos" className="relative bg-breu py-24 sm:py-32">
      <FundoDeSeccao foto={fotos.balcaoBandeirinhas} />

      {/* `relative` obrigatório: sem ele o conteúdo fica por baixo do fundo. */}
      <div className="relative mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Tabua semente={3} className="p-6 sm:p-8">
            <h2 className="display letra-na-madeira text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
              {dic.petiscos.titulo}
            </h2>
            <p className="letra-na-madeira mt-5 text-base leading-relaxed text-osso">
              {dic.petiscos.frase}
            </p>
          </Tabua>
        </Reveal>

        {/*
          Células todas iguais em todas as resoluções: duas colunas no
          telemóvel, três a partir do tablet. Era um bento — a primeira célula
          ocupava 4 colunas por 2 linhas — e saiu a pedido do Gonçalo, que
          queria as fotografias mais pequenas.

          Eram cinco, e cinco numa grelha de três deixavam uma folga em baixo à
          direita — decisão dele, contra a alternativa de encher o buraco com o
          "Ver a ementa", que continua solto por baixo da grelha como sempre
          esteve. Com a ementa verdadeira passaram a seis, e as duas linhas
          fecham cheias.
        */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {highlights.map((dish, i) => (
            <Reveal key={dish.name} index={i} as="article" className="group">
              <div
                className={`tabua flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border-4 border-[var(--madeira-borda)] shadow-[0_10px_26px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out group-hover:rotate-0 ${tilts[i % tilts.length]}`}
              >
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
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal index={2} className="mt-10">
          <a
            href={caminho(lang, "/ementa")}
            className="group inline-flex items-center gap-3 text-base font-medium text-osso transition-colors hover:text-lanterna"
          >
            <span className="link-underline">{dic.geral.verEmenta}</span>
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
