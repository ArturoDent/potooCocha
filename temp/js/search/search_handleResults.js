// "use strict";

function resetSearchResultsHeight() {

  searchResults.style.height = "auto";
  searchResultsScroller.style.height = "auto";

  if (searchResults.scrollHeight >= 300) {
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
function resetTaxPageHeight() {

  taxPageScroller.style.height = "74vh";
  taxPageScroller.scrollTop = 0;
}

// eslint-disable-next-line no-unused-vars
function loadSearchResults(results) {

  var term = lastQuery;

  // remove accented characters and surrounding regex from the displayed query: (n|ñ) and/or (a|ã)
  // TODO: what about (-| )
  if (lastQuery) {
    var regex = /[ãñ()|]/g;
    term = lastQuery.replace(regex, "");
  }

  if (currentCountry === "Falklands") {
    document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + "&nbsp;&nbsp; :&nbsp;&nbsp; <span>" + term + "</span>&nbsp;&nbsp;» &nbsp;" + results.numSpecies + " species";
  }
  else {
    document.getElementById("searchTerm").innerHTML = currentCountry + "&nbsp;&nbsp; :&nbsp;&nbsp; <span>" + term + "</span>&nbsp;&nbsp;&nbsp;» &nbsp;" + results.numSpecies + " species";
  }

  if (!results.numSpecies) {

    // searchResults.innerHTML = "<li> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; no matches found</li></br>";
    searchResults.innerHTML = "<li> &nbsp; &nbsp; no matches found</li><li></li><li></li>";

    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();

    // updateActivityData("search", originalQuery);
    return;
  }

  document.getElementById("countrySearch").classList.remove("closed");

  searchResults.innerHTML = results.list;

  resetSearchResultsHeight();
  if (!resultsPanelOpen) toggleSearchResultsPanel();
}
