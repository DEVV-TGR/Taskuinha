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
          A trave da primeira junta é a única diferente das seis, e por duas
          razões que só ela tem.

          `acimaDaLinha="56%"` — a aresta de baixo da madeira tem de ficar
          abaixo da linha para tapar as pontas das correntes da tabuleta, que
          nascem exactamente nela. Nas outras não há nada pendurado e o valor
          por omissão (50%, centrado) é o que serve.

          A camada `z-10` do componente põe-na **por trás** do esqueleto
          (z-20, dentro da Casa) e à frente de tudo o resto, sem deixar de
          estar atrás da Nav (z-40). A tabuleta fica em camada automática, por
          isso as correntes sobem por trás dos dois. Os dois números já foram
          ao contrário; trocaram-se por pedido do Gonçalo, que quis o esqueleto
          à frente da madeira.
        */}
        <Tronco acimaDaLinha="56%" />
        <Casa />

        {/*
          As outras quatro, uma por divisória entre secções. `espelhada`
          alternada por posição, para a mesma casca não repetir o desenho de
          divisória em divisória — a primeira conta como não espelhada, por
          isso a seguir vem espelhada.
        */}
        <Tronco espelhada />
        <Petiscos />
        <Tronco />
        <Galeria />
        <Tronco espelhada />
        <Vozes />
        <Tronco />
        <Encontrar />
      </main>

      {/* Sem trave antes do rodapé: chegou a haver uma e o Gonçalo mandou-a
          tirar. O rodapé ficou a separar-se pela linha fina que sempre teve. */}
      <Footer />
    </>
  );
}
