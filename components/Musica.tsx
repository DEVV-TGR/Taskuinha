"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from "@phosphor-icons/react/dist/ssr";

/*
  A faixa da casa.

  ## O formato

  AAC em ADTS cru — 98 kbps, 2,9 MB, três minutos e meio a repetir em ciclo.

  Um aviso a quem passar por aqui e tiver a tentação de mexer: esteve neste
  sítio um AAC dentro de um `.m4a`, feito com o `afconvert` do macOS, e o
  browser recusou-o — `MEDIA_ERR_SRC_NOT_SUPPORTED`, duração `NaN` —, e isto
  **apesar** de o mesmo browser responder `probably` ao
  `canPlayType("audio/mp4; codecs=\"mp4a.40.2\"")` e de o ficheiro estar
  estruturalmente correcto: `ftyp` válido, codec `mp4a`, `esds` presente,
  `moov` à frente do `mdat`, e a descodificar sem queixas no próprio Mac.
  Nunca se chegou à causa. Foi essa recusa que trouxe para cá, durante uns
  tempos, um MP3 de 6,9 MB.

  Este é outro caso: ADTS não tem contentor MP4 pelo meio, e o caminho de
  descodificação no browser é outro. Mas a lição fica — trocar de ficheiro
  **depois** de o ouvir no Chrome e no Safari, nunca antes.

  A extensão também não é decoração. O ficheiro chegou do download chamado
  `.jpeg`, e com esse nome a Vercel servia-o como `image/jpeg` e o browser
  recusava-o sem sequer tentar.

  O peso não pesa: o `preload="none"` faz com que não saia do servidor um
  único byte enquanto ninguém tocar no site, e a partir daí o browser vai
  buscando por pedaços em vez de esperar pelo ficheiro todo.
*/
const FICHEIRO = "/audio/musica.aac";

/* Música de fundo, não concerto. A 1,0 tapava a conversa de quem está a ler a
   ementa em voz alta ao lado. */
const VOLUME = 0.32;

/* A subida do silêncio até ao volume final. Entrar a meio de um compasso já é
   estranho; entrar a meio de um compasso e no volume todo é um susto. */
const SUBIDA_MS = 1400;

