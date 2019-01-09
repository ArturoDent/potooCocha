"use strict";

var lastQuery;
var lastSpecies;

var species;
var families;
var numFamilies;

// eslint-disable-next-line
var birds;

var numSpeciesList = {
  "Argentina": 1005, "Aruba": 219, "Bolivia": 1383, "Brazil": 1804, "Chile": 498,
  "Colombia": 1847, "Curaçao": 217, "Ecuador": 1632, "French Guiana": 698,
  "Guyana": 783, "Paraguay": 694, "Peru": 1803, "Suriname": 731, "Trinidad": 470,
  "Uruguay": 448, "Venezuela": 1383, "Bonaire": 209, "Falklands": 227, "South America": 3402
};

// numSpecies does not include hypotheticals, so taken from http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm
// numFamilies does not include Incertae Sedis-1 or Incertae Sedis-2

var numFamiliesList = {
  "Argentina": 87, "Aruba": 52, "Bolivia": 78, "Brazil": 91, "Chile": 67,
  "Colombia": 90, "Curaçao": 50, "Ecuador": 91, "French Guiana": 82,
  "Guyana": 78, "Paraguay": 72, "Peru": 88, "Suriname": 80, "Trinidad": 70,
  "Uruguay": 72, "Venezuela": 87, "Bonaire": 47, "Falklands": 48, "South America": 102
};

// South America : 102 families not including 2 incertae "families", 3394 total spp.
//   class='fco'>(?!INCERTAE).*?  --> finds number of families not including INCERTAE in ..SACC.html

var searchCountryText;
var taxTreeArticleOpen = false;

var taxPage;
var searchSpecials;
var resultsPanel;
var searchResults;

var simpleBarResults;
var simpleBarTaxPage;

var closeResultsPanelButton;
var resultsPanelOpen = false;
var printerButton;
var closeOpenFamilies;

var searchInput;

var lastResultsSpecies;
var lastIndex;

var searchSlideUpWrapper;
var taxInstructionsButton;
var searchInstructionsOpen = true;


/* global  SimpleBar  currentMap  currentCountry  */

document.addEventListener("DOMContentLoaded", function () {

  searchSlideUpWrapper = document.querySelector("#taxonomyArticle > div.slideUpWrapper");
  searchSlideUpWrapper.style.height = searchSlideUpWrapper.clientHeight + "px";

  taxInstructionsButton = document.querySelector(".taxInstructionsButton");

  closeResultsPanelButton = document.getElementById("closeResultsPanelButton");
  closeResultsPanelButton.addEventListener("click", toggleSearchResultsPanel);

  // FIXME :
  printerButton = document.getElementById("printerButton");
  printerButton.addEventListener("click", printElem);
  // closeResultsPanelButton.addEventListener("click", printElem);

  closeOpenFamilies = document.getElementById("closeOpenFamiliesButton");
  closeOpenFamilies.addEventListener("click", closeAllFamilies);

  searchCountryText = document.getElementById("searchCountryText");

  searchInput = document.getElementById("searchInput");
  searchSpecials = document.getElementById("searchSpecials");

  // TODO : (are all of these necessary?)  (especially "click" and "focusin"?)
  searchInput.addEventListener("input", getQuery);
  // searchInput.addEventListener("change", getQuery);
  // searchInput.addEventListener("click", getQuery);
  // searchInput.addEventListener("textInput", getQuery);
  // searchInput.addEventListener("focusin", getQuery);

  searchSpecials.addEventListener("click", getSearchSpecialsQuery);

  taxInstructionsButton.addEventListener("click", showSearchInstructions);

  taxPage = document.getElementById("taxPage");
  // TODO : set taxPage height here??

  searchResults = document.getElementById("searchResults");
  resultsPanel = document.querySelector(".results-panel");

  searchResults.addEventListener("click", gotoMatch, false);
  taxPage.addEventListener("click", toggleFamilyOpen);
  // document.querySelector("#taxPageButton").addEventListener("click", closeAllFamilies);

  // TODO : (start with searchInstructions closed?)
  // showSearchInstructions(),

  // preloading the file occurrences.txt
  // TODO : (delay this ? prefetch?)
  getAjax("../data/occurrences.txt", function (data) { loadOccurrences(data); });
});

function getAjax(url, success) {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
  };
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
  return xhr;
}

function loadOccurrences(data) {
  birds = data.split("\n");
  // loadRandomCountryAtStart();
  // loadArubaStart();
}

// TODO : (can this be delayed at start?)
// function loadArubaStart() {

