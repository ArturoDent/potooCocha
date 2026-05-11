// "use strict";
import { countries2Postals, currentCountry, searchSpecials } from "./main.js";
import { map, highlightSAMmap, alreadyInMapsCollection } from "./SouthAmerica.js";
import { mapsCollection, saveMapButton } from "./birdMapFactory.js";
import { numFamiliesList, numSpeciesList } from "./numList.js";
import { navigateToFamily } from "./familyMap.js";

import { searchRegexTree } from "./search/search_functions.js";
import { specialSearch, getSearchSpecialsQuery } from "./search/search_entry.js";
import { loadSearchResults, resetTaxPageHeight } from "./search/search_handleResults.js";


export let lastQuery = "";
export function setLastQuery ( q ) {
  lastQuery = q;
}
export function getLastQuery () {
  return lastQuery;
}

var lastSpecies;
export let families;
var numFamilies;
export let birds;
var searchCountryText;

export let taxPage;
var resultsPanel;
export let searchResults;
var lastResultsSpecies;
export let lastIndex;

export let resultsPanelOpen = false;
var printerButton;

export let taxNodeByKey = new Map();
let taxonomyInitialized = false;


function ensureTaxonomyDomRefs () {
  if ( !searchCountryText ) searchCountryText = document.getElementById( "searchCountryText" );
  if ( !taxPage ) taxPage = document.getElementById( "taxPage" );
  if ( !searchResults ) searchResults = document.getElementById( "searchResults" );
  if ( !resultsPanel ) resultsPanel = document.getElementById( "results-panel" );
  if ( !printerButton ) printerButton = document.getElementById( "printerButton" );
}

// export async function initTaxonomy () { necessary for printSearchResults() ??

export function initTaxonomy () {
  if ( taxonomyInitialized ) return;
  taxonomyInitialized = true;

  printerButton = document.getElementById( "printerButton" );
  printerButton?.addEventListener( "click", printSearchResults );

  const closeOpenFamiliesButton = document.getElementById( "closeOpenFamiliesButton" );
  closeOpenFamiliesButton?.addEventListener( "click", closeAllFamilies );

  searchCountryText = document.getElementById( "searchCountryText" );
  searchSpecials?.addEventListener( "click", getSearchSpecialsQuery );
  taxPage = document.getElementById( "taxPage" );

  searchResults = document.getElementById( "searchResults" );
  resultsPanel = document.getElementById( "results-panel" );

  searchResults?.addEventListener( "click", gotoMatch, false );
  searchResults?.addEventListener( "dblclick", gotoSACCLink, false );
  // searchResults.addEventListener("auxclick", gotoSACCLink, false);
  searchResults?.addEventListener( "keydown", ( e ) => {
    if ( e.key === "Enter" ) {
      gotoSACCLink( e );
    }
  }, false );

  taxPage?.addEventListener( "click", toggleFamilyOpen );
  taxPage?.addEventListener( "dblclick", gotoSACCLink, false );
  // taxPage.addEventListener("auxclick", gotoSACCLink, false);
  taxPage?.addEventListener( "keyup", ( e ) => {
    if ( e.key === "Enter" ) {
      gotoSACCLink( e );
    }
  }, false );

  // preloading the file occurrences.txt
  getTEXT( "../occurrences/occurrences.txt", data => birds = data.split( "\n" ) );

}

// fetch() not supported by IE11
// const response = await fetch('http://example.com/movies.json');
// const myJson = await response.json();
// console.log(JSON.stringify(myJson));

function getTEXT ( url, success ) {
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", url );
  xhr.onreadystatechange = function () {
    if ( xhr.readyState > 3 && xhr.status === 200 ) success( xhr.responseText );
  };
  xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
  xhr.send();
  return xhr;
}

export function getJSON ( url, success ) {
  var xhr = new XMLHttpRequest();
  xhr.open( 'GET', url, true );
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if ( status === 200 ) {
      success( xhr.response );
    }
    else {
      throw new Error( "getJSON failed : " + xhr.response );
    }
  };
  xhr.send();
}

