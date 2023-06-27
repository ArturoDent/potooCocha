/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

		"Argentina": 89, "Aruba": 54, "Bolivia": 80, "Brazil": 96, "Chile": 70,
  "Colombia": 94, "Curaçao": 51, "Ecuador": 94, "French Guiana": 85,
  "Guyana": 81, "Paraguay": 72, "Peru": 91, "Suriname": 83, "Trinidad": 73,
  "Uruguay": 75, "Venezuela": 91, "Bonaire": 48, "Falklands": 51, "South America": 107
};

var numSpeciesList = {

		"Argentina": 1042, "Aruba": 245, "Bolivia": 1402, "Brazil": 1857, "Chile": 525,
  "Colombia": 1865, "Curaçao": 217, "Ecuador": 1657, "French Guiana": 699,
  "Guyana": 786, "Paraguay": 694, "Peru": 1859, "Suriname": 741, "Trinidad": 488,
  "Uruguay": 501, "Venezuela": 1402, "Bonaire": 208, "Falklands": 218, "South America": 3468
};

// numSpecies does not include hypotheticals, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class="fco">(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html