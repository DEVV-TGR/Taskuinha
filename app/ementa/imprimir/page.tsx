import type { Metadata } from "next";
import { menu, formatPrice, groupDishes } from "@/lib/menu";
import { site, fullAddress } from "@/lib/site";

/*
  A ementa em folha A4, para ser impressa em PDF.

  Existe porque o botão "Descarregar a ementa" tinha de dar um documento com
  o desenho da casa — não as sete fotografias do papel plastificado, que foi
  a primeira tentativa e que o Gonçalo pôs de lado. O PDF é gerado a partir
  desta rota, por `scripts/gerar-pdf-ementa.mjs`, e vai commitado em
  `public/ementa-taskuinha.pdf`. Não se gera no build: a ementa muda quando o
  Anselmo muda os preços, não a cada deploy.

  Não está ligada em lado nenhum do site nem entra no sitemap, e leva
  `noindex` — quem chega ao site vê a ementa em `/ementa`, que é a boa para
  ecrã. Esta é só o molde da impressão.

  Todo o CSS vive aqui dentro, num `<style>`. Podia estar em globals.css, mas
  são regras que só fazem sentido dentro de uma folha de papel (`@page`,
  quebras, colunas) e que ninguém tem de carregar para ver o site.
*/

export const metadata: Metadata = {
  title: "Ementa para imprimir",
  robots: { index: false, follow: false },
};

const css = `
  @page {
    size: A4;
    margin: 16mm 15mm;
  }

  /*
    O fundo do pergaminho tem de sair na impressora. Por omissão o Chrome
    descarta fundos ao imprimir; isto obriga-o a pintá-los, e como o fundo
    está no <html> propaga-se para a folha inteira, margens incluídas.
  */
  @media print {
    html {
      background: var(--pergaminho) !important;
    }

    /*
      O layout da raiz monta o portão da chegada, a transição entre páginas e
      a tralha decorativa ao lado de {children}. Nada disso é papel.
    */
    body > *:not(#folha) {
      display: none !important;
    }
  }

  #folha {
    background: var(--pergaminho);
    color: var(--pergaminho-tinta);
    font-family: var(--font-alegreya), serif;
    line-height: 1.45;
  }

  /* Fora da impressão isto é uma página como as outras, e precisa de ar. */
  @media screen {
    #folha {
      max-width: 210mm;
      margin: 0 auto;
      padding: 16mm 15mm;
    }
  }

  #folha .quebra {
    break-after: page;
  }

  /*
    Capa e contracapa ocupam a folha inteira. A altura é a da área útil do
    @page — A4 menos as margens de cima e de baixo.
  */
  #folha .pagina-inteira {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: calc(297mm - 32mm);
    text-align: center;
  }

  #folha .moldura {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6mm;
    border: 1.5pt solid var(--pergaminho-tinta);
    outline: 0.5pt solid var(--pergaminho-tinta);
    outline-offset: 2mm;
    /* O filete de fora precisa de folga, ou vai bater no rodapé da folha. */
    margin: 2.5mm 2.5mm 6mm;
    padding: 14mm 10mm;
  }

  #folha .wordmark {
    font-family: var(--font-rye), serif;
    font-size: 34pt;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  /* A assinatura da casa: o letreiro da porta tem o N ao contrário. */
  #folha .wordmark .n-invertido {
    display: inline-block;
    transform: scaleX(-1);
  }

  #folha .sobrenome {
    font-family: var(--font-elite), monospace;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.34em;
  }

  #folha .titulo-capa {
    font-family: var(--font-imfell), serif;
    font-size: 46pt;
    line-height: 1;
  }

  #folha .filete {
    width: 34mm;
    border-top: 1pt solid var(--pergaminho-tinta);
    opacity: 0.6;
  }

  #folha .rodape-capa {
    font-family: var(--font-elite), monospace;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    opacity: 0.75;
    padding-top: 6mm;
  }

  #folha .familia {
    margin-bottom: 9mm;
  }

  /*
    Uma família não se parte a meio se couber inteira na folha seguinte. As
    grandes — Bar, Vinho — partem-se à mesma, e é o que se quer: obrigá-las a
    caber deixaria meia página em branco antes delas.
  */
  #folha .familia h2 {
    font-family: var(--font-imfell), serif;
    font-size: 19pt;
    line-height: 1;
    border-bottom: 1pt solid var(--pergaminho-tinta);
    padding-bottom: 2.5mm;
    margin-bottom: 4mm;
    break-after: avoid;
  }

  #folha .familia h3 {
    font-family: var(--font-elite), monospace;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--pergaminho-queimado);
    margin: 0 0 2.5mm;
    break-after: avoid;
  }

  #folha .bloco + .bloco {
    margin-top: 5mm;
  }

  #folha .lista {
    column-count: 2;
    column-gap: 10mm;
  }

  #folha .item {
    break-inside: avoid;
    margin-bottom: 2.4mm;
  }

  #folha .linha {
    display: flex;
    align-items: baseline;
    gap: 1.5mm;
  }

  #folha .nome {
    font-family: var(--font-imfell), serif;
    font-size: 11pt;
    line-height: 1.15;
  }

  /* O pontilhado que leva o olho do nome até ao preço. */
  #folha .pontos {
    flex: 1;
    border-bottom: 0.75pt dotted var(--pergaminho-tinta);
    opacity: 0.5;
    transform: translateY(-1mm);
  }

  #folha .preco {
    font-family: var(--font-elite), monospace;
    font-size: 9pt;
    white-space: nowrap;
  }

  #folha .descricao {
    font-size: 8pt;
    line-height: 1.35;
    opacity: 0.8;
    max-width: 62mm;
    margin-top: 0.5mm;
  }

  #folha .contracapa-conteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9mm;
    text-align: center;
  }

  #folha .contracapa-conteudo h2 {
    font-family: var(--font-elite), monospace;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: var(--pergaminho-queimado);
    margin-bottom: 2.5mm;
  }

  #folha .horario {
    display: inline-block;
    text-align: left;
    font-size: 10pt;
  }

  #folha .horario div {
    display: flex;
    justify-content: space-between;
    gap: 12mm;
  }

  #folha .horario .fechado {
    opacity: 0.55;
  }

  #folha .morada {
    font-family: var(--font-imfell), serif;
    font-size: 14pt;
    line-height: 1.3;
  }

  #folha .contacto {
    font-family: var(--font-elite), monospace;
    font-size: 10pt;
    letter-spacing: 0.06em;
  }

  #folha .aviso {
    font-size: 8pt;
    opacity: 0.75;
    max-width: 90mm;
    margin: 0 auto;
    line-height: 1.4;
  }
`;

