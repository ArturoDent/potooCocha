// "use strict";

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

// eslint-disable-next-line no-unused-vars
function resetTaxPageHeight() {

  simpleBarTaxPage = new SimpleBar(taxPage, { autoHide: false });

  var elem;

  taxPage.style.height = "75vh";
  elem = simpleBarTaxPage.getScrollElement();
  elem.style.height = "75vh";

  simpleBarTaxPage.recalculate();
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

    searchResults.innerHTML = "<li></li><br/><br/><li> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; no matches found</li><li></li>";

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