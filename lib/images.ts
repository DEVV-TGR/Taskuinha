/*
  Fotografia de demonstração.

  Nenhuma destas fotos é da Taskuinha. São imagens de licença aberta do
  Unsplash, escolhidas para aproximar o enquadramento certo de cada slot.
  Para publicar, substituir cada `src` pelo caminho local correspondente
  (ver public/images/README.md) e apagar `remotePatterns` do next.config.ts.
*/

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export type Photo = {
  src: string;
  alt: string;
  /** ficheiro local que vai substituir esta imagem */
  slot: string;
  width: number;
  height: number;
};

export const photos = {
  hero: {
    src: u("photo-1599407173228-40e33efaa25c", 2000),
    alt: "O sol a pôr-se sobre o Atlântico, visto da praia.",
    slot: "hero-mar.jpg",
    width: 2000,
    height: 3000,
  },
  casa: {
    src: u("photo-1714733340805-268e89cf861a", 1400),
    alt: "Interior de taberna com paredes de pedra, mesas de madeira e luz quente.",
    slot: "casa-interior.jpg",
    width: 1400,
    height: 933,
  },
  ameijoas: {
    src: u("photo-1710775694428-5f6e66ae6a4c", 1200),
    alt: "Bivalves abertos num prato branco, com pão torrado e limão.",
    slot: "petisco-ameijoas.jpg",
    width: 1200,
    height: 800,
  },
  lulas: {
    src: u("photo-1763467940825-d067fb3baf22", 1200),
    alt: "Travessa de lulas fritas numa mesa de esplanada, com uma caneca de cerveja ao fundo.",
    slot: "petisco-lulas.jpg",
    width: 1200,
    height: 800,
  },
  fritura: {
    src: u("photo-1780823231663-6f08dde9b54c", 1200),
    alt: "Travessa de fritos de mar sobre uma mesa de madeira.",
    slot: "petisco-pataniscas.jpg",
    width: 1200,
    height: 800,
  },
  prego: {
    src: u("photo-1699728088600-6d684acbeada", 1200),
    alt: "Sandes de carne num pão rústico, servida numa tábua de madeira.",
    slot: "petisco-prego.jpg",
    width: 1200,
    height: 800,
  },
  passadico: {
    src: u("photo-1785827981060-30cce0bed874", 1200),
    alt: "Passadiço de madeira a atravessar as dunas em direcção ao mar.",
    slot: "sitio-passadico.jpg",
    width: 1200,
    height: 1600,
  },
  praia: {
    src: u("photo-1716235254942-5dce42e66c4d", 1400),
    alt: "Ondas a chegar à areia numa praia larga do litoral norte.",
    slot: "sitio-praia.jpg",
    width: 1400,
    height: 1867,
  },
  porDoSol: {
    src: u("photo-1784727529054-728034f7e1f5", 1200),
    alt: "Sol a descer sobre o mar, com a povoação junto à costa.",
    slot: "sitio-por-do-sol.jpg",
    width: 1200,
    height: 1600,
  },
  balcao: {
    src: u("photo-1736075006642-1f535cdb5834", 1200),
    alt: "Balcão de bar com bancos altos alinhados.",
    slot: "sitio-balcao.jpg",
    width: 1200,
    height: 800,
  },
} satisfies Record<string, Photo>;
