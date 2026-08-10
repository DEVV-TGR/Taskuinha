import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { HeroMedia } from "@/components/HeroMedia";
import { Cta } from "@/components/Cta";
import { site } from "@/lib/site";

/*
  Havia aqui uma fila de seis barris pendurados a soletrar P·I·R·A·T·A,
  primeiro desenhados em SVG e depois trocados pela fotografia do barril
  real da casa. Saíram os dois: o cliente não gostou de nenhuma das
  versões.

  Não ficou nada no lugar, e é uma decisão defensável por si: a fotografia
  da fachada que está por trás **já tem os barris reais dela**, pendurados
  ao longo do beiral. A fila decorativa estava a duplicar um objecto que a
  fotografia já mostrava.

  `items-start` até aos 1024px, `items-end` a partir daí. Abaixo de `lg` o
  conteúdo sobe para o topo e deixa o fundo do Hero livre — é lá que o
  esqueleto se senta, na régua com a secção "A casa". Num ecrã estreito não
  há margem lateral onde ele caiba ao lado do texto; a única folga possível
  é por baixo. Em `lg` e acima o texto vive num `max-w-3xl` encostado à
  esquerda e sobram ~600px à direita, por isso o desenho original — texto
  assente no fundo, por cima da fachada — fica intacto onde funciona.
*/
export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-start overflow-hidden bg-gradient-to-b from-breu to-breu-raso lg:items-end">
      <HeroMedia />

      {/*
        O `pt` só existe enquanto o conteúdo está alinhado ao topo: a Nav é
        `fixed` e tem 68px (`--altura-nav`), por isso sem isto o wordmark
        ficava por baixo dela. Em `lg` volta a zero, que é quando o
        `items-end` assume e o `pb` passa a mandar.
      */}
      <div className="relative z-30 mx-auto w-full max-w-[1400px] px-5 pt-[calc(var(--altura-nav)+1.5rem)] pb-16 sm:px-8 sm:pb-24 lg:pt-0">
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
