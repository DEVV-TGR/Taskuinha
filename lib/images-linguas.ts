import type { Locale } from "@/lib/i18n";
import { photos, type Photo } from "@/lib/images";

/*
  Os textos alternativos das fotografias, nas outras três línguas.

  ## Porquê traduzir isto

  É a parte do site que ninguém vê e a única que algumas pessoas leem. Um
  leitor de ecrã configurado em francês, a ler uma descrição portuguesa,
  não lê francês com sotaque — lê palavra a palavra, sem sentido nenhum. Se
  o resto da página está traduzido e o `alt` não está, a tradução pára
  exactamente onde mais falta faz.

  São as descrições mais compridas do site, e é de propósito: dizem o que
  está na fotografia a quem não a pode ver. As traduções seguem-nas ao
  detalhe em vez de as resumirem.

  ## As quatro vazias

  `esqueletoRecorte`, `tronco`, `portaEsquerda` e `portaDireita` têm `alt`
  vazio no `lib/images.ts` e continuam vazias aqui. São decoração — o
  esqueleto recortado, a trave, as folhas do portão — e um `alt` descritivo
  numa imagem decorativa é ruído para quem ouve a página. A chave fica na
  mesma, com `""`, para o `Record` continuar a obrigar às 36.
*/

type ChaveFoto = keyof typeof photos;

const en: Record<ChaveFoto, string> = {
  fachadaNoite:
    "The front of the Taskuinha at night: the letters PIRATA lit up along the eaves, six barrels hanging beneath them, the door open and spilling light onto the pavement, and the pirate skeleton sitting to the right with a bottle in its hand.",
  fachadaNoite2:
    "The same front on another night, seen head on: the barrels, the two wooden ship's wheels, the lanterns lit and the entrance corridor painted with a harbour of boats.",
  fachadaPorDoSol:
    "The front in the late afternoon, with the low sun setting the tiled roof alight. You can read the wooden sign above the door, the handwritten opening hours and the menu written on wooden slats beside the entrance.",
  esqueleto:
    "The pirate skeleton that greets you at the door, sitting on a treasure chest: a red bandana on its head, an eye patch, a ragged coat and a bottle raised to its mouth.",
  esqueletoCorpo:
    "The pirate skeleton at full length, with the handwritten menu on wooden slats behind it and the board of biker club stickers at its side.",
  esqueletoRecorte: "",
  tronco: "",
  portaEsquerda: "",
  portaDireita: "",
  bandeiraCaveira:
    "The black flag of the house hanging from the turquoise ceiling: a skull in a bicorne hat, crossed sabres below it and a small skull on the brim of the hat.",
  lemeTaskuinha:
    "The table call button shaped like a ship's wheel, hand-painted in red with the name of the house — the N reversed, as on the sign at the door.",
  tectoNau:
    "The ceiling painted with a sailing ship on a rough sea, and below it the wall covered with model boats, nets, sailors' caps and old advertising signs.",
  tectoNauAranha:
    "The ship mural on the ceiling with a hairy spider hanging halfway down, above the counter loaded with hats, diving masks and wooden boats.",
  salaCheia:
    "The room full on a dinner night, with football club scarves hanging from the wooden ceiling, paper lanterns, lifebuoys and tables of green, yellow and orange chairs.",
  balcaoBandeirinhas:
    "The counter seen from below, with the string of country bunting strung across above it — Brazil, Spain, Germany, Ghana, Argentina, Costa Rica, Cameroon, Chile, Australia and South Korea — under the turquoise plank ceiling.",
  balcaoEspingardas:
    "Two old muskets crossed with oars above the counter, among fishing nets, white lanterns, scallop shells and a row of wooden boats.",
  salaEstatuas:
    "The corner of life-size pirates, with a chest overflowing with necklaces and coins, cannonballs stacked up and the Captain Morgan sign on the wooden wall.",
  esplanada:
    "The terrace, with its fence of planks painted every colour, a rescue board from the I.S.N. hanging up, lifebuoys, oars and a rusted bicycle leaning at the far end.",
  esplanada2:
    "Wooden-topped tables and red chairs on the artificial grass of the terrace, facing the fence of coloured planks with the I.S.N. board and two lifebuoys.",
  marPorDoSol:
    "The sun going down over the Atlantic at low tide, seen from the low wall along the seafront, with the rocks uncovered and the sky streaked with high cloud.",
  marCao:
    "A man sitting on the seafront wall with his dog beside him, the two of them watching the sun set over the sea.",
  petiscoAmeijoas:
    "A dish of clams opened in olive oil and oregano, with half a lemon in the middle and a plate of bread beside it.",
  petiscoLapas:
    "Limpets grilled with garlic and coriander, each one in its shell, served on slices of toasted bread in an iron pan.",
  petiscoLulas:
    "Squid grilled with garlic and pepper on a serving dish, with chips at the side.",
  petiscoSardinhas:
    "Two grilled sardines lying on a wide slice of toasted bread, on a white plate, in front of the charcoal grill still burning.",
  petiscoPercebes:
    "A plate of boiled goose barnacles and a velvet crab, on a table on the terrace, with a mug of beer and the house menu beside it.",
  petiscoNavalheira:
    "A velvet crab boiled whole, red-shelled with its claws open, on a china plate on the wooden table, with a metal cracker set down behind it.",
  petiscoBacalhauBras:
    "Bacalhau à Brás in a white dish: straw potatoes, flakes of salt cod, onion, chopped parsley, strips of red pepper and black olives on top.",
  percebesCrus:
    "Goose barnacles just picked, their nails still shut and bits of seaweed on them, in a basin.",
  lapasCruas:
    "Raw limpets laid out on a red board, taken off the rock that morning, with strands of seaweed between the shells.",
  nauCruz:
    "An old illustration of a Portuguese carrack with square sails bearing the Cross of Christ.",
  nauArmada:
    "An illustration of a carrack from the Portuguese fleets of the sixteenth century.",
  nausFrota: "An illustration of a fleet of sailing carracks on the open sea.",
  caveiraMadeira:
    "A pirate skull carved in wood, with a bicorne hat, an eye patch and crossed sabres behind it, on a black background.",
  caveiraLenco:
    "A pirate skull with a bandana on its head, cut out on a plain background.",
  caveiraMesa: "A decorative skull seen head on, cut out on a plain background.",
};

