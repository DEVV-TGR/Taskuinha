import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
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
