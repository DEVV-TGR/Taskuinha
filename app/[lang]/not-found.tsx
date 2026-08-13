import { Nav } from "@/components/Nav";
import { Cta } from "@/components/Cta";
import { PainelDeErro } from "@/components/PainelDeErro";
import { caminho } from "@/lib/i18n";
import { linguaOuCasa, dicionarioOuCasa } from "@/lib/dicionario/servidor";

/*
  O 404 da casa.

  ## Porque é que não usa o `linguaActual()`

  Porque esse resolve o caso mau com `notFound()`, e chamá-lo daqui era
  pedir à página de 404 que renderizasse um 404. O `linguaOuCasa()` recua
  ao português em vez de atirar — ver o comentário em
  `lib/dicionario/servidor.ts`.

  ## Porque é que não tem rodapé

  O `Footer` vai buscar a língua sozinho, por dentro, e cai no mesmo
  problema. Podia-se abrir-lhe uma prop, mas não vale a pena mudar um
  componente que funciona em oito páginas por causa de um ecrã de engano —
  e um 404 sem rodapé é o normal, não uma falta. A `Nav` fica, porque
  recebe tudo por props e é ela que dá a saída daqui: o menu inteiro, o
  telefone e o selector de língua.
*/
export default async function NaoEncontrado() {
  const lang = await linguaOuCasa();
  const dic = await dicionarioOuCasa();

  return (
    <>
      <Nav
        lang={lang}
        texto={{ nav: dic.nav, geral: dic.geral, linguas: dic.linguas }}
      />

      <PainelDeErro
        codigo={dic.erro.perdido.codigo}
        titulo={dic.erro.perdido.titulo}
        frase={dic.erro.perdido.frase}
      >
        <Cta href={caminho(lang, "/")}>{dic.erro.perdido.voltar}</Cta>
        <Cta href={caminho(lang, "/ementa")} variant="secondary">
          {dic.geral.verEmenta}
        </Cta>
      </PainelDeErro>
    </>
  );
}
