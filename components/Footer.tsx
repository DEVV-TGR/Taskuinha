import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { site, fullAddress } from "@/lib/site";

const nav = [
  { label: "A casa", href: "/#a-casa" },
  { label: "Petiscos", href: "/#petiscos" },
  { label: "O sítio", href: "/#o-sitio" },
  { label: "Ementa", href: "/ementa" },
  { label: "Encontrar-nos", href: "/#encontrar-nos" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <Wordmark size="lg" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-muted">
              {fullAddress()}
            </p>
            <a
              href={`tel:${site.phone.tel}`}
              className="link-underline mt-2 inline-block font-mono text-sm text-ink"
            >
              {site.phone.display}
            </a>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Navegação do rodapé">
              <ul className="space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="link-underline text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <a
                href={site.links.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
              >
                <InstagramLogo size={20} weight="bold" aria-hidden />
                <span className="link-underline">@taskuinhadopirata</span>
              </a>
              <p className="mt-6 max-w-[15rem] text-sm leading-relaxed text-ink-muted">
                O Caminho de Santiago passa à porta. Peregrinos são bem
                recebidos, com ou sem reserva.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-16 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
          Sítio de demonstração. As fotografias não são da casa e os preços da
          ementa são exemplos, à espera dos verdadeiros.
        </p>
      </div>
    </footer>
  );
}
