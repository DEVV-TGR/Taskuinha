"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useAbaVisivel } from "./usarVisibilidade";

const MAX_APARICOES = 3;
const RAIO_FUGA = 140;

type Estado = "escondida" | "descendo" | "pousada" | "subindo";

/*
  As oito pernas, metade delas — a outra metade é esta espelhada em x=32.
  Cada perna tem duas secções e um joelho no meio, que é o que dá a
  silhueta de tarântula: o fémur sobe acima do corpo, a tíbia desce até à
  ponta. O desenho anterior fazia um arco só, e por isso lia-se como um
  polvo geométrico em vez de uma aranha.

  Coordenadas em viewBox 0 0 64 52, medidas contra tecto-nau-aranha.jpg.
*/
const PERNAS = [
  // anca      controlo   joelho     controlo   ponta
  { a: [37, 14], c1: [44, 7], j: [50, 5], c2: [56, 5], p: [59, 11] },
  { a: [38, 17], c1: [47, 11], j: [54, 13], c2: [60, 15], p: [62, 22] },
  { a: [38, 21], c1: [48, 20], j: [54, 24], c2: [59, 28], p: [60, 35] },
  { a: [36, 25], c1: [45, 27], j: [50, 33], c2: [54, 38], p: [54, 46] },
] as const;

/* Pêlos do abdómen: ângulos e comprimentos fixos à mão, nunca Math.random()
   — o HTML do servidor tem de bater certo com o do cliente (regra 7). */
const PELOS_ABDOMEN = [
  200, 218, 236, 252, 268, 284, 300, 320, 340, 0, 20, 40, 58, 76, 94, 112, 130, 148,
] as const;

