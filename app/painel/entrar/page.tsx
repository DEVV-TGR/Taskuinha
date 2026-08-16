import { redirect } from "next/navigation";
import { sessao } from "@/lib/painel/porta";
import { FormularioDeEntrada } from "@/components/painel/FormularioDeEntrada";
import { Tabua } from "@/components/decor/Tabua";

/*
  O ecrã de entrada.

  É a única página do painel que não chama `exigirSessao()` — seria um ciclo.
  Faz o contrário: quem já tem sessão não tem nada que fazer aqui e vai para
  dentro.

  Nada nesta página toca em variáveis de ambiente até o formulário ser
  submetido, e isso não é um acaso: é o que permite ao `npm run fumo` do CI
  abrir esta página num ambiente sem um único segredo definido.
*/

export default async function Entrar() {
  if (await sessao()) redirect("/painel");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="display text-[clamp(1.9rem,8vw,2.6rem)] leading-none text-osso">
            Taskuinha
          </h1>
          <p className="mt-3 text-sm text-osso-fraco">
            O painel da casa. Escreve o teu email e recebes um código.
          </p>
        </header>

        <Tabua semente={3} className="p-5 sm:p-6">
          <FormularioDeEntrada />
        </Tabua>

        <p className="mt-6 text-center text-xs leading-relaxed text-osso-fraco">
          Não há palavra-passe para decorar. Se o código não chegar, confirma o
          endereço e vê o spam.
        </p>
      </div>
    </main>
  );
}
