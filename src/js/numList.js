/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

  "Argentina": 87, "Aruba": 52, "Bolivia": 79, "Brazil": 95, "Chile": 68,
  "Colombia": 94, "Curacao": 51, "Ecuador": 94, "French Guiana": 84,
  "Guyana": 81, "Paraguay": 72, "Peru": 90, "Suriname": 82, "Trinidad": 71,
  "Uruguay": 73, "Venezuela": 91, "Bonaire": 48, "Falklands": 49, "South America": 106
};

var numSpeciesList = {

  "Argentina": 1007, "Aruba": 219, "Bolivia": 1384, "Brazil": 1818, "Chile": 506,
  "Colombia": 1851, "Curacao": 217, "Ecuador": 1634, "French Guiana": 698,
  "Guyana": 784, "Paraguay": 694, "Peru": 1817, "Suriname": 731, "Trinidad": 471,
  "Uruguay": 448, "Venezuela": 1393, "Bonaire": 208, "Falklands": 227, "South America": 3414
};

// numSpecies does not include hypotheticals, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class='fco'>(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html