//   lastQuery = "elae";
//   // lastQuery = "rufo";
//   // set searchInput.value to lastQuery
//   // set currentCountry to firstCountry
//   searchInput.value = lastQuery;

//   // TODO : (assign currentCountry in main.js)

//   // eslint-disable-next-line
//   currentCountry = "Aruba";
//   loadCountryTaxonomy(currentCountry);
//   setChecklistCountryAuthors(currentCountry);

//   // evt.target = "<span>Ornate Stipplethroat</span>";
//   // gotoMatch(evt);
//   // searchResults.addEventListener("click", gotoMatch);
// }

// function loadRandomCountryAtStart() {

//   var firstKey = Math.floor(Math.random() * 19);
//   var firstCountry = Object.keys(numSpeciesList)[firstKey];
//   console.log("firstCountry = " + firstCountry);

//   lastQuery = "xantho";
//   // set searchInput.value to lastQuery
//   // set currentCountry to firstCountry
//   searchInput.value = lastQuery;
//   // TODO : (assign currentCountry in main.js)
//   // eslint-disable-next-line
//   currentCountry = firstCountry;
//   loadCountryTaxonomy(firstCountry);
// }

// function animateScrollTop(el) {

//   // var step = el.scrollTop / (duration/25);
//   var step = 25;

//   (function animateScroll() {
//     el.scrollTop -= step;
//     if (el.scrollTop > 0) setTimeout(animateScroll, 25);
//   })();
// }

function showSearchInstructions() {

  // TODO : (merge these below)
  if (!searchInstructionsOpen) document.querySelector(".taxInstructionsButton .tooltip").innerHTML = "Close";
  else document.querySelector(".taxInstructionsButton .tooltip").innerHTML = "Open";

  if (!taxInstructionsButton.classList.contains("instructionsClosed")) taxInstructionsButton.classList.add("instructionsClosed");
  searchSlideUpWrapper.classList.toggle("closeInstructions");
  searchInstructionsOpen = !searchInstructionsOpen;
}

// eslint-disable-next-line
function loadCountryTaxonomy(country) {

  if (searchSpecials.classList.contains("grayed")) {
    document.querySelector("#searchForm span.grayed").classList.remove("grayed");
    searchSpecials.classList.remove("grayed");
    // prepareSVGstyles("SAMsvg");
  }

  if (lastQuery) {
    document.getElementById("countrySearch").classList.remove("closed");
    // document.getElementById("searchTerm").innerHTML = country + " : '" + lastQuery + "'";
    document.getElementById("searchTerm").innerHTML = country + " : '<span>" + lastQuery + "</span>'";
  }

  if (country !== "South America") {
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }

  if (country === "French Guiana") getAjax("Countries/FrenchGuianaSACC.html", getCountryData);

  // because Curaçao is accented here but not in filenames
  else if (country === "Curaçao") getAjax("Countries/CuracaoSACC.html", getCountryData);

  else if (country === "South America") {

    getAjax("Countries/SouthAmericaSACC.html", getCountryData);
    searchResults.classList.add("samTax");

    // so hypotheticals and vagrants aren't selectable if South America is chosen

    searchSpecials.querySelector("span:nth-of-type(3)").classList.add("notAvailable");
    searchSpecials.querySelector("span:nth-of-type(5)").classList.add("notAvailable");

    searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }

  else if (country) getAjax("Countries/" + country + "SACC.html", getCountryData);

  if (country !== "South America") {
    searchSpecials.querySelector("span:nth-of-type(3)").classList.remove("notAvailable");
    searchSpecials.querySelector("span:nth-of-type(5)").classList.remove("notAvailable");
    searchSpecials.classList.remove("SAM");
  }

  if (!lastQuery) {
    currentMap.querySelector(".saveMapButton").style.display = "none";
    document.querySelector(".colorKey").style.opacity = "0.9";
  }

  else if (lastQuery === "endemic" || lastQuery === "hypothetical" || lastQuery === "vagrant" ||
    lastQuery === "incertae" || lastQuery === "extinct") {

    currentMap.querySelector(".saveMapButton").style.display = "none";
  }

  if (country === "Falklands") searchCountryText.innerHTML = "the Falklands";
  else searchCountryText.innerHTML = country;

  if (country === "Falklands")
    document.querySelector("#treeIntroText").innerHTML = "Falklands/Malvinas" + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";
  else document.querySelector("#treeIntroText").innerHTML = country + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";

  // document.querySelector(".colorKey").style.opacity = "0.9";

  // animateScrollTop(taxPage);
}

