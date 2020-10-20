/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

var numFamiliesList = {

		"Argentina": 88, "Aruba": 54, "Bolivia": 80, "Brazil": 95, "Chile": 68,
		"Colombia": 94, "Curaçao": 51, "Ecuador": 94, "French Guiana": 85,
		"Guyana": 81, "Paraguay": 72, "Peru": 91, "Suriname": 83, "Trinidad": 73,
		"Uruguay": 73, "Venezuela": 91, "Bonaire": 48, "Falklands": 49, "South America": 106
};

var numSpeciesList = {

		"Argentina": 1024, "Aruba": 245, "Bolivia": 1399, "Brazil": 1823, "Chile": 506,
		"Colombia": 1851, "Curaçao": 217, "Ecuador": 1639, "French Guiana": 698,
		"Guyana": 784, "Paraguay": 694, "Peru": 1828, "Suriname": 733, "Trinidad": 485,
		"Uruguay": 484, "Venezuela": 1398, "Bonaire": 208, "Falklands": 227, "South America": 3431
};

// numSpecies does not include hypotheticals, from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include 'Incertae Sedis'

// South America : 105 families not including 1 Incertae Sedis 'family', 3413 total spp.
// class='fco'>(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ...SACC.html