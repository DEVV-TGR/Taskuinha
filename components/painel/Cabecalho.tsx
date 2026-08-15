import Link from "next/link";
import { ArrowLeft, SignOut } from "@phosphor-icons/react/dist/ssr";
import { sair } from "@/app/painel/accoes";

/*
  A barra de cima de todos os ecrãs do painel.

  Não é a `Nav` do site: essa é fixa, tem gaveta de telemóvel, selector de
  língua e um botão de reserva, e nada disso faz sentido aqui. Esta tem o
  caminho de volta à esquerda e sair à direita, e mais nada.

  Não é `sticky`. A barra de publicar do editor da ementa é que fica colada em
  baixo, ao pé do polegar; ter as duas coladas comia o ecrã de um telemóvel a
  meio.
*/

export function Cabecalho({
  titulo,
  voltarPara,
  utilizador,
}: {
  titulo: string;
  /** Ausente na página inicial do painel, que não tem para onde voltar. */
  voltarPara?: string;
  utilizador?: string;
}) {
  return (
    <header className="border-b border-linha bg-breu-fundo">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        {voltarPara ? (
          <Link
            href={voltarPara}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] text-osso-fraco hover:text-lanterna"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} weight="bold" />
          </Link>
        ) : null}

        <h1 className="min-w-0 flex-1 truncate text-lg leading-tight text-osso">
          {titulo}
        </h1>

        {utilizador ? (
          <form action={sair} className="shrink-0">
            <span className="mr-2 hidden text-sm text-osso-fraco sm:inline">
              {utilizador}
            </span>
            <button
              type="submit"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] text-osso-fraco hover:text-lanterna"
              aria-label={`Sair (${utilizador})`}
            >
              <SignOut size={20} weight="bold" />
            </button>
          </form>
        ) : null}
      </div>
    </header>
  );
}
