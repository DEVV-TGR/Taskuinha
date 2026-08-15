"use client";

import { useActionState, useState } from "react";
import { Campo } from "@/components/painel/Campo";
import { Aviso } from "@/components/painel/Aviso";
import { EstadoDaGravacao } from "@/components/painel/EstadoDaGravacao";
import { CtaBotao } from "@/components/Cta";
import { gravarCasa, type EstadoDaCasa } from "@/app/painel/casa/accoes";
import { dias, type Dia } from "@/lib/horario";

/*
  Os contactos e o horário.

  É o ecrã pequeno, e foi construído primeiro de propósito: exercita a volta
  completa — ler do GitHub, editar, validar, gravar, esperar pelo deploy — com
  meia dúzia de campos em vez de com cento e cinquenta e quatro pratos.
*/

type Casa = {
  telefone: { mostrar: string; tel: string };
  morada: { rua: string; codigoPostal: string; localidade: string; concelho: string };
  horario: { dia: Dia; fechado?: boolean; abre?: string; fecha?: string }[];
  links: Record<string, string>;
};

const nomeDoDia: Record<Dia, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado",
  domingo: "Domingo",
};

const nomeDaLigacao: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tripadvisor: "TripAdvisor",
  restaurantGuru: "Restaurant Guru",
};

export function EditorDaCasa({ inicial, sha }: { inicial: Casa; sha: string }) {
  const [casa, setCasa] = useState<Casa>(inicial);
  const [estado, accao, aGravar] = useActionState<EstadoDaCasa, FormData>(
    gravarCasa,
    { tipo: "parado" },
  );

  /*
    O JSON inteiro vai num campo escondido em vez de trinta campos com `name`.
    O ecrã trabalha sobre um objecto, a acção valida esse mesmo objecto, e não
    há uma terceira forma no meio para se desencontrar das outras duas.
  */
  function mudar(caminho: (c: Casa) => void) {
    setCasa((anterior) => {
      const copia = structuredClone(anterior);
      caminho(copia);
      return copia;
    });
  }

  return (
    <form action={accao} className="space-y-8">
      <input type="hidden" name="sha" value={sha} />
      <input type="hidden" name="casa" value={JSON.stringify(casa)} />

      {estado.tipo === "erro" ? <Aviso tom="mau">{estado.mensagem}</Aviso> : null}

      {estado.tipo === "problemas" ? (
        <Aviso tom="mau">
          <strong>Isto não pode ser gravado assim:</strong>
          <span className="mt-2 block space-y-1">
            {estado.lista.map((problema) => (
              <span key={problema} className="block">
                · {problema}
              </span>
            ))}
          </span>
        </Aviso>
      ) : null}

      {estado.tipo === "gravado" ? (
        <EstadoDaGravacao commit={estado.commit} endereco={estado.endereco} />
      ) : null}

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-lanterna">
          Telefone
        </h2>
        <Campo
          etiqueta="Como aparece no site"
          value={casa.telefone.mostrar}
          onChange={(e) => mudar((c) => void (c.telefone.mostrar = e.target.value))}
          inputMode="tel"
        />
        <Campo
          etiqueta="Número que o telemóvel marca"
          ajuda="Com indicativo e sem espaços. É o que o botão «Reservar mesa» marca."
          value={casa.telefone.tel}
          onChange={(e) => mudar((c) => void (c.telefone.tel = e.target.value))}
          inputMode="tel"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-lanterna">
          Morada
        </h2>
        <Campo
          etiqueta="Rua"
          value={casa.morada.rua}
          onChange={(e) => mudar((c) => void (c.morada.rua = e.target.value))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Código postal"
            value={casa.morada.codigoPostal}
            onChange={(e) => mudar((c) => void (c.morada.codigoPostal = e.target.value))}
          />
          <Campo
            etiqueta="Localidade"
            value={casa.morada.localidade}
            onChange={(e) => mudar((c) => void (c.morada.localidade = e.target.value))}
          />
        </div>
        <Campo
          etiqueta="Concelho"
          value={casa.morada.concelho}
          onChange={(e) => mudar((c) => void (c.morada.concelho = e.target.value))}
        />
        {/*
          O ponto no mapa não está aqui, e é deliberado: as coordenadas, o mapa
          e o link do «Como chegar» são três cópias do mesmo par de números e
          vivem no lib/site.ts. Uma casa não muda de sítio; uma rua pode mudar
          de nome.
        */}
        <Aviso tom="nota">
          O ponto no mapa não se muda aqui. A casa não muda de sítio — se a rua
          mudar de nome, é preciso mexer no código.
        </Aviso>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-lanterna">
          Horário
        </h2>
        <ul className="space-y-2">
          {dias.map((dia, i) => {
            const entrada = casa.horario[i];
            const fechado = entrada.fechado === true;

            return (
              <li
                key={dia}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-card)] border border-linha bg-breu-fundo px-3 py-2"
              >
                <span className="w-20 shrink-0 text-sm text-osso">
                  {nomeDoDia[dia]}
                </span>

                <label className="flex min-h-11 shrink-0 items-center gap-2 text-sm text-osso-fraco">
                  <input
                    type="checkbox"
                    checked={fechado}
                    onChange={(e) =>
                      mudar((c) => {
                        c.horario[i] = e.target.checked
                          ? { dia, fechado: true }
                          : { dia, abre: "10:00", fecha: "23:00" };
                      })
                    }
                    className="h-5 w-5 accent-[var(--lanterna)]"
                  />
                  Folga
                </label>

                {fechado ? null : (
                  <span className="flex items-center gap-2">
                    <input
                      type="time"
                      value={entrada.abre ?? ""}
                      onChange={(e) => mudar((c) => void (c.horario[i].abre = e.target.value))}
                      aria-label={`${nomeDoDia[dia]}, abre`}
                      className="min-h-11 rounded-[var(--radius-card)] border border-linha bg-breu px-2 text-base text-osso focus:border-lanterna focus:outline-none"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    />
                    <span className="text-osso-fraco">às</span>
                    <input
                      type="time"
                      value={entrada.fecha ?? ""}
                      onChange={(e) => mudar((c) => void (c.horario[i].fecha = e.target.value))}
                      aria-label={`${nomeDoDia[dia]}, fecha`}
                      className="min-h-11 rounded-[var(--radius-card)] border border-linha bg-breu px-2 text-base text-osso focus:border-lanterna focus:outline-none"
                      style={{ fontFamily: "var(--font-maquina)" }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-lanterna">
          Redes e sítios
        </h2>
        {Object.keys(casa.links).map((chave) => (
          <Campo
            key={chave}
            etiqueta={nomeDaLigacao[chave] ?? chave}
            value={casa.links[chave]}
            onChange={(e) => mudar((c) => void (c.links[chave] = e.target.value))}
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
          />
        ))}
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-linha bg-breu-fundo px-4 py-3">
        <CtaBotao type="submit" disabled={aGravar} className="w-full">
          {aGravar ? "A gravar…" : "Publicar"}
        </CtaBotao>
      </div>
    </form>
  );
}
