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
      <main id="conteudo" className="flex-1">
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
