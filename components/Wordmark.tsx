import Link from "next/link";
import { CaveiraMinima } from "@/components/decor/Caveira";

/*
  O logótipo é a letra da própria casa, não um desenho meu. O letreiro de
  madeira sobre a porta lê-se TASKUIИHA — com o N ao contrário — e o comando
  de mesa em forma de leme repete exactamente o mesmo, em peças
  independentes feitas em alturas diferentes. Não é gralha, é a assinatura.

  O N invertido é decoração visual (aria-hidden); o nome certo vai num
  sr-only ao lado, para leitores de ecrã e para o Google. Dentro deste link
  o sr-only é redundante com o aria-label do próprio <Link> — mas mantém-se,
  porque é o mesmo bloco que serve de referência caso o wordmark volte a
  aparecer fora de um link (hero, por exemplo).
*/
export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      className="group inline-flex flex-col items-start leading-none"
      aria-label="Taskuinha do Pirata, ir para a página inicial"
    >
      <span
        className={`display gravado text-osso transition-colors duration-200 group-hover:text-lanterna ${
          isLarge ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"
        }`}
      >
        <span aria-hidden="true">
          TASKUI<span className="inline-block scale-x-[-1]">N</span>HA
        </span>
        <span className="sr-only">Taskuinha</span>
      </span>

      <CaveiraMinima
        className={`text-osso-fraco ${isLarge ? "my-1.5 h-3 w-3" : "my-1 h-2.5 w-2.5"}`}
      />

      <span
        className={`uppercase text-osso-fraco ${
          isLarge
            ? "text-[0.7rem] tracking-[0.34em]"
            : "text-[0.55rem] tracking-[0.28em]"
        }`}
        style={{ fontFamily: "var(--font-maquina)" }}
      >
        do Pirata
      </span>
    </Link>
  );
}