export function loadCountryTaxonomy ( country ) {
  ensureTaxonomyDomRefs();

  // lastQuery.slice(0, 24) to limit lastQuery length in the searchTerm flyout
  let searchTermElement = document.getElementById( "searchTerm" );
  if ( searchTermElement ) {
    if ( lastQuery ) {
      searchTermElement.innerHTML = country + " : <span>" + lastQuery + "</span>";
    }
    else
      searchTermElement.innerHTML = country + " : <span>" + "enter a search term</span>";
  }

  if ( country !== "South America" ) {
    searchResults.classList.remove( "samTax" );
    taxPage.classList.remove( "samTax" );
  }

  //  -----------------------------------------------------------------------------------------------

  if ( country === "French Guiana" ) {
    getJSON( "JSON/FrenchGuiana/FrenchGuiana.json", getCountryJSON );
  }
  // because Curaçao is accented here but not in filenames
  else if ( country === "Curaçao" ) {
    getJSON( "JSON/Curacao/Curacao.json", getCountryJSON );
  }
  else if ( country === "South America" ) {
    getJSON( "JSON/SouthAmerica/SouthAmerica.json", getCountryJSON );
    searchResults = document.getElementById( "searchResults" );

    searchResults.classList.add( "samTax" );

    // so unconfirmeds and vagrants aren't selectable if South America is chosen
    searchSpecials?.querySelector( '[data-special="unconfirmed"]' ).classList.add( "notAvailable" );
    searchSpecials?.querySelector( '[data-special="vagrant"]' ).classList.add( "notAvailable" );

    taxPage.classList.add( "samTax" );
  }
  else if ( country ) {
    getJSON( "JSON/" + country + "/" + country + ".json", getCountryJSON );
  }

  //  -----------------------------------------------------------------------------------------------

  if ( country !== "South America" ) {
    searchSpecials.querySelector( '[data-special="unconfirmed"]' ).classList.remove( "notAvailable" );
    searchSpecials.querySelector( '[data-special="vagrant"]' ).classList.remove( "notAvailable" );
  }

  var specials = /extinct|endemic|unconfirmed|vagrant|endemic-breeder/;

  if ( !lastQuery ) {
    map.querySelector( ".saveMapButton" ).style.display = "none";
    /** @type {HTMLElement | null} */
    const el = document.querySelector( ".colorKey" );
    if ( el ) el.style.opacity = "0.9";
  }
  else if ( specials.test( lastQuery ) ) {
    map.querySelector( ".saveMapButton" ).style.display = "none";
  }

  if ( country === "South America" ) searchCountryText.innerHTML = "South America";
  else if ( country === "Falklands" ) searchCountryText.innerHTML = "the Falkland Islands";
  else searchCountryText.innerHTML = country;

  const treeIntroTextElement = document.querySelector( "#treeIntroText" );

  if ( treeIntroTextElement ) {
    if ( country === "Falklands" )
      treeIntroTextElement.innerHTML = "Falklands/Malvinas" + " : " + numFamiliesList[ country ] + " families, " + numSpeciesList[ country ] + " species";
    else treeIntroTextElement.innerHTML = country + " : " + numFamiliesList[ country ] + " families, " + numSpeciesList[ country ] + " species";
  }
}


function initTaxPageStickyHeaders () {

  const scrollContainer = document.querySelector( '#taxPage' );

  const observer = new IntersectionObserver(
    ( [ e ] ) => {
      e.target.classList.toggle( "sticky", e.intersectionRatio < 1 );
    },
    {
      root: scrollContainer,
      threshold: [ 1 ]
    }
  );

  const headers = document.querySelectorAll( '.fTitle' );
  headers.forEach( header => {
    observer.observe( header );
  } );
}

// function getCountryHTML(data) {
//    TODO: test this!
//   taxPage.innerHTML = data;