const fr: Record<ChaveFoto, string> = {
  fachadaNoite:
    "La façade de la Taskuinha la nuit : les lettres PIRATA éclairées le long de l'avant-toit, six tonneaux suspendus en dessous, la porte ouverte qui déverse sa lumière sur le trottoir et le squelette de pirate assis à droite, une bouteille à la main.",
  fachadaNoite2:
    "La même façade un autre soir, vue de face : les tonneaux, les deux barres à roue en bois, les lanternes allumées et le couloir d'entrée peint d'un quai de bateaux.",
  fachadaPorDoSol:
    "La façade en fin d'après-midi, le soleil rasant embrasant le toit de tuiles. On lit l'enseigne en bois au-dessus de la porte, l'affiche manuscrite des horaires et la carte écrite sur des lattes de bois à côté de l'entrée.",
  esqueleto:
    "Le squelette de pirate qui accueille à la porte, assis sur un coffre au trésor : foulard rouge sur la tête, cache-œil, veste en lambeaux et une bouteille portée à la bouche.",
  esqueletoCorpo:
    "Le squelette de pirate en pied, avec la carte manuscrite sur des lattes de bois derrière lui et le panneau d'autocollants de clubs de motards à côté.",
  esqueletoRecorte: "",
  tronco: "",
  portaEsquerda: "",
  portaDireita: "",
  bandeiraCaveira:
    "Le pavillon noir de la maison suspendu au plafond turquoise : crâne au bicorne, sabres croisés en dessous et un petit crâne sur le bord du chapeau.",
  lemeTaskuinha:
    "La sonnette de table en forme de barre à roue, peinte à la main en rouge au nom de la maison — le N à l'envers, comme sur l'enseigne de la porte.",
  tectoNau:
    "Le plafond peint d'un navire à voiles sur une mer démontée, et en dessous le mur couvert de bateaux miniatures, de filets, de bonnets de marin et de vieilles réclames.",
  tectoNauAranha:
    "La fresque du navire au plafond avec une araignée velue suspendue à mi-hauteur, au-dessus du comptoir chargé de chapeaux, de masques de plongée et de bateaux en bois.",
  salaCheia:
    "La salle pleine un soir de dîner, avec des écharpes de clubs de football suspendues au plafond en bois, des lanternes en papier, des bouées de sauvetage et des tables aux chaises vertes, jaunes et orange.",
  balcaoBandeirinhas:
    "Le comptoir vu d'en bas, avec la guirlande de fanions de pays tendue au-dessus — Brésil, Espagne, Allemagne, Ghana, Argentine, Costa Rica, Cameroun, Chili, Australie et Corée du Sud — sous le plafond de planches turquoise.",
  balcaoEspingardas:
    "Deux vieux fusils croisés avec des rames au-dessus du comptoir, parmi des filets de pêche, des lanternes blanches, des coquilles Saint-Jacques et une rangée de bateaux en bois.",
  salaEstatuas:
    "Le coin des pirates grandeur nature, avec un coffre débordant de colliers et de pièces, des boulets de canon empilés et la réclame Captain Morgan sur le mur en bois.",
  esplanada:
    "La terrasse, avec sa palissade de planches peintes de toutes les couleurs, une planche de sauvetage de l'I.S.N. accrochée, des bouées, des rames et un vélo rouillé appuyé au fond.",
  esplanada2:
    "Des tables au plateau de bois et des chaises rouges sur le gazon synthétique de la terrasse, face à la palissade de planches colorées avec la planche de l'I.S.N. et deux bouées de sauvetage.",
  marPorDoSol:
    "Le soleil descendant sur l'Atlantique à marée basse, vu du muret du front de mer, les rochers découverts et le ciel strié de nuages hauts.",
  marCao:
    "Un homme assis sur le muret du front de mer avec son chien à côté, tous deux regardant le soleil se coucher sur la mer.",
  petiscoAmeijoas:
    "Un plat de palourdes ouvertes à l'huile d'olive et à l'origan, avec un demi-citron au milieu et une assiette de pain à côté.",
  petiscoLapas:
    "Des patelles grillées à l'ail et à la coriandre, chacune dans sa coquille, servies sur des tranches de pain grillé dans une poêle en fonte.",
  petiscoLulas:
    "Des calmars grillés à l'ail et au poivre dans un plat, avec des frites à côté.",
  petiscoSardinhas:
    "Deux sardines grillées posées sur une large tranche de pain grillé, dans une assiette blanche, devant le gril à charbon encore allumé.",
  petiscoPercebes:
    "Une assiette de pouces-pieds cuits et une étrille, sur une table de la terrasse, avec une chope de bière et la carte de la maison à côté.",
  petiscoNavalheira:
    "Une étrille cuite entière, carapace rouge et pinces ouvertes, dans une assiette en faïence sur la table en bois, avec un casse-noix en métal posé derrière.",
  petiscoBacalhauBras:
    "Bacalhau à Brás dans un plat blanc : pommes paille, effilochée de morue, oignon, persil haché, lanières de poivron rouge et olives noires sur le dessus.",
  percebesCrus:
    "Des pouces-pieds tout juste cueillis, les ongles encore fermés et des restes d'algues, dans une bassine.",
  lapasCruas:
    "Des patelles crues disposées sur une planche rouge, détachées du rocher le matin même, avec des filaments d'algue entre les coquilles.",
  nauCruz:
    "Illustration ancienne d'une caraque portugaise aux voiles carrées portant la croix du Christ.",
  nauArmada:
    "Illustration d'une caraque des armadas portugaises du XVIe siècle.",
  nausFrota: "Illustration d'une flotte de caraques à voiles en haute mer.",
  caveiraMadeira:
    "Crâne de pirate sculpté dans le bois, avec bicorne, cache-œil et sabres croisés derrière, sur fond noir.",
  caveiraLenco:
    "Crâne de pirate avec un foulard sur la tête, détouré sur fond uni.",
  caveiraMesa: "Crâne décoratif vu de face, détouré sur fond uni.",
};

