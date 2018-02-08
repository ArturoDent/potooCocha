"use strict";

var lastQuery;
var lastSpecies;

var species;
var families;
var numFamilies;

// eslint-disable-next-line
var birds;

var numSpeciesList = { "Argentina":1002, "Aruba":219, "Bolivia":1381, "Brazil":1799, "Chile":496,
  "Colombia":1847, "Curaçao":218, "Ecuador":1620, "French Guiana":697,
  "Guyana":783, "Paraguay":694, "Peru":1792, "Suriname":728, "Trinidad":468,
  "Uruguay":444, "Venezuela":1382, "Bonaire":210, "Falklands":227, "Malvinas":227, "South America": 3379};

// numSpecies does not include hypotheticals, so taken from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include Incertae Sedis-1 or Incertae Sedis-2

var numFamiliesList = { "Argentina":87, "Aruba":52, "Bolivia":78, "Brazil":91, "Chile":66,
  "Colombia":90, "Curaçao":50, "Ecuador":91, "French Guiana":82,
  "Guyana":78, "Paraguay":72, "Peru":88, "Suriname":80, "Trinidad":70,
  "Uruguay":72, "Venezuela":87, "Bonaire":47, "Falklands":48, "Malvinas":48, "South America": 102};

// South America : 102 families not including 2 incertae "families", 3376 total spp.
//                 which includes one hypothetical (in one country only) Black Turnstone
//                 class='fco'>(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ..SACC.html


var currentTaxonomyCountry;
var currentTaxonomyCountryElement;

// var taxonomyArticle;
var taxTreeArticleOpen = false;

var taxPage;
var searchSpecials;
var resultsPanel;
var searchResults;

var simpleBarResults;
var simpleBarTaxPage;

var closeResultsPanelButton;
var resultsPanelOpen = false;

var searchInput;

var lastResultsSpecies;
var lastIndex;

var searchSlideUpWrapper;
// var searchSlideUpWrapper_height;

var taxInstructionsButton;
var searchInstructionsOpen = true;

var selectedFillColor = "#fff";

/* global   fillSAMmap SimpleBar selectedCountryFillColor currentMap   */

document.addEventListener("DOMContentLoaded", function(){

  // taxonomyArticle = document.getElementById("taxonomyArticle");

  searchSlideUpWrapper               =  document.querySelector("#taxonomyArticle > div.slideUpWrapper");
  searchSlideUpWrapper.style.height  =  searchSlideUpWrapper.clientHeight + "px";
  // searchSlideUpWrapper_height        =  searchSlideUpWrapper.style.height;

  taxInstructionsButton = document.querySelector(".taxInstructionsButton");

  closeResultsPanelButton = document.getElementById("closeResultsPanelButton");
  closeResultsPanelButton.addEventListener("click", toggleSearchResultsPanel);

  searchInput = document.getElementById("searchInput");
  searchSpecials = document.getElementById("searchSpecials");

  searchInput.addEventListener("input", getQuery);
  searchInput.addEventListener("change", getQuery);
  searchInput.addEventListener("click", getQuery);
  searchInput.addEventListener("textInput", getQuery);
  searchInput.addEventListener("focusin", getQuery);

  searchInput.addEventListener("input", clearSearchInput);
  searchInput.addEventListener("change", clearSearchInput);
  searchInput.addEventListener("click", clearSearchInput);
  searchInput.addEventListener("textInput", clearSearchInput);
  searchInput.addEventListener("keyup", clearSearchInput);
  searchInput.addEventListener("focusin", clearSearchInput);

  searchSpecials.addEventListener("click", getSearchSpecialsQuery);

  taxInstructionsButton.addEventListener("click", showSearchInstructions);

  taxPage        =  document.getElementById("taxPage");
  searchResults = document.getElementById("searchResults");
  resultsPanel = document.querySelector(".results-panel");

  searchResults.addEventListener("click", gotoMatch);
  taxPage.addEventListener("click", toggleFamilyOpen);

  getAjax("../data/occurrences.txt", function (data) { loadIntoArray(data); });
});

function loadIntoArray(data) {
  birds = data.split("\n");
}

function animateScrollTop(el) {

  // var step = el.scrollTop / (duration/25);
  var step = 25;

  (function animateScroll() {
    el.scrollTop -= step;
    if (el.scrollTop > 0) setTimeout(animateScroll, 25);
  })();
}

function getAjax(url, success) {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
  };
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
  return xhr;
}

function showSearchInstructions(state)  {

  if ( (state === true) || !searchInstructionsOpen)  {

    // searchSlideUpWrapper.style.height = searchSlideUpWrapper_height;
    searchSlideUpWrapper.classList.remove("closeInstructions");
    searchSpecials.classList.add("open");
    searchInstructionsOpen = true;

    document.querySelector(".taxInstructionsButton .tooltip").innerHTML = "Close";
  }

  else {

    // searchSlideUpWrapper.style.height = 0;
    searchSlideUpWrapper.classList.add("closeInstructions");
    taxInstructionsButton.classList.add("instructionsClosed");
    searchSpecials.classList.remove("open");
    searchInstructionsOpen = false;

    document.querySelector(".taxInstructionsButton .tooltip").innerHTML = "Open";
  }
}

/* global taxonomyCountryButton  */
// eslint-disable-next-line
function loadCountryTaxonomy(evt) {

  var taxCountry;

  window.closeCountryModal();

  if (searchSpecials.classList.contains("grayed")) {
    document.querySelector("#searchForm span.grayed").classList.remove("grayed");
    searchSpecials.classList.remove("grayed");
    // prepareSVGstyles("SAMsvg");
  }

  if (currentTaxonomyCountry) {
    currentTaxonomyCountryElement.classList.remove("taxHighlight");
    currentTaxonomyCountryElement.classList.remove("bothHighlights");
  }

  // trying to force a redraw because of iPhone
  // taxPage.style.webkitTransform = "scale(1)";
  // searchResults.style.webkitTransform = "scale(1)";
  // taxPage.WebkitTransform = "rotateZ(0deg)";

  // taxCountry = (typeof evt === "string") ? evt : evt.target.innerHTML;

  taxCountry = evt.target.innerText;

  if (evt.target.tagName === "A") {
    currentTaxonomyCountryElement = evt.target;
    // taxCountry = evt.target.children[1].innerHTML;
  }
  else if (evt.target.tagName === "SPAN") {
    currentTaxonomyCountryElement = evt.target.parentNode;
    // taxCountry = evt.target.innerHTML;
  }
  // else {  //  evt.target.tagName === "IMG")
  //   currentTaxonomyCountryElement = evt.target.parentNode;
  //   taxCountry = evt.target.nextElementSibling.innerText;
  // }

  // could probably replace first two options above with evt.target.innerText, not clicking on image tho
  // console.log("innerText = " + evt.target.innerText);

  if (lastQuery)   {
    document.getElementById("countrySearch").classList.remove("closed");
    document.getElementById("searchTerm").innerHTML = taxCountry + " : '" + lastQuery + "'";
    // document.querySelector(".results-panel").style.opacity = "1";
  }

  // all samTax calls could be put into one if (taxCountry === "South America")  else

  if (taxCountry === "French Guiana") {

    getAjax("Countries/FrenchGuianaSACC.html", updatetaxArticleQueries);
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }

  // because Curaçao is accented here but not in filenames
  else if (taxCountry === "Curaçao") {

    getAjax("Countries/CuracaoSACC.html", updatetaxArticleQueries);
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }

  else if (taxCountry === "South America") {

    getAjax("Countries/SouthAmericaSACC.html", updatetaxArticleQueries);
    searchResults.classList.add("samTax");

    // so hypotheticals and vagrants aren't selectable if South America is chosen

    searchSpecials.querySelector("span:nth-of-type(3)").classList.add("notAvailable");
    searchSpecials.querySelector("span:nth-of-type(5)").classList.add("notAvailable");

    searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }

  // else if (taxCountry === "Falklands/Malv.") {

  //   getAjax("Countries/FalklandsSACC.html", updatetaxArticleQueries);
  //   searchResults.classList.remove("samTax");
  //   taxPage.classList.remove("samTax");
  //   taxCountry = "Falklands";
  // }

  else if (taxCountry) {

    getAjax("Countries/" + taxCountry + "SACC.html", updatetaxArticleQueries);
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }

  if (currentTaxonomyCountry === "South America" && taxCountry !== "South America")  {
    searchSpecials.querySelector("span:nth-of-type(3)").classList.remove("notAvailable");
    searchSpecials.querySelector("span:nth-of-type(5)").classList.remove("notAvailable");
    searchSpecials.classList.remove("SAM");
  }

  // remove space from within "French Guiana", svg id = "FrenchGuiana"
  if (!lastQuery)  {

    currentMap.querySelector(".saveMapButton").style.display = "none";
    var temp = taxCountry.replace(" ", "");
    if (taxCountry !== "South America") selectedCountryFillColor(temp, selectedFillColor);
    else fillSAMmap("", "");
  }

  else if (lastQuery === "endemic" || lastQuery === "hypothetical"  || lastQuery === "vagrant" ||
      lastQuery === "incertae" || lastQuery === "extinct")  {

    currentMap.querySelector(".saveMapButton").style.display = "none";
    if (taxCountry !== "South America") selectedCountryFillColor(taxCountry.replace(" ", ""), selectedFillColor);
  }

  currentTaxonomyCountry = taxCountry;

  taxonomyCountryButton.innerHTML = taxCountry;
  if (taxCountry === "Falklands") taxonomyCountryButton.innerHTML = "Malvinas";

  currentTaxonomyCountryElement.classList.add("taxHighlight");
  if (currentTaxonomyCountryElement.classList.contains("checkHighlight")) currentTaxonomyCountryElement.classList.add("bothHighlights");

  taxonomyCountryButton.classList.remove("needsAttention");
  taxonomyCountryButton.classList.add("highlight");

  document.querySelector("#treeIntroText").innerHTML = taxCountry + " &nbsp; : &nbsp; " + numFamiliesList[taxCountry] + " families, " + numSpeciesList[taxCountry] + " species *";
  if (taxCountry === "Falklands")
    document.querySelector("#treeIntroText").innerHTML = "Falklands/Malvinas" + " &nbsp; : &nbsp; " + numFamiliesList[taxCountry] + " families, " + numSpeciesList[taxCountry] + " species *";

  document.querySelector(".colorKey").style.opacity = "0.9";

  animateScrollTop(taxPage);
}

function toggleSearchResultsPanel(evt) {

  if (resultsPanelOpen) closeResultsPanelButton.removeEventListener("click", toggleSearchResultsPanel);
  else closeResultsPanelButton.addEventListener("click", toggleSearchResultsPanel);

  searchResults.classList.toggle("fadeIn");
  resultsPanel.classList.toggle("translateDown");
  resultsPanelOpen = !resultsPanelOpen;
}



function updatetaxArticleQueries(data) {

  // <ul id='tree'>
  taxPage.innerHTML = data;

  var taxPanel = document.querySelector(".tax-panel");

  if (!taxTreeArticleOpen) taxPanel.classList.add("translateDown");

  else taxTreeArticleOpen = true;

  species = document.getElementById("tree").getElementsByTagName("li");
  families = taxPage.querySelectorAll("#tree .familyOpen, #tree .family");
  numFamilies = families.length;

	 // this restricts opening and closing to only the family names
	 // _("#taxPage .fco, #taxPage .fsc").on("click", toggleFamilyOpen);
  if (lastQuery) searchTree(lastQuery);
  document.querySelector("#taxPageButtons").addEventListener("click", closeAllFamilies);

  simpleBarTaxPage = new SimpleBar(document.getElementById("taxPage"), { autoHide: false });
  // simpleBarTaxPage.recalculate();

  resetTaxPageHeight();
}

function clearSearchInput()  {
  searchInput.placeholder = "";
  searchInput.removeEventListener("input", clearSearchInput);
  searchInput.removeEventListener("change", clearSearchInput);
  searchInput.removeEventListener("click", clearSearchInput);
  searchInput.removeEventListener("textInput", clearSearchInput);
  searchInput.removeEventListener("focusin", clearSearchInput);
}

//  Caller :
//     _("#searchInput").on ("input change click textInput focusin", getQuery);
//                             keyup removed
function getQuery(event)  {

  // var badIndex = searchInput.value.search(/[^a-zñã'\s\*\?-]/i);
  var badIndex = searchInput.value.search(/[^a-zñã'\s-]/i);

  if ( badIndex !== -1) {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; character '" + searchInput.value[badIndex] + "' not allowed </li><li></li>";
    // searchResults.style.height = "55px";

    // searchResults.classList.add("fadeIn");
    // resultsPanel.classList.add("translateDown");

    if (!resultsPanelOpen) toggleSearchResultsPanel(event);

    resetSearchResultsHeight();
    return;
  }

  // wait for at least two characters
  if (searchInput.value.length < 2)   {
    return;
  }

  var e = event || window.event;

  // all the same *** ?
  if (e.type === "textinput")   {
    searchTree(searchInput.value);
    e.preventDefault();
    return false;
  }
  else if (e.type === "input")             {  searchTree(searchInput.value);  }
  else if (e.type === "onpropertychange")  {  searchTree(searchInput.value);  }
}

function getSearchSpecialsQuery(evt)  {

  //  <span class="searchSpecialWrapper"><a>e<span class="highlightSpecial">x</span>tinct</a></span>
  //  <span class="searchSpecialWrapper"><a><span class="highlightSpecial">e</span>ndemic</a></span>

  // clear the input
  searchInput.value = "";

  // parentNode else if you click on "e" for example of extinct only the "e" is detected as the textContent of the target
  var term = evt.target.parentNode.textContent.trim();
  searchTree(term);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function searchTree(query2) {

  var query;
  query2 = escapeRegExp(query2);

  document.querySelector(".colorKey").style.opacity = "0.9";

  var numFound = 0;

  // var observer = new MutationObserver(function() {

  //   searchResults.style.height = "auto";

  //   if (searchResults.scrollHeight >= 300) {
  //     searchResults.style.height = "315px";
  //     simpleBarResults = new SimpleBar(document.getElementById("searchResults"));
  //     simpleBarResults.removeObserver();
  //     var elem = simpleBarResults.getScrollElement();
  //     elem.style.height = "315px";
  //   }
  //   else {
  //     searchResults.style.height = searchResults.scrollHeight + 15 + "px";
  //     simpleBarResults = new SimpleBar(document.getElementById("searchResults"));
  //     simpleBarResults.removeObserver();
  //     var elem = simpleBarResults.getScrollElement();
  //     elem.style.height = searchResults.scrollHeight + 15 + "px";
  //   }
  // });

  // observer.observe(searchResults, { childList: true });

  if (!currentTaxonomyCountry) {

    taxonomyCountryButton.classList.add("needsAttention");
    return;
  }

  if (!resultsPanelOpen) toggleSearchResultsPanel(event);

  // if (!resultsPanel.classList.contains("translateDown")) {
  //   searchResults.classList.add("fadeIn");
  //   resultsPanel.classList.add("translateDown");
  // }

  lastQuery = query2;

  if (lastQuery)  {
    document.getElementById("countrySearch").classList.remove("closed");
    if (currentTaxonomyCountry === "Falklands")  {
      document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '" + lastQuery + "'";
    }
    else document.getElementById("searchTerm").innerHTML = currentTaxonomyCountry + " : '" + lastQuery + "'";
  }
  else {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; search results will appear here</li><li></li>";

    if (!resultsPanelOpen) toggleSearchResultsPanel(event);
    // searchResults.classList.add("fadeIn");
    searchResults.style.top = 0;

    resetSearchResultsHeight();
    return;
  }

  animateScrollTop(searchResults);

  // reset all families.cloned to false, used to insert new families into searchResults
  for (var i = 0; i < numFamilies; i++) {
    families[i].cloned = false;
  }

  // boolean that search input term was bad or missing
  var warning = false;

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  var matches = [];
  var j = 0;
  var entry;
  var eClass;
  var sL = species.length;

  if (query2 === "endemic" || query2 === "hypothetical"  || query2 === "vagrant" ||
      query2 === "incertae" || query2 === "extinct")  {

    var special;

    if (query2 === "endemic") special = document.getElementById("tree").getElementsByClassName("endemic");
    else if (query2 === "extinct") special = document.getElementById("tree").getElementsByClassName("extinct");
    else if (query2 === "hypothetical") special = document.getElementById("tree").getElementsByClassName("hy");
    else if (query2 === "vagrant") special = document.getElementById("tree").getElementsByClassName("va");
    else if (query2 === "incertae") special = document.getElementById("tree").getElementsByClassName("ince");

    for (var k = 0; k < special.length ; k++ )  {

      // check if family has already been cloned
      if (special[k].parentNode.parentNode.parentNode.cloned !== true) {

        matches[j++] = special[k].parentNode.parentNode.parentNode.cloneNode(true);
        special[k].parentNode.parentNode.parentNode.cloned = true;
      }
      matches[j++] = special[k].parentNode.cloneNode(true);
    }
  }
  // not endemic, extinct, hypothetical, vagrant or incertae
  else {

    query2 = query2.replace(/^\s+|\s+$/g, "");

    //  wildcards * and ? ::
    // query2 = query2.replace(/\\\*/g, "[a-zA-Z'ñã\\s-]+");
    // query2 = query2.replace(/\\\?/g, "[a-zA-Z'ñã\\s-]");

    // SACC only uses ñ and São, no other accented characters
    query2 = query2.replace(/n/g, "(n|ñ)");
    query2 = query2.replace(/a/g, "(a|ã)");

    query2 = query2.replace(/ú/g, "u");
    query2 = query2.replace(/á/g, "a");
    query2 = query2.replace(/ó/g, "o");
    query2 = query2.replace(/í/g, "i");
    query2 = query2.replace(/ç/g, "c");

    // now database can have any number of spaces between genus and species
    query2 = query2.replace(/\s+/g, "\\s+");

    if (query2) {
      query = query2;
    }
    else {
      query = searchInput.value.replace(/^\s+|\s+$/g, "");
      if   ( query  ===   "type here") warning = true;
      else if   ( query  ===   "")  warning = true;
    }

    // bad or missing search term
    if (warning)  {
      searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; no search term entered</li><li></li>";

      if (!resultsPanelOpen) toggleSearchResultsPanel(event);
      // searchResults.classList.add("fadeIn");
      // searchResults.style.height = "55px";

      resetSearchResultsHeight();
      return;
    }

    var pattern = new RegExp(query, "i");

    // consider using array.filter(function()) in the future

    // nodes must be cloned otherwise they are removed from the tree !!

    for (i = 0; i < sL ; i++ )  {

      entry = species[i];
      eClass = entry.className;

      if (entry.firstChild.textContent.match(pattern) || entry.childNodes[1].textContent.match(pattern)) {

        if (eClass === "family" || eClass === "familyOpen")
          entry.cloned = true;

        var eParPar = entry.parentNode.parentNode;

        if (eClass !== "family" && eClass !== "familyOpen"
          && eParPar.cloned !== true) {

          matches[j++] = eParPar.cloneNode(true);
          eParPar.cloned = true;
        }
        matches[j++] = entry.cloneNode(true);
      }
    }
  }

  if (matches.length === 0)  {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; no matching results found</li><li></li>";

    if (!resultsPanelOpen) toggleSearchResultsPanel(event);
    // searchResults.classList.add("fadeIn");
    // searchResults.style.height = "55px";

    resetSearchResultsHeight();

    return;
  }

  var z;
  var matchClass;
  // if list isn't set to "", it defaults to undefined
  var list = "";

  for (k = 0; k < matches.length ; k++ )  {

    matchClass = matches[k].className;

    if (matchClass === "family" || matchClass === "familyOpen") {

      list += "<li class='family'><span class='fco'>";
      list += matches[k].firstChild.firstChild.textContent + "</span><span class='fsc'>";

      // <li class="family"><span class='fTitle'><span class="fcommon">INCERTAE SEDIS-2</span><span class="fscientific"> </span></span>
      // must have space between the spans
      // or handle as below

      list += (matches[k].firstChild.lastChild) ? matches[k].firstChild.childNodes[1].textContent : " ";
      list += "</span></li>";

      // only matched one family, get all its species and add them to list
      if (matches.length === 1) {
        for (z = 0; z < matches[0].children[1].children.length; z++) {

          list += "<li data-i='" +   matches[0].children[1].children[z].getAttribute("data-i") + "' class='bird'>" + matches[0].children[1].children[z].innerHTML + "</li>";
        }
        numFound = z;
      }
    }  // end of family/familyOpen

    else if (matchClass === "fsc")  {  /* do nothing */ }

    else {
      matches[k].style.textShadow = "none";  // *** ?
      list += "<li data-i='" +  matches[k].getAttribute("data-i") + "' class='bird'>" + matches[k].innerHTML + "</li>";
      numFound++;
    }
  }

  searchResults.innerHTML = list;

  if (!resultsPanelOpen) toggleSearchResultsPanel(event);
  // searchResults.classList.add("fadeIn");

  lastQuery = lastQuery.replace(/\\\*/g, "*");
  lastQuery = lastQuery.replace(/\\\?/g, "?");

  if (currentTaxonomyCountry === "Falklands") {
    document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '" + lastQuery + "'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
  }
  else {
    document.getElementById("searchTerm").innerHTML = currentTaxonomyCountry + " : '" + lastQuery + "'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
  }

  resetSearchResultsHeight();

  return;
}

function resetSearchResultsHeight() {

  searchResults.style.height = "auto";

  simpleBarResults = new SimpleBar(document.getElementById("searchResults"), { autoHide: false });
  simpleBarResults.recalculate();

  var elem;

  if (searchResults.scrollHeight >= 300) {
    searchResults.style.height = "325px";
    elem = simpleBarResults.getScrollElement();
    elem.style.maxHeight = "320px";
  }
  else {
    searchResults.style.height = searchResults.scrollHeight + 35 + "px";
    elem = simpleBarResults.getScrollElement();
    elem.style.height = searchResults.scrollHeight + 35 + "px";
  }

  simpleBarResults.recalculate();
}

function resetTaxPageHeight() {

  simpleBarTaxPage = new SimpleBar(taxPage, { autoHide: false });
  var elem;

  taxPage.style.height = "calc(100vh - 262px)";
  elem = simpleBarTaxPage.getScrollElement();
  elem.style.maxHeight = "calc(100vh - 262px)";

  simpleBarTaxPage.recalculate();
}

// <ul id="searchResults"></ul>
function gotoMatch(e) {

  currentMap.querySelector(".colorKey").style.opacity = "0.9";

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  var ev = e || window.event;  // window.event for IE8-
  var clicked = ev.target;
  var clickedPar = clicked.parentNode;
  var clickedClass = clicked.className;

  if (clicked.className.indexOf("simplebar") !== -1) return;
  if (clicked.className.indexOf("fadeIn") !== -1) return;

  if (clicked.textContent.replace(/^\s+|\s+$/g, "")      ===  "no matching results found")  return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") ===  "no search term entered")  return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") ===  "search results will appear here") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") ===  "")  return;

  // goto family level else to <li>commom scientific
  if (clickedClass === "family") {
    clicked = ev.target;
  }
  else if (clickedClass === "fco")  {
    clicked = clickedPar;
    clickedClass = "family";
  }
  else if (clickedClass === "fsc")  {
    clicked = clickedPar;
    clickedClass = "family";
  }
  else if (clickedClass.match(/co/) !== null) {
    clicked = clickedPar;
  }
  else if (clickedClass === "bird")  {
    clicked = ev.target;
  }
  else {
    clicked = clickedPar;
  }

  var sLen = species.length;
  var entry;
  var elem;
  var eText = clicked.textContent;

  for (var i = 0; i < sLen; i++ ) {

    entry = species[i];

    var entryTextTrimmed = entry.textContent.split("\n")[0];
    // match if clicked = common, scientific or default
    if (entryTextTrimmed === eText && clickedClass !== "family")  {

      var familyTemp = entry.parentNode;

      if (!familyTemp.classList.contains("open")) {

        familyTemp.classList.add("open");
        familyTemp.parentNode.className = "familyOpen";
      }

      // put highlighted bird at top of taxPage
      // entry.scrollIntoView(true);

      elem = simpleBarTaxPage.getScrollElement();

      elem.scrollTop = familyTemp.parentNode.offsetTop + entry.offsetTop - 100;

      entry.className = "active";

      lastSpecies = entry;
      lastIndex = Number(entry.getAttribute("data-i"));
      highlightSAMmap(lastIndex, "currentMap");

      if (lastResultsSpecies) lastResultsSpecies.classList.toggle("active");

      clicked.classList.toggle("active");
      lastResultsSpecies = clicked;
      addBirdNameToMap(entry);
      break;
    }

    // match in family, fcommon, fscientific  ||
    // "INCERTAE SEDIS-1 " for some reason eText returns a space at the end of the INCERTAE SEDIS's

    /*<li class='family'><span class='fTitle'><span class='fco'>SCREAMERS</span><span class='fsc'>ANHIMIDAE</span></span>
	    <ul class='birds'>
	      <li data-i='47'><span>Horned Screamer</span><span>Anhima cornuta</span></li>
	      <li data-i='49'><span>Northern Screamer</span><span>Chauna chavaria</span></li>
      </ul>
    </li>*/

    else if (entryTextTrimmed === eText && clickedClass === "family")  {

      elem = simpleBarTaxPage.getScrollElement();
      elem.scrollTop = entry.offsetTop;

      // family clicked on in searchResults
      //    put family at top of taxPage
      //   entry.scrollIntoView(true);  screws up IE

      // on a new search put lastSpecies if a family at top of taxPage?
      lastSpecies = entry.firstChild;
      lastSpecies.classList.toggle("active");

      if (lastResultsSpecies)  {
        lastResultsSpecies.classList.toggle("active");
        lastResultsSpecies = null;
      }
      break;
    }
  }
}

function addBirdNameToMap(name)  {

  var temp = "";

  if ( name ) {
    temp = "<span>" + name.firstChild.textContent + "</span><br/><span>" + name.lastChild.textContent + "</span>";
    document.getElementById("currentBirdName").innerHTML = temp;
  }
  else {
    document.getElementById("currentBirdName").innerHTML = temp;
  }
}

/* global highlightSAMmap */

function toggleFamilyOpen(event) {
  // console.log("toggleFamilyOpen");

  if (event.target.className.indexOf("simplebar") !== -1) return;

  if (event.target.id === "taxPage") return;

  // taxPage is not open yet
  if (!numFamilies) return;

  document.querySelector(".colorKey").style.opacity = "0.9";

  event = event || window.event;  // window.event for IE8-
  var familyTarget;
  var thisSpecies      =  event.target;
  var speciesClass = thisSpecies.className;

  // want familyTarget to = <ul class="birds"> to toggle display
  if (speciesClass === "family" || speciesClass === "familyOpen") {
    familyTarget = event.target.childNodes[1].nextSibling;
  }
  else if (speciesClass === "fco") {
    familyTarget = event.target.parentNode.nextSibling.nextSibling;
  }
  else if (speciesClass === "fsc") {
    familyTarget = event.target.parentNode.nextSibling.nextSibling;
  }
  else if (speciesClass === "fTitle" || speciesClass === "fTitle active") {
    familyTarget = event.target.nextSibling.nextSibling;
  }

  if (familyTarget && !familyTarget.classList.contains("open")) {

    familyTarget.classList.add("open");

    familyTarget.parentNode.className = "familyOpen";

    // console.log('familyTarget.scrollHeight = ' + familyTarget.scrollHeight);


    // clicked on a closed family
    // check to see if family at bottom of taxPage, if so, open and move up ?*

    // Element.scrollIntoViewIfNeeded()  webkit only

    var taxPageHeight = taxPage.getBoundingClientRect().height;

    if (familyTarget.offsetTop - taxPage.scrollTop > taxPageHeight - 24)  {

      //  will the entire family fit in taxPage ?

      if (familyTarget.parentNode.clientHeight > taxPageHeight)
        taxPage.scrollTop = familyTarget.parentNode.offsetTop;

      else
        taxPage.scrollTop += familyTarget.lastElementChild.offsetTop + familyTarget.lastElementChild.clientHeight;
    }
    //  show family and numSpecies in that family
    document.querySelector("#treeIntroText").innerHTML = currentTaxonomyCountry + "  &nbsp; : &nbsp; " + familyTarget.parentNode.firstChild.children[1].textContent + " has " + familyTarget.children.length + " species";
  }

  else if (familyTarget)  {
    familyTarget.classList.remove("open");
    familyTarget.parentNode.className = "family";

    var reset = familyTarget.parentNode.querySelectorAll(".active");

    if (reset.length) {
      reset[0].classList.remove("active");
    }
    document.querySelector("#treeIntroText").innerHTML = currentTaxonomyCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentTaxonomyCountry] + " families, " + numSpeciesList[currentTaxonomyCountry] + " species";
  }
  //   clicked on a species in the taxTree
  if (!familyTarget) {
    // clicked in between common and scientific names in an open family, i.e., the LI element, not a DIV/SPAN

    //    <ul class="span">
    //    <li data-i="2692"><span>Tepui Wren</div><div>Troglodytes rufulus</span></li>

    if (thisSpecies.parentNode.classList.contains("birds")) {
      thisSpecies = thisSpecies.firstChild;
    }

    thisSpecies.parentNode.className = "active";

    if (thisSpecies.parentNode !== lastSpecies) {

      if (lastSpecies && lastSpecies.classList.contains("active")) {
        lastSpecies.classList.remove("active");
      }
    }

    lastSpecies = thisSpecies.parentNode;
    if (lastResultsSpecies) lastResultsSpecies.classList.toggle("active");
    lastResultsSpecies = null;

    addBirdNameToMap(thisSpecies.parentNode);

    lastIndex = Number(thisSpecies.parentNode.getAttribute("data-i"));
    highlightSAMmap(lastIndex, "currentMap");

    document.querySelector("#treeIntroText").innerHTML = currentTaxonomyCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentTaxonomyCountry] + " families, " + numSpeciesList[currentTaxonomyCountry] + " species *";
  }

  taxPage.style.zIndex = 5;
}

function closeAllFamilies()  {

  var openedFamilies = taxPage.querySelectorAll("#tree .familyOpen ul");
  var len = openedFamilies.length;

  for (var i = 0; i < len; i++)  {

    openedFamilies[i].classList.remove("open");
    openedFamilies[i].classList.add("closed");

    openedFamilies[i].parentNode.className = "family";
  }
  // **** reset families and species of country
  document.querySelector("#treeIntroText").innerHTML = currentTaxonomyCountry + "   &nbsp; : " + numFamiliesList[currentTaxonomyCountry] + " families, " + numSpeciesList[currentTaxonomyCountry] + " species *";
}
//# sourceMappingURL=sourcemaps/taxonomy.js.map
