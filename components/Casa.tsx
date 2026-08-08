import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Tabua } from "@/components/decor/Tabua";
import { Lanterna } from "@/components/decor/Lanterna";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
import { photos } from "@/lib/images";

export function Casa() {
  return (
    <section
      id="a-casa"
      className="relative mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <FundoDeSeccao foto={photos.salaEstatuas} posicao="center 40%" />

      {/* `relative` no conteúdo, não z-index: dois irmãos posicionados
          pintam por ordem do DOM, e o conteúdo vem depois do fundo. Sem
          isto, o fundo (que é `absolute`) tapava a secção inteira. */}
      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:pt-10">
          <Tabua semente={2} className="p-6 sm:p-8">
            <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
              A casa
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-osso-fraco">
              <p>
                Chamam-lhe o Pirata. O nome pegou-se e ficou, como se pega tudo
                numa terra pequena.
              </p>
              <p>
                A Taskuinha é uma taberna de pescadores na Avenida dos Banhos, com
                o mar do outro lado da estrada. Serve petiscos, não pratos de
                bandeira: amêijoas, lulas, pataniscas, e percebes quando o mar
                deixa apanhar.
              </p>
              <p>
                Há esplanada nas traseiras para quem quer sossego, e há o balcão
                para quem não quer. A bebida pode sair porta fora e ir ver o pôr
                do sol contigo.
              </p>
            </div>
          </Tabua>
        </Reveal>

        <Reveal index={1} className="relative lg:col-span-7">
          {/* Moldura torta — o quadro pendurado a direito seria estranho
              numa casa onde nada mais está. */}
          <figure
            className="relative aspect-[4/3] -rotate-1 overflow-hidden rounded-[var(--radius-card)] border-[6px] border-[var(--madeira)] shadow-[0_18px_40px_rgb(0_0_0/0.5)] lg:aspect-[3/2]"
            style={{ boxShadow: "inset 0 0 0 1px var(--madeira-borda)" }}
          >
            <Image
              src={photos.balcaoEspingardas.src}
              alt={photos.balcaoEspingardas.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-breu/45 mix-blend-multiply" />
            <div className="absolute inset-0 bg-lanterna/12 mix-blend-overlay" />
          </figure>

          <Lanterna className="-left-6 top-1/3 hidden sm:block" />
        </Reveal>
      </div>
    </section>
  );
}
