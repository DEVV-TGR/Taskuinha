import { exigirSessao } from "@/lib/painel/porta";
import { ler, CAMINHO_CASA, ErroDoGithub } from "@/lib/painel/github";
import { Cabecalho } from "@/components/painel/Cabecalho";
import { EditorDaCasa } from "@/components/painel/EditorDaCasa";
import { Aviso } from "@/components/painel/Aviso";
import type { Dia } from "@/lib/horario";

type Casa = {
  telefone: { mostrar: string; tel: string };
  morada: { rua: string; codigoPostal: string; localidade: string; concelho: string };
  horario: { dia: Dia; fechado?: boolean; abre?: string; fecha?: string }[];
  links: Record<string, string>;
};

/*
  Os contactos e o horário.

  Os dados vêm do GitHub e **não** do `import "@/data/casa.json"`, que é o que
  o site usa. A razão está escrita por extenso no `lib/painel/github.ts`, e
  resume-se a duas: o import é a versão embutida no último build, que durante a
  reconstrução está atrasada face ao repositório; e não traz o `sha`, que é o
  cadeado de que a gravação a seguir precisa.
*/

export default async function Casa() {
  const { utilizador } = await exigirSessao();

  let ficheiro;
  try {
    ficheiro = await ler<Casa>(CAMINHO_CASA);
  } catch (erro) {
    return (
      <>
        <Cabecalho titulo="A casa" voltarPara="/painel" utilizador={utilizador} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          <Aviso tom="mau">
            {erro instanceof ErroDoGithub
              ? erro.paraOEcra
              : "Não foi possível ir buscar os dados ao repositório."}
          </Aviso>
        </main>
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo="A casa" voltarPara="/painel" utilizador={utilizador} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <EditorDaCasa inicial={ficheiro.dados} sha={ficheiro.sha} />
      </main>
    </>
  );
}
