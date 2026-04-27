// "use strict";
import { taxNodeByKey } from '../taxonomy.js';
import { modifyQuery } from "./search_handleQuery.js";



// let results = "";

var json2html = {
  "V": "va", "IN": "intr", "U": "u", "NB": "nb", "X(e)": "endemic",
  "X(eb)": "endemic-breeder", "EX(e)": "extinct", "EX": "extinct", "X": ""
};

//  ------------------------------------------------------------------------------------------------------------  //

// eslint-disable-next-line no-unused-vars
export function searchRegexTree ( families, query, country, modifyBoolean ) {


  if ( modifyBoolean ) query = modifyQuery( query );

  if ( query ) return searchAllQuery( families, query, country );     // Any country, any regex query
  else return null;
}

// ------------------------------------------------------------------------------------------------------ //

// eslint-disable-next-line no-unused-vars
export function searchExtinctOrEndemicSAM ( families, special ) {

  //  country === "SAM"
  var numSpecies = 0;
  let results = "";
  var familyAdded;

  for ( var family of families ) {

    familyAdded = false;

    for ( var genus of family.genera ) {

      var SAMbirdsExtinct_Endemic = genus.spp.filter( function ( bird ) {

        var birdOccurrenceArray = Object.values( bird );
        if ( special === "EX" ) {
          return birdOccurrenceArray.includes( "EX" ) || birdOccurrenceArray.includes( "EX(e)" );
          // "extinct" : "EX" or "EX(e)"
        }
        // TODO: does special include "X(eb)" ?
        else return birdOccurrenceArray.includes( special );  // endemic = "X(e)"
      } );

      SAMbirdsExtinct_Endemic.forEach( function ( bird ) {
        if ( !familyAdded ) {
          results += buildFamily( { FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon } );
          familyAdded = true;
        }
        results += buildBird( { family: family.Family, index: bird.index, special: json2html[ bird[ "SAM" ] ], name: bird.name, genus: genus.Genus, spp: bird.species } );
        numSpecies++;
      } );
    }
    // results += closeFamily();
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

// // var addFamily = buildFamily({ FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon });
function buildFamily ( f ) {
  var elem = `<li data-family="${ f.FamilyScientific }" class="family"  tabindex="0">`;
  elem += `<span class="fco">${ f.FamilyCommon }</span>`;
  elem += `<span class="fsc">${ f.FamilyScientific }</span>`;
  return elem;
}

// function closeFamily () {
//   return `</ul></li>`; // Closes the bird-list and the family-container
// }

// // var addBird = buildBird({ family: family.Family, index: bird.index, special: special, name: bird.name, genus: genus, spp: bird.species });
function buildBird ( b ) {
  var elem = `<li data-i="${ b.index }" data-family="${ b.family }" class="bird"  tabindex="0">`;
  if ( b.special ) elem += `<span class="${ b.special }">`;
  else elem += `<span>`;
  elem += `${ b.name }</span>`;
  elem += `<span>${ b.genus } ${ b.spp }</span></li>`;
  return elem;
}

// ------------------------------------------------------------------------------------------------------ //

function searchAllQuery ( families, query, country ) {

  var regex = RegExp( query, "i" );

  var numFamilies = [];
  var familyAdded;
  let results = "";
  var numSpecies = 0;

  families.forEach( function ( family ) {    // forEach is okay, there will be no `break`s

    familyAdded = false;

    if ( regex.test( family.Family ) || regex.test( family.FamilyCommon ) ) {
      results += buildFamily( { FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon } );
      familyAdded = true;
      numFamilies.push( family.Family );
    }

    family.genera.forEach( function ( genus ) {

      genus.spp.forEach( function ( bird ) {

        if ( regex.test( genus.Genus.concat( " ", bird.species ) ) || regex.test( bird.name ) ) {

          if ( !familyAdded ) {
            results += buildFamily( { FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon } );
            familyAdded = true;
            numFamilies.push( family.Family );
          }

          results += buildBird( { family: family.Family, index: bird.index, special: json2html[ bird[ country ] ], name: bird.name, genus: genus.Genus, spp: bird.species } );
          numSpecies++;
        }
      } );
    } );
  } );

  if ( numFamilies.length === 1 && !numSpecies ) {
    var birdsInFamily = getAllSpeciesFromOneFamily( results, numFamilies[ 0 ], country );
    results = birdsInFamily.$results;
    numSpecies = birdsInFamily.numSpecies;
  }
  return { numSpecies: numSpecies, list: results };
}

/* <li class="family"><span class="fco">FINCHES</span><span class="fsc">FRINGILLIDAE</span></li> */

// <li data-i="817" class="bird"><span class="va">Cape Petrel</span><span>Daption capense</span></li>
// <li data-i="693" class="bird"><span class="hy">Puna Snipe</span><span>Gallinago andina</span></li>
// <li data-i="628" class="bird"><span class="extinct">American Coot</span><span>Fulica americana</span></li>
// <li data-i="733" class="bird"><span class="endemic">Lava Gull</span><span>Leucophaeus fuliginosus</span></li>

// ------------------------------------------------------------------------------------------------------ //

// for countries (not SAM): unconfirmed, vagrant, extinct and endemic

export function searchCountrySpecials ( families, special, country ) {

  var numSpecies = 0;
  let results = "";
  var familyAdded;

  for ( var family of families ) {

    familyAdded = false;

    for ( var genus of family.genera ) {

      var birdsWithSpecial = genus.spp.filter( function ( bird ) {    // single country, not SAM
        return ( bird[ country ] === special );
      } );

      if ( birdsWithSpecial.length ) {

        if ( !familyAdded ) {
          results += buildFamily( { FamilyScientific: family.Family, FamilyCommon: family.FamilyCommon } );
          familyAdded = true;
        }

        birdsWithSpecial.forEach( function ( bird ) {
          results += buildBird( { family: family.Family, index: bird.index, special: json2html[ bird[ country ] ], name: bird.name, genus: genus.Genus, spp: bird.species } );
          numSpecies++;
        } );
      }
    }
  }
  return { numSpecies: numSpecies, list: results };
}
// <li class="family"><span class="fco">SHEARWATERS</span><span class="fsc">PROCELLARIIDAE</span></li>

// <li data-i="817" class="bird"><span class="va">Cape Petrel</span><span>Daption capense</span></li>
// <li data-i="693" class="bird"><span class="hy">Puna Snipe</span><span>Gallinago andina</span></li>
// <li data-i="628" class="bird"><span class="extinct">American Coot</span><span>Fulica americana</span></li>
// <li data-i="733" class="bird"><span class="endemic">Lava Gull</span><span>Leucophaeus fuliginosus</span></li>

// ------------------------------------------------------------------------------------------------------ //

function getAllSpeciesFromOneFamily ( $results, thisFamily, country ) {

  var numSpecies = 0;
  const familyNode = taxNodeByKey.get( `family:${ thisFamily }` );

  const allBirdsInFamily = familyNode.querySelectorAll( '.birds > li' );

  allBirdsInFamily.forEach( function ( bird ) {

    const genus = bird.children[ 1 ].innerText.split( " " )[ 0 ];
    const species = bird.children[ 1 ].innerText.split( " " )[ 1 ];

    $results += buildBird( { family: thisFamily, index: bird.dataset.i, special: bird.children[ 0 ].className, name: bird.children[ 0 ].innerText, genus, spp: species } );
    numSpecies++;
  } );

  return { numSpecies, $results };
}

// function getAllSpeciesFromOneFamily ( families, currentResults, thisFamily, country ) {
//   var numSpecies = 0;
//   var regex = new RegExp( thisFamily, "i" );
//   var output = currentResults;

//   for ( var family of families ) {
//     if ( regex.test( family.Family ) ) {
//       // If we are calling this, the Family header might already be added.
//       // If not, add buildFamily() here.
//       family.genera.forEach( function ( genus ) {
//         genus.spp.forEach( function ( bird ) {
//           output += buildBird( {
//             family: family.Family,
//             index: bird.index,
//             special: json2html[ bird[ country ] ],
//             name: bird.name,
//             genus: genus.Genus,
//             spp: bird.species
//           } );
//           numSpecies++;
//         } );
//       } );
//       break;
//     }
//   }
//   return { numSpecies: numSpecies, $results: output };
// }

// console.log(`\n${family.Family} : ${family.genera.length} genera`);  // to print familes : genera and how many
// family.genera.forEach(function (genus) {
//  console.log(`\t${genus.Genus} : ${genus.spp.length} spp.`);