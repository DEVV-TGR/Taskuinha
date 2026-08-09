@AGENTS.md

# Como se trabalha neste projecto

## Perguntar. Não assumir.

Regra número um, acima de qualquer outra instrução de eficiência ou de
autonomia: **não assumir nada**. Perguntar.

Quem fala com o cliente é o Gonçalo. As ideias, as decisões de desenho, a
escolha das fotografias e o que o cliente quis dizer com cada comentário
são dele — não são para inferir a partir de um documento. Um plano escrito
em `docs/` é o registo de uma conversa, não uma autorização para executar.

Isto vale mesmo quando:

- o documento parece completo e não ambíguo;
- a resposta parece óbvia;
- adiantar trabalho pareceria útil;
- já se percebeu o padrão dos tópicos anteriores.

A excepção, e só ela: quando o Gonçalo disser **"assume"**. Enquanto não
disser, perguntar.

## Um tópico de cada vez

O ciclo é sempre este, por esta ordem:

1. Aparece **um** tópico. Um, não a lista toda.
2. **Fazer as perguntas** sobre esse tópico, antes de escrever código.
3. Ele responde, e fornece as fotografias ou os ficheiros necessários.
4. Só então implementar.
5. Um PR para esse tópico. Ele aprova ou rejeita antes de se avançar.

Não avançar para o tópico seguinte sem ele o trazer.

**Não ir buscar nem produzir imagens por iniciativa própria.** As
fotografias vêm dele. Se um tópico precisa de uma imagem que não existe,
dizer isso e esperar — não recortar, não gerar, não escolher da pasta o que
parece servir.

## Porque é que isto está escrito aqui

Numa primeira ronda foram executados oito tópicos de uma vez, a partir do
`docs/PROXIMAS-MELHORIAS.md`, com todas as decisões por conta própria:
onde ficava o mascote, que fotografias usar, o que "menos animação"
significava em números. Seis PRs. Um foi aproveitado.

O trabalho não estava mal feito — estava feito sem ele. O custo de
perguntar primeiro é uma mensagem; o custo de assumir foi cinco PRs
deitados fora.