/*
  A aranha peluda do tecto (referência real: tecto-nau-aranha.jpg). Desce ao
  entrar em #a-casa, depois reaparece em intervalos aleatórios de 45–120s,
  no máximo 3 vezes por sessão. Foge se o rato chegar perto — detectado por
  um listener em `window`, nunca por uma hit area (regra 2 do §7): a aranha
  nunca rouba um clique.

  Com movimento reduzido, desaparece por completo — não fica pendurada a
  meio do ecrã sem se mexer.
*/
export function Aranha({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const visivel = useAbaVisivel();
  const ref = useRef<HTMLDivElement>(null);
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

  // Foge se o rato entrar no raio, só enquanto está pousada.
  useEffect(() => {
    if (reduce || !visivel || estado !== "pousada") return;

    function aoMoverRato(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distancia = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (distancia < RAIO_FUGA) {
        setEstado("subindo");
        window.setTimeout(() => setEstado("escondida"), 500);
      }
    }

    window.addEventListener("mousemove", aoMoverRato);
    return () => window.removeEventListener("mousemove", aoMoverRato);
  }, [estado, reduce, visivel]);

  if (reduce) return null;

  const descendoOuPousada = estado === "descendo" || estado === "pousada";
  // O plano fala em "y: -120 a y: 220" para o percurso da descida — mas o fio
  // sozinho já tem 240px, por isso -120 deixava uma pontinha visível mesmo
  // em repouso. -260 esconde o conjunto todo (fio + corpo) sem tocar no
  // ponto de chegada nem na duração descrita.
  const y = descendoOuPousada ? 220 : -260;
  const aSubir = estado === "subindo";

  return (
    <div
      ref={ref}
      data-tralha-movel=""
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 ${className ?? ""}`}
    >
      <motion.div
        className="pendurado"
        animate={{ y }}
        transition={{
          duration: aSubir ? 0.5 : 1.2,
          ease: aSubir ? [0.4, 0, 0.2, 1] : [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* Fio de seda */}
        <svg viewBox="0 0 2 240" className="mx-auto h-60 w-0.5" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="240" stroke="var(--osso-fraco)" strokeWidth="1" opacity="0.5" />
        </svg>

        <motion.svg
          viewBox="0 0 64 52"
          className="-mt-1 mx-auto h-9 w-11 sm:h-12 sm:w-14"
          style={{ transformOrigin: "50% 0%" }}
          animate={estado === "pousada" ? { rotate: [-6, 6, -6] } : { rotate: 0 }}
          transition={
            estado === "pousada"
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          {/*
            Três passagens sobrepostas sobre a mesma silhueta.

            1. REBORDO. Verificado a renderizar o SVG isolado sobre --breu:
               uma aranha preta sobre fundo preto não se vê — só os olhos.
               Na fotografia da casa ela é uma silhueta escura contra um
               tecto iluminado; aqui é o contrário, e por isso apanha luz de
               lanterna pelas bordas em vez de a bloquear.
            2. PÊLOS, na mesma luz, mais fortes: fibra retroiluminada.
            3. CORPO escuro por cima, a tapar o meio do rebordo e a deixar
               só o contorno aceso.
          */}
          <g stroke="var(--madeira-luz)" fill="var(--madeira-luz)" opacity="0.34" strokeLinecap="round">
            <Lados>
              {PERNAS.map((perna, i) => (
                <Perna key={i} {...perna} passagem="rebordo" />
              ))}
            </Lados>
            <path d="M29,12 Q26,8 24.5,5" strokeWidth="3.8" fill="none" />
            <path d="M35,12 Q38,8 39.5,5" strokeWidth="3.8" fill="none" />
            <ellipse cx="32" cy="32" rx="10.3" ry="11.3" stroke="none" />
            <ellipse cx="32" cy="17.5" rx="7.9" ry="7.1" stroke="none" />
          </g>

          <g stroke="var(--madeira-luz)" opacity="0.5" strokeLinecap="round">
            <Lados>
              {PERNAS.map((perna, i) => (
                <Perna key={i} {...perna} passagem="pelo" />
              ))}
            </Lados>
            {/* Pêlos do abdómen: é o contorno irregular que tira o ar de
                ícone ao corpo, que é uma elipse lisa por baixo. */}
            {PELOS_ABDOMEN.map((grau) => {
              const rad = (grau * Math.PI) / 180;
              const comprimento = 2 + (grau % 7) * 0.28;
              return (
                <line
                  key={grau}
                  x1={(32 + Math.cos(rad) * 8.6).toFixed(2)}
                  y1={(32 + Math.sin(rad) * 9.6).toFixed(2)}
                  x2={(32 + Math.cos(rad) * (8.6 + comprimento)).toFixed(2)}
                  y2={(32 + Math.sin(rad) * (9.6 + comprimento)).toFixed(2)}
                  strokeWidth="1.1"
                />
              );
            })}
          </g>

          <g stroke="var(--breu-fundo)" fill="none" strokeLinecap="round">
            <Lados>
              {PERNAS.map((perna, i) => (
                <Perna key={i} {...perna} passagem="corpo" />
              ))}
            </Lados>
            {/* Palpos — os dois apêndices curtos à frente da boca. */}
            <path d="M29,12 Q26,8 24.5,5" strokeWidth="2.4" />
            <path d="M35,12 Q38,8 39.5,5" strokeWidth="2.4" />
          </g>

          <ellipse cx="32" cy="32" rx="9.4" ry="10.4" fill="var(--breu-fundo)" />
          {/* Brilho castanho, não cinzento: a aranha da casa é castanha-escura,
              e o --madeira-borda mantém-na dentro da paleta. */}
          <ellipse cx="29.5" cy="28.5" rx="3.8" ry="4.8" fill="var(--madeira-borda)" opacity="0.7" />
          <ellipse cx="32" cy="17.5" rx="7" ry="6.2" fill="var(--breu-fundo)" />
          <ellipse cx="30" cy="15.5" rx="3" ry="2.4" fill="var(--madeira-borda)" opacity="0.7" />

          {/* Olhos. Dois grandes e dois vestigiais — o suficiente para a
              cabeça ter frente sem virar caricatura. */}
          <circle cx="29.6" cy="14.2" r="1.05" fill="var(--lanterna)" />
          <circle cx="34.4" cy="14.2" r="1.05" fill="var(--lanterna)" />
          <circle cx="31.4" cy="12.9" r="0.5" fill="var(--lanterna)" opacity="0.7" />
          <circle cx="32.6" cy="12.9" r="0.5" fill="var(--lanterna)" opacity="0.7" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

type Ponto = readonly [number, number];

/* Ponto sobre uma Bézier quadrática no parâmetro t. Sem isto os pêlos
   ficavam nos pontos de controlo — que não estão sobre a curva — e viam-se
   a flutuar ao lado da perna. */
function naCurva(p0: Ponto, c: Ponto, p1: Ponto, t: number): Ponto {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ];
}

/* Normal unitária à curva no parâmetro t — a direcção em que o pêlo espeta. */
function normalDaCurva(p0: Ponto, c: Ponto, p1: Ponto, t: number): Ponto {
  const u = 1 - t;
  const tx = 2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
  const ty = 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
  const comprimento = Math.hypot(tx, ty) || 1;
  return [-ty / comprimento, tx / comprimento];
}

/* Pêlos de uma secção da perna: dois de cada lado, alternados, a apontar
   para fora da curva. Comprimentos fixos, nunca aleatórios. */
function pelosDaSeccao(p0: Ponto, c: Ponto, p1: Ponto, escala: number) {
  return [
    { t: 0.35, sentido: -1, comprimento: 2.4 * escala },
    { t: 0.55, sentido: 1, comprimento: 1.9 * escala },
    { t: 0.78, sentido: -1, comprimento: 2.1 * escala },
  ].map(({ t, sentido, comprimento }) => {
    const [x, y] = naCurva(p0, c, p1, t);
    const [nx, ny] = normalDaCurva(p0, c, p1, t);
    return {
      x1: x,
      y1: y,
      x2: x + nx * sentido * comprimento,
      y2: y + ny * sentido * comprimento,
    };
  });
}

/* Desenha os filhos duas vezes: como estão, e espelhados em x=32. As oito
   pernas são quatro definidas à mão mais o reflexo — uma tarântula é
   simétrica, e escrever as outras quatro à mão só duplicaria os erros. */
function Lados({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <g transform="translate(64,0) scale(-1,1)">{children}</g>
    </>
  );
}

/*
  Uma perna: dois traços em vez de um. O fémur (anca → joelho) é grosso, a
  tíbia (joelho → ponta) afina até acabar em bico. É o joelho que dá a
  silhueta de tarântula; o desenho anterior tinha um arco único e lia-se
  como um polvo geométrico.

  A `passagem` escolhe o que desenhar — as cores e a opacidade vêm sempre do
  <g> de cima, para as três passagens não repetirem a paleta.
*/
function Perna({
  a,
  c1,
  j,
  c2,
  p,
  passagem,
}: {
  a: Ponto;
  c1: Ponto;
  j: Ponto;
  c2: Ponto;
  p: Ponto;
  passagem: "rebordo" | "pelo" | "corpo";
}) {
  const femur = `M${a[0]},${a[1]} Q${c1[0]},${c1[1]} ${j[0]},${j[1]}`;
  const tibia = `M${j[0]},${j[1]} Q${c2[0]},${c2[1]} ${p[0]},${p[1]}`;

  if (passagem === "pelo") {
    const pelos = [...pelosDaSeccao(a, c1, j, 1), ...pelosDaSeccao(j, c2, p, 0.8)];
    return (
      <>
        {pelos.map((pelo, i) => (
          <line
            key={i}
            x1={pelo.x1.toFixed(2)}
            y1={pelo.y1.toFixed(2)}
            x2={pelo.x2.toFixed(2)}
            y2={pelo.y2.toFixed(2)}
            strokeWidth="0.85"
          />
        ))}
      </>
    );
  }

  // O rebordo é a mesma perna 1,4 unidades mais gorda — o corpo escuro
  // assenta-lhe por cima e sobra só o contorno aceso.
  const grossoFemur = passagem === "rebordo" ? 4.1 : 2.7;
  const grossoTibia = passagem === "rebordo" ? 3.3 : 1.9;

  return (
    <>
      <path d={femur} strokeWidth={grossoFemur} fill="none" />
      <path d={tibia} strokeWidth={grossoTibia} fill="none" />
    </>
  );
}
