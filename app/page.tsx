import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Tronco } from "@/components/decor/Tronco";
import { Casa } from "@/components/Casa";
import { Petiscos } from "@/components/Petiscos";
import { Galeria } from "@/components/Galeria";
import { Vozes } from "@/components/Vozes";
import { Encontrar } from "@/components/Encontrar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav transparentAtTop />
      {/* tabIndex={-1}: o skip link salta para aqui, e sem isto o
          "salto" é só scroll — o foco do teclado não vem atrás. */}
      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        {/*
          A régua da junta. `h-0` para não ocupar espaço nenhum: serve só de
          linha, e o tronco centra-se nela com um `-translate-y-1/2`.

          Está aqui, e não dentro do Hero nem da Casa, porque é o único sítio
          com largura total — o Hero corta (`overflow-hidden`) e a Casa é
          `max-w-[1400px]`.

          `z-20` é o que põe a trave à frente do esqueleto (z-10, dentro da
          Casa) sem deixar de estar atrás da Nav (z-40). A tabuleta fica em
          camada automática, por isso as correntes sobem por trás dos dois.
        */}
        <div className="relative z-20 h-0">
          <Tronco />
        </div>
        <Casa />
        <Petiscos />
        <Galeria />
        <Vozes />
        <Encontrar />
      </main>
      <Footer />
    </>
  );
}
