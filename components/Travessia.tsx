"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { veioMadeira, ripasMadeira } from "@/lib/texturas";
import { Caveira } from "@/components/decor/Caveira";

/* Quanto tempo as portadas ficam fechadas depois de a rota já ter mudado.
   Curto de propósito: é uma batida, não uma espera. */
const PAUSA_MS = 160;

/* Rede de segurança. Se o `router.push` não resultar em mudança de rota
   dentro deste tempo (rota inexistente, erro de rede a buscar o payload),
   as portadas abrem à mesma — mais vale ver a página velha do que ficar
   preso atrás de duas tábuas. */
const TEMPO_MAXIMO_MS = 2500;

/* Texturas geradas uma vez no módulo, não por render: são deterministas e
   iguais em todas as travessias. Sementes diferentes para as duas portadas,
   senão a junta ao meio lê-se como um espelho. */
const TEXTURA_ESQUERDA = `${ripasMadeira(11)}, ${veioMadeira({ semente: 12 })}`;
const TEXTURA_DIREITA = `${ripasMadeira(23)}, ${veioMadeira({ semente: 24 })}`;

/*
  Loader de transição entre páginas — as portadas da taberna a fechar e a
  abrir de novo do outro lado.

  Porque é que isto não é um `loading.tsx`: as duas rotas do site são
  estáticas e o Next faz prefetch dos links à vista, por isso a navegação
  resolve-se em zero milissegundos e o fallback de rota nunca chegaria a
  aparecer (o mesmo vale para o `pending` do `useLinkStatus`). O ecrã de
  carregamento aqui é deliberado, não é sintoma de espera — se dependesse
  do tempo real de carregamento, nunca se veria.

  t=0.00s  clique intersectado, portadas entram das duas margens
  t=0.34s  fecham ao meio; é aqui que se faz o router.push
  t=0.50s  a rota nova já montou por trás; fim da batida de pausa
  t=0.84s  portadas fora do ecrã, cada uma para o seu lado

  Com movimento reduzido não intersecta nada: os links voltam a ser links, e
  a navegação é imediata. Sem JavaScript idem — este componente nunca corre e
  os `<a>` funcionam como sempre funcionaram.
*/
export function Travessia() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  const [fechado, setFechado] = useState(false);
  /* Guardamos o `href` completo (para o push) e o `pathname` isolado (para
     saber quando chegámos). Comparar o href inteiro não serviria: traz
     query e hash, que o `usePathname` não devolve. */
  const destino = useRef<{ href: string; pathname: string } | null>(null);
  const temporizadores = useRef<number[]>([]);

  const limparTemporizadores = useCallback(() => {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = [];
  }, []);

  // Intersecção dos cliques. Um único listener no documento apanha tudo —
  // os `<a>` simples da Nav e os que o `next/link` renderiza no Cta e no
  // Wordmark — sem obrigar cada sítio do site a saber que isto existe.
  useEffect(() => {
    if (reduce) return;

    function aoClicar(evento: MouseEvent) {
      // Alguém antes de nós já tratou do clique, ou não é um clique simples
      // de botão esquerdo: abrir em separador novo (Cmd/Ctrl), em janela
      // nova (Shift) ou descarregar não são travessias dentro da casa.
      if (evento.defaultPrevented) return;
      if (evento.button !== 0) return;
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

      const ligacao = (evento.target as Element | null)?.closest?.("a");
      if (!ligacao) return;
      if (ligacao.hasAttribute("download")) return;
      if (ligacao.target && ligacao.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(ligacao.href, window.location.href);
      } catch {
        return;
      }

      // Fora do site (Instagram, mapas), ou nem sequer http — `tel:` e
      // `mailto:` dão origem "null" e caem aqui.
      if (url.origin !== window.location.origin) return;

      // Mesma página: as âncoras da homepage (#a-casa, #petiscos) e o salto
      // para o conteúdo. São scroll, não navegação — fechar as portadas para
      // descer meia página seria absurdo.
      if (url.pathname === window.location.pathname) return;

      evento.preventDefault();
      destino.current = {
        href: `${url.pathname}${url.search}${url.hash}`,
        pathname: url.pathname,
      };
      setFechado(true);
    }

    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, [reduce]);

  // As portadas acabaram de encostar uma à outra: é agora que se navega,
  // com o ecrã tapado.
  function aoFechar() {
    const alvo = destino.current;
    if (!alvo) return;
    router.push(alvo.href);

    temporizadores.current.push(
      window.setTimeout(() => {
        // Se a rota não mudou a tempo, abrimos na mesma. Ver TEMPO_MAXIMO_MS.
        destino.current = null;
        setFechado(false);
      }, TEMPO_MAXIMO_MS),
    );
  }

  // A rota mudou por trás das portadas — pausa curta e abre. A comparação é
  // de igualdade exacta: `startsWith` daria verdadeiro para "/ementa" contra
  // "/" e abria as portadas antes sequer de o push acontecer.
  useEffect(() => {
    if (!fechado || !destino.current) return;
    if (destino.current.pathname !== pathname) return;

    limparTemporizadores();
    destino.current = null;
    temporizadores.current.push(
      window.setTimeout(() => setFechado(false), PAUSA_MS),
    );
  }, [pathname, fechado, limparTemporizadores]);

  useEffect(() => limparTemporizadores, [limparTemporizadores]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {fechado && (
        <div
          aria-hidden="true"
          /* z-[90]: por cima da tralha (60) e do skip link (70), por baixo do
             ecrã de entrada (100) — se os dois coincidissem, a entrada ganha.
             `pointer-events-auto` enquanto está fechado: engolir cliques é
             metade do trabalho, senão dá para carregar duas vezes no mesmo
             link e disparar duas navegações. */
          className="pointer-events-auto fixed inset-0 z-[90] overflow-hidden"
        >
          <Portada lado="esquerda" aoTerminar={aoFechar} />
          <Portada lado="direita" />

          {/* Luz de lanterna na junta, como se estivesse alguém do outro
              lado com o candeeiro. Entra depois de as portadas encostarem. */}
          <motion.div
            className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--lanterna) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
          />

          {/* A caveira da casa como marca de espera — sem o pano da bandeira
              nem os sabres, que a fariam ler como a bandeira outra vez. */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-osso"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.34, duration: 0.22 }}
          >
            <Caveira className="h-16 w-24" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* Uma folha da portada. `aoTerminar` só vai na da esquerda — as duas têm a
   mesma duração, e chamar o router duas vezes seria pedir sarilhos. */
function Portada({
  lado,
  aoTerminar,
}: {
  lado: "esquerda" | "direita";
  aoTerminar?: () => void;
}) {
  const esquerda = lado === "esquerda";

  return (
    <motion.div
      className={`tabua absolute inset-y-0 w-1/2 ${
        esquerda
          ? "left-0 border-r-2 border-[var(--madeira-borda)]"
          : "right-0 border-l-2 border-[var(--madeira-borda)]"
      }`}
      style={
        {
          "--textura-madeira": esquerda ? TEXTURA_ESQUERDA : TEXTURA_DIREITA,
        } as React.CSSProperties
      }
      initial={{ x: esquerda ? "-100%" : "100%" }}
      animate={{ x: 0 }}
      exit={{ x: esquerda ? "-100%" : "100%" }}
      transition={{ duration: 0.34, ease: [0.76, 0, 0.24, 1] }}
      /* O `onAnimationComplete` dispara também no fim da saída. Só nos
         interessa a chegada ao meio (x: 0) — navegar no fim da abertura
         mandaria a pessoa outra vez para a página que acabou de deixar. */
      onAnimationComplete={(definicao) => {
        if ((definicao as { x?: number | string })?.x !== 0) return;
        aoTerminar?.();
      }}
    />
  );
}
