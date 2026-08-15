import { connection } from "next/server";
import { exigirSessaoNaAccao } from "@/lib/painel/porta";

/*
  Que versão do site é que está no ar, neste instante.

  Serve uma pergunta só, e é a pergunta que o dono da casa faz a seguir a
  gravar: *"já apareceu?"*. Depois de publicar, o painel guarda o sha do commit
  que acabou de fazer e pergunta aqui de dez em dez segundos; quando os dois
  coincidem, a alteração está no ar.

  ## Porque é que não se pergunta à API da Vercel

  Porque perguntar a esta rota não custa um segredo novo. A API de deployments
  da Vercel daria mais — sabia distinguir "a construir" de "falhou" mais cedo, e
  dava o link dos registos — mas exige um `VERCEL_TOKEN`, e um token de conta da
  Vercel tem acesso a **todos** os projectos da conta. Trocar isso por uma
  mensagem de erro três minutos mais cedo não é bom negócio.

  O `VERCEL_GIT_COMMIT_SHA` é posto pela própria plataforma e existe em build e
  em execução. Fora da Vercel — em `next start` na máquina de alguém — não
  existe, e a resposta é `null`: o painel percebe isso e diz que não sabe, em
  vez de esperar para sempre por uma coincidência que nunca chega.
*/

export async function GET() {
  /*
    Sem isto, o Next tentaria gerar esta rota no build — e uma resposta com o
    sha do deployment congelada no build seria sempre a mesma, para sempre.
    O `connection()` diz que isto é um pedido vivo.
  */
  await connection();
  await exigirSessaoNaAccao();

  return Response.json(
    { sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
