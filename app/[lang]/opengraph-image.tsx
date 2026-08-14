import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { fullAddress } from "@/lib/site";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { dicionarioDe } from "@/lib/dicionario";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
  A língua vem do `params`, não do `next/root-params`.

  As imagens de metadata correm como route handlers, e a documentação do
  `next/root-params` é explícita: os getters não funcionam lá. Aqui o
  `params` está disponível e resolve o mesmo.

  O `generateImageMetadata` existe por causa do `alt`: como `export const`
  ele seria uma constante só, igual nas quatro línguas. Devolvido daqui,
  acompanha a língua do cartão — que é o que um leitor de ecrã anuncia
  quando o link é partilhado.
*/
/*
  Recuo ao português em vez de `notFound()`.

  Na fase de recolha de dados do build o Next chama estas funções sem os
  parâmetros da rota preenchidos, e um `notFound()` aí rebenta a compilação
  inteira — verificado, não hipotético. Um 404 também não teria aqui o
  sentido que tem numa página: a rota só chega a existir para as quatro
  línguas que o `generateStaticParams` do layout gera, e o
  `dynamicParams = false` fecha o resto antes de se chegar cá.
*/
function linguaDe(valor: string | undefined): Locale {
  return valor && isLocale(valor) ? valor : defaultLocale;
}

export async function generateImageMetadata({
  params,
}: {
  params?: Promise<{ lang: string }>;
}) {
  const lang = linguaDe((await params)?.lang);
  return [
    { id: "cartao", size, contentType, alt: dicionarioDe(lang).meta.ogAlt },
  ];
}

/*
  O `next/font` não chega ao ImageResponse (corre fora do React normal, num
  renderizador próprio — o Satori). Para ter a Rye no cartão de partilha era
  preciso ir buscar o ficheiro à Google Fonts, mas a API só devolve WOFF2
  pelo `User-Agent` que se lhe dá, e o Satori só lê TTF/OTF — a rota
  rebentava com "Input buffer contains unsupported image format". Verificado
  em execução, não hipotético. O plano já previa esta saída: "se complicar,
  usar uma serif do sistema e aceitar a diferença" — é um cartão de
  partilha, não a página.
*/

/*
  O que mais o Satori não faz, verificado no código do `@vercel/og` que vem
  embutido no Next, para o próximo não ter de lá ir outra vez:

  - **`filter` não existe.** Nem `blur`, nem nada. Há um `feGaussianBlur` no
    ficheiro dele, mas é usado só para desenhar o `box-shadow`. É por isso
    que o fundo daqui de baixo é um ficheiro já desfocado, gerado por
    `npm run cartao-fundo`, e não uma linha de CSS.
  - **Não há blend modes nem máscaras.** Uma fotografia com fundo opaco posta
    por cima de outra desenha o seu próprio rectângulo, e não há como o
    esconder — quem entrar aqui tem de vir recortado, com alfa.
  - **Não lê WebP.** JPEG e PNG.

  Do que há, isto usa `objectFit`, `position`, `opacity` e cores com alfa,
  que chegam bem.
*/

/*
  As imagens entram em base64 e não por URL.

  O Satori aceitaria um endereço, mas isso punha o build a fazer pedidos de
  rede a um site que ainda está a ser construído — e a falhar em silêncio se
  não respondesse. Ler do disco não tem essa dúvida: ou o ficheiro está lá,
  ou o build rebenta a dizer qual falta.

  Esta rota não declara `runtime`, portanto corre em Node, e estas imagens
  são geradas no build. O `fs` está disponível.
*/
async function imagemEmBase64(nome: string) {
  const bytes = await readFile(join(process.cwd(), "public", "images", nome));
  const tipo = nome.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${tipo};base64,${bytes.toString("base64")}`;
}

export default async function OpengraphImage({
  params,
}: {
  params?: Promise<{ lang: string }>;
}) {
  const dic = dicionarioDe(linguaDe((await params)?.lang));
  const [fundo, caveira] = await Promise.all([
    imagemEmBase64("fachada-por-do-sol-cartao.jpg"),
    imagemEmBase64("caveira-madeira.jpg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#080B0D",
          color: "#E8DCC4",
          fontFamily: "sans-serif",
        }}
      >
        {/*
          A fachada ao pôr do sol, desfocada. O recorte é `cover` porque a
          fotografia é 4:3 e o cartão quase 2:1 — sai o telhado e sai a
          calçada, fica o meio, que é onde estão a porta e o letreiro.
        */}
        <img
          src={fundo}
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
          }}
          alt=""
        />

        {/*
          O véu. A fotografia é do fim da tarde, cheia de laranjas claros, e o
          texto do cartão é osso (#E8DCC4) — sem isto por cima não se lê nada.
          A 50% ainda se percebe que por trás está a casa, que é o objectivo:
          a luz dela, não a leitura dela.
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "rgba(8, 11, 13, 0.5)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
            {/*
              A caveira de madeira, inteira e com o seu fundo preto — não
              recortada. É uma decisão do Gonçalo e não uma limitação: o
              rectângulo assume-se, como se fosse uma fotografia pousada em
              cima da fachada.

              Aqui esteve o emblema desenhado em SVG — o mesmo traço do
              `app/icon.svg`. Continua a ser ele no separador do browser, que é
              onde um desenho de duas cores a 32px se defende melhor do que uma
              fotografia. Num cartão de 1200×630 é ao contrário: há espaço para
              a peça a sério.

              O `borderRadius` é o que faz o rectângulo ler-se como escolha em
              vez de descuido. Sombra é que não há: precisava de `filter`, e o
              `filter` é justamente o que o Satori não tem — ver acima.
            */}
            <img
              src={caveira}
              width={190}
              height={238}
              style={{ borderRadius: 10, objectFit: "cover" }}
              alt=""
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 128,
                  fontFamily: "Georgia, serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                TASKUI
                <span style={{ display: "flex", transform: "scaleX(-1)" }}>N</span>
                HA
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 26,
                  letterSpacing: 14,
                  textTransform: "uppercase",
                  color: "#F2A33C",
                }}
              >
                do Pirata
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 38, color: "#E8DCC4" }}>
              {dic.hero.titulo}
            </div>
            <div style={{ fontSize: 26, color: "#9A8F7C" }}>{fullAddress()}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
