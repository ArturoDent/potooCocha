/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

		"Argentina": 88, "Aruba": 53, "Bolivia": 81, "Brazil": 95, "Chile": 69,
  "Colombia": 94, "Curaçao": 50, "Ecuador": 93, "French Guiana": 84,
  "Guyana": 83, "Paraguay": 71, "Peru": 90, "Suriname": 82, "Trinidad": 72,
  "Uruguay": 74, "Venezuela": 90, "Bonaire": 47, "Falklands": 51, "South America": 106
};

var numSpeciesList = {

		"Argentina": 1048, "Aruba": 245, "Bolivia": 1410, "Brazil": 1867, "Chile": 526,
  "Colombia": 1915, "Curaçao": 217, "Ecuador": 1683, "French Guiana": 737,
  "Guyana": 828, "Paraguay": 694, "Peru": 1905, "Suriname": 747, "Trinidad": 490,
  "Uruguay": 500, "Venezuela": 1414, "Bonaire": 209, "Falklands": 220, "South America": 3514
};

// numSpecies does not include unconfirmeds, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class="fco">(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html