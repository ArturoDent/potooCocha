// "use strict";
 
var results = "";
  
var json2html = {	"V": "va", "IN": "intr", "U": "u", "NB": "nb", "X(e)": "endemic",
  "EX(e)": "extinct", "EX": "extinct", "X": ""  };

//  ------------------------------------------------------------------------------------------------------------  //

// eslint-disable-next-line no-unused-vars
function searchRegexTree(families, query, country, modifyBoolean) {
  

  if (modifyBoolean) query = modifyQuery(query);

  if (query) return searchAllQuery(families, query, country);     // Any country, any regex query
  else return null;
}

// ------------------------------------------------------------------------------------------------------ //

// eslint-disable-next-line no-unused-vars
function searchExtinctOrEndemicSAM(families, special) {
  
  //  country === "SAM"
  var numSpecies = 0;
  results = "";
  var familyAdded;
  
  for (var family of families) {

    familyAdded = false;
    
    for (var genus of family.genera) {
      
      var SAMbirdsExtinct_Endemic = genus.spp.filter(function(bird) {
        
        var birdOccurrenceArray = Object.values(bird);
        if (special === "EX") {
          return birdOccurrenceArray.includes("EX") || birdOccurrenceArray.includes("EX(e)");
          // "extinct" : "EX" or "EX(e)"
        }
        else return birdOccurrenceArray.includes(special);  // endemic = "X(e)"
      });
      
      SAMbirdsExtinct_Endemic.forEach(function (bird) {
        if (!familyAdded) {
          results += buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
          familyAdded = true;
        }
        results += buildBird({ index: bird.index, special: json2html[bird["SAM"]], name: bird.name, genus: genus.Genus, spp: bird.species });
        numSpecies++;
      });
    }
  }
  return { numSpecies: numSpecies, list: results };
}

// {
//   "species": "pentlandii",
//   "index": 35,
//   "name": "Andean Tinamou",
//   "AR": "X",
//   "BO": "X",
//   "CL": "EX",
//   "EC": "X",
//   "PE": "X"
// },
// {
//   "species": "mitu",
//   "index": 139,
//   "name": "Alagoas Curassow",
//   "BR": "EX(e)"
// },
// {
//   "species": "perdicaria",
//   "index": 33,
//   "name": "Chilean Tinamou",
//   "CL": "X(e)"
// },

/* <li class="family"><span class="fco">TINAMOUS</span><span class="fsc">TINAMIDAE</span></li> */
/* <li data-i="35" class="bird"><span class="extinct">Andean Tinamou</span><span>Nothoprocta pentlandii</span></li> */

/* <li class="family"><span class="fco">TINAMOUS</span><span class="fsc">TINAMIDAE</span></li> */
/* <li data-i="13" class="bird"><span class="endemic">Tepui Tinamou</span><span>Crypturellus ptaritepui</span></li> */

// ------------------------------------------------------------------------------------------------------ //

// var addFamily = buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
function buildFamily(f) {
  
  var elem = "<li class=\"family\"><span class=\"fco\">";
  elem += f.FamilyCommon + "</span>";
  elem += "<span class=\"fsc\">" + f.FamilyScientific + "</span></li>";
  return elem;
}

// var addBird = buildBird({ index: bird.index, special: special, name: bird.name, genus: genus, spp: bird.species });
function buildBird(b) {
  
  var elem = "<li data-i=\"" + b.index + "\" class=\"bird\">";
  
  if (b.special) elem += "<span class=\"" + b.special + "\">";
  else elem += "<span>";
  
  elem += b.name + "</span>";
  elem += "<span>" + b.genus + " " + b.spp + "</span></li>";
  return elem;
}

// ------------------------------------------------------------------------------------------------------ //