/*
  A música de fundo, e o botão para a calar.

  ## Porque é que não começa sozinha

  Não é escolha: o Chrome, o Safari e o Firefox recusam `play()` com som
  enquanto não houver um gesto do visitante na página. O Chrome abre uma
  excepção a quem já visitou o site várias vezes — o que é pior do que não
  abrir nenhuma, porque para quem faz o site funciona sempre e para quem
  chega de novo nunca. No iOS não há excepção de espécie alguma.

  O que se faz então é arrancar no **primeiro gesto, seja ele qual for**: um
  toque, um clique, uma tecla. Ninguém lê uma página sem tocar nela, e a
  `Chegada` já ensina o gesto — as folhas do portão abrem ao primeiro clique.
  Na prática a música entra tão cedo que se confunde com ter começado só.

  ## Calar dura a visita, e não mais do que isso

  Não há nada guardado no browser — nem `localStorage`, nem cookie, nem marca
  nenhuma. Quem desliga fica em silêncio o resto da visita, incluindo ao
  andar entre a inicial e a ementa, porque este componente vive no layout e
  não remonta nas navegações de cliente. Quem recarregar, ou voltar amanhã,
  encontra a música ligada outra vez.

  Houve aqui uma versão que guardava o "não" para sempre, com o argumento de
  que quem cala não quer voltar a calar. O Gonçalo quis o contrário, e tem
  razão pelo menos numa coisa que se viu à custa própria: uma preferência
  guardada é estado invisível, e estado invisível numa página que já depende
  de um gesto do visitante para arrancar dá horas de sintomas que parecem
  bugs e não são.

  ## O botão

  Está sempre à vista, mesmo antes de a música arrancar — e antes mostra o
  altifalante cortado, que é a verdade: ainda não se ouve nada. Carregar nele
  é, ele próprio, um gesto válido, por isso também serve para ligar.
*/
export function Musica({
  texto,
}: {
  texto: { ligar: string; desligar: string };
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [aTocar, setATocar] = useState(false);
  const [calada, setCalada] = useState(false);

  const arrancar = useCallback(() => {
    const audio = audioRef.current;
    /* Já a tocar: o `pointerdown` e o `click` do mesmo dedo chegam os dois
       aqui, e sem esta saída o segundo mandava a subida de volume começar
       outra vez do silêncio a meio da música. */
    if (!audio || !audio.paused) return;

    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setATocar(true);
        try {
          subir(audio);
        } catch {
          /* Rede de segurança: ouvir a música é o que importa, a rampa é
             enfeite. Se ela partir, o volume vai directo ao sítio em vez de
             ficar no zero em que a deixámos. */
          audio.volume = VOLUME;
        }
      })
      .catch(() => {
        /* O browser recusou — quase sempre por ainda não haver gesto que
           conte. Não se diz nada ao visitante: os ouvintes continuam
           montados e o gesto seguinte tenta outra vez. O volume volta ao
           valor final para que essa tentativa não parta do silêncio caso a
           rampa não chegue a correr. */
        audio.volume = VOLUME;
      });
  }, []);

  /*
    Os gestos do visitante, até um deles pegar.

    Os quatro ficam montados e só saem quando a música arranca **mesmo** —
    quem os tira é a limpeza deste efeito, disparada pelo `aTocar` a mudar.
    Registá-los com `once: true` era o erro óbvio e estava errado: o `play()`
    pode falhar — o primeiro clique cair antes de o React hidratar, por
    exemplo, que no `next dev` é meio segundo largo — e um ouvinte de um só
    disparo gasta-se na mesma. A pessoa clicava uma vez, não ouvia nada, e
    não havia segunda oportunidade.

    São quatro e não dois porque os que contam como gesto para o browser não
    são os mesmos em todo o lado: `pointerdown` e `click` no computador,
    `touchend` no iOS — onde o `touchstart` **não** conta —, e o `keydown`
    para quem navega por teclado.
  */
  useEffect(() => {
    if (calada || aTocar) return;

    const eventos = ["pointerdown", "click", "touchend", "keydown"] as const;

    function aoGesto() {
      arrancar();
    }

    for (const evento of eventos) {
      window.addEventListener(evento, aoGesto, { passive: true });
    }

    return () => {
      for (const evento of eventos) {
        window.removeEventListener(evento, aoGesto);
      }
    };
  }, [calada, aTocar, arrancar]);

  function alternar() {
    const audio = audioRef.current;
    if (!audio) return;

    if (aTocar) {
      audio.pause();
      setATocar(false);
      setCalada(true);
      return;
    }

    setCalada(false);
    arrancar();
  }

  return (
    <>
      {/*
        Sem `autoPlay` de propósito — quem manda tocar é o `arrancar()`, e um
        `autoPlay` que o browser vai recusar de qualquer maneira só serviria
        para encher a consola de avisos.
      */}
      <audio ref={audioRef} src={FICHEIRO} loop preload="none" />
      <button
        type="button"
        onClick={alternar}
        aria-pressed={aTocar}
        aria-label={aTocar ? texto.desligar : texto.ligar}
        title={aTocar ? texto.desligar : texto.ligar}
        /* z-[80]: por cima da tralha (60) e do skip link (70), por baixo das
           portadas da travessia (90) — enquanto o portão está fechado não
           tem de se ver. Canto inferior direito, que é o único que está
           livre: a Nav é em cima e o rodapé não tem nada fixo. */
        className="fixed bottom-4 right-4 z-[80] flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] border border-linha bg-breu/85 text-osso-fraco backdrop-blur-md transition-colors hover:border-linha-forte hover:text-lanterna focus-visible:border-lanterna focus-visible:text-lanterna sm:bottom-6 sm:right-6"
      >
        {aTocar ? (
          <SpeakerSimpleHigh aria-hidden size={20} weight="regular" />
        ) : (
          <SpeakerSimpleSlash aria-hidden size={20} weight="regular" />
        )}
      </button>
    </>
  );
}

/*
  Do silêncio até ao `VOLUME`, em rampa. Pára sozinha se entretanto a música
  foi calada — daí o `audio.paused` a cada quadro.

  ## Porque é que a fracção leva um `Math.max(0, …)`

  O carimbo que o `requestAnimationFrame` entrega é o do **início do quadro**,
  e o quadro pode ter começado antes do `performance.now()` desta linha — basta
  o `subir()` ser chamado a meio de um. Nesse caso `agora - inicio` é negativo,
  o volume ia a negativo, e pôr `volume` fora de [0,1] **atira**. A rampa
  morria no primeiro quadro com a excepção engolida pelo `rAF` e a música
  ficava a tocar em volume zero — a soar exactamente a estar avariada.
*/
function subir(audio: HTMLAudioElement) {
  const inicio = performance.now();

  function passo(agora: number) {
    if (audio.paused) return;
    const parte = Math.max(0, Math.min(1, (agora - inicio) / SUBIDA_MS));
    audio.volume = VOLUME * parte;
    if (parte < 1) requestAnimationFrame(passo);
  }

  requestAnimationFrame(passo);
}
