import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { HeroMedia } from "@/components/HeroMedia";
import { Cta } from "@/components/Cta";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <HeroMedia />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="max-w-3xl">
          <p className="display text-[clamp(2.75rem,11vw,6rem)] leading-[0.88] text-ink">
            Taskuinha
            <span className="mt-3 block font-mono text-[0.7rem] font-normal uppercase tracking-[0.42em] text-accent">
              do Pirata
            </span>
          </p>

          <h1 className="mt-8 max-w-xl text-[clamp(1.6rem,4.4vw,2.6rem)] font-medium leading-[1.12] tracking-tight text-ink">
            O mar fica a vinte passos.
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            Taberna de petiscos em Vila Chã. Marisco fresco, esplanada calma e a
            bebida pode ir contigo até à areia.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={`tel:${site.phone.tel}`}>Reservar mesa</Cta>
            <Cta href="/ementa" variant="secondary">
              <ForkKnife size={17} weight="bold" aria-hidden />
              Ver a ementa
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