//   resetTaxPageHeight();
// indexTaxTree();

// }

function buildTaxTree ( thisCountryFamilies, country ) {
  ensureTaxonomyDomRefs();

  // TODO: why building this here instead of using the *SACC.html file??

  var occ = "";
  var json2html = {
    "V": "va", "IN": "intr", "U": "u", "NB": "nb", "X(e)": "endemic",
    "X(eb)": "endemic-breeder", "EX(e)": "endemic extinct", "EX": "extinct", "X": ""
  };

  var results = `<ul id="tree">\n\n`;

  thisCountryFamilies.forEach( function ( family ) {    // forEach is okay, there will be no `break`s

    //   <li class="family"><span class="fTitle"><span class="fco">FLAMINGOS</span><span class="fsc">PHOENICOPTERIDAE</span></span>
    //      <ul class="birds"></ul>

    results += `<li class="family" data-family="${ family.Family }"><span class="fTitle" tabindex="0"><span class="fco">${ family.FamilyCommon }</span>`;
    results += `<span class="fsc">${ family.Family }</span></span>\n`;
    results += `  <ul class="birds">\n\n`;

    family.genera.forEach( function ( genus ) {

      genus.spp.forEach( function ( bird ) {

        // <li data-i="160"><span>Chilean Flamingo</span><span>Phoenicopterus chilensis</span></li>
        // <li data-i="162"><span class="nb">Andean Flamingo</span><span>Phoenicoparrus andinus</span></li>

        occ = bird[ country ];
        if ( occ && occ !== "X" )
          results += `  <li data-i="${ bird.index }" tabindex="0"><span class="${ json2html[ bird[ country ] ] }">${ bird.name }</span>`;
        else
          results += `  <li data-i="${ bird.index }" tabindex="0"><span>${ bird.name }</span>`;

        results += `<span>${ genus.Genus } ${ bird.species }</span></li>\n`;
      } );
    } );
    results += `  </ul></li>\n\n`;
  } );

  results += `</ul>\n`;

  taxPage.innerHTML = results;

  // so "species" includes the family level _and_ individual bird species
  // species = document.getElementById("tree").getElementsByTagName("li");

  resetTaxPageHeight();

  indexTaxTree();
  initTaxPageStickyHeaders();
}


function indexTaxTree () {
  taxNodeByKey.clear();

  /** @type {NodeListOf<HTMLLIElement>} */
  const byI = document.querySelectorAll( "#tree li[data-i]" );
  byI.forEach( li => {
    taxNodeByKey.set( `bird:${ li.dataset.i }`, li );
  } );

  /** @type {NodeListOf<HTMLLIElement>} */
  const byFamily = document.querySelectorAll( "#tree li.family[data-family], #tree li.familyOpen[data-family]" );
  byFamily.forEach( li => {
    taxNodeByKey.set( `family:${ li.dataset.family }`, li );
  } );
}


function getCountryJSON ( data ) {

  families = data.birds.families;
  numFamilies = families.length;

  let results;

  if ( lastQuery ) {
    var specials = /extinct|endemic|unconfirmed|vagrant|endemic-breeder/;
    if ( specials.test( lastQuery ) ) results = specialSearch( families, lastQuery );
    // false will avoid modifyQuery()  sanitize, add accents, etc. - has already been done on the lastQuery
    else results = searchRegexTree( families, lastQuery, countries2Postals[ currentCountry ] ), false;

    loadSearchResults( results );
  }

  buildTaxTree( families, countries2Postals[ currentCountry ] );
}


function gotoSACCLink ( e ) {

  const familySciName = e.target.closest( "li[data-family]" ).dataset.family;
  const birdFullName = e.target.closest( "li[data-i]" )?.innerText || "";

  navigateToFamily( familySciName, birdFullName );

  e.preventDefault();
  e.stopImmediatePropagation();
}