const es: Record<ChaveFoto, string> = {
  fachadaNoite:
    "La fachada de la Taskuinha de noche: las letras PIRATA iluminadas a lo largo del alero, seis barriles colgados debajo, la puerta abierta derramando luz sobre la acera y el esqueleto pirata sentado a la derecha con una botella en la mano.",
  fachadaNoite2:
    "La misma fachada otra noche, vista de frente: los barriles, los dos timones de madera, los faroles encendidos y el pasillo de entrada pintado con un muelle de barcos.",
  fachadaPorDoSol:
    "La fachada al final de la tarde, con el sol rasante encendiendo el tejado de teja. Se lee el letrero de madera sobre la puerta, el cartel manuscrito del horario y la carta escrita en listones de madera junto a la entrada.",
  esqueleto:
    "El esqueleto pirata que recibe en la puerta, sentado en un cofre del tesoro: pañuelo rojo en la cabeza, parche en el ojo, casaca hecha jirones y una botella llevada a la boca.",
  esqueletoCorpo:
    "El esqueleto pirata de cuerpo entero, con la carta manuscrita en listones de madera detrás y el tablón de pegatinas de clubes moteros al lado.",
  esqueletoRecorte: "",
  tronco: "",
  portaEsquerda: "",
  portaDireita: "",
  bandeiraCaveira:
    "La bandera negra de la casa colgada del techo turquesa: calavera con bicornio, sables cruzados debajo y una calavera pequeña en el ala del sombrero.",
  lemeTaskuinha:
    "El mando de mesa con forma de timón de barco, pintado a mano en rojo con el nombre de la casa — la N al revés, como en el letrero de la puerta.",
  tectoNau:
    "El techo pintado con una nao a vela en mar bravo, y debajo la pared cubierta de barcos en miniatura, redes, gorros de marinero y anuncios antiguos.",
  tectoNauAranha:
    "El mural de la nao en el techo con una araña peluda colgando a media altura, sobre la barra cargada de sombreros, máscaras de buceo y barcos de madera.",
  salaCheia:
    "La sala llena una noche de cena, con bufandas de clubes de fútbol colgadas del techo de madera, farolillos de papel, salvavidas y mesas de sillas verdes, amarillas y naranjas.",
  balcaoBandeirinhas:
    "La barra vista desde abajo, con la ristra de banderines de países cruzada por encima — Brasil, España, Alemania, Ghana, Argentina, Costa Rica, Camerún, Chile, Australia y Corea del Sur — bajo el techo de tablas turquesa.",
  balcaoEspingardas:
    "Dos escopetas antiguas cruzadas con remos sobre la barra, entre redes de pesca, faroles blancos, conchas de vieira y una fila de barcos de madera.",
  salaEstatuas:
    "El rincón de los piratas a tamaño real, con un cofre rebosante de collares y monedas, balas de cañón apiladas y el anuncio de Captain Morgan en la pared de madera.",
  esplanada:
    "La terraza, con la valla de tablas pintadas de todos los colores, una tabla de salvamento del I.S.N. colgada, salvavidas, remos y una bicicleta oxidada apoyada al fondo.",
  esplanada2:
    "Mesas de tablero de madera y sillas rojas sobre el césped artificial de la terraza, frente a la valla de tablas de colores con la tabla del I.S.N. y dos salvavidas.",
  marPorDoSol:
    "El sol bajando sobre el Atlántico con la marea baja, visto desde el murete del paseo marítimo, con las rocas al descubierto y el cielo rayado de nubes altas.",
  marCao:
    "Un hombre sentado en el murete del paseo marítimo con el perro al lado, los dos viendo ponerse el sol en el mar.",
  petiscoAmeijoas:
    "Una fuente de almejas abiertas en aceite de oliva y orégano, con medio limón en el centro y un plato de pan al lado.",
  petiscoLapas:
    "Lapas a la plancha con ajo y cilantro, cada una en su concha, servidas sobre rebanadas de pan tostado en una sartén de hierro.",
  petiscoLulas:
    "Calamares a la plancha con ajo y pimienta en una fuente, con patatas fritas al lado.",
  petiscoSardinhas:
    "Dos sardinas asadas sobre una rebanada ancha de pan tostado, en un plato blanco, delante de la parrilla de carbón todavía encendida.",
  petiscoPercebes:
    "Un plato de percebes cocidos y una nécora, en la mesa de la terraza, con una jarra de cerveza y la carta de la casa al lado.",
  petiscoNavalheira:
    "Una nécora cocida entera, de caparazón rojo y pinzas abiertas, en un plato de loza sobre la mesa de madera, con un cascanueces de metal posado detrás.",
  petiscoBacalhauBras:
    "Bacalhau à Brás en una fuente blanca: patatas paja, lascas de bacalao, cebolla, perejil picado, tiras de pimiento rojo y aceitunas negras por encima.",
  percebesCrus:
    "Percebes recién cogidos, con las uñas aún cerradas y restos de alga, en un barreño.",
  lapasCruas:
    "Lapas crudas dispuestas en una tabla roja, sacadas de la roca esa mañana, con hebras de alga entre las conchas.",
  nauCruz:
    "Ilustración antigua de una nao portuguesa de velas cuadradas con la cruz de Cristo.",
  nauArmada:
    "Ilustración de una nao de las armadas portuguesas del siglo XVI.",
  nausFrota: "Ilustración de una flota de naos a vela en alta mar.",
  caveiraMadeira:
    "Calavera pirata tallada en madera, con bicornio, parche en el ojo y sables cruzados detrás, sobre fondo negro.",
  caveiraLenco:
    "Calavera pirata con pañuelo en la cabeza, recortada sobre fondo liso.",
  caveiraMesa: "Calavera decorativa vista de frente, recortada sobre fondo liso.",
};