function toggleSearchResultsPanel() {

  // if (resultsPanelOpen)   closeResultsPanelButton.removeEventListener("click", toggleSearchResultsPanel);
  // else   closeResultsPanelButton.addEventListener("click", toggleSearchResultsPanel);

  // TODO : (delay if countryMenu selecting)
  searchResults.classList.toggle("fadeIn");
  resultsPanel.classList.toggle("translateDown");
  resultsPanelOpen = !resultsPanelOpen;
}

function closeOpenFamilies() {

}

function getCountryData(data) {

  // <ul id='tree'>
  //  TODO  : (fixed size? for taxPage)
  taxPage.innerHTML = data;

  var taxPanel = document.querySelector(".tax-panel");

  //  TODO  : (delay translateDown till after countryMenu is gone)
  //  TODO  : (or have already translatedDown?)
  if (!taxTreeArticleOpen) {
    taxPanel.classList.add("translateDown");

    // var browser = navigator.userAgent;
    // if (browser.indexOf("Edge") > -1) map.classList.toggle("fadeMap");
  }
  else taxTreeArticleOpen = true;

  // so "species" includes the family level and individual bird species
  species = document.getElementById("tree").getElementsByTagName("li");

  //  TODO  : (any need for familyOpen?)
  // families = taxPage.querySelectorAll("#tree .familyOpen, #tree .family");
  families = taxPage.querySelectorAll("#tree .family");
  numFamilies = families.length;

  if (lastQuery) searchTree(lastQuery);
  // document.querySelector("#taxPageButton").addEventListener("click", closeAllFamilies);

  // simpleBarTaxPage = new SimpleBar(document.getElementById("taxPage"), { autoHide: false });
  // simpleBarTaxPage = new SimpleBar(taxPage), { autoHide: false });
  //  FIXME : (height of simpleBar?)
  resetTaxPageHeight();
}