export default function ImprimirEmentaPage() {
  return (
    <div id="folha">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Capa */}
      <div className="pagina-inteira quebra">
        <div className="moldura">
          <Emblema />
          <div>
            <div className="wordmark">
              TASKUI<span className="n-invertido">N</span>HA
            </div>
            <div className="sobrenome" style={{ marginTop: "3mm" }}>
              do Pirata
            </div>
          </div>
          <div className="filete" />
          <div className="titulo-capa">Ementa</div>
        </div>
        <div className="rodape-capa">
          Praia de Vila Chã &middot; {site.address.region}
        </div>
      </div>

      {/* Miolo */}
      {menu.map((category) => (
        <section key={category.id} className="familia">
          <h2>{category.title}</h2>

          {groupDishes(category.dishes).map((bloco, blocoIndex) => (
            <div key={bloco.group ?? `bloco-${blocoIndex}`} className="bloco">
              {bloco.group ? <h3>{bloco.group}</h3> : null}

              <div className="lista">
                {bloco.dishes.map((dish) => (
                  <div key={dish.name} className="item">
                    <div className="linha">
                      <span className="nome">{dish.name}</span>
                      <span className="pontos" />
                      <span className="preco">{formatPrice(dish.price)}</span>
                    </div>
                    {dish.description ? (
                      <p className="descricao">{dish.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Contracapa */}
      <div className="pagina-inteira" style={{ breakBefore: "page" }}>
        <div className="contracapa-conteudo">
          <Emblema largura={90} />

          <div>
            <h2>Horário</h2>
            <div className="horario">
              {site.hours.map((h) => (
                <div key={h.day} className={h.closed ? "fechado" : undefined}>
                  <span>{h.day}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>Onde</h2>
            <p className="morada">{fullAddress()}</p>
          </div>

          <div>
            <h2>Reservas</h2>
            <p className="contacto">{site.phone.display}</p>
            <p className="contacto" style={{ marginTop: "1.5mm" }}>
              @taskuinhadopirata
            </p>
          </div>

          <p className="aviso">
            Se tiveres alergias ou intolerâncias, diz à mesa antes de pedir.
            Quase tudo passa por marisco.
          </p>
        </div>

        <div className="rodape-capa">{site.url.replace("https://", "")}</div>
      </div>
    </div>
  );
}

/*
  O símbolo da casa — caveira de bicorne, sabres cruzados, ossos — tirado da
  `<BandeiraNegra />`, sem o pano nem o mastro: numa capa impressa não há
  vento nenhum para ondular. Cores invertidas face ao site, que o tem em osso
  sobre breu; aqui é tinta sobre pergaminho.
*/
function Emblema({ largura = 120 }: { largura?: number }) {
  const tinta = "currentColor";
  const vazio = "var(--pergaminho)";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 70"
      width={largura}
      height={largura * 0.7}
    >
      <line x1="15" y1="55" x2="85" y2="20" stroke={tinta} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="20" x2="85" y2="55" stroke={tinta} strokeWidth="2.5" strokeLinecap="round" />

      <path d="M25,28 Q50,8 75,28 Q60,20 50,24 Q40,20 25,28 Z" fill={tinta} />

      <circle cx="50" cy="34" r="13" fill={tinta} />
      <path d="M39,40 Q50,52 61,40 L58,44 Q50,48 42,44 Z" fill={tinta} />
      <circle cx="45" cy="34" r="3" fill={vazio} />
      <circle cx="55" cy="34" r="3" fill={vazio} />
      <path d="M47,41 L50,44 L53,41" fill="none" stroke={vazio} strokeWidth="1.2" />

      <line x1="35" y1="58" x2="65" y2="66" stroke={tinta} strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="66" x2="65" y2="58" stroke={tinta} strokeWidth="3" strokeLinecap="round" />

      <circle cx="70" cy="24" r="3.5" fill={tinta} />
    </svg>
  );
}
