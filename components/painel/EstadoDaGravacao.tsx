"use client";

import { useEffect, useState } from "react";
import { Aviso } from "@/components/painel/Aviso";

/*
  O que acontece depois de carregar em "Publicar".

  Gravar não é a mesma coisa que estar no ar. O commit é imediato; o site
  demora o tempo de a Vercel o reconstruir, e nesse minuto e meio quem
  recarregar a ementa vê o preço antigo. Sem isto escrito no ecrã, a conclusão
  natural é que a gravação se perdeu.

  Quatro estados:

  1. **Gravado** — o GitHub respondeu, o commit existe.
  2. **A reconstruir** — com o contador a andar, para a espera ter fim à vista.
  3. **No ar** — o site já serve o commit que se acabou de fazer.
  4. **Passou tempo de mais** — e este é o que mais vale, e o que quase toda a
     gente esquece. Se o build falhar, a Vercel **mantém o deploy anterior no
     ar**: o site não cai, e o único sintoma seria a alteração nunca aparecer.
     Ao fim de cinco minutos isto diz o que se passa em vez de girar para
     sempre.

  Fora da Vercel a rota `/painel/versao` responde `null` e não há nada a
  comparar — nesse caso fica-se no estado 1, que é honesto.
*/

const INTERVALO_MS = 10_000;
const DESISTIR_MS = 5 * 60_000;

type Estado = "gravado" | "a-reconstruir" | "no-ar" | "demorou";

export function EstadoDaGravacao({
  commit,
  endereco,
}: {
  /** O sha do commit que se acabou de fazer. */
  commit: string;
  endereco: string;
}) {
  const [estado, setEstado] = useState<Estado>("gravado");
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let vivo = true;
    const inicio = Date.now();

    const relogio = setInterval(() => {
      if (vivo) setSegundos(Math.floor((Date.now() - inicio) / 1000));
    }, 1000);

    async function perguntar() {
      if (!vivo) return;

      try {
        const resposta = await fetch("/painel/versao", { cache: "no-store" });
        const { sha } = (await resposta.json()) as { sha: string | null };

        if (!vivo) return;

        /* Fora da Vercel não há com que comparar. Fica-se por "gravado". */
        if (sha === null) return parar();

        if (sha === commit) {
          setEstado("no-ar");
          return parar();
        }
        setEstado("a-reconstruir");
      } catch {
        /* Uma falha de rede a meio não quer dizer nada — tenta-se outra vez. */
      }

      if (Date.now() - inicio > DESISTIR_MS) {
        setEstado("demorou");
        parar();
      }
    }

    const sonda = setInterval(perguntar, INTERVALO_MS);
    void perguntar();

    function parar() {
      clearInterval(sonda);
      clearInterval(relogio);
    }

    return () => {
      vivo = false;
      parar();
    };
  }, [commit]);

  const ligacaoAoCommit = (
    <a href={endereco} target="_blank" rel="noreferrer" className="link-underline">
      ver a alteração
    </a>
  );

  if (estado === "no-ar") {
    return (
      <Aviso tom="bom">
        <strong>Está no ar.</strong> A alteração já se vê no site — {ligacaoAoCommit}.
      </Aviso>
    );
  }

  if (estado === "demorou") {
    return (
      <Aviso tom="mau">
        <strong>Passaram cinco minutos e o site continua na versão anterior.</strong>{" "}
        A alteração foi gravada e não se perdeu ({ligacaoAoCommit}), mas é
        provável que a reconstrução do site tenha falhado. Vale a pena avisar o
        Tomás.
      </Aviso>
    );
  }

  return (
    <Aviso tom="nota">
      <strong>Gravado.</strong>{" "}
      {estado === "a-reconstruir"
        ? `O site está a ser reconstruído — costuma demorar 1 a 2 minutos. Vão ${segundos}s.`
        : "A aguardar a reconstrução do site."}{" "}
      Podes fechar isto e voltar mais tarde — {ligacaoAoCommit}.
    </Aviso>
  );
}
