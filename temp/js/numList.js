/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

		"Argentina": 88, "Aruba": 53, "Bolivia": 81, "Brazil": 95, "Chile": 69,
  "Colombia": 94, "Curaçao": 50, "Ecuador": 93, "French Guiana": 84,
  "Guyana": 83, "Paraguay": 71, "Peru": 90, "Suriname": 82, "Trinidad": 72,
  "Uruguay": 74, "Venezuela": 90, "Bonaire": 47, "Falklands": 51, "South America": 106
};

var numSpeciesList = {

		"Argentina": 1047, "Aruba": 245, "Bolivia": 1406, "Brazil": 1861, "Chile": 525,
  "Colombia": 1913, "Curaçao": 217, "Ecuador": 1670, "French Guiana": 737,
  "Guyana": 828, "Paraguay": 694, "Peru": 1890, "Suriname": 746, "Trinidad": 490,
  "Uruguay": 500, "Venezuela": 1413, "Bonaire": 209, "Falklands": 219, "South America": 3499
};

// numSpecies does not include unconfirmeds, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class="fco">(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html