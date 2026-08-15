import casa from "@/data/casa.json";
import { especificacaoDeHorario, type EntradaDeHorario } from "@/lib/horario";

/*
  Fonte de verdade do site.

  Os dados de contacto, morada e horário começaram por ser recolhidos do
  Restaurantji, do Restaurant Guru e do GastroRanking, em Agosto de 2026, e
  foram depois confirmados com o Anselmo. O que está aqui é o que a casa
  disse, não o que os agregadores dizem dela — quando divergirem, ganha isto.

  ## O que está no `data/casa.json` e o que está aqui

  No JSON, e portanto editável no painel: **telefone, morada, horário e as
  redes sociais.** São as quatro coisas que mudam sem que o site mude, e as
  quatro que o dono sabe de cor melhor do que ninguém.

  Aqui, em código: o nome, a descrição, o endereço do site, as **coordenadas**
  e o mapa. As coordenadas e as duas ligações que as levam lá dentro — o
  `mapEmbedUrl` e o `links.directions` — são três cópias do mesmo par de
  números, e mexer numa sem mexer nas outras deixa o mapa a apontar para o
  sítio errado sem dar um erro. Uma casa não muda de sítio; a rua pode mudar
  de nome. Por isso a morada é editável e o ponto no mapa não é.
*/

const horario = casa.horario as readonly EntradaDeHorario[];

export const site = {
  name: "Taskuinha",
  fullName: "Taskuinha do Pirata",
  legalName: "Rumoceano - Taskuinha",
  description:
    "Taberna de petiscos em frente à praia de Vila Chã, Vila do Conde. Marisco fresco, esplanada virada ao Atlântico e o Caminho de Santiago a passar à porta.",
  /*
    Com `www.`, e não sem: o `taskuinhapirata.pt` responde 308 para o `www`,
    portanto é o `www` que é a morada e não o atalho para ela. Deste valor
    saem o `canonical`, o `og:url`, o `og:image`, o JSON-LD e o sitemap
    inteiro — apontá-lo ao endereço que redirecciona seria mandar toda a
    gente dar uma volta antes de chegar.
  */
  url: "https://www.taskuinhapirata.pt",

  address: {
    street: casa.morada.rua,
    postalCode: casa.morada.codigoPostal,
    locality: casa.morada.localidade,
    region: casa.morada.concelho,
    country: "PT",
  },

  // Confirmado na OpenStreetMap (Avenida dos Banhos, Vila Chã).
  geo: { latitude: 41.29033, longitude: -8.73272 },

  phone: {
    display: casa.telefone.mostrar,
    tel: casa.telefone.tel,
  },

  hours: horario,

  /*
    Formato schema.org, para o JSON-LD. Calculado do `hours` acima e não
    escrito à parte — ver `lib/horario.ts` para a razão.
  */
  openingHoursSpec: especificacaoDeHorario(horario),

  links: {
    instagram: casa.links.instagram,
    facebook: casa.links.facebook,
    tripadvisor: casa.links.tripadvisor,
    restaurantGuru: casa.links.restaurantGuru,
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
