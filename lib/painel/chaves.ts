import "server-only";
import { hkdfSync } from "node:crypto";
import { segredoDasCredenciais } from "./utilizadores";

/*
  Uma chave por uso.

  O painel faz agora três coisas com criptografia, e são três coisas diferentes:

  | uso | o quê | como |
  |---|---|---|
  | `sessao` | assinar o cookie de quem já entrou | HMAC-SHA256 |
  | `desafio` | **cifrar** o código de seis algarismos entre os dois ecrãs | AES-256-GCM |
  | `aparelho` | assinar o "este telemóvel já passou pelo email" | HMAC-SHA256 |

  **As três não podem ser a mesma chave.** Reutilizar chave entre um HMAC e uma
  cifra é a receita de manual para um problema que não se vê a olho: o material
  que assina passa a ser o mesmo que cifra, e a partir daí basta uma fraqueza
  num dos usos para comprometer os outros. Separar custa três linhas.

  ## Porque `hkdf` e não três `sha256` com prefixos diferentes

  Um `sha256("desafio" + segredo)` daria três valores distintos e chegaria, na
  prática, para o que aqui se faz. O `hkdf` é a ferramenta desenhada exactamente
  para isto — esticar um segredo em várias chaves independentes, com um rótulo
  por uso — está no `node:crypto` desde sempre, e é síncrono. Não há razão para
  improvisar quando a coisa certa não custa mais.

  ## De onde vem o segredo

  Das próprias credenciais, e não de mais uma variável de ambiente para gerar
  com o `openssl`. Isso dá a propriedade que se quer e que já estava lá:
  **mudar a password revoga tudo de uma vez** — sessões abertas, desafios a meio,
  e aparelhos que estavam lembrados. É o botão de emergência, e é um só.
*/

type Uso = "sessao" | "desafio" | "aparelho";

/*
  Sem sal.

  Um sal, no `hkdf`, serve para separar derivações que partem de segredos com
  pouca entropia e podem colidir entre si. Aqui a separação que interessa é
  entre os três usos, e essa é feita pelo rótulo — que é o parâmetro `info`, e
  é para isso que ele existe. Um sal fixo escrito no código não acrescentava
  nada; um sal variável obrigava a guardá-lo em algum lado, que é precisamente
  o que este desenho não tem.
*/
export function chave(uso: Uso, bytes = 32): Buffer {
  return Buffer.from(
    hkdfSync("sha256", segredoDasCredenciais(), "", `taskuinha:${uso}:v1`, bytes),
  );
}
