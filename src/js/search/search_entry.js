// "use strict";
import { currentCountry, countries2Postals, searchInput } from "../main.js";
import {
  searchResults, families, setLastQuery
} from "../taxonomy.js";
import { loadSearchResults, resetSearchResultsHeight } from "./search_handleResults.js";
import { searchRegexTree, searchExtinctOrEndemicSAM, searchCountrySpecials } from "./search_functions.js";
import { selectedCountryFill } from "../SouthAmerica.js";
import {
  clearPendingSearchQuery,
  clearSearchQueryHistoryTimer,
  configureSearchQueryHistory,
  debounceRememberSearchQuery
} from "./search_queryHistory.js";

var results; // {numSpecies: numSpecies, list: results}

// don't need 'resident', 'introduced', 'non-Breeder': html2json only used for searchSpecials
var html2json = {
  "vagrant": "V", "unconfirmed": "U", "endemic": "X(e)",
  "extinct": "EX", "endemic-breeder": "X(eb)"
};  // note 'extinct` is an array: 2 values to search for EX(e)

configureSearchQueryHistory( {
  runQuery: getQuery,
  specialQueries: Object.keys( html2json )
} );

export function getQuery () {
  clearSearchQueryHistoryTimer();

  // úáóíç are not used by SACC, and will be swapped later for 'uaoic'
  var badIndex = searchInput?.value.search( /[^"a-zñãúáóíç'\s-]/i );

  if ( badIndex !== -1 ) {
    clearPendingSearchQuery();
    searchResults.innerHTML = "<li> &nbsp; &nbsp; character not allowed</li><li></li><li></li>";
    resetSearchResultsHeight();
    // if ( !resultsPanelOpen ) toggleSearchResultsPanel();
    return;
  }

  // trim leading whitespace
  if ( searchInput instanceof HTMLInputElement ) {
    searchInput.value = searchInput.value.trimStart();
    if ( searchInput.value.length === 0 ) {   // if only whitespace, clear the input element
      searchInput.value = "";
    }
  }

  // wait for at least two characters
  if ( searchInput instanceof HTMLInputElement && searchInput.value.length < 2 ) {
    debounceRememberSearchQuery( searchInput.value );
    return;
  }

  let searchForm = document.getElementById( "searchForm" );
  // // keep a minimum of 20 ch's width in input field and add 1 ch width for every query.length > 8
  if ( searchInput instanceof HTMLInputElement && searchInput.value.length > 6 ) {
    if ( searchForm instanceof HTMLElement )
      searchForm.style.setProperty( "--search-query-shift", "-" + ( searchInput.value.length - 6 ) / 5 + "ch" );
    searchInput.size = 20 + ( searchInput.value.length - 6 );
  }

  // 'true': will run the query through handleQuery() to cleanse, etc.
  results = searchRegexTree( families, searchInput?.value, countries2Postals[ currentCountry ], true );
  loadSearchResults( results );
  if ( searchInput instanceof HTMLInputElement ) debounceRememberSearchQuery( searchInput.value );
}

//  ------------------------------------------------------------------------------------------------------------  //

export function getSearchSpecialsQuery ( event ) {
  const wrapper = event.target.closest( ".searchSpecialWrapper" );
  if ( !wrapper || wrapper.classList.contains( "notAvailable" ) ) return;

  const special = wrapper.dataset.special;
  if ( !special ) return;

  setLastQuery( special );
  selectedCountryFill( currentCountry, special );
  loadSearchResults( specialSearch( families, special ) );
}

//  ------------------------------------------------------------------------------------------------------------  //

export function specialSearch ( families, special ) {

  setLastQuery( special );
  special = html2json[ special ];  // vagrant("V"), unconfirmed("U"), endemic("X(e)"), extinct("EX"), "endemic-breeder": "X(eb)"

  if ( special ) {

    if ( currentCountry === "SAM" || currentCountry === "South America" ) return searchExtinctOrEndemicSAM( families, special );    // SAM : extinct and endemics
    else return searchCountrySpecials( families, special, countries2Postals[ currentCountry ] );     // countries: unconfirmed, vagrant, extinct and endemic
  }
}
