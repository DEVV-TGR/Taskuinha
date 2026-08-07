import { MapPin, Phone, NavigationArrow } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { Mapa } from "@/components/Mapa";
import { site, fullAddress } from "@/lib/site";

export function Encontrar() {
  return (
    <section
      id="encontrar-nos"
      className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95]">
            Encontrar-nos
          </h2>

          <address className="mt-8 not-italic">
            <p className="flex items-start gap-3 text-base leading-relaxed text-ink">
              <MapPin
                size={20}
                weight="bold"
                aria-hidden
                className="mt-0.5 shrink-0 text-accent"
              />
              {fullAddress()}
            </p>
            <p className="mt-4 flex items-center gap-3">
              <Phone
                size={20}
                weight="bold"
                aria-hidden
                className="shrink-0 text-accent"
              />
              <a
                href={`tel:${site.phone.tel}`}
                className="link-underline font-mono text-base text-ink"
              >
                {site.phone.display}
              </a>
            </p>
          </address>

          <h3 className="mt-12 text-sm font-medium text-ink">Horário</h3>
          <dl className="mt-4 max-w-sm">
            {site.hours.map((entry) => (
              <div
                key={entry.day}
                className="flex items-baseline justify-between gap-6 py-1.5"
              >
                <dt
                  className={`text-sm ${
                    entry.closed ? "text-ink-muted" : "text-ink"
                  }`}
                >
                  {entry.day}
                </dt>
                <dd
                  className={`font-mono text-sm ${
                    entry.closed ? "text-ink-muted" : "text-ink"
                  }`}
                >
                  {entry.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink-muted">
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

        <Mapa />
      </div>
    </section>
  );
}
