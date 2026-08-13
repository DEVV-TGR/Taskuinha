/*
  Fonte de verdade do site.
  Os dados de contacto, morada e horário foram recolhidos do Restaurantji,
  Restaurant Guru e GastroRanking em Agosto de 2026. Confirmar com o
  Anselmo antes de publicar.
*/

export const site = {
  name: "Taskuinha",
  fullName: "Taskuinha do Pirata",
  legalName: "Rumoceano - Taskuinha",
  description:
    "Taberna de petiscos em frente à praia de Vila Chã, Vila do Conde. Marisco fresco, esplanada virada ao Atlântico e o Caminho de Santiago a passar à porta.",
  url: "https://taskuinha.pt",

  address: {
    street: "Av. dos Banhos 185",
    postalCode: "4485-691",
    locality: "Vila Chã",
    region: "Vila do Conde",
    country: "PT",
  },

  // Confirmado na OpenStreetMap (Avenida dos Banhos, Vila Chã).
  geo: { latitude: 41.29033, longitude: -8.73272 },

  phone: {
    display: "229 285 079",
    tel: "+351229285079",
  },

  priceRange: "10 a 20 € por pessoa",

  hours: [
    { day: "Segunda", label: "Encerrado", closed: true },
    { day: "Terça", label: "10h00 às 23h00", closed: false },
    { day: "Quarta", label: "10h00 às 23h00", closed: false },
    { day: "Quinta", label: "10h00 às 23h00", closed: false },
    { day: "Sexta", label: "10h00 às 23h00", closed: false },
    { day: "Sábado", label: "10h00 às 23h00", closed: false },
    { day: "Domingo", label: "10h00 às 20h00", closed: false },
  ],

  // Formato schema.org, para o JSON-LD.
  openingHoursSpec: [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "23:00" },
    { days: ["Sunday"], opens: "10:00", closes: "20:00" },
  ],

  links: {
    instagram: "https://www.instagram.com/taskuinhadopirata/",
    facebook: "https://www.facebook.com/pages/Taskuinha/641723082553326",
    tripadvisor:
      "https://www.tripadvisor.pt/Restaurant_Review-g189186-d6874259-Reviews-Rumoceano_Taskuinha-Vila_do_Conde_Porto_District_Northern_Portugal.html",
    restaurantGuru: "https://pt.restaurantguru.com/Taskuinha-Vila-Cha",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=41.29033,-8.73272&destination_place_id=Taskuinha+Vila+Ch%C3%A3",
  },
} as const;

export const mapEmbedUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=-8.7407%2C41.2856%2C-8.7247%2C41.2951&layer=mapnik&marker=41.29033%2C-8.73272";

export function fullAddress() {
  const { street, postalCode, locality, region } = site.address;
  return `${street}, ${postalCode} ${locality}, ${region}`;
}
