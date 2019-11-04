
function resetSearchResultsHeight() {

  searchResults.style.height = "auto";

  simpleBarResults = new SimpleBar(document.getElementById("searchResults"), { autoHide: false });

  var elem;

  if (searchResults.scrollHeight >= 300) {
    searchResults.style.height = "25rem";
    elem = simpleBarResults.getScrollElement();
    elem.style.height = "25rem";
  }
  else {
    // 25px added due to Chrome-only bug, 
    //   it makes the searchResults height too short, even two species do not fit w/o scrolling
    searchResults.style.height = searchResults.scrollHeight + 25 + "px";
    elem = simpleBarResults.getScrollElement();
    elem.style.height = searchResults.scrollHeight + 25 + "px";
  }
  // simpleBarResults.recalculate();
}

function resetTaxPageHeight() {

  simpleBarTaxPage = new SimpleBar(taxPage, { autoHide: false });

  var elem;

  taxPage.style.height = "75vh";
  elem = simpleBarTaxPage.getScrollElement();
  elem.style.height = "75vh";

  simpleBarTaxPage.recalculate();
}

function loadSearchresults(results) {

  var term = lastQuery;
  
  // remove accented characters and surrounding regex from the displayed query: (n|ñ) and/or (a|ã)
  if (lastQuery) {
    var regex = /[ãñ()|]/g;    
    term = lastQuery.replace(regex, "");
  }
  
  if (currentCountry === "Falklands") {
    document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '<span>" + term + "</span>'&nbsp;&nbsp;   [ " + results.numSpecies + " species ]";
  }
  else {
    document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + term + "</span>'&nbsp;&nbsp;&nbsp;   [ " + results.numSpecies + " species ]";
  }
  
  // if (matches.length === 0) {
  if (!results.numSpecies) {
    
    searchResults.innerHTML = "<li></li><br/><li> &nbsp; &nbsp; &nbsp; &nbsp; no matches found</li><li></li>";

    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    
    // updateActivityData("search", originalQuery);
    return;
  }
  
  document.getElementById("countrySearch").classList.remove("closed");
  
  searchResults.innerHTML = results.list;
  
  // console.log(results.list);
//   previousSearchResults = list;  // for memoization
//   updateActivityData("search", originalQuery);
  
  // if (currentCountry === "Falklands") {
  //   document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;   [ " + results.numSpecies + " species ]";
  // }
  // else {
  //   document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;&nbsp;   [ " + results.numSpecies + " species ]";
  // }
  
  resetSearchResultsHeight();
  if (!resultsPanelOpen) toggleSearchResultsPanel();
}


// function loadLastQuery() {

//   lastQuery = query2;

//   if (lastQuery) {
//     document.getElementById("countrySearch").classList.remove("closed");
//     // could limit lastQuery.slice(0, 24) first 25 characters for example
//     if (currentCountry === "Falklands") {
//       document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '<span>" + lastQuery + "</span>'";
//     }
//     else document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'";
//   }
//   else {
//     searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; search results will appear here</li><li></li>";

//     resetSearchResultsHeight();
//     if (!resultsPanelOpen) toggleSearchResultsPanel();
  
//     return;
//   }
// }