import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sessao } from "@/lib/painel/porta";
import { meioEscondido } from "@/lib/painel/utilizadores";
import { emailDoDesafio, NOME_DO_DESAFIO } from "@/lib/painel/codigo";
import { FormularioDeCodigo } from "@/components/painel/FormularioDeCodigo";
import { Tabua } from "@/components/decor/Tabua";

/*
  O segundo ecrã: o código.

  Só se chega aqui com um desafio a meio — ou seja, com um email da lista e um
  código já enviado. Quem lá bater sem isso é mandado para o princípio, e não
  fica a saber que este ecrã existe para alguma coisa.

  O endereço aparece meio escondido (`g•••••o@…`). Escrevê-lo por extenso seria
  confirmar a quem o escreveu que aquele endereço tem acesso — que é exactamente
  o que a resposta uniforme do primeiro ecrã existe para não fazer. As pontas
  chegam para quem é dono da caixa reconhecer.
*/

export default async function Codigo() {
  if (await sessao()) redirect("/painel");

  const frasco = await cookies();
  const email = await emailDoDesafio(frasco.get(NOME_DO_DESAFIO)?.value);
  if (!email) redirect("/painel/entrar");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="display text-[clamp(1.6rem,7vw,2.2rem)] leading-none text-osso">
            O código
          </h1>
        </header>

        <Tabua semente={5} className="p-5 sm:p-6">
          <FormularioDeCodigo paraOnde={meioEscondido(email)} />
        </Tabua>

        <p className="mt-6 text-center text-xs leading-relaxed text-osso-fraco">
          Se recebeste este código sem o teres pedido, alguém escreveu o teu
          endereço no ecrã de entrada. Sem o código não se entra.
        </p>
      </div>
    </main>
  );
}
