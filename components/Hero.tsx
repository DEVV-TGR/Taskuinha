import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { HeroMedia } from "@/components/HeroMedia";
import { Cta } from "@/components/Cta";
import { Relampago } from "@/components/decor/Relampago";
import { Barril } from "@/components/decor/Barril";
import { site } from "@/lib/site";

const LETRAS_PIRATA = ["P", "I", "R", "A", "T", "A"];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-gradient-to-b from-breu to-breu-raso">
      <HeroMedia />
      <Relampago className="z-20" />

      {/*
        Seis barris pendurados, a soletrar PIRATA — mas NÃO sobrepostos aos
        barris reais da fotografia. O plano (§9.1) pedia alinhamento
        pixel-a-pixel com os barris fotografados; a foto é um retrato
        (1536×2048) atravessado por `object-cover` num herói que muda de
        paisagem larga (1440px) a quase quadrado (390px) — a mesma
        percentagem não aponta para o mesmo sítio da foto nos dois casos.
        Fica a fila decorativa própria que o plano já previa como
        alternativa mais segura: perde-se o truque do alinhamento exacto,
        ganha-se robustez nos três tamanhos que a Fase 6 pede para verificar.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(var(--altura-nav)+0.5rem)] z-20 flex justify-center gap-3 px-4 sm:gap-6"
      >
        {LETRAS_PIRATA.map((letra, i) => (
          <Barril key={i} letra={letra} indice={i} />
        ))}
      </div>

      <div className="relative z-30 mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="max-w-3xl">
          <p className="display gravado text-[clamp(2.75rem,11vw,6rem)] leading-[0.88] text-osso">
            <span aria-hidden="true">
              TASKUI<span className="inline-block scale-x-[-1]">N</span>HA
            </span>
            <span className="sr-only">Taskuinha</span>
            <span
              className="mt-3 block text-[0.7rem] font-normal uppercase tracking-[0.42em] text-lanterna"
              style={{ fontFamily: "var(--font-maquina)" }}
            >
              do Pirata
            </span>
          </p>

          <h1 className="mt-8 max-w-xl text-[clamp(1.6rem,4.4vw,2.6rem)] font-medium leading-[1.12] tracking-tight text-osso">
            O mar fica a vinte passos.
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-osso-fraco">
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
