// "use strict";

//  Caller :  ("#searchInput").on ("input", getQuery);    keyup removed
// function modifyQuery(term) {
// eslint-disable-next-line no-unused-vars
function modifyQuery(term) {
  
  var searcFormContents = document.querySelector(".searchForm_contents");
  // keep a minimum of 20 ch's width in input field and add 1 ch width for every query.length > 8
  if (term.length > 6) {
    searcFormContents.style.left = "-" + (term.length - 6)/5 + "ch";
    searchInput.size = 20 + (term.length - 6);
  }
  
  term = term.replace(/^\s+|\s+$/g, ""); // strip trailing and leading whitespaces

  //  wildcards * and ? ::
  // term = term.replace(/\\\*/g, "[a-zA-Z'ñã\\s-]+");
  // term = term.replace(/\\\?/g, "[a-zA-Z'ñã\\s-]");

  // SACC only uses Marañon, Nariño, Española and São, no other accented characters
  // don't have to do both, but how?
  term = term.replace(/n/g, "(n|ñ)");
  term = term.replace(/a/g, "(a|ã)");

  var regex = RegExp("[úáóíç]", "i");
  var unusedAccent = regex.test(term);
  
  if (unusedAccent) {
    term = term.replace(/ú/g, "u");
    term = term.replace(/á/g, "a");
    term = term.replace(/ó/g, "o");
    term = term.replace(/í/g, "i");
    term = term.replace(/ç/g, "c");
  }

  // now database can have any number of spaces between genus and species
  //   TODO  : fuzzy or not?
  // term = term.replace(/\s+/g, "\\s+"); // inserts a literal "\s+" but screws up fuzzy searching
  
  //  TODO : use next 2 lines to enable fuzzy searching
  //   but gets very weird with the accented characters
    // query = query.replace(/(\S|\s)/g, "$1.*?");   // add '.*?' behind every character, even spaces
    // term = term.replace(/(\S|\s)/g, "$1[a-z' -]*?");   // add '.*?' behind every character, even spaces
    
    // query = query.replace(/(\S|\s)/g, "$1.{2}?");   // to limit the possible characters between inputs, sorta weird
  
  lastQuery = term;
  return term;
}

//  ---------------------------------------------------------------------------------------------------------  //

// eslint-disable-next-line no-unused-vars
function escapeRegExp(string) {
  return string.replace(/[.*+?^@#!+=_${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

//  ---------------------------------------------------------------------------------------------------------  //


// eslint-disable-next-line no-unused-vars
function searchTree(query) {

  // var originalQuery = query;
  
  lastQuery = query;

  //  TODO  :  call a setSerachTermField() here
  
  if (lastQuery) {
    document.getElementById("countrySearch").classList.remove("closed");
    // could limit lastQuery.slice(0, 24) first 25 characters for example
    if (currentCountry === "Falklands") {
      document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '<span>" + lastQuery + "</span>'";
    }
    else document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'";
  }
  
  //  TODO  : can you ever get here?
  else {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; search results will appear here</li><li></li>";
    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    return;
  }

  // animateScrollTop(searchResults);

  // boolean that search input term was bad or missing
  var warning = false;

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }
  
  if (!query) {
    query = searchInput.value.replace(/^\s+|\s+$/g, ""); // trim leading/trailing whitespace
    if (query === "type here") warning = true;
    else if (query === "") warning = true;
  }

  // bad or missing search term
  if (warning) {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; no search term entered</li><li></li>";

    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();

    // updateActivityData("search");
    // updateActivityData("search", "warning");
    
    return;
  }
}