import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { Mar } from "@/components/decor/Mar";
import { Caveira } from "@/components/decor/Caveira";
import { site, fullAddress } from "@/lib/site";
import { PRECOS_SAO_DEMO } from "@/lib/menu";

const nav = [
  { label: "A casa", href: "/#a-casa" },
  { label: "Petiscos", href: "/#petiscos" },
  { label: "O sítio", href: "/#o-sitio" },
  { label: "Ementa", href: "/ementa" },
  { label: "Encontrar-nos", href: "/#encontrar-nos" },
];

/*
  O casco do rodapé: fundo afundado, o mar a bater por baixo (mesmo
  componente do Hero), e o nome do barco da ementa real — RUMOCEANO — como
  legenda por baixo do wordmark.
*/
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-linha bg-breu-fundo">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <Wordmark size="lg" />
            <p
              className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-osso-fraco"
              style={{ fontFamily: "var(--font-maquina)" }}
            >
              {site.legalName}
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-osso-fraco">
              {fullAddress()}
            </p>
            <a
              href={`tel:${site.phone.tel}`}
              className="link-underline mt-2 inline-block text-sm text-osso"
              style={{ fontFamily: "var(--font-maquina)" }}
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
                      className="link-underline text-sm text-osso-fraco transition-colors hover:text-osso"
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
                className="inline-flex items-center gap-2 text-sm text-osso-fraco transition-colors hover:text-lanterna"
              >
                <InstagramLogo size={20} weight="bold" aria-hidden />
                <span className="link-underline">@taskuinhadopirata</span>
              </a>
              <p className="mt-6 max-w-[15rem] text-sm leading-relaxed text-osso-fraco">
                O Caminho de Santiago passa à porta. Peregrinos são bem
                recebidos, com ou sem reserva.
              </p>
            </div>
          </div>
        </div>

        {/* A marca da casa a fechar o casco, entre os contactos e a letra
            pequena. Grande e apagada: é uma marca de água, não um logótipo
            a competir com o wordmark que está três blocos acima. */}
        <div aria-hidden="true" className="mt-16 flex items-center gap-6">
          <span className="h-px flex-1 bg-linha" />
          <Caveira className="h-12 w-16 text-osso-fraco opacity-40" ossos />
          <span className="h-px flex-1 bg-linha" />
        </div>

        {PRECOS_SAO_DEMO ? (
          <p className="mt-8 text-xs leading-relaxed text-osso-fraco">
            Os preços da ementa são exemplos de demonstração, à espera dos
            verdadeiros.
          </p>
        ) : null}
      </div>

      {/* O mar a bater no casco, por baixo de tudo. */}
      <div aria-hidden="true" className="relative h-16 sm:h-24">
        <Mar />
      </div>
    </footer>
  );
}
