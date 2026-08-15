/*
  Os parâmetros do scrypt, num sítio só.

  Está em `.mjs` e não em `.ts` porque tem de ser lido pelos dois lados: pelo
  `lib/painel/utilizadores.ts`, que verifica as passwords em execução, e pelo
  `scripts/palavra-passe.mjs`, que as deriva na linha de comandos. Se os dois
  números divergirem, uma password gerada hoje deixa de bater certo amanhã sem
  ninguém perceber porquê.

  ## Os números

  `N = 2^16`, `r = 8`, `p = 1`, chave de 32 bytes.

  O mínimo que a OWASP recomenda para scrypt é `N = 2^17`. Isto é um degrau
  abaixo, e é um desvio consciente: numa função da Vercel, com 1 a 2 vCPU em
  rajada, `2^17` chega perto do segundo por tentativa — que é lento para quem
  entra e caro na factura de compute, e que se paga em cada tentativa **falhada**
  de um atacante, não só nas boas.

  O degrau que se perde compensa-se onde compensa mesmo: a password é gerada e
  não escolhida (ver `scripts/palavra-passe.mjs`), e o Vercel Firewall trava as
  tentativas por IP antes de chegarem aqui. Contra uma password de 144 bits, a
  diferença entre 2^16 e 2^17 não decide nada.

  ## `maxmem`, que não é opcional

  O scrypt precisa de `128 · N · r` bytes — com estes números, **64 MiB**. O
  Node dá 32 MiB por omissão e atira `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` se se
  passar disso, o que se lê como um erro de parâmetros e é na verdade falta de
  memória. 192 MiB dão folga; a função na Vercel tem 1024.

  ## Se um dia se subir o custo

  Sobe-se aqui, e as passwords antigas continuam a funcionar: os parâmetros com
  que cada uma foi derivada vão escritos dentro do próprio segredo
  (`scrypt$65536$8$1$…`), e é por eles que a verificação se guia. Este ficheiro
  só manda no que se deriva **de novo**.
*/

export const CUSTO = {
  N: 1 << 16,
  r: 8,
  p: 1,
  chave: 32,
  maxmem: 192 * 1024 * 1024,
};

/** O prefixo que identifica o formato. Ver `lib/painel/utilizadores.ts`. */
export const ALGORITMO = "scrypt";
