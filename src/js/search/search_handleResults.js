// "use strict";
import { currentCountry } from "../main.js";

// import {
//   searchResults, toggleSearchResultsPanel,
//   taxPage, lastQuery, resultsPanelOpen,
// } from "../taxonomy.js";

import { searchResults, taxPage, lastQuery } from "../taxonomy.js";




export function resetSearchResultsHeight () {

  searchResults.style.height = "auto";

  if ( searchResults.scrollHeight >= 300 ) {
    searchResults.style.height = "25rem";
    searchResults.style.overflowY = "auto";
  }
  else {
    // 25px added due to Chrome-only bug,
    //   it makes the searchResults height too short, even two species do not fit w/o scrolling
    // searchResults.style.height = searchResults.scrollHeight + 25 + "px";
    searchResults.style.height = searchResults.scrollHeight + 2 + "px";
    searchResults.style.overflowY = "hidden";
  }

  searchResults.scrollTop = 0;
}

export function resetTaxPageHeight () {

  taxPage.style.height = "74vh";
  taxPage.scrollTop = 0;
}

export function loadSearchResults ( results ) {

  var term = lastQuery;

  // remove accented characters and surrounding regex from the displayed query: (n|ñ) and/or (a|ã)
  // TODO: what about (-| )
  if ( lastQuery ) {
    var regex = /[ãñ()|]/g;
    term = lastQuery.replace( regex, "" );
  }

  let el = document.getElementById( "searchTerm" );

  if ( el ) {
    if ( currentCountry === "Falklands" ) {
      el.innerHTML = "Malvinas/Falklands" + " : <span>" + term + "</span>» " + results.numSpecies + " species";
    }
    else {
      el.innerHTML = currentCountry + " : <span>" + term + "</span> » " + results.numSpecies + " species";
    }
  }

  if ( !results.numSpecies ) {

    // searchResults.innerHTML = "<li> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; no matches found</li></br>";
    searchResults.innerHTML = "<li> &nbsp; &nbsp; no matches found</li><li></li><li></li>";

    resetSearchResultsHeight();
    // if ( !resultsPanelOpen ) toggleSearchResultsPanel();

    // updateActivityData("search", originalQuery);
    return;
  }

  document.getElementById( "countrySearch" )?.classList.remove( "closed" );

  searchResults.innerHTML = results.list;
  // initSearchResultsStickyHeaders();


  resetSearchResultsHeight();
  // if ( !resultsPanelOpen ) toggleSearchResultsPanel();
}

// function initSearchResultsStickyHeaders () {

//   // Make sure this matches the container that has the scrollbar
//   const resultsContainer = document.querySelector( '#searchResults' );

//   const observer = new IntersectionObserver(
//     ( [ e ] ) => {
//       // We use is-pinned to match the CSS above
//       e.target.classList.toggle( "sticky", e.intersectionRatio < 1 );
//     },
//     {
//       root: resultsContainer,
//       threshold: [ 1 ]
//     }
//   );

//   // Apply to your family headers
//   document.querySelectorAll( '#searchResults li.family' ).forEach( header => {
//     observer.observe( header );
//   } );
// }
