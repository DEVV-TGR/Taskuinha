/*
  Ler um preço escrito por uma pessoa.

  Aceita vírgula e ponto. Em Portugal escreve-se `13,50`, e é isso que o dono
  da casa vai escrever — mas os teclados numéricos de telemóvel dão um ponto em
  algumas configurações de língua, e recusar `13.50` era recusar uma coisa que
  o próprio telemóvel escreveu.

  Devolve `null` para tudo o que não seja um preço: vazio, letras, negativos,
  zero, e números com mais de duas casas decimais. `13,456 €` não é um preço, é
  um dedo a escorregar.

  A validação de verdade está no `lib/painel/validar.ts` e corre no servidor —
  esta é a que dá a resposta imediata a quem está a escrever.
*/
export function lerPreco(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null;

  const valor = Number(limpo);
  return valor > 0 ? valor : null;
}

/** `13.5` → `"13,50"`. Para preencher os campos a partir dos dados. */
export function escreverPreco(valor: number): string {
  return valor.toFixed(2).replace(".", ",");
}