// <ul id="searchResults"></ul>
function gotoMatch ( e ) {
  ensureTaxonomyDomRefs();

  // e.target === 'Mergus octosetaceus' or 'Brazilian Merganser'

  if ( e.ctrlKey || e.metaKey ) {
    gotoSACCLink( e );
    return;
  }

  if ( lastSpecies && lastSpecies.classList.contains( "active" ) ) {
    lastSpecies.classList.remove( "active" );
  }

  // <li class="family"><span class="fco">HUMMINGBIRDS</span><span class="fsc">TROCHILIDAE</span></li>
  // <li data-i="316" class="bird"><span>Fiery Topaz</span><span>Topaza pyra</span></li>

  var ev = e || window.event;  // TODO: window.event for IE8-  TODO: simplify with ??=
  var clicked = ev.target.closest( "li" );  // works

  if ( !clicked ) return;
  if ( !clicked.classList.contains( 'family' ) && !clicked.classList.contains( 'bird' ) ) return;

  // eText = "Horned ScreamerAnhima cornuta"
  // clicked.children[1].innerText = "Anhima cornuta"
  // map.children.currentBird.children.currentBirdName.children[2].innerText = "Anhima cornuta"

  // map already shows the bird selected in results or taxTree
  // but last species was a family; lastSpecies.className === 'fTitle'

  if ( lastSpecies?.className !== 'fTitle' ) {
    let sciNameSpan;
    if ( sciNameSpan = map.querySelector( "#currentBirdName span:last-of-type" ) ) {
      const mapSciName = sciNameSpan.innerText;
      if ( mapSciName === clicked.querySelector( "span:last-of-type" ).innerText ) {

        clicked.classList.add( "active" );
        const birdNode = taxNodeByKey.get( `bird:${ clicked.dataset.i }` );
        birdNode.classList.add( "active" );
        lastSpecies = birdNode;
        if ( lastResultsSpecies && lastResultsSpecies !== clicked ) {
          lastResultsSpecies.classList.remove( "active" );
        }
        lastResultsSpecies = clicked;
        return;
      }
    }
  }

  let familySciName = clicked.dataset.family;

  // TODO: get full nodes from ...SACC.html
  const birdNode = taxNodeByKey.get( `bird:${ clicked.dataset.i }` );
  const familyNode = taxNodeByKey.get( `family:${ familySciName }` );

  if ( clicked.classList.contains( "bird" ) ) {

    const familyUList = familyNode?.querySelector( ":scope > ul.birds" );
    if ( !familyNode || !familyUList || !birdNode ) return;

    if ( !familyUList.classList.contains( "open" ) ) {
      familyUList.classList.add( "open" );
      familyNode.classList.remove( "family" );
      familyNode.classList.add( "familyOpen" );
    }

    // can't offset down easily for some reason with scroll-margin-top on '.active' elements
    // birdNode.scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    //   container: "nearest"
    // });

    const top =
      birdNode.getBoundingClientRect().top -
      taxPage.getBoundingClientRect().top +
      taxPage.scrollTop -
      60;     // offset

    taxPage.scroll( {
      top,
      behavior: "smooth"
    } );

    birdNode.classList.add( "active" );

    lastSpecies = birdNode;
    lastIndex = Number( clicked.dataset.i );

    if ( lastResultsSpecies && lastResultsSpecies !== clicked ) {
      lastResultsSpecies.classList.remove( "active" );
    }
    clicked.classList.add( "active" );
    lastResultsSpecies = clicked;  // not birdNode which is a taxTree node, clicked is in the resultsPanel
    addBirdNameToMap( clicked );

    highlightSAMmap( lastIndex, "currentMap" );

    if ( mapsCollection.getElementsByClassName( "smallBird" ).length === 5 || alreadyInMapsCollection() ) {
      saveMapButton.style.display = "none";
    }
    else
      saveMapButton.style.display = "block";
  }

  else if ( clicked.classList.contains( "family" ) ) {

    if ( lastResultsSpecies ) {
      lastResultsSpecies.classList.remove( "active" );
      lastResultsSpecies = null;
    }

    const top =
      familyNode.getBoundingClientRect().top -
      taxPage.getBoundingClientRect().top +
      taxPage.scrollTop -
      30;

    taxPage.scroll( {
      top,
      behavior: "smooth"
    } );

    familyNode.firstChild.classList.add( "active" );
    lastSpecies = clicked;  // remove active from lastSpecies before this
    lastSpecies.classList.add( "active" );
    lastResultsSpecies = familyNode.firstChild;
  }
}

