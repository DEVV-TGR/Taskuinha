import { MapPin, Phone, NavigationArrow, Compass } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { Mapa } from "@/components/Mapa";
import { Pergaminho } from "@/components/decor/Pergaminho";
import { Tabua } from "@/components/decor/Tabua";
import { FundoDeSeccao } from "@/components/decor/FundoDeSeccao";
import { fotosEm } from "@/lib/images-linguas";
import { site, fullAddress } from "@/lib/site";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";

export async function Encontrar() {
  const dic = await dicionario();
  const fotos = fotosEm(await linguaActual());

  return (
    <section id="encontrar-nos" className="relative scroll-mt-20 bg-breu">
      <FundoDeSeccao foto={fotos.marPorDoSol} />

      {/* `relative` obrigatório: sem ele o conteúdo fica por baixo do fundo. */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            {/*
            A morada e o telefone entram na mesma tábua do título. Eram texto
            solto, e com o pôr do sol por trás a 75% deixavam de se ler.

            **Não aninhar o horário aqui dentro**: já tem tábua própria, e
            madeira dentro de madeira lê-se como um erro de montagem.
          */}
            <Tabua semente={8} className="p-6 sm:p-8">
              <h2 className="display letra-na-madeira text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
                {dic.encontrar.titulo}
              </h2>

              <address className="letra-na-madeira mt-8 not-italic">
                <p className="flex items-start gap-3 text-base leading-relaxed text-osso">
                  <MapPin
                    size={20}
                    weight="bold"
                    aria-hidden
                    className="mt-0.5 shrink-0 text-lanterna"
                  />
                  {fullAddress()}
                </p>
                <p className="mt-4 flex items-center gap-3">
                  <Phone
                    size={20}
                    weight="bold"
                    aria-hidden
                    className="shrink-0 text-lanterna"
                  />
                  <a
                    href={`tel:${site.phone.tel}`}
                    className="link-underline text-base text-osso"
                    style={{ fontFamily: "var(--font-maquina)" }}
                  >
                    {site.phone.display}
                  </a>
                </p>
              </address>
            </Tabua>

            {/* Horário numa tabuleta pendurada, como o cartaz manuscrito real
              da fachada — "SEGUNDA — FOLGA" e o resto por baixo. */}
            <Tabua semente={6} className="pendurado mt-12 max-w-sm p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-lanterna">
                {dic.encontrar.horario}
              </h3>
              <dl className="mt-4">
                {site.hours.map((entry) => (
                  <div
                    key={entry.day}
                    className="flex items-baseline justify-between gap-6 py-1.5"
                  >
                    <dt
                      className={`flex items-center gap-2 text-sm ${
                        entry.closed ? "gravado uppercase tracking-wide text-lanterna" : "text-osso"
                      }`}
                    >
                      {/* --sangue nunca toca em texto (2,3:1 sobre --madeira,
                        falha AA) — a cor de aviso fica no ponto, não na letra. */}
                      {entry.closed ? (
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sangue" />
                      ) : null}
                      {entry.closed
                        ? `${dic.dias[entry.day]} — ${dic.encontrar.folga}`
                        : dic.dias[entry.day]}
                    </dt>
                    {entry.closed ? null : (
                      <dd
                        className="text-sm text-osso-fraco"
                        style={{ fontFamily: "var(--font-maquina)" }}
                      >
                        {dic.horarios[entry.label]}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </Tabua>

            {/* Tábua própria, pequena: era a última linha de texto solto da
              secção e é o aviso mais útil que aqui está. */}
            <Tabua semente={10} className="mt-8 max-w-sm p-5">
              <p className="letra-na-madeira text-sm leading-relaxed text-osso">
                {dic.encontrar.aviso}
              </p>
            </Tabua>

            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={`tel:${site.phone.tel}`}>{dic.geral.reservar}</Cta>
              <Cta href={site.links.directions} variant="secondary">
                <NavigationArrow size={17} weight="bold" aria-hidden />
                {dic.geral.comoChegar}
              </Cta>
            </div>
          </Reveal>

          <Reveal index={1}>
            <Pergaminho semente={11} className="h-full">
              <div className="relative">
                <Mapa titulo={dic.encontrar.mapa} />
                {/* X a marcar o sítio + bússola — decoração, não faz parte do
                  mapa em si (nunca cima do iframe interactivo). */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-sangue"
                  style={{ fontFamily: "var(--font-maquina)", textShadow: "0 2px 3px rgb(0 0 0 / 0.6)" }}
                >
                  ✕
                </span>
                <Compass
                  aria-hidden="true"
                  size={32}
                  weight="fill"
                  className="pointer-events-none absolute right-3 top-3 text-lanterna drop-shadow-[0_1px_3px_rgb(0_0_0/0.7)]"
                />
              </div>
            </Pergaminho>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
