import Link from "next/link";
import { caminho, type Locale } from "@/lib/i18n";

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
export function Wordmark({
  size = "sm",
  lang,
  etiqueta,
}: {
  size?: "sm" | "lg";
  lang: Locale;
  /* `nav.inicio` do dicionário. Vem por prop porque a Nav, que monta este
     componente, é de cliente. */
  etiqueta: string;
}) {
  const isLarge = size === "lg";

  return (
    <Link
      href={caminho(lang, "/")}
      className="group inline-flex flex-col items-start leading-none"
      aria-label={etiqueta}
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

      <CaveiraPequena
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

function CaveiraPequena({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={className} fill="currentColor">
      <circle cx="6" cy="5.5" r="4" />
      <path d="M3.3,8 Q6,10 8.7,8 L8,9 Q6,10.2 4,9 Z" />
      <circle cx="4.5" cy="5.3" r="1" fill="var(--breu)" />
      <circle cx="7.5" cy="5.3" r="1" fill="var(--breu)" />
    </svg>
  );
}
