import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sessao } from "@/lib/painel/porta";
import { emailDe } from "@/lib/painel/utilizadores";
import {
  utilizadorDoDesafio,
  meioEscondido,
  NOME_DO_DESAFIO,
} from "@/lib/painel/codigo";
import { FormularioDeCodigo } from "@/components/painel/FormularioDeCodigo";
import { Tabua } from "@/components/decor/Tabua";

/*
  O segundo passo da entrada.

  Só se chega aqui com um desafio a meio — ou seja, com a password já acertada.
  Quem lá bater sem isso é mandado para o princípio, e não fica a saber que este
  ecrã existe para alguma coisa.

  O endereço aparece meio escondido (`g•••••o@…`). Quem é dono da caixa
  reconhece-o; quem chegou aqui com uma password roubada não fica a saber para
  onde ir bater a seguir.
*/

export default async function Codigo() {
  if (await sessao()) redirect("/painel");

  const frasco = await cookies();
  const utilizador = utilizadorDoDesafio(frasco.get(NOME_DO_DESAFIO)?.value);
  if (!utilizador) redirect("/painel/entrar");

  const email = emailDe(utilizador);
  if (!email) redirect("/painel/entrar");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="display text-[clamp(1.6rem,7vw,2.2rem)] leading-none text-osso">
            Segundo passo
          </h1>
        </header>

        <Tabua semente={5} className="p-5 sm:p-6">
          <FormularioDeCodigo paraOnde={meioEscondido(email)} />
        </Tabua>

        <p className="mt-6 text-center text-xs leading-relaxed text-osso-fraco">
          Se recebeste este código sem teres tentado entrar, alguém sabe a
          palavra-passe do painel. Vale a pena mudá-la.
        </p>
      </div>
    </main>
  );
}
