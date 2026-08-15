"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Trash, Plus } from "@phosphor-icons/react/dist/ssr";
import { Aviso } from "@/components/painel/Aviso";
import { CampoDeEscolha } from "@/components/painel/Campo";
import { EstadoDaGravacao } from "@/components/painel/EstadoDaGravacao";
import { PratoNovo, type PratoParaCriar } from "@/components/painel/PratoNovo";
import { lerPreco, escreverPreco } from "@/components/painel/preco";
import { CtaBotao } from "@/components/Cta";
import { publicarEmenta, type EstadoDaEmenta } from "@/app/painel/ementa/accoes";
import { identificadorLivre } from "@/lib/painel/validar";
import { em } from "@/lib/texto";
import type { Texto } from "@/lib/texto";

/*
  A ementa.

  ## O que este ecrã deixa fazer, e porquê só isto

  Mudar um preço, acrescentar um prato, tirar um prato. Mais nada — o nome e a
  descrição de um prato que já existe não se editam aqui. Foi decisão do
  cliente, e é ela que faz este ecrã ser uma lista de preços em vez de um
  editor de texto: a coisa que se faz a sério, dez vezes por ano, é corrigir
  preços, e essa faz-se sem abrir nada.

  Corrigir uma gralha num nome já publicado faz-se apagando o prato e voltando
  a criá-lo — e ele volta no fim da categoria. É o preço desta simplificação, e
  está dito no ecrã para não apanhar ninguém de surpresa.

  ## Uma categoria de cada vez

  São 154 pratos. Numa lista só, não se navega com o polegar. O selector em
  cima é um `<select>` nativo de propósito: no telemóvel abre a roda do
  sistema, que é a coisa mais rápida que existe para escolher entre nove.

  ## Rascunho no browser, um botão para publicar

  Nada se grava sozinho. Cada publicação é um commit e um build da Vercel —
  gravar a cada tecla seria um build por tecla. O contador de alterações está
  sempre à vista e o `beforeunload` avisa quem fecha o separador a meio.
*/

type Prato = {
  id: string;
  nome: string;
  preco: number;
  descricao?: Texto;
  nota?: Texto;
};

type Categoria = { id: string; titulo: Texto; intro: Texto; pratos: Prato[] };
type Ementa = { categorias: Categoria[] };

/*
  Quantas alterações há por publicar.

  Conta gestos, não bytes: um preço mudado é uma, um prato acrescentado é uma,
  um prato tirado é uma. É o número que vai no botão, e tem de ser o número que
  a pessoa tem na cabeça.
*/
function contarAlteracoes(inicial: Ementa, agora: Ementa): number {
  const antes = new Map<string, number>();
  for (const c of inicial.categorias) for (const p of c.pratos) antes.set(p.id, p.preco);

  const depois = new Map<string, number>();
  for (const c of agora.categorias) for (const p of c.pratos) depois.set(p.id, p.preco);

  let total = 0;
  for (const [id, preco] of depois) {
    if (!antes.has(id)) total += 1;
    else if (antes.get(id) !== preco) total += 1;
  }
  for (const id of antes.keys()) if (!depois.has(id)) total += 1;

  return total;
}

/* A frase que vai para a mensagem do commit. */
function resumir(inicial: Ementa, agora: Ementa): string {
  const antes = new Map<string, number>();
  for (const c of inicial.categorias) for (const p of c.pratos) antes.set(p.id, p.preco);
  const depois = new Map<string, number>();
  for (const c of agora.categorias) for (const p of c.pratos) depois.set(p.id, p.preco);

  let precos = 0;
  let novos = 0;
  for (const [id, preco] of depois) {
    if (!antes.has(id)) novos += 1;
    else if (antes.get(id) !== preco) precos += 1;
  }
  const tirados = [...antes.keys()].filter((id) => !depois.has(id)).length;

  const partes: string[] = [];
  if (precos) partes.push(`${precos} preço${precos > 1 ? "s" : ""}`);
  if (novos) partes.push(`${novos} prato${novos > 1 ? "s" : ""} novo${novos > 1 ? "s" : ""}`);
  if (tirados) partes.push(`${tirados} tirado${tirados > 1 ? "s" : ""}`);
  return partes.join(", ");
}

export function EditorDeEmenta({
  inicial,
  sha,
}: {
  inicial: Ementa;
  sha: string;
}) {
  const [ementa, setEmenta] = useState<Ementa>(inicial);
  const [categoriaAberta, setCategoriaAberta] = useState(inicial.categorias[0]?.id ?? "");
  const [aCriar, setACriar] = useState(false);
  /*
    Os preços em texto, enquanto estão a ser escritos.

    Sem isto não se consegue escrever `13,` — o número que se lê a meio de
    `13,` é 13, e o campo saltava para "13" por baixo dos dedos. O texto é a
    verdade enquanto se escreve; o número só é actualizado quando o texto já é
    um preço.
  */
  const [emEdicao, setEmEdicao] = useState<Record<string, string>>({});
  const [estado, accao, aGravar] = useActionState<EstadoDaEmenta, FormData>(
    publicarEmenta,
    { tipo: "parado" },
  );

  const alteracoes = useMemo(() => contarAlteracoes(inicial, ementa), [inicial, ementa]);
  const publicado = estado.tipo === "gravado";

  /*
    Fechar o separador com trabalho por publicar dá o aviso do browser. Depois
    de publicar não dá — o `alteracoes > 0` continua verdadeiro (o rascunho é o
    que foi gravado), mas já não há nada em risco.
  */
  useEffect(() => {
    if (alteracoes === 0 || publicado) return;

    const avisar = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [alteracoes, publicado]);

  const categoria = ementa.categorias.find((c) => c.id === categoriaAberta);
  const idsOcupados = useMemo(
    () => new Set(ementa.categorias.flatMap((c) => c.pratos.map((p) => p.id))),
    [ementa],
  );

  function mudarPreco(id: string, texto: string) {
    setEmEdicao((anterior) => ({ ...anterior, [id]: texto }));

    const valor = lerPreco(texto);
    if (valor === null) return;

    setEmenta((anterior) => ({
      categorias: anterior.categorias.map((c) => ({
        ...c,
        pratos: c.pratos.map((p) => (p.id === id ? { ...p, preco: valor } : p)),
      })),
    }));
  }

  function tirar(prato: Prato) {
    const certeza = window.confirm(
      `Tirar "${prato.nome}" da ementa?\n\n` +
        `Só desaparece do site quando publicares. Para o voltar a pôr, é criá-lo de novo.`,
    );
    if (!certeza) return;

    setEmenta((anterior) => ({
      categorias: anterior.categorias.map((c) => ({
        ...c,
        pratos: c.pratos.filter((p) => p.id !== prato.id),
      })),
    }));
  }

  function juntar(novo: PratoParaCriar) {
    const id = identificadorLivre(novo.nome, idsOcupados);

    setEmenta((anterior) => ({
      categorias: anterior.categorias.map((c) =>
        c.id !== novo.categoria
          ? c
          : {
              ...c,
              pratos: [
                ...c.pratos,
                {
                  id,
                  nome: novo.nome,
                  preco: novo.preco,
                  ...(novo.descricao ? { descricao: novo.descricao } : {}),
                  ...(novo.nota ? { nota: novo.nota } : {}),
                },
              ],
            },
      ),
    }));

    setCategoriaAberta(novo.categoria);
    setACriar(false);
  }

  return (
    <form action={accao} className="pb-24">
      <input type="hidden" name="sha" value={sha} />
      <input type="hidden" name="ementa" value={JSON.stringify(ementa)} />
      <input type="hidden" name="resumo" value={resumir(inicial, ementa)} />

      <div className="space-y-4">
        {estado.tipo === "erro" ? <Aviso tom="mau">{estado.mensagem}</Aviso> : null}

        {estado.tipo === "problemas" ? (
          <Aviso tom="mau">
            <strong>Isto não pode ser publicado assim:</strong>
            <span className="mt-2 block space-y-1">
              {estado.lista.map((problema) => (
                <span key={problema} className="block">
                  · {problema}
                </span>
              ))}
            </span>
          </Aviso>
        ) : null}

        {estado.tipo === "gravado" ? (
          <EstadoDaGravacao commit={estado.commit} endereco={estado.endereco} />
        ) : null}

        <CampoDeEscolha
          etiqueta="Categoria"
          value={categoriaAberta}
          onChange={(e) => {
            setCategoriaAberta(e.target.value);
            setACriar(false);
          }}
        >
          {ementa.categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {em(c.titulo, "pt")} ({c.pratos.length})
            </option>
          ))}
        </CampoDeEscolha>
      </div>

      {categoria ? (
        <ul className="mt-5 divide-y divide-[var(--linha)] border-y border-linha">
          {categoria.pratos.map((prato) => (
            <li key={prato.id} className="flex items-center gap-3 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base leading-tight text-osso">
                  {prato.nome}
                </span>
                {prato.nota ? (
                  <span
                    className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.14em] text-osso-fraco"
                    style={{ fontFamily: "var(--font-maquina)" }}
                  >
                    {em(prato.nota, "pt")}
                  </span>
                ) : null}
              </span>

              <span className="flex shrink-0 items-center gap-1">
                <input
                  value={emEdicao[prato.id] ?? escreverPreco(prato.preco)}
                  onChange={(e) => mudarPreco(prato.id, e.target.value)}
                  /*
                    Ao sair do campo, o texto em curso é deitado fora e o valor
                    passa a vir do número — que é o que reescreve `13,5` como
                    `13,50`. Se o texto não era um preço, o número nunca foi
                    mexido e o campo volta ao que lá estava.
                  */
                  onBlur={() =>
                    setEmEdicao((anterior) => {
                      const resto = { ...anterior };
                      delete resto[prato.id];
                      return resto;
                    })
                  }
                  inputMode="decimal"
                  aria-label={`Preço de ${prato.nome}`}
                  aria-invalid={
                    emEdicao[prato.id] !== undefined &&
                    lerPreco(emEdicao[prato.id]) === null
                  }
                  className={`min-h-11 w-20 rounded-[var(--radius-card)] border bg-breu-fundo px-2 text-right text-base text-osso focus:border-lanterna focus:outline-none focus:ring-1 focus:ring-lanterna ${
                    emEdicao[prato.id] !== undefined &&
                    lerPreco(emEdicao[prato.id]) === null
                      ? "border-sangue"
                      : "border-linha"
                  }`}
                  style={{ fontFamily: "var(--font-maquina)" }}
                />
                <span
                  className="text-sm text-osso-fraco"
                  style={{ fontFamily: "var(--font-maquina)" }}
                >
                  €
                </span>
              </span>

              <button
                type="button"
                onClick={() => tirar(prato)}
                aria-label={`Tirar ${prato.nome} da ementa`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] text-osso-fraco hover:text-lanterna"
              >
                <Trash size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        {aCriar ? (
          <PratoNovo
            categorias={ementa.categorias.map((c) => ({
              id: c.id,
              titulo: em(c.titulo, "pt"),
            }))}
            categoriaActual={categoriaAberta}
            aoCriar={juntar}
            aoDesistir={() => setACriar(false)}
          />
        ) : (
          <CtaBotao
            variant="secondary"
            onClick={() => setACriar(true)}
            className="w-full"
          >
            <Plus size={16} weight="bold" /> Prato novo
          </CtaBotao>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-osso-fraco">
        O nome e a descrição de um prato que já existe não se mudam aqui. Se
        houver uma gralha, tira o prato e cria-o outra vez — ele volta no fim da
        categoria.
      </p>

      {/*
        Colada em baixo, ao pé do polegar. É o único elemento fixo do painel: a
        barra de cima não é `sticky` de propósito, porque duas barras coladas
        comem o ecrã de um telemóvel a meio.
      */}
      <div className="fixed inset-x-0 bottom-0 border-t border-linha bg-breu-fundo/95 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <CtaBotao
            type="submit"
            disabled={aGravar || alteracoes === 0}
            className="w-full disabled:opacity-40"
          >
            {aGravar
              ? "A publicar…"
              : alteracoes === 0
                ? "Nada por publicar"
                : `Publicar (${alteracoes})`}
          </CtaBotao>
        </div>
      </div>
    </form>
  );
}
