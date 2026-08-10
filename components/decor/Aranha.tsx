"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const MAX_APARICOES = 3;

/*
  Quanto o fio cresce, em píxeis, do topo do ecrã até ao corpo da aranha. É o
  mesmo número em dois sítios: a altura do fio (que anima em `scaleY`) e o
  deslocamento do corpo (que anima em `y`). Se os dois se separarem, o corpo
  descola da ponta do fio.
*/
const DESCIDA = 420;

type Estado = "escondida" | "descendo" | "pousada" | "subindo";

/*
  A aranha peluda do tecto (referência real: tecto-nau-aranha.jpg). Desce ao
  entrar em #a-casa, depois reaparece em intervalos aleatórios de 45–120s,
  no máximo 3 vezes por sessão.

  Com movimento reduzido, desaparece por completo — não fica pendurada a
  meio do ecrã sem se mexer.

  ## O fio nasce no topo do ecrã

  Era o conjunto fio+corpo a deslocar-se inteiro, como uma peça rígida, de
  `y: -260` a `y: 220`. O fio tinha 240px fixos, por isso em repouso a ponta de
  cima dele ficava a 220px do topo: a aranha parecia sair do ar a meio da
  página. O Gonçalo viu-a a descer do tronco e disse que a queria a descer da
  barra de navegação.

  Agora o fio tem o percurso todo (`DESCIDA`) e está ancorado em `top-0` do
  contentor da tralha, que é `fixed inset-0` — o topo do ecrã. Cresce em
  `scaleY` a partir do topo (é o `transform-origin` que a classe `.pendurado`
  do globals.css já dá), e o corpo desce em `y` na mesma duração e curva, para
  chegar sempre à ponta.

  O fio passa **à frente** da barra de navegação, não por trás: a camada da
  tralha é `z-[60]` e a Nav é `z-40`. É a consequência de nascer no topo, e
  está assim de propósito.

  As duas animações são transformações. Nada disto toca em layout.

  ## O clique despacha-a

  Havia aqui uma regra — "a aranha nunca rouba um clique" — e uma fuga: se o
  rato entrasse num raio de 140px, ela subia sozinha. As duas coisas saíram a
  pedido dele, que a quer despachada com o dedo ou com o rato. Não davam para
  conciliar: com 140px de raio, no computador o ponteiro nunca lhe chegava
  perto o suficiente para a clicar.

  Só o **corpo** é clicável, e é um `<button>` com `tabIndex={-1}`: o contentor
  da tralha é `aria-hidden`, e um elemento focável lá dentro seria uma
  armadilha para quem navega por teclado.
*/
export function Aranha({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<Estado>("escondida");
  const aparicoes = useRef(0);
  const temporizadores = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;

    function agendar(atraso: number, fn: () => void) {
      const id = window.setTimeout(fn, atraso);
      temporizadores.current.push(id);
      return id;
    }

    function agendarProxima() {
      if (aparicoes.current >= MAX_APARICOES) return;
      agendar(45000 + Math.random() * 75000, descer);
    }

    function descer() {
      if (aparicoes.current >= MAX_APARICOES) return;
      aparicoes.current += 1;
      setEstado("descendo");
      agendar(1200, () => setEstado("pousada"));
      const tempoPousada = 5000 + Math.random() * 3000;
      agendar(1200 + tempoPousada, () =>
        setEstado((actual) => (actual === "pousada" ? "subindo" : actual)),
      );
      /* Corre mesmo que ela já tenha sido despachada com um clique — nesse
         caso o estado já é "escondida" e isto só serve para agendar a
         próxima aparição. */
      agendar(1200 + tempoPousada + 500, () => {
        setEstado("escondida");
        agendarProxima();
      });
    }

    const alvo = document.getElementById("a-casa");
    let observer: IntersectionObserver | undefined;
    if (alvo) {
      observer = new IntersectionObserver(
        (entradas) => {
          if (entradas[0]?.isIntersecting && aparicoes.current === 0) {
            descer();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(alvo);
    }

    return () => {
      observer?.disconnect();
      temporizadores.current.forEach(clearTimeout);
      temporizadores.current = [];
    };
  }, [reduce]);

  /* Sobe já e desaparece. O caminho é o mesmo por onde ela sairia sozinha ao
     fim do tempo de pousada. */
  function despachar() {
    if (estado !== "descendo" && estado !== "pousada") return;
    setEstado("subindo");
    const id = window.setTimeout(() => setEstado("escondida"), 500);
    temporizadores.current.push(id);
  }

  if (reduce) return null;

  const descendoOuPousada = estado === "descendo" || estado === "pousada";
  const aSubir = estado === "subindo";

  /* A subida é rápida e seca; a descida tem um `overshoot` na curva, que é o
     que lhe dá o repique de coisa pendurada num fio. */
  const transicao = {
    duration: aSubir ? 0.5 : 1.2,
    ease: aSubir ? ([0.4, 0, 0.2, 1] as const) : ([0.34, 1.56, 0.64, 1] as const),
  };

  return (
    <div
      aria-hidden="true"
      data-tralha-movel=""
      className={`pointer-events-none absolute top-0 ${className ?? ""}`}
    >
      {/* Fio de seda. Tem o percurso todo de altura e cresce do topo para
          baixo — é por isso que nunca se vê uma ponta solta no ar.

          O `initial` é obrigatório, e não decorativo: sem ele o servidor
          renderiza o fio sem `transform` nenhuma, ou seja em `scaleY: 1`, e
          via-se um fio de 420px esticado no ecrã até a hidratação o recolher. */}
      <motion.svg
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className="pendurado mx-auto w-0.5"
        style={{ height: DESCIDA }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: descendoOuPousada ? 1 : 0 }}
        transition={transicao}
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="var(--osso-fraco)"
          strokeWidth="1"
          opacity="0.5"
        />
      </motion.svg>

      {/* O corpo desce até à ponta do fio. `top-0` mais `y` — e não `top`
          animado — para ser uma transformação e não um recálculo de layout. */}
      <motion.button
        type="button"
        tabIndex={-1}
        onClick={despachar}
        className="pointer-events-auto absolute top-0 left-1/2 -ml-4 block cursor-pointer sm:-ml-5"
        initial={{ y: 0 }}
        animate={{ y: descendoOuPousada ? DESCIDA : 0 }}
        transition={transicao}
      >
        <motion.svg
          viewBox="0 0 40 40"
          className="-mt-2 h-8 w-8 sm:h-10 sm:w-10"
          style={{ transformOrigin: "50% 0%" }}
          animate={estado === "pousada" ? { rotate: [-6, 6, -6] } : { rotate: 0 }}
          transition={
            estado === "pousada"
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          {[-1, 1].map((lado) =>
            [0, 1, 2, 3].map((i) => (
              <path
                key={`${lado}-${i}`}
                d={`M20,18 Q${20 + lado * (10 + i * 2)},${10 + i * 4} ${20 + lado * (16 + i * 3)},${14 + i * 6}`}
                stroke="var(--breu-fundo)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            )),
          )}
          <circle cx="20" cy="22" r="8" fill="var(--breu-fundo)" />
          <circle cx="20" cy="13" r="5" fill="var(--breu-fundo)" />
          <circle cx="18" cy="12" r="1" fill="var(--lanterna)" />
          <circle cx="22" cy="12" r="1" fill="var(--lanterna)" />
        </motion.svg>
      </motion.button>
    </div>
  );
}
