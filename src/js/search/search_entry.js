// "use strict";

var results = {}; // {numSpecies: numSpecies, list: results}

var html2json = {	"vagrant": "V", "hypothetical": "H", "endemic": "X(e)",
  "extinct": "EX"
};  // note 'extinct` is an array: 2 values to search for EX(e)
  
//  TODO  : need country2postalCodes here??

// var json = require('../JSON/Ecuador/Ecuador 2019-10-22.json');
// var json = require('../JSON/South America/South America 2019-10-22.json');

// families = json.birds.families;

// results = S.searchRegexTree(families, "xantho", "EC");
// results = searchSpecials(families, "extinct", "EC");

document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", getQuery);
});

//  ------------------------------------------------------------------------------------------------------------  //

//  Caller :  ("#searchInput").on ("input change click textInput focusin", getQuery);    keyup removed
// eslint-disable-next-line no-unused-vars
function getQuery() {
  
  // úáóíç are not used by SACC, and will be swapped later for 'uaoic'
  var badIndex = searchInput.value.search(/[^"a-zñãúáóíç'\s-]/i);

  if (badIndex !== -1) {
    searchResults.innerHTML = "<li></li><br/><br/><li> &nbsp; &nbsp; &nbsp; &nbsp; character not allowed </li><li></li>";
    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    return;
  }

  // wait for at least two characters
  if (searchInput.value.length < 2) {
    return;
  }
  
  var searcFormContents = document.querySelector(".searchForm_contents");
  // // keep a minimum of 20 ch's width in input field and add 1 ch width for every query.length > 8
  if (searchInput.value.length > 6) {
    searcFormContents.style.left = "-" + (searchInput.value.length - 6)/5 + "ch";
    searchInput.size = 20 + (searchInput.value.length - 6);
  }
  
  // true: will run the query through handleQuery() to cleanse, etc.
  results = searchRegexTree(families, searchInput.value, countries2Postals[currentCountry], true);
  loadSearchResults(results);
}

//  ------------------------------------------------------------------------------------------------------------  //

// eslint-disable-next-line no-unused-vars
function getSearchSpecialsQuery(evt) {

  // <div id="searchSpecials" class="grayed">
  //    <span class="searchSpecialWrapper"><a>e<span class="highlightSpecial">x</span>tinct</a></span>
  //    <span class="searchSpecialWrapper"><a><span class="highlightSpecial">e</span>ndemic</a></span>
  
   // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup" && evt.keyCode !== 13) {
    return;
  }

  var special;

  // clear the input
  searchInput.value = "";

  if (evt.target.id === "searchSpecials") return;     // clicked in #searchSpecials but not on a button area
  else if (evt.target.className === "searchSpecialWrapper")
    special = evt.target.textContent.trim();    // clicked between "visible" buttons on "searchSpecialWrapper"
  else special = evt.target.parentNode.textContent.trim();
  // parentNode else if you click on "e" of extinct only the "e" is detected as the textContent of the target
  
  results = specialSearch(families, special);  // country is a postalCode
  loadSearchResults(results);
}

//  ------------------------------------------------------------------------------------------------------------  //

function specialSearch(families, special) {
  
  lastQuery = special;
  special = html2json[special];  // vagrant("V"), hypothetical("H"), endemic("X(e)"), extinct("EX")
  
  if (special) {
    
    if (currentCountry === "SAM") return searchExtinctOrEndemicSAM(families, special);    // SAM : extinct and endemics
    else return searchCountrySpecials(families, special, countries2Postals[currentCountry]);     // countries: hypothetical, vagrant, extinct and endemic
  }
}
