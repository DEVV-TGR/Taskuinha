import { exigirSessao } from "@/lib/painel/porta";
import { ler, CAMINHO_EMENTA, ErroDoGithub } from "@/lib/painel/github";
import { Cabecalho } from "@/components/painel/Cabecalho";
import { EditorDeEmenta } from "@/components/painel/EditorDeEmenta";
import { Aviso } from "@/components/painel/Aviso";
import type { Texto } from "@/lib/texto";

type Ementa = {
  categorias: {
    id: string;
    titulo: Texto;
    intro: Texto;
    pratos: { id: string; nome: string; preco: number; descricao?: Texto; nota?: Texto }[];
  }[];
};

/*
  A ementa.

  Lê do GitHub e não do `import "@/data/ementa.json"` — ver o comentário longo
  no `lib/painel/github.ts`. Em resumo: o import é a fotografia do último build,
  que durante a reconstrução está atrasada face ao repositório, e não traz o
  `sha` que a gravação a seguir precisa como cadeado.
*/

export default async function Ementa() {
  const { utilizador } = await exigirSessao();

  let ficheiro;
  try {
    ficheiro = await ler<Ementa>(CAMINHO_EMENTA);
  } catch (erro) {
    return (
      <>
        <Cabecalho titulo="A ementa" voltarPara="/painel" utilizador={utilizador} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          <Aviso tom="mau">
            {erro instanceof ErroDoGithub
              ? erro.paraOEcra
              : "Não foi possível ir buscar a ementa ao repositório."}
          </Aviso>
        </main>
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo="A ementa" voltarPara="/painel" utilizador={utilizador} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <EditorDeEmenta inicial={ficheiro.dados} sha={ficheiro.sha} />
      </main>
    </>
  );
}
