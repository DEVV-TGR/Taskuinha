import type { ComponentProps, ReactNode } from "react";

/*
  Os campos de formulário do painel.

  O site não tinha nenhum — não há um único input nas oito páginas públicas, e
  o `next.config.ts` chega a usar isso como argumento a favor da CSP que tem.
  Por isso este pedaço do sistema de desenho nasce aqui, e nasce a seguir às
  regras que já existem: raio de 4px em tudo (nada é pílula), fundo afundado,
  linha em vez de caixa, e o foco a acender em `--lanterna`.

  ## Tamanho

  `min-h-11` são 44px, que é o alvo de toque mínimo. `text-base` são 16px, e
  isso não é estética: abaixo de 16px o Safari do iPhone faz zoom sozinho ao
  focar um campo, e o ecrã salta. Num painel feito para ser usado ao balcão com
  o polegar, as duas coisas não se negoceiam.
*/

const caixa =
  "min-h-11 w-full rounded-[var(--radius-card)] border border-linha bg-breu-fundo px-3 py-2 text-base text-osso " +
  "placeholder:text-osso-fraco/60 " +
  "focus:border-lanterna focus:outline-none focus:ring-1 focus:ring-lanterna " +
  "disabled:opacity-50";

export function Campo({
  etiqueta,
  ajuda,
  erro,
  className = "",
  ...rest
}: {
  etiqueta: string;
  ajuda?: ReactNode;
  erro?: string;
  className?: string;
} & Omit<ComponentProps<"input">, "className">) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-osso-fraco">
        {etiqueta}
      </span>
      <input
        {...rest}
        aria-invalid={erro ? true : undefined}
        className={`${caixa} ${erro ? "border-sangue" : ""}`}
      />
      {ajuda ? (
        <span className="mt-1.5 block text-xs leading-relaxed text-osso-fraco">
          {ajuda}
        </span>
      ) : null}
      {/*
        --sangue não passa contraste sobre o breu e nunca toca em texto — a
        regra é do globals.css. O aviso fica em --lanterna e a cor de perigo
        vive na borda do campo.
      */}
      {erro ? (
        <span role="alert" className="mt-1.5 block text-xs text-lanterna">
          {erro}
        </span>
      ) : null}
    </label>
  );
}

export function CampoDeTexto({
  etiqueta,
  className = "",
  ...rest
}: { etiqueta: string; className?: string } & Omit<
  ComponentProps<"textarea">,
  "className"
>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-osso-fraco">
        {etiqueta}
      </span>
      <textarea {...rest} rows={rest.rows ?? 2} className={caixa} />
    </label>
  );
}

export function CampoDeEscolha({
  etiqueta,
  className = "",
  children,
  ...rest
}: { etiqueta: string; className?: string; children: ReactNode } & Omit<
  ComponentProps<"select">,
  "className" | "children"
>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-osso-fraco">
        {etiqueta}
      </span>
      <select {...rest} className={caixa}>
        {children}
      </select>
    </label>
  );
}
