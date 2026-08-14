import Link from "next/link";

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

      {/*
        Entre o nome e o "do Pirata" havia uma caveira de 10px — um círculo
        com dois olhos, sem chapéu nem ossos. A esse tamanho não se lia como
        caveira nenhuma, e o Gonçalo mandou tirá-la. O emblema a sério, o da
        bandeira negra, continua onde tem espaço para se ver.

        A folga que ela dava (`my-1`/`my-1.5`) passou para a margem de cima
        deste `<span>`, ou o "do Pirata" ficava colado ao nome.
      */}
      <span
        className={`uppercase text-osso-fraco ${
          isLarge
            ? "mt-3 text-[0.7rem] tracking-[0.34em]"
            : "mt-2 text-[0.55rem] tracking-[0.28em]"
        }`}
        style={{ fontFamily: "var(--font-maquina)" }}
      >
        do Pirata
      </span>
    </Link>
  );
}
