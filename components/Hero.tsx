import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { HeroMedia } from "@/components/HeroMedia";
import { Cta } from "@/components/Cta";
import { site } from "@/lib/site";
import { caminho } from "@/lib/i18n";
import { linguaActual, dicionario } from "@/lib/dicionario/servidor";

/*
  Havia aqui uma fila de seis barris pendurados a soletrar P·I·R·A·T·A,
  primeiro desenhados em SVG e depois trocados pela fotografia do barril
  real da casa. Saíram os dois: o cliente não gostou de nenhuma das
  versões.

  Não ficou nada no lugar, e é uma decisão defensável por si: a fotografia
  da fachada que está por trás **já tem os barris reais dela**, pendurados
  ao longo do beiral. A fila decorativa estava a duplicar um objecto que a
  fotografia já mostrava.

  ## Porque é `100vh` e não `100dvh`

  Era `dvh`, e o `dvh` é dinâmico de propósito: acompanha a barra de endereço
  do telemóvel a recolher-se. Só que os navegadores fazem isso **em degraus**,
  não continuamente — e a cada degrau o Hero mudava de altura e arrastava
  consigo tudo o que está ancorado ao fundo dele: a junta com "A casa", a
  trave, o esqueleto que se senta nela. O Gonçalo descreveu-o como o site a
  travar, "como se fossem três frames". Eram três degraus.

  O `vh` é a altura do ecrã com a barra recolhida, e não muda enquanto se rola.
  A contrapartida, que é preciso saber antes de alguém achar que isto é um bug:
  com a barra de endereço **à vista**, os últimos ~80px do Hero ficam por baixo
  dela. Não se perde nada — abaixo de `lg` o conteúdo está encostado ao topo, e
  o que fica lá em baixo é a junta, a um dedo de scroll.

  Não voltar ao `dvh`. Nem ao `svh`, que resolve o tremor mas encolhe o Hero
  para a altura *com* a barra à vista e deixa a secção seguinte a espreitar.

  `items-start` até aos 1024px, `items-end` a partir daí. Abaixo de `lg` o
  conteúdo sobe para o topo e deixa o fundo do Hero livre — é lá que o
  esqueleto se senta, na régua com a secção "A casa". Num ecrã estreito não
  há margem lateral onde ele caiba ao lado do texto; a única folga possível
  é por baixo. Em `lg` e acima o texto vive num `max-w-3xl` encostado à
  esquerda e sobram ~600px à direita, por isso o desenho original — texto
  assente no fundo, por cima da fachada — fica intacto onde funciona.
*/
export async function Hero() {
  const lang = await linguaActual();
  const dic = await dicionario();

  return (
    <section className="relative flex min-h-[100vh] items-start overflow-hidden bg-gradient-to-b from-breu to-breu-raso lg:items-end">
      <HeroMedia />

      {/*
        O `pt` só existe enquanto o conteúdo está alinhado ao topo: a Nav é
        `fixed` e tem 68px (`--altura-nav`), por isso sem isto o wordmark
        ficava por baixo dela. Em `lg` volta a zero, que é quando o
        `items-end` assume e o `pb` passa a mandar.
      */}
      {/*
        O `pb` cresce para 384px em ecrãs baixos, e só neles.

        É a segunda metade do arranjo do esqueleto — a primeira está no
        `Esqueleto.tsx`. Encolhê-lo era o caminho óbvio e não chegava: para ele
        deixar de tocar nos botões numa WebView de 600px de altura teria de vir
        abaixo dos 110px de largura, e a essa escala deixa de se perceber que é
        um esqueleto.

        O que resolve é dar-lhe espaço em vez de lho tirar. O esqueleto está
        ancorado à junta com a secção "A casa"; se o Hero crescer, a junta
        desce e ele desce com ela. Este `pb` é o que faz o Hero crescer — e só
        quando o conteúdo mais o espaçamento passam da altura do ecrã, que é
        exactamente o caso que se quer apanhar. Num telemóvel normal o
        `min-h-[100vh]` continua a mandar e isto não muda nada.

        `max-height` e não `max-width`: o que distingue a WebView do Facebook
        de um browser normal não é a largura do telemóvel, é a altura que
        sobra depois das barras que nunca recolhem.

        Medido em quatro cenários, com a distância do topo do esqueleto ao
        fundo dos botões (negativo = em cima deles):

        | | antes | depois |
        |---|---|---|
        | Chrome, 390×844 | +110 | +111 |
        | WebView, 390×600, letra a 120% | **−294** | +154 |
        | WebView, 390×600, letra a 150% | **−275** | +270 |
        | 360×640 | **−91** | +57 |

        A primeira linha é a que interessa tanto como as outras: no telemóvel
        de todos os dias nada mexeu.
      */}
      <div className="relative z-30 mx-auto w-full max-w-[1400px] px-5 pt-[calc(var(--altura-nav)+1.5rem)] pb-16 [@media(max-height:700px)]:pb-96 sm:px-8 sm:pb-24 lg:pt-0">
        <div className="max-w-3xl">
          {/*
            O piso do `clamp` desceu de `2.75rem` para `2rem`, e a razão é a
            mesma do `whitespace-nowrap` aqui abaixo.

            Num ecrã de 390px o `11vw` dá 42,9px e continua a ganhar ao piso,
            portanto **no Chrome não muda absolutamente nada**. Onde muda é
            onde estava mal: num ecrã de 360px o piso de 44px ganhava ao `11vw`
            de 39,6px e obrigava o nome a ocupar mais largura do que havia. Com
            o texto do sistema a 120% ganhava ainda mais.

            O `rem` continua a mandar quando o utilizador pede letra maior — só
            que a partir de um valor mais baixo. Não se trava a preferência de
            ninguém; faz-se o layout aguentá-la, que é o que estava por fazer.
          */}
          <p className="display gravado text-[clamp(2rem,11vw,6rem)] leading-[0.88] text-osso">
            {/*
              O `whitespace-nowrap` não é decorativo — é o que impede o nome
              de partir a meio.

              O N invertido tem de ser `inline-block`, porque `transform` não
              pega em elementos inline. Só que um `inline-block` é uma caixa
              atómica, e o browser trata as fronteiras dela como sítios
              legítimos para mudar de linha: para o motor de layout aquilo
              não é a palavra TASKUINHA, são três pedaços — `TASKUI` + `N` +
              `HA`. Enquanto cabe tudo numa linha ninguém dá por isso; quando
              deixa de caber, parte no único sítio onde pode, e lê-se
              `TASKUIИ / HA`.

              Quando é que deixa de caber: o browser embutido do Facebook no
              Android é uma WebView, e a WebView aplica o *Tamanho da letra*
              das definições do sistema. O Chrome tem definição própria, a
              100% por omissão — mesmo telemóvel, mesma página, escalas
              diferentes. O mínimo do `clamp` acima está em `rem` e escala com
              essa definição; o `11vw` não escala. Num ecrã estreito é o `rem`
              que ganha, e é ele que empurra o nome para lá da largura.

              O `-webkit-text-size-adjust: 100%` do preflight do Tailwind não
              trava isto: serve para o font boosting automático, que é outra
              coisa. E o zoom pedido pelo sistema não deve ser travado — é uma
              preferência de acessibilidade. O que se corrige é o layout
              aguentá-lo.
            */}
            <span aria-hidden="true" className="whitespace-nowrap">
              TASKUI<span className="inline-block scale-x-[-1]">N</span>HA
            </span>
            <span className="sr-only">Taskuinha</span>
            <span
              className="mt-3 block text-[0.7rem] font-normal uppercase tracking-[0.42em] text-lanterna"
              style={{ fontFamily: "var(--font-maquina)" }}
            >
              do Pirata
            </span>
          </p>

          <h1 className="mt-8 max-w-xl text-[clamp(1.6rem,4.4vw,2.6rem)] font-medium leading-[1.12] tracking-tight text-osso">
            {dic.hero.titulo}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-osso-fraco">
            {dic.hero.frase}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={`tel:${site.phone.tel}`}>{dic.geral.reservar}</Cta>
            <Cta href={caminho(lang, "/ementa")} variant="secondary">
              <ForkKnife size={17} weight="bold" aria-hidden />
              {dic.geral.verEmenta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
