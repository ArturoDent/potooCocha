/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

  "Argentina": 87, "Aruba": 52, "Bolivia": 78, "Brazil": 94, "Chile": 68,
  "Colombia": 93, "Curacao": 51, "Ecuador": 93, "French Guiana": 83,
  "Guyana": 80, "Paraguay": 72, "Peru": 89, "Suriname": 81, "Trinidad": 71,
  "Uruguay": 73, "Venezuela": 90, "Bonaire": 48, "Falklands": 49, "South America": 105
};

var numSpeciesList = {

  "Argentina": 1006, "Aruba": 219, "Bolivia": 1384, "Brazil": 1818, "Chile": 505,
  "Colombia": 1851, "Curacao": 217, "Ecuador": 1635, "French Guiana": 698,
  "Guyana": 784, "Paraguay": 694, "Peru": 1802, "Suriname": 731, "Trinidad": 470,
  "Uruguay": 448, "Venezuela": 1391, "Bonaire": 208, "Falklands": 227, "South America": 3413
};

// numSpecies does not include hypotheticals, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class='fco'>(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html