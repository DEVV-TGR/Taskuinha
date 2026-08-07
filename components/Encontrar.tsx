import { MapPin, Phone, NavigationArrow, Compass } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { Mapa } from "@/components/Mapa";
import { Pergaminho } from "@/components/decor/Pergaminho";
import { Tabua } from "@/components/decor/Tabua";
import { site, fullAddress } from "@/lib/site";

export function Encontrar() {
  return (
    <section
      id="encontrar-nos"
      className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] text-osso">
            Encontrar-nos
          </h2>

          <address className="mt-8 not-italic">
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

          {/* Horário numa tabuleta pendurada, como o cartaz manuscrito real
              da fachada — "SEGUNDA — FOLGA" e o resto por baixo. */}
          <Tabua semente={6} className="pendurado mt-12 max-w-sm p-5">
            <h3 className="text-sm font-medium uppercase tracking-wide text-lanterna">
              Horário
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
                    {entry.closed ? `${entry.day} — Folga` : entry.day}
                  </dt>
                  {entry.closed ? null : (
                    <dd
                      className="text-sm text-osso-fraco"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    >
                      {entry.label}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </Tabua>

          <p className="mt-8 max-w-sm text-sm leading-relaxed text-osso-fraco">
            Ao fim de semana a casa enche. Vale a pena telefonar antes de vir.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={`tel:${site.phone.tel}`}>Reservar mesa</Cta>
            <Cta href={site.links.directions} variant="secondary">
              <NavigationArrow size={17} weight="bold" aria-hidden />
              Como chegar
            </Cta>
          </div>
        </Reveal>

        <Reveal index={1}>
          <Pergaminho semente={11} className="h-full">
            <div className="relative">
              <Mapa />
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
    </section>
  );
}