export function addBirdNameToMap ( name ) {

  var temp = "";

  const currentBirdNameElement = document.getElementById( "currentBirdName" );
  if ( currentBirdNameElement ) {
    if ( name ) {
      temp = "<span>" + name.firstChild.textContent + "</span><br/><span>" + name.lastChild.textContent + "</span>";
      currentBirdNameElement.innerHTML = temp;
    }
    else {
      currentBirdNameElement.innerHTML = temp;
    }
  }
}

function toggleFamilyOpen ( event ) {

  ensureTaxonomyDomRefs();

  if ( event.ctrlKey || event.metaKey ) {
    gotoSACCLink( event );
    return;
  }

  if ( event.target.id === "taxPage" ) return;

  // taxPage is not open yet
  if ( !numFamilies ) return;

  event = event || window.event;  // TODO: window.event for IE8-  TODO: use ??= instead

  var familyUList;
  var familyHeader;
  var speciesTarget;
  const treeIntroTextElement = document.querySelector( "#treeIntroText" );

  if ( event.target.closest( "ul.birds" ) ) speciesTarget = event.target.closest( "ul.birds li" );
  else {
    familyHeader = event.target.closest( "li.family, li.familyOpen" );
    familyUList = familyHeader.childNodes[ 1 ].nextSibling;
    // want familyUList to == <ul class="birds [open]"> to toggle display
  }

  //  <ul id="tree">
  //    <li class="familyOpen"><span class="fTitle"><span class="fco">RHEAS</span><span class="fsc">RHEIDAE</span></span>
  //      <ul class="birds open">

  //         <li data-i="0"><span>Greater Rhea</span><span>Rhea americana</span></li>
  //         <li data-i="1"><span>Lesser Rhea</span><span>Rhea pennata</span></li>
  //      </ul></li>

  if ( familyUList && !familyUList.classList.contains( "open" ) ) {  // not open

    familyUList.classList.add( "open" );

    familyHeader.className = "familyOpen";

    // clicked on a closed family
    // check to see if family at bottom of taxPage, if so, open and move up ?*

    var taxPageHeight = taxPage.getBoundingClientRect().height;

    if ( familyUList.offsetTop - taxPage.scrollTop > taxPageHeight - 24 ) {

      //  will the entire family fit in taxPage ?

      if ( familyHeader.clientHeight > taxPageHeight )
        taxPage.scrollTop = familyHeader.offsetTop;

      else
        taxPage.scrollTop += familyUList.lastElementChild.offsetTop + familyUList.lastElementChild.clientHeight;
    }
    //  show family and numSpecies in that family
    var scientificFamily = familyHeader.firstChild.children[ 1 ].textContent;
    if ( !scientificFamily ) scientificFamily = familyHeader.firstChild.children[ 0 ].textContent;

    if ( treeIntroTextElement )
      treeIntroTextElement.innerHTML = currentCountry + " : " + scientificFamily + " has " + familyUList.children.length + " species";
  }

  else if ( familyUList ) {    // was open
    familyUList.classList.remove( "open" );
    familyHeader.className = "family";

    var reset = familyHeader.querySelectorAll( ".active" );

    if ( reset.length ) {
      reset[ 0 ].classList.remove( "active" );
    }

    if ( treeIntroTextElement )
      treeIntroTextElement.innerHTML = currentCountry + " : " + numFamiliesList[ currentCountry ] + " families, " + numSpeciesList[ currentCountry ] + " species";
  }

  //   clicked on a species in the taxTree
  if ( !familyUList ) {

    //    <ul class="birds open">
    //      <li data-i="2692"><span>Tepui Wren</div><div>Troglodytes rufulus</span></li>

    speciesTarget.classList.add( "active" );

    if ( speciesTarget !== lastSpecies ) {

      if ( lastSpecies && lastSpecies.classList.contains( "active" ) ) {
        lastSpecies.classList.remove( "active" );
      }
    }

    lastSpecies = speciesTarget;
    if ( lastResultsSpecies ) lastResultsSpecies.classList.remove( "active" );
    lastResultsSpecies = null;

    addBirdNameToMap( speciesTarget );

    lastIndex = Number( speciesTarget.dataset.i );
    highlightSAMmap( lastIndex, "currentMap" );

    if ( treeIntroTextElement )
      treeIntroTextElement.innerHTML = currentCountry + " : " + numFamiliesList[ currentCountry ] + " families, " + numSpeciesList[ currentCountry ] + " species *";

    if ( mapsCollection.getElementsByClassName( "smallBird" ).length === 5 || alreadyInMapsCollection() ) {
      saveMapButton.style.display = "none";
    }
    else
      saveMapButton.style.display = "block";
  }

  taxPage.style.zIndex = 5;
}

