import type { Dicionario } from "./pt";

/*
  O francês.

  Há uma avaliação francesa citada no `lib/reviews.ts` — "Bon manger frais
  près de la mer" — e não é acaso: o Caminho Português da Costa traz gente
  de França o Verão inteiro.

  "Petiscos" fica, como no inglês. "Chemin de Saint-Jacques" é como o
  Caminho se diz em francês e é assim que quem o anda o procura.
*/
export const fr = {
  meta: {
    titulo: "Taverne en bord de mer à Vila Chã",
    descricao:
      "Taverne à petiscos face à la plage de Vila Chã, Vila do Conde. Fruits de mer frais, terrasse tournée vers l'Atlantique et le Chemin de Saint-Jacques qui passe devant la porte.",
    palavras: [
      "restaurant Vila Chã",
      "fruits de mer Vila do Conde",
      "restaurant bord de mer Porto",
      "Taskuinha",
      "Chemin de Saint-Jacques",
    ],
    ementaTitulo: "Carte",
    ementaDescricao:
      "Entrées, snacks, sandwichs et tartines de la Taskuinha do Pirata, à Vila Chã, avec la carte des bières, des vins et du bar.",
    ogAlt: "Taskuinha do Pirata, taverne en bord de mer à Vila Chã",
  },

  geral: {
    reservar: "Réserver une table",
    verEmenta: "Voir la carte",
    comoChegar: "S'y rendre",
    saltar: "Aller au contenu",
  },

  nav: {
    principal: "Navigation principale",
    rodape: "Navigation du pied de page",
    inicio: "Taskuinha do Pirata, aller à la page d'accueil",
    abrir: "Ouvrir le menu",
    fechar: "Fermer le menu",
    casa: "La maison",
    petiscos: "Petiscos",
    sitio: "Le lieu",
    ementa: "Carte",
    encontrar: "Nous trouver",
  },

  linguas: {
    escolher: "Choisir la langue",
    actual: "Langue utilisée",
  },

  hero: {
    titulo: "La mer est à vingt pas.",
    frase:
      "Taverne à petiscos à Vila Chã. Fruits de mer frais, terrasse tranquille, et le verre peut vous accompagner jusqu'au sable.",
  },

  casa: {
    titulo: "La maison",
    p1: "On l'appelle le Pirate. Le surnom a pris et il est resté, comme tout prend dans un petit village.",
    p2: "La Taskuinha est une taverne de pêcheurs sur l'Avenida dos Banhos, la mer de l'autre côté de la route. On y sert des petiscos, pas des plats de prestige : palourdes, calmars, beignets de morue, et pouces-pieds quand la mer laisse les cueillir.",
    p3: "Il y a une terrasse à l'arrière pour qui cherche le calme, et le comptoir pour qui ne le cherche pas. Le verre peut sortir par la porte et aller voir le coucher de soleil avec vous.",
  },

  petiscos: {
    titulo: "Ce qui sort le plus de la cuisine",
    frase:
      "Ce sont les plats qui reviennent le plus dans les avis de ceux qui sont passés ici.",
  },

  galeria: {
    titulo: "Le lieu",
    frase:
      "Vila Chã est un village de pêcheurs. Les passerelles en bois suivent la côte dans les deux sens et le Chemin de Saint-Jacques passe devant la porte, tous les jours, sous les pieds de quelqu'un.",
  },

  vozes: {
    titulo: "Ce qu'on en dit",
    frase:
      "Les avis arrivent en plusieurs langues, ce qui a du sens dans une maison où il y a toujours quelqu'un en route vers Saint-Jacques.",
    traduzido: {
      pt: "Traduit du portugais",
      en: "Traduit de l'anglais",
      fr: "Traduit du français",
      es: "Traduit de l'espagnol",
    },
  },

  encontrar: {
    titulo: "Nous trouver",
    horario: "Horaires",
    folga: "Fermé",
    aviso:
      "Le week-end, la maison se remplit. Mieux vaut téléphoner avant de venir.",
    mapa: "Carte indiquant la Taskuinha sur l'Avenida dos Banhos, à Vila Chã",
  },

  dias: {
    segunda: "Lundi",
    terca: "Mardi",
    quarta: "Mercredi",
    quinta: "Jeudi",
    sexta: "Vendredi",
    sabado: "Samedi",
    domingo: "Dimanche",
  },


  rodape: {
    peregrinos:
      "Le Chemin de Saint-Jacques passe devant la porte. Les pèlerins sont les bienvenus, avec ou sans réservation.",
    creditos: "Site par",
  },

  ementa: {
    titulo: "Carte",
    frase:
      "Maison de petiscos, pas de plats de prestige. Ce qu'il y a aujourd'hui dépend de ce que la mer a donné le matin.",
    categorias: "Catégories de la carte",
    alergias:
      "Si vous avez des allergies ou des intolérances, dites-le à table avant de commander. Presque tout passe par les fruits de mer.",
  },

  erro: {
    perdido: {
      codigo: "404",
      titulo: "Cette page n'est pas dans la maison",
      frase:
        "L'adresse que vous avez suivie ne mène nulle part. Cela arrive — la mer emporte des choses.",
      voltar: "Retour à la porte",
    },
    avaria: {
      titulo: "Quelque chose s'est cassé",
      frase:
        "Ce n'est pas de votre faute. Réessayez ; si cela se reproduit, appelez-nous — la table est toujours là.",
      tentar: "Réessayer",
      voltar: "Retour à la porte",
    },
  },
} satisfies Dicionario;