const traducoes = { en, fr, es };

/*
  Da fotografia para a chave, pelo `src`.

  Quem tem uma `Photo` na mão — o `Petiscos.tsx`, que a recebe dentro de um
  destaque — não tem a chave com que ela foi declarada. O `src` é único e
  serve de identidade. O mapa constrói-se do próprio `photos`, por isso não
  há como ficar dessincronizado.
*/
const porSrc = new Map(
  (Object.entries(photos) as [ChaveFoto, Photo][]).map(([chave, foto]) => [
    foto.src,
    chave,
  ]),
);

/** Todas as fotografias, com o `alt` na língua da página. */
export function fotosEm(lang: Locale): Record<ChaveFoto, Photo> {
  if (lang === "pt") return photos;
  const t = traducoes[lang];

  return Object.fromEntries(
    (Object.entries(photos) as [ChaveFoto, Photo][]).map(([chave, foto]) => [
      chave,
      { ...foto, alt: t[chave] },
    ]),
  ) as Record<ChaveFoto, Photo>;
}

/** Uma fotografia solta, com o `alt` na língua da página. */
export function fotoEm(lang: Locale, foto: Photo): Photo {
  if (lang === "pt") return foto;
  const chave = porSrc.get(foto.src);
  return chave ? { ...foto, alt: traducoes[lang][chave] } : foto;
}
