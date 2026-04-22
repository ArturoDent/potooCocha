// "use strict";
import { currentCountry } from "../main.js";

import {
  searchResults, searchResultsScroller, toggleSearchResultsPanel,
  taxPageScroller, lastQuery, resultsPanelOpen,
} from "../taxonomy.js";




export function resetSearchResultsHeight () {

  searchResults.style.height = "auto";
  searchResultsScroller.style.height = "auto";

  if ( searchResults.scrollHeight >= 300 ) {
    searchResultsScroller.style.height = "25rem";
    searchResultsScroller.style.overflowY = "auto";
  }
  else {
    // 25px added due to Chrome-only bug,
    //   it makes the searchResults height too short, even two species do not fit w/o scrolling
    // searchResultsScroller.style.height = searchResults.scrollHeight + 25 + "px";
    searchResultsScroller.style.height = searchResults.scrollHeight + 2 + "px";
    searchResultsScroller.style.overflowY = "hidden";
  }

  searchResultsScroller.scrollTop = 0;
}

// eslint-disable-next-line no-unused-vars
export function resetTaxPageHeight () {

  taxPageScroller.style.height = "74vh";
  taxPageScroller.scrollTop = 0;
}

// eslint-disable-next-line no-unused-vars
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
    if ( !resultsPanelOpen ) toggleSearchResultsPanel();

    // updateActivityData("search", originalQuery);
    return;
  }

  document.getElementById( "countrySearch" )?.classList.remove( "closed" );

  searchResults.innerHTML = results.list;
  // initSearchResultsStickyHeaders();


  resetSearchResultsHeight();
  if ( !resultsPanelOpen ) toggleSearchResultsPanel();
}

// function initSearchResultsStickyHeaders () {

//   // Make sure this matches the container that has the scrollbar
//   const resultsContainer = document.querySelector( '#searchResultsScroller' );

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
