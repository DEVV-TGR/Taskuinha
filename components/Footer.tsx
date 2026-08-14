import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { site, fullAddress } from "@/lib/site";
import { caminho } from "@/lib/i18n";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";

/* Como na Nav: âncoras iguais em todas as línguas, só o prefixo muda. */
const secoes = [
  { chave: "casa", rota: "/", ancora: "#a-casa" },
  { chave: "petiscos", rota: "/", ancora: "#petiscos" },
  { chave: "sitio", rota: "/", ancora: "#o-sitio" },
  { chave: "ementa", rota: "/ementa", ancora: "" },
  { chave: "encontrar", rota: "/", ancora: "#encontrar-nos" },
] as const;

/*
  O casco do rodapé: fundo afundado e o nome do barco da ementa real —
  RUMOCEANO — como legenda por baixo do wordmark.

  Havia aqui uma faixa de 64/96px com três camadas de onda a deslizar em loop
  (`decor/Mar.tsx`). Saiu a pedido do Gonçalo, e o componente foi apagado — o
  rodapé fecha agora a direito.
*/
export async function Footer() {
  const lang = await linguaActual();
  const dic = await dicionario();

  const nav = secoes.map((seccao) => ({
    label: dic.nav[seccao.chave],
    href: `${caminho(lang, seccao.rota)}${seccao.ancora}`,
  }));

  return (
    <footer className="relative overflow-hidden border-t border-linha bg-breu-fundo">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <Wordmark size="lg" lang={lang} etiqueta={dic.nav.inicio} />
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
            <nav aria-label={dic.nav.rodape}>
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
                {dic.rodape.peregrinos}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-linha pt-6">
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em] text-osso-fraco"
            style={{ fontFamily: "var(--font-maquina)" }}
          >
            {dic.rodape.creditos}{" "}
            <a
              href="https://devplus.pt"
              target="_blank"
              rel="noreferrer"
              className="link-underline transition-colors hover:text-lanterna"
            >
              DevPlus
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