function closeAllFamilies () {
  ensureTaxonomyDomRefs();

  const treeIntroTextElement = document.querySelector( "#treeIntroText" );

  for ( const node of taxNodeByKey.values() ) {
    if ( node.matches( "li.familyOpen" ) ) {

      const familyUList = node?.querySelector( ":scope > ul.birds" );

      familyUList.classList.remove( "open" );
      familyUList.classList.add( "closed" );

      node.classList.add( "family" );
      node.classList.remove( "familyOpen" );
    }
  }

  // **** reset families and species of country
  if ( treeIntroTextElement )
    treeIntroTextElement.innerHTML = currentCountry + " : " + numFamiliesList[ currentCountry ] + " families, " + numSpeciesList[ currentCountry ] + " species *";
}

async function printSearchResults ( evt ) {

  // if no search results do nothing
  var numSpecies = document.getElementsByClassName( "bird" ).length;
  if ( !numSpecies ) return;

  let divId = "searchResults";
  var content = document.getElementById( divId )?.innerHTML;

  // OPTION 1:
  try {
    // 1. Fetch the CSS file content
    const response = await fetch( '/printCSS/printSearchResults.css' );
    const cssContent = await response.text();

    // 2. Wrap it in style tags
    var css = `<style>${ cssContent }</style>`;

    var html = '<html><head><title>Search Print Results</title>';
    html += css;
    html += '</head><body>';

    // ... continue with your window.open / document.write logic
    // `normalize lastQuery (remove accented regex's):: South America : 's(a|ã)o' 2 species
    //          'm(a|ã)r(a|ã)(n|ñ)o(n|ñ)'
    var normalizedQuery = lastQuery.replace( /\(a\|ã\)/gi, "a" ).replace( /\(n\|ñ\)/gi, "n" );

    html += '<h3>' + currentCountry + ' : &nbsp;\'' + normalizedQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
    html += "<div id='searchResults'>";
    html += content;
    html += "</div>";

    html += "<br><br><br>Mark Pearman, Juan Freile, Jhonathan Miranda, and Van Remsen (coordinators). Country lists. &nbsp;26&nbsp;March&nbsp;2026. A classification of the bird species of South America. American Ornithological Society. http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm";
    html += '</body></html>';

    var iframe = document.createElement( "iframe" );
    document.body.appendChild( iframe );
    iframe.srcdoc = html;

    setTimeout( function () {
      iframe.contentWindow?.print();
      iframe.remove();
    }, 250 );

    return true;



  } catch ( err ) {
    console.error( "Failed to load CSS:", err );
  }

  // OPTION 2:
  // Ensure you use an absolute path or a path relative to the root
  // var css = '<link rel="stylesheet" type="text/css" href="/css/print-search.css">';

  // var css =
  //   `<style>
  //     h3 {
  //       position: relative;
  //       top: 20px;
  //       margin: 0 0 3.5ch 0;
  //       text-align: center;
  //       padding-left: 0;
  //     }

  //     #searchResults {
  //       position: relative;
  //       padding: 20px 0 20px 0;
  //       list-style-type: none;
  //       font-size: 1rem;
  //     }

  //     #searchResults span:not(.fsc):last-child {
  //       position: absolute;
  //       left: calc(56% + 2ch);
  //     }

  //     #searchResults span:not(.fsc):first-child {
  //       position: relative;
  //       left: 10%;
  //     }

  //     .fsc {
  //       display: inline-block;
  //       position: absolute;
  //       left: 56%;
  //       font-weight: bold;
  //       font-style: normal;
  //     }

  //     .fco {
  //       display: inline-block;
  //       position: absolute;
  //       left: 20%;
  //       font-weight: bold;
  //     }

  //     .endemic::before {
  //       content: "e";
  //       position: relative;
  //       left: -0.53rem;
  //       font-size: 0.8rem;
  //     }

  //     .endemic-breeder::before {
  //       content: "*";
  //       position: relative;
  //       left: -0.53rem;
  //       font-size: 0.8rem;
  //     }

  //     .extinct::before {
  //       content: "x";
  //       position: relative;
  //       left: -0.53rem;
  //       font-size: 0.8rem;
  //     }

  //     .u::before {
  //       content: "u";
  //       position: relative;
  //       left: -0.53rem;
  //       font-size: 0.8rem;
  //     }

  //     .va::before {
  //       content: "v";
  //       position: relative;
  //       left: -0.53rem;
  //       font-size: 0.8rem;
  //     }

  //     .family {
  //       position: relative;
  //       font-weight: bold;
  //       // padding: 1px 0 1px 0;
  //       margin-top: 2ch;
  //     }

  //     li.bird {
  //       padding: 2px 0 2px 2ch;
  //     }

  //     li.bird span:first-child {
  //       display: inline-block;
  //       position: relative;
  //       left: 16%;
  //     }

  //     .bird span:last-child { display: inline-block; }

  //       /* 1. Prevent a single bird row from being sliced horizontally */
  //     .bird {
  //       display: block;
  //       width: 100%;
  //       break-inside: avoid;
  //       page-break-inside: avoid; /* For older browser support */
  //     }

  //       /* 2. Prevent a Family Header from being separated from its first bird */
  //     .family {
  //       break-after: avoid;
  //       page-break-after: avoid;
  //     }

  //   </style>`;

  // var html = '<html><head><title></title>';
  // html += css;
  // html += '</head><body>';


  // // `normalize lastQuery (remove accented regex's):: South America : 's(a|ã)o' 2 species
  // //          'm(a|ã)r(a|ã)(n|ñ)o(n|ñ)'
  // var normalizedQuery = lastQuery.replace( /\(a\|ã\)/gi, "a" ).replace( /\(n\|ñ\)/gi, "n" );

  // html += '<h3>' + currentCountry + ' : &nbsp;\'' + normalizedQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
  // html += "<div id='searchResults'>";
  // html += content;
  // html += "</div>";

  // html += "<br><br><br>Mark Pearman, Juan Freile, Jhonathan Miranda, and Van Remsen (coordinators). Country lists. &nbsp;26&nbsp;March&nbsp;2026. A classification of the bird species of South America. American Ornithological Society. http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm";
  // html += '</body></html>';

  // var iframe = document.createElement( "iframe" );
  // document.body.appendChild( iframe );
  // iframe.srcdoc = html;

  // setTimeout( function () {
  //   iframe.contentWindow?.print();
  //   iframe.remove();
  // }, 250 );

  // return true;
}
