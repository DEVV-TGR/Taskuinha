"use client";

import { useState } from "react";
import { Campo, CampoDeEscolha } from "@/components/painel/Campo";
import { Aviso } from "@/components/painel/Aviso";
import { CtaBotao } from "@/components/Cta";
import { lerPreco } from "@/components/painel/preco";
import type { Texto } from "@/lib/texto";

/*
  O formulário do prato novo.

  Vive **dentro** do editor da ementa e não numa página à parte. Uma página à
  parte era mais arrumada de escrever e perdia o trabalho: as alterações de
  preço por publicar vivem no rascunho do browser, e navegar para outra rota
  deitava-as fora.

  ## As descrições estão escondidas, e é de propósito

  Dos 154 pratos da casa, a esmagadora maioria não tem descrição nenhuma —
  "Tremoços" chega-se a si próprio. Pôr quatro caixas de texto à frente de
  quem só quer acrescentar "Sardinhas assadas 9,50 €" é dar-lhe quatro campos
  para ignorar de cada vez.

  Quem abrir as descrições só é obrigado ao português. As outras três em branco
  fazem o site mostrar o português nessas línguas — é o recuo que o
  `lib/texto.ts` garante, e é melhor do que uma linha em branco na carta.
*/

export type PratoParaCriar = {
  nome: string;
  categoria: string;
  preco: number;
  nota?: Texto;
  descricao?: Texto;
};

export function PratoNovo({
  categorias,
  categoriaActual,
  aoCriar,
  aoDesistir,
}: {
  categorias: { id: string; titulo: string }[];
  categoriaActual: string;
  aoCriar: (prato: PratoParaCriar) => void;
  aoDesistir: () => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(categoriaActual);
  const [preco, setPreco] = useState("");
  const [nota, setNota] = useState("");
  const [comDescricao, setComDescricao] = useState(false);
  const [descricao, setDescricao] = useState({ pt: "", en: "", fr: "", es: "" });
  const [erro, setErro] = useState<string | null>(null);

  function criar() {
    const valor = lerPreco(preco);

    if (nome.trim() === "") return setErro("O prato tem de ter nome.");
    if (valor === null) return setErro("O preço tem de ser um número — 9,50 por exemplo.");
    if (comDescricao && descricao.pt.trim() === "") {
      return setErro("Se abriste as descrições, o português é obrigatório.");
    }

    aoCriar({
      nome: nome.trim(),
      categoria,
      preco: valor,
      ...(nota.trim() ? { nota: { pt: nota.trim() } } : {}),
      ...(comDescricao
        ? {
            descricao: Object.fromEntries(
              Object.entries(descricao)
                .map(([l, t]) => [l, t.trim()])
                .filter(([, t]) => t !== ""),
            ) as Texto,
          }
        : {}),
    });
  }

  return (
    <div className="space-y-4 rounded-[var(--radius-card)] border border-lanterna/50 bg-breu-raso p-4">
      <h3 className="text-base text-osso">Prato novo</h3>

      {erro ? <Aviso tom="mau">{erro}</Aviso> : null}

      <Campo
        etiqueta="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Sardinhas assadas"
        autoFocus
      />

      <CampoDeEscolha
        etiqueta="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      >
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.titulo}
          </option>
        ))}
      </CampoDeEscolha>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          etiqueta="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          inputMode="decimal"
          placeholder="9,50"
          style={{ fontFamily: "var(--font-maquina)" }}
        />
        <Campo
          etiqueta="Nota (opcional)"
          ajuda="A etiqueta pequena ao lado do nome — «época», «Douro»."
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="época"
        />
      </div>

      {comDescricao ? (
        <div className="space-y-3 border-t border-linha pt-4">
          <Campo
            etiqueta="Descrição em português"
            value={descricao.pt}
            onChange={(e) => setDescricao({ ...descricao, pt: e.target.value })}
            placeholder="Grelhadas na brasa, com pimento e batata cozida."
          />
          {(["en", "fr", "es"] as const).map((lingua) => (
            <Campo
              key={lingua}
              etiqueta={
                { en: "Em inglês", fr: "Em francês", es: "Em espanhol" }[lingua]
              }
              value={descricao[lingua]}
              onChange={(e) => setDescricao({ ...descricao, [lingua]: e.target.value })}
              placeholder="Em branco mostra o português"
            />
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setComDescricao(true)}
          className="link-underline min-h-11 text-sm text-osso-fraco hover:text-lanterna"
        >
          + Acrescentar descrição
        </button>
      )}

      <div className="flex gap-3 pt-1">
        <CtaBotao onClick={criar} className="flex-1">
          Juntar à ementa
        </CtaBotao>
        <CtaBotao variant="secondary" onClick={aoDesistir}>
          Cancelar
        </CtaBotao>
      </div>

      <p className="text-xs leading-relaxed text-osso-fraco">
        O prato entra no fim da categoria e só vai para o site quando carregares
        em Publicar.
      </p>
    </div>
  );
}
