import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { photos } from "@/lib/images";

export function Casa() {
  return (
    <section
      id="a-casa"
      className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:pt-10">
          <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95]">
            A casa
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-muted">
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
        </Reveal>

        <Reveal index={1} className="lg:col-span-7">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-line lg:aspect-[3/2]">
            <Image
              src={photos.casa.src}
              alt={photos.casa.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
