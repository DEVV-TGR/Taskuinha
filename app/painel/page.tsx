import Link from "next/link";
import { ForkKnife, House, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { exigirSessao } from "@/lib/painel/porta";
import { Cabecalho } from "@/components/painel/Cabecalho";
import { Tabua } from "@/components/decor/Tabua";

/*
  A porta de dentro. Duas escolhas e mais nenhuma.

  `exigirSessao()` aqui e não no layout — ver o comentário longo no
  `app/painel/layout.tsx` sobre um layout não ser fronteira de segurança.
*/

const seccoes = [
  {
    href: "/painel/ementa",
    titulo: "A ementa",
    frase: "Mudar preços, acrescentar pratos, tirar pratos.",
    Icone: ForkKnife,
    semente: 1,
  },
  {
    href: "/painel/casa",
    titulo: "A casa",
    frase: "Telefone, morada, horário e redes sociais.",
    Icone: House,
    semente: 4,
  },
];

export default async function Painel() {
  const { utilizador } = await exigirSessao();

  return (
    <>
      <Cabecalho titulo="Painel" utilizador={utilizador} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <ul className="space-y-4">
          {seccoes.map(({ href, titulo, frase, Icone, semente }) => (
            <li key={href}>
              <Link href={href} className="block">
                <Tabua
                  semente={semente}
                  className="flex items-center gap-4 p-5 transition-[border-color] hover:ring-1 hover:ring-lanterna"
                >
                  <Icone
                    size={28}
                    weight="duotone"
                    className="shrink-0 text-lanterna"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-tight text-osso">
                      {titulo}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-osso-fraco">
                      {frase}
                    </span>
                  </span>
                  <CaretRight
                    size={18}
                    className="shrink-0 text-osso-fraco"
                    aria-hidden="true"
                  />
                </Tabua>
              </Link>
            </li>
          ))}
        </ul>

        {/*
          O aviso que evita o telefonema. Uma alteração no painel é um commit
          no repositório e um build da Vercel — não é uma escrita numa base de
          dados que aparece no instante seguinte. Quem não souber disto vai
          recarregar o site, não ver nada mudar, e concluir que se perdeu.
        */}
        <p className="mt-8 text-sm leading-relaxed text-osso-fraco">
          O que se muda aqui não aparece no site logo a seguir. Cada publicação
          reconstrói o site, e isso costuma demorar <strong>1 a 2 minutos</strong>.
        </p>
      </main>
    </>
  );
}
