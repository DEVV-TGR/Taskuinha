import type { ReactNode } from "react";
import { Tabua } from "@/components/decor/Tabua";

/*
  A tábua onde ficam pregados os dois ecrãs de erro — o 404 e a avaria.

  Um só componente para os dois porque a diferença entre eles é o texto e
  os botões, não o desenho. Sem `"use client"` de propósito: o
  `not-found.tsx` é servidor e o `error.tsx` tem de ser cliente, e um
  componente sem directiva serve os dois sem se duplicar.

  Não leva fotografia nenhuma. As imagens da casa são todas escolha do
  Gonçalo e não se vai buscar uma à pasta só para encher um ecrã de erro;
  a textura de madeira da `Tabua` já é a casa e é gerada em código.

  Também não leva `Reveal`. As secções do site entram a cair e a balançar
  porque se está a descer a página com vontade de as ver — quem cai aqui
  caiu por engano, e esperar por uma animação para ler "esta página não
  existe" é castigo a dobrar.
*/
export function PainelDeErro({
  codigo,
  titulo,
  frase,
  children,
}: {
  /** Só o 404 tem número. A avaria não mostra código nenhum. */
  codigo?: string;
  titulo: string;
  frase: string;
  /** Os botões. Variam entre os dois ecrãs. */
  children: ReactNode;
}) {
  return (
    /* O mesmo `id` e `tabIndex` das outras páginas: o skip link da Nav
       aponta para aqui e sem o tabIndex o foco do teclado não o segue. */
    <main
      id="conteudo"
      tabIndex={-1}
      className="flex flex-1 items-center justify-center px-5 py-24 focus:outline-none sm:px-8"
    >
      <Tabua
        semente={404}
        className="w-full max-w-[46rem] px-6 py-14 text-center sm:px-12 sm:py-20"
      >
        {codigo ? (
          <p
            className="leading-none text-lanterna text-[clamp(3rem,12vw,5.5rem)]"
            style={{ fontFamily: "var(--font-maquina)" }}
          >
            {codigo}
          </p>
        ) : null}

        <h1 className="display letra-na-madeira mt-4 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[0.95] text-osso">
          {titulo}
        </h1>

        <p className="letra-na-madeira mx-auto mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-osso">
          {frase}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      </Tabua>
    </main>
  );
}