function searchAllQuery(families, query, country) {
  
  var regex = RegExp(query, "i");
  
  var numFamilies = [];
  var familyAdded;
  results = "";
  var numSpecies = 0;

  families.forEach(function(family) {    // forEach is okay, there will be no `break`s
  
    familyAdded = false;
  
    if (regex.test(family.Family) || regex.test(family.FamilyCommon)) {
      results += buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
      familyAdded = true;
      numFamilies.push(family.Family);
    }
  
    family.genera.forEach(function (genus) {
    
      genus.spp.forEach(function (bird) {
      
        if (regex.test(genus.Genus.concat(" ", bird.species)) || regex.test(bird.name)) {
        
          if (!familyAdded) {
            results += buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
            familyAdded = true;
            numFamilies.push(family.Family);
          }
          results += buildBird({ index: bird.index, special: json2html[bird[country]], name: bird.name, genus: genus.Genus, spp: bird.species });
          numSpecies++;
        }
      });
    });
  });
  
  if (numFamilies.length === 1 && !numSpecies) {
    // console.log("numSpecies = " + numSpecies);
    // results = {$results, numSpecies}
    var birdsInFamily = getAllSpeciesFromOneFamily(results, numFamilies[0], country);
    results = birdsInFamily.$results;
    numSpecies = birdsInFamily.numSpecies;
  }
  // return numSpecies;
  return { numSpecies: numSpecies, list: results };
}

/* <li class="family"><span class="fco">FINCHES</span><span class="fsc">FRINGILLIDAE</span></li> */

  // <li data-i="817" class="bird"><span class="va">Cape Petrel</span><span>Daption capense</span></li>
  // <li data-i="693" class="bird"><span class="hy">Puna Snipe</span><span>Gallinago andina</span></li>
  // <li data-i="628" class="bird"><span class="extinct">American Coot</span><span>Fulica americana</span></li>
  // <li data-i="733" class="bird"><span class="endemic">Lava Gull</span><span>Leucophaeus fuliginosus</span></li>
  
  // <li data-i="510" class="bird"><span>Western Emerald</span><span>Chlorostilbon melanorhynchus</span></li>
  // <li data-i="2793" class="bird"><span class="intr">House Sparrow</span><span>Passer domesticus</span></li>
  // <li data-i="160" class="bird"><span class="nb">Chilean Flamingo</span><span>Phoenicopterus chilensis</span></li>
  
// ------------------------------------------------------------------------------------------------------ //

// for countries (not SAM): unconfirmed, vagrant, extinct and endemic

// eslint-disable-next-line no-unused-vars
function searchCountrySpecials(families, special, country) {
  
  var numSpecies = 0;
  results = "";
  var familyAdded;
  
  for (var family of families) {

    familyAdded = false;
    
    for (var genus of family.genera)  {
      
      var birdsWithSpecial = genus.spp.filter(function(bird) {    // single country, not SAM
        return (bird[country] === special);
      });

      if (birdsWithSpecial.length) {
      
        if (!familyAdded) {
          results += buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
          familyAdded = true;
        }
      
        birdsWithSpecial.forEach(function(bird) {
          results += buildBird({ index: bird.index, special: json2html[bird[country]], name: bird.name, genus: genus.Genus, spp: bird.species });
          numSpecies++;
        });
      }
    }
  }
  // return numSpecies;
  return { numSpecies: numSpecies, list: results };
}
  // <li class="family"><span class="fco">SHEARWATERS</span><span class="fsc">PROCELLARIIDAE</span></li>
  
  // <li data-i="817" class="bird"><span class="va">Cape Petrel</span><span>Daption capense</span></li>
  // <li data-i="693" class="bird"><span class="hy">Puna Snipe</span><span>Gallinago andina</span></li>
  // <li data-i="628" class="bird"><span class="extinct">American Coot</span><span>Fulica americana</span></li>
  // <li data-i="733" class="bird"><span class="endemic">Lava Gull</span><span>Leucophaeus fuliginosus</span></li>
  
// ------------------------------------------------------------------------------------------------------ //

function getAllSpeciesFromOneFamily($results, thisFamily, country) {
  
  var numSpecies = 0;
  results = "";
  var regex = new RegExp(thisFamily);

  for (var family of families) {  //  there will be a`break` after finding the one family

    if (!(regex.test(family.Family))) continue;  // no match, goto next family in loop
    
    family.genera.forEach(function (genus) {
    
      genus.spp.forEach(function (bird) {
      
        $results += buildBird({ index: bird.index, special: json2html[bird[country]], name: bird.name, genus: genus.Genus, spp: bird.species });
        numSpecies++;
      });
    });
    break;  // if got to here, must have matched family so go no further
  }
  return { numSpecies: numSpecies, $results: $results };
}

// console.log(`\n${family.Family} : ${family.genera.length} genera`);  // to print familes : genera and how many
// family.genera.forEach(function (genus) {
//  console.log(`\t${genus.Genus} : ${genus.spp.length} spp.`);