//  Caller :  ("#searchInput").on ("input change click textInput focusin", getQuery);    keyup removed
function getQuery() {

  var badIndex = searchInput.value.search(/[^a-zñã'\s-]/i);

  if (badIndex !== -1) {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; character '" + searchInput.value[badIndex] + "' not allowed </li><li></li>";
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    resetSearchResultsHeight();
    return;
  }

  // wait for at least two characters
  if (searchInput.value.length < 2) {
    return;
  }

  searchTree(searchInput.value);
}

function getSearchSpecialsQuery(evt) {

  // <div id="searchSpecials" class="grayed">
  //    <span class="searchSpecialWrapper"><a>e<span class="highlightSpecial">x</span>tinct</a></span>
  //    <span class="searchSpecialWrapper"><a><span class="highlightSpecial">e</span>ndemic</a></span>

  var term;

  // clear the input
  searchInput.value = "";

  if (evt.target.id === "searchSpecials") return;     // clicked in #searchSpecials but not on a button area
  else if (evt.target.className === "searchSpecialWrapper")
    term = evt.target.textContent.trim();    // clicked between "visible" buttons but on their background, i.e., "searchSpecialWrapper"
  else term = evt.target.parentNode.textContent.trim();

  // parentNode else if you click on "e" for example of extinct only the "e" is detected as the textContent of the target
  // var term = evt.target.parentNode.textContent.trim();
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

  if (!resultsPanelOpen) toggleSearchResultsPanel();

  lastQuery = query2;

  if (lastQuery) {
    document.getElementById("countrySearch").classList.remove("closed");
    if (currentCountry === "Falklands") {
      // document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '" + lastQuery + "'";
      document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '<span>" + lastQuery + "</span>'";
    }
    // else document.getElementById("searchTerm").innerHTML = currentCountry + " : '" + lastQuery + "'";
    else document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'";
  }
  else {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; search results will appear here</li><li></li>";

    if (!resultsPanelOpen) toggleSearchResultsPanel();
    searchResults.style.top = 0;

    resetSearchResultsHeight();
    return;
  }

  // animateScrollTop(searchResults);

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

  if (query2 === "endemic" || query2 === "hypothetical" || query2 === "vagrant" ||
    query2 === "incertae" || query2 === "extinct") {

    var special;

    if (query2 === "endemic") special = document.getElementById("tree").getElementsByClassName("endemic");
    else if (query2 === "extinct") special = document.getElementById("tree").getElementsByClassName("extinct");
    else if (query2 === "hypothetical") special = document.getElementById("tree").getElementsByClassName("hy");
    else if (query2 === "vagrant") special = document.getElementById("tree").getElementsByClassName("va");
    else if (query2 === "incertae") special = document.getElementById("tree").getElementsByClassName("ince");

    for (var k = 0; k < special.length; k++) {

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
      if (query === "type here") warning = true;
      else if (query === "") warning = true;
    }

    // bad or missing search term
    if (warning) {
      searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; no search term entered</li><li></li>";

      if (!resultsPanelOpen) toggleSearchResultsPanel();

      resetSearchResultsHeight();
      return;
    }

    var pattern = new RegExp(query, "i");

    // consider using array.filter(function()) in the future

    // nodes must be cloned otherwise they are removed from the tree !!

    for (i = 0; i < sL; i++) {

      entry = species[i];
      eClass = entry.className;
      var eParPar = entry.parentNode.parentNode;

      // "<li class="family"><span class="fTitle"><span class="fco">RHEAS</span><span class="fsc">RHEIDAE</span></span>
      //    <ul class="birds">

      //      <li data-i="0"><span>Greater Rhea</span><span>Rhea americana</span></li>
      //      <li data-i="1"><span>Lesser Rhea</span><span>Rhea pennata</span></li>
      //    </ul>
      //  </li>"

      if (eClass) {  // eClass === "family" || eClass === "familyOpen"

        // match family scientific and common names separately
        if (entry.firstChild.firstChild.textContent.match(pattern) || entry.firstChild.lastChild.textContent.match(pattern)) {
          entry.cloned = true;
          matches[j++] = entry.cloneNode(true);
        }
      }

      else {  // "<li data-i="0"><span>Greater Rhea</span><span>Rhea americana</span></li>"

        // match species common and scientific names respectively
        if (entry.firstChild.textContent.match(pattern) || entry.childNodes[1].textContent.match(pattern)) {

          // if the family is not already cloned and added to the match list, add it
          if (eParPar.cloned !== true) {
            matches[j++] = eParPar.cloneNode(true);
            eParPar.cloned = true;
          }
          matches[j++] = entry.cloneNode(true);
        }
      }
    }
  }

  if (matches.length === 0) {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; no matching results found</li><li></li>";

    if (!resultsPanelOpen) toggleSearchResultsPanel();

    resetSearchResultsHeight();

    return;
  }

  var z;
  var matchClass;
  // if list isn't set to "", it defaults to undefined
  var list = "";

  for (k = 0; k < matches.length; k++) {

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

          list += "<li data-i='" + matches[0].children[1].children[z].getAttribute("data-i") + "' class='bird'>" + matches[0].children[1].children[z].innerHTML + "</li>";
        }
        numFound = z;
      }
    }  // end of family/familyOpen

    else if (matchClass === "fsc") {  /* do nothing */ }

    else {
      matches[k].style.textShadow = "none";  // *** ?
      list += "<li data-i='" + matches[k].getAttribute("data-i") + "' class='bird'>" + matches[k].innerHTML + "</li>";
      numFound++;
    }
  }

  searchResults.innerHTML = list;

  if (!resultsPanelOpen) toggleSearchResultsPanel();
  // searchResults.classList.add("fadeIn");

  // lastQuery = lastQuery.replace(/\\\*/g, "*");
  // lastQuery = lastQuery.replace(/\\\?/g, "?");

  if (currentCountry === "Falklands") {
    // document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '" + lastQuery + "'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
    document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;   [ " + numFound + " species ]";
  }
  else {
    // document.getElementById("searchTerm").innerHTML = currentCountry + " : '" + lastQuery + "'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
    document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
  }

  resetSearchResultsHeight();

  // i.e., first run
  // TODO : (why no work?)
  // if (!lastSpecies) {

  //   var evt = new MouseEvent("click", {
  //     bubbles: true,
  //     cancelable: true,
  //     view: window
  //   });

  //   var cb = document.getElementById("searchResults").children[7]; //element to click on
  //   cb.dispatchEvent(evt);
  // }
  // return;
}

function resetSearchResultsHeight() {

  searchResults.style.height = "auto";

  simpleBarResults = new SimpleBar(document.getElementById("searchResults"), { autoHide: false });
  // simpleBarResults.recalculate();

  var elem;

  if (searchResults.scrollHeight >= 300) {
    searchResults.style.height = "25rem";
    elem = simpleBarResults.getScrollElement();
    elem.style.height = "25rem";
  }
  else {
    searchResults.style.height = searchResults.scrollHeight + "px";
    elem = simpleBarResults.getScrollElement();
    elem.style.height = searchResults.scrollHeight + "px";
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

// <ul id="searchResults"></ul>
function gotoMatch(e) {

  currentMap.querySelector(".colorKey").style.opacity = "0.9";

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  // TODO : (element.closest()? with polyfill)
  var ev = e || window.event;  // window.event for IE8-
  var clicked = ev.target;

  // console.log(ev.target);

  var clickedPar = clicked.parentNode;
  var clickedClass = clicked.className;

  if (clicked.className.indexOf("simplebar") !== -1) return;
  if (clicked.className.indexOf("fadeIn") !== -1) return;

  if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "no matching results found") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "no search term entered") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "search results will appear here") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "") return;

  // goto family level else to <li>commom scientific
  // TODO : (closest()?)
  if (clickedClass === "family") {
    clicked = ev.target;
  }
  else if (clickedClass === "fco") {
    clicked = clickedPar;
    clickedClass = "family";
  }
  else if (clickedClass === "fsc") {
    clicked = clickedPar;
    clickedClass = "family";
  }
  else if (clickedClass.match(/co/) !== null) {
    clicked = clickedPar;
  }
  else if (clickedClass === "bird") {
    clicked = ev.target;
  }
  else {
    clicked = clickedPar;
  }

  var sLen = species.length;
  var entry;
  var elem;
  var eText = clicked.textContent;

  for (var i = 0; i < sLen; i++) {

    entry = species[i];

    var entryTextTrimmed = entry.textContent.split("\n")[0];
    // match if clicked = common, scientific or default
    if (entryTextTrimmed === eText && clickedClass !== "family") {

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


    //
    else if (entryTextTrimmed === eText && clickedClass === "family") {

      elem = simpleBarTaxPage.getScrollElement();
      elem.scrollTop = entry.offsetTop;

      // family clicked on in searchResults
      //    put family at top of taxPage
      //   entry.scrollIntoView(true);  screws up IE

      // on a new search put lastSpecies if a family at top of taxPage?
      lastSpecies = entry.firstChild;
      lastSpecies.classList.toggle("active");

      if (lastResultsSpecies) {
        lastResultsSpecies.classList.toggle("active");
        lastResultsSpecies = null;
      }
      break;
    }
  }
}

function addBirdNameToMap(name) {

  var temp = "";

  if (name) {
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
  var thisSpecies = event.target;
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

    if (familyTarget.offsetTop - taxPage.scrollTop > taxPageHeight - 24) {

      //  will the entire family fit in taxPage ?

      if (familyTarget.parentNode.clientHeight > taxPageHeight)
        taxPage.scrollTop = familyTarget.parentNode.offsetTop;

      else
        taxPage.scrollTop += familyTarget.lastElementChild.offsetTop + familyTarget.lastElementChild.clientHeight;
    }
    //  show family and numSpecies in that family
    // INCERTAE SEDIS-1 and INCERTAE SEDIS-2
    var scientificFamily = familyTarget.parentNode.firstChild.children[1].textContent;
    if (!scientificFamily) scientificFamily = familyTarget.parentNode.firstChild.children[0].textContent;

    document.querySelector("#treeIntroText").innerHTML = currentCountry + "  &nbsp; : &nbsp; " + scientificFamily + " has " + familyTarget.children.length + " species";
  }

  else if (familyTarget) {
    familyTarget.classList.remove("open");
    familyTarget.parentNode.className = "family";

    var reset = familyTarget.parentNode.querySelectorAll(".active");

    if (reset.length) {
      reset[0].classList.remove("active");
    }
    document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species";
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

    document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species *";
  }

  taxPage.style.zIndex = 5;
}

function closeAllFamilies() {

  var openedFamilies = taxPage.querySelectorAll("#tree .familyOpen ul");
  var len = openedFamilies.length;

  for (var i = 0; i < len; i++) {

    openedFamilies[i].classList.remove("open");
    openedFamilies[i].classList.add("closed");

    openedFamilies[i].parentNode.className = "family";
  }
  // **** reset families and species of country
  document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species *";
}

function printElem (evt) {

  var divId = evt.target.id;
  if (divId === "printerButton" || evt.target.nodeName === "use") divId = "searchResults";

  var content = document.getElementById(divId).children[2].innerHTML;
  var numSpecies = document.getElementsByClassName("bird").length;

  var html = '<html><head><title></title><head>';
  html += '<link rel="stylesheet" href="temp/css/printSearchresults.css" />';
  html += '</head><body>';
  html += '<h3>' + currentCountry + ' : &nbsp;\'' + lastQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
  html += content;
  html += '</body></html>';

  var printWindow = window.open('_blank', 'Print', 'menubar=yes,scroll=yes,height=600,width=800');

  printWindow.document.write(html);
  // printWindow.focus();

  setTimeout(function() {
    printWindow.print();
    printWindow.close();
   }, 1000);

  return true;
}