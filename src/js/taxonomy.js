"use strict";

var lastQuery;
var lastSpecies;

var species;
var families;
var numFamilies;

// eslint-disable-next-line
var birds;

var searchCountryText;
var taxTreeArticleOpen = false;

var taxPage;
var taxPanel;
var searchSpecials;
var resultsPanel;
var searchResults;

var simpleBarResults;
var simpleBarTaxPage;

var resultsPanelOpen = false;
var printerButton;
var closeOpenFamiliesButton;

var searchInput;
var searchCache = {};
var previousSearchResults;

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

  printerButton = document.getElementById("printerButton");
  printerButton.addEventListener("click", printElem);

  closeOpenFamiliesButton = document.getElementById("closeOpenFamiliesButton");
  closeOpenFamiliesButton.addEventListener("click", closeAllFamilies);

  searchCountryText = document.getElementById("searchCountryText");

  searchInput = document.getElementById("searchInput");
  searchSpecials = document.getElementById("searchSpecials");

  // (are all of these necessary?)  (especially "click" and "focusin"?)
  searchInput.addEventListener("input", getQuery);
  // "change", "click", "textInput", "focusin"

  searchSpecials.addEventListener("click", getSearchSpecialsQuery);
  searchSpecials.addEventListener("keyup", getSearchSpecialsQuery);  

  taxInstructionsButton.addEventListener("click", toggleSearchInstructions);

  taxPage = document.getElementById("taxPage");

  searchResults = document.getElementById("searchResults");
  resultsPanel = document.getElementById("results-panel");

  searchResults.addEventListener("click", gotoMatch, false);
  taxPage.addEventListener("click", toggleFamilyOpen);
  taxPanel = document.getElementById("tax-panel");
  
  // preloading the file occurrences.txt
  getAjax("../occurrences/occurrences.txt", function (data) { loadOccurrences(data); });
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


/**
 *
 * @param {*} data
 */
function loadOccurrences(data) {
  birds = data.split("\n");
}

// function animateScrollTop(el) {

//   // var step = el.scrollTop / (duration/25);
//   var step = 25;

//   (function animateScroll() {
//     el.scrollTop -= step;
//     if (el.scrollTop > 0) setTimeout(animateScroll, 25);
//   })();
// }

function toggleSearchInstructions() {

  // TODO : (merge these below)  
  var taxInstructionTooltip = document.querySelector(".taxInstructionsButton .tooltip");
  
  if (!searchInstructionsOpen) taxInstructionTooltip.innerHTML = "Close";
  else taxInstructionTooltip.innerHTML = "Open";

  //  do only once, hence no toggle
  if (!taxInstructionsButton.classList.contains("instructionsClosed")) taxInstructionsButton.classList.add("instructionsClosed");
  
  searchSlideUpWrapper.classList.toggle("closeInstructions");  
  resultsPanel.classList.toggle("closeInstructions");  
  
  if (searchInstructionsOpen) moveTaxPanel("searchInstructionsClosing");
  else moveTaxPanel("searchInstructionsOpening");
  
  searchInstructionsOpen = !searchInstructionsOpen;
}

function enableSearchSpecials() {
  
  document.querySelector("#searchForm span.grayed").classList.remove("grayed");
  searchSpecials.classList.remove("grayed");
  
  var list = searchSpecials.querySelectorAll("a");
    // set tabIndex from -1 to 0 so tabbing works through searchSpecials after country is chosen
    
  list.forEach(function(element) {
    element.setAttribute("tabindex", "0");
  });
  
  searchInput.setAttribute("tabindex", "0");
}

// eslint-disable-next-line
function loadCountryTaxonomy(country) {

  if (searchSpecials.classList.contains("grayed")) {
    enableSearchSpecials();    
    
    closeOpenFamiliesButton.setAttribute("tabindex", "0");
  }

  // lastQuery.slice(0, 24) to limit lastQuery length in the searchTerm flyout
  if (lastQuery) {
    document.getElementById("countrySearch").classList.remove("closed");
    document.getElementById("searchTerm").innerHTML = country + " : '<span>" + lastQuery + "</span>'";
  }

  if (country !== "South America") {
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }
//  -----------------------------------------------------------------------------------------------
  if (country === "French Guiana") getAjax("Countries/FrenchGuianaSACC.html", getCountryData);
  // because Curaçao is accented here but not in filenames
  else if (country === "Curaçao") getAjax("Countries/CuracaoSACC.html", getCountryData);
  else if (country === "South America") {
    getAjax("Countries/SouthAmericaSACC.html", getCountryData);
    searchResults.classList.add("samTax");

    // so hypotheticals and vagrants aren't selectable if South America is chosen
    searchSpecials.querySelector("div:nth-of-type(3)").classList.add("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(5)").classList.add("notAvailable");

    searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }
  else if (country) getAjax("Countries/" + country + "SACC.html", getCountryData);
  //  TODO  : gwtAjax the JSON file
//  -----------------------------------------------------------------------------------------------
  

  if (country !== "South America") {
    searchSpecials.querySelector("div:nth-of-type(3)").classList.remove("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(5)").classList.remove("notAvailable");
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

  if (country === "Falklands") searchCountryText.innerHTML = "the Falkland Islands";
  else searchCountryText.innerHTML = country;

  if (country === "Falklands")
    document.querySelector("#treeIntroText").innerHTML = "Falklands/Malvinas" + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";
  else document.querySelector("#treeIntroText").innerHTML = country + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";
}

function toggleSearchResultsPanel() {  
  
  resultsPanel.classList.toggle("resultsPanelBoolean");
    
  if (!resultsPanelOpen) {      // results-panel was not open
    moveTaxPanel("searchResultsOpening");
    printerButton.setAttribute("tabindex", "0");
  }
  else {                        // results-panel was open
    moveTaxPanel("searchResultsClosing");    
    printerButton.setAttribute("tabindex", "-1");
  }

  resultsPanelOpen = !resultsPanelOpen;
}

function moveTaxPanel(whatIsOpening) {
  
  //    "searchResultsOpening", "searchResultsClosing"
  //    "searchInstructionsClosing", "searchInstructionsOpening"
  
  var instructionsHeight = searchSlideUpWrapper.style.height;
  // transform: translateY(-15rem);  // the initial state
  
  switch (whatIsOpening) {
    
    case "searchResultsOpening":
      if (searchInstructionsOpen) {
        taxPanel.style.transform = "translateY(-128px)";
      }
      else {
        var shift = 100 + parseInt(instructionsHeight) + "px";        
        taxPanel.style.transform = "translateY(-" + shift + ")"; 
      }
      break;
    
    case "searchInstructionsClosing":
      if (resultsPanelOpen) {
        var shift = 100 + parseInt(instructionsHeight) + "px";        
        taxPanel.style.transform = "translateY(-" + shift + ")";        
      }
      else {
        var shift = 200 + parseInt(instructionsHeight) + "px";
        taxPanel.style.transform = "translateY(-" + shift + ")";        
      }
      break;
    
    case "searchInstructionsOpening":
      if (resultsPanelOpen)  {
        var shift = -100 + parseInt(instructionsHeight) + "px";        
        taxPanel.style.transform = "translateY(-" + shift + ")";        
      }
      else {
        var shift = 220 + "px";        
        taxPanel.style.transform = "translateY(-" + shift + ")";        
      }
      break;
  
    default:
      break;
  }
}

function getCountryData(data) {

  // <ul id='tree'>
  //  TODO  : tabindex="0" on all families and species !! ***
  taxPage.innerHTML = data;

  // so "species" includes the family level _and_ individual bird species
  species = document.getElementById("tree").getElementsByTagName("li");
  // for memoize, could loop through families instead of all species

  //  TODO  : (any need for familyOpen?)
  families = taxPage.querySelectorAll("#tree .family");
  numFamilies = families.length;

  if (lastQuery) searchTree(lastQuery); //  TODO  : memoize, set flag for new country here?

  resetTaxPageHeight();
}

//  Caller :  ("#searchInput").on ("input change click textInput focusin", getQuery);    keyup removed
function getQuery() { 
  
  // úáóíç are not used by SACC, and will be swapped later for 'uaoic'
  var badIndex = searchInput.value.search(/[^"a-zñãúáóíç'\s-]/i);

  if (badIndex !== -1) {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; character not allowed </li><li></li>";
    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    return;
  }

  // wait for at least two characters
  if (searchInput.value.length < 2) {
    return;
  }
  
  var searcFormContents = document.querySelector(".searchForm_contents");
  // keep a minimum of 20 ch's width in input field and add 1 ch width for every query.length > 8
  if (searchInput.value.length > 6) {
    searcFormContents.style.left = "-" + (searchInput.value.length - 6)/5 + "ch";
    searchInput.size = 20 + (searchInput.value.length - 6);
  }
  
  searchTree(searchInput.value); // memoize, set flag for same country
}

// going backward this is good, but also want to limit search going forward in searches
// how to limit the cache or clear old values?

// if searchInput.value.length is 1 more than last value && substring is the same,
// then search using the old cached result: searchTree(search.cache[searchInput.value.subst(), query2)

    // a memoized function
// function sqrt(arg) {
//   if (!sqrt.cache) {
//       sqrt.cache = {}
//   }
//   if (!sqrt.cache[arg]) {
//       return sqrt.cache[arg] = Math.sqrt(arg)
//   }
//   return sqrt.cache[arg]
// }

/**
 * @desc Memoization - build and check cache for new searches
 *
 * @param {string} query - searchInput.value
 * @param {boolean} newCountry - clear cache if true
 **/
function checkSearchCache(query, newCountry) {
  
// manage the cache: clear it if searchInput.value.length = 0 or 1
//                 : array.shift (remove first element) if cache.length > someMagicNumber
//                 : array.pop   (remove last element)  if going backwards 

  if (newCountry) {
     searchCache = {};
    searchCache[query] = searchTree(species, query);
    return;
  }
  
  if (!searchCache[query]) {  // if same country
  
     searchCache.shift();  // even if ultimately find no matches? could look at return value

     if (query.slice(0,-1) === lastQuery) {  // going forward
       searchCache[query] = searchTree(previousSearchResults, query);  // return searchResultsList
       return;
     }
           // going backwards should be in the cache, so this is a safety check
     else if (lastQuery.slice(0, -1) === query) {
       SearchCache.pop();   // going backwards
       searchCache[query] = searchTree(species, query);
       return;
     }

    searchCache[query] = searchTree(species, query);
    return;
  }
  
  searchCache[query];
  return;
}


function getSearchSpecialsQuery(evt) {

  // <div id="searchSpecials" class="grayed">
  //    <span class="searchSpecialWrapper"><a>e<span class="highlightSpecial">x</span>tinct</a></span>
  //    <span class="searchSpecialWrapper"><a><span class="highlightSpecial">e</span>ndemic</a></span>
  
   // KeyboardEvent, type keyup, 13 === Enter
   if (evt.type === "keyup" && evt.keyCode !== 13) {
    return;
  }

  var term;

  // clear the input
  searchInput.value = "";

  if (evt.target.id === "searchSpecials") return;     // clicked in #searchSpecials but not on a button area
  else if (evt.target.className === "searchSpecialWrapper")
    term = evt.target.textContent.trim();    // clicked between "visible" buttons but on their background, i.e., "searchSpecialWrapper"
  else term = evt.target.parentNode.textContent.trim();

  // parentNode else if you click on "e" for example of extinct only the "e" is detected as the textContent of the target
  // var term = evt.target.parentNode.textContent.trim();
  
  searchTree(term);  // memoize: set flag for same country
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// function searchTree(subTree, query2) {  // memoize
function searchTree(query2) {

  // var species = subTree;  // memoize, but `species` is a global, so probably use a different local in searchTree()
  
  var query;
  query2 = escapeRegExp(query2);
  var originalQuery = query2;

  var numFound = 0;

  // if (!resultsPanelOpen) toggleSearchResultsPanel();

  lastQuery = query2;

  if (lastQuery) {
    document.getElementById("countrySearch").classList.remove("closed");
    // could limit lastQuery.slice(0, 24) first 25 characters for example
    if (currentCountry === "Falklands") {
      document.getElementById("searchTerm").innerHTML = "Falklands/Malvinas" + " : '<span>" + lastQuery + "</span>'";
    }
    else document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'";
  }
  else {
    searchResults.innerHTML = "<li></li><li> &nbsp; &nbsp; search results will appear here</li><li></li>";

    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    
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

  //  TODO : use `species` as a cached subset, for memoziation  
  
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

    if (query2.match(/[úáóíç]/) !== -1) {    
      query2 = query2.replace(/ú/g, "u");
      query2 = query2.replace(/á/g, "a");
      query2 = query2.replace(/ó/g, "o");
      query2 = query2.replace(/í/g, "i");
      query2 = query2.replace(/ç/g, "c");
    }

    // now database can have any number of spaces between genus and species
    //   TODO  : fuzzy or not?
    // query2 = query2.replace(/\s+/g, "\\s+"); // inserts a literal "\s+" but screws up fuzzy searching

    if (query2) {
      query = query2;
    }
    else {
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
    
    //  TODO : use next 2 lines to enable fuzzy searching
    // query = query.replace(/(\s+)/g, "");  // remove any spaces to do fuzzy search    
    // query = query.replace(/(\S|\s)/g, "$1.*?");   // add '.*?' behind every character, even spaces
    
    // query = query.replace(/(\S|\s)/g, "$1[a-z' -]*?");   // add '.*?' behind every character, even spaces
    
    // query = query.replace(/(\S|\s)/g, "$1.{2}?");   // to limit the possible characters between inputs, sorta weird
    
    // query2 = query2.replace(/\s+/g, "\\s+"); // doesn't seem to make any difference?
    
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

    // if (!resultsPanelOpen) toggleSearchResultsPanel();

    resetSearchResultsHeight();
    if (!resultsPanelOpen) toggleSearchResultsPanel();
    
    // updateActivityData("search");
    updateActivityData("search", originalQuery);
    return;
  }
  
  // console.log(matches);

  var z;
  var matchClass;
  // if list isn't set to "", it defaults to undefined
  var list = "";

  for (k = 0; k < matches.length; k++) {

    matchClass = matches[k].className;
    
    //  TODO  : tabindex="0" for each family and species !! ***

    if (matchClass === "family" || matchClass === "familyOpen") {

      list += "<li class='family'><span class='fco'>";
      list += matches[k].firstChild.firstChild.textContent + "</span><span class='fsc'>";

      // <li class="family"><span class='fTitle'><span class="fcommon">INCERTAE SEDIS</span><span class="fscientific"> </span></span>
      
      // <li class='family'><span class='fTitle'><span class='fco'>INCERTAE SEDIS</span><span class='fsc'></span></span>
      // must have space between the spans
      // or handle as below

      list += (matches[k].firstChild.lastChild) ? matches[k].firstChild.childNodes[1].textContent : " ";
      list += "</span></li>";  
      
      // "<li class='family'><span class='fco'>INCERTAE SEDIS</span><span class='fsc'></span></li>"

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
  previousSearchResults = list;  // for memoization
  
  // console.log(previousSearchResults);
  
  // updateActivityData("search");
  updateActivityData("search", originalQuery);

  // lastQuery = lastQuery.replace(/\\\*/g, "*");
  // lastQuery = lastQuery.replace(/\\\?/g, "?");

  // lastQuery.slice(0, 24)
  if (currentCountry === "Falklands") {
    document.getElementById("searchTerm").innerHTML = "Malvinas/Falklands" + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;   [ " + numFound + " species ]";
  }
  else {
    document.getElementById("searchTerm").innerHTML = currentCountry + " : '<span>" + lastQuery + "</span>'&nbsp;&nbsp;&nbsp;   [ " + numFound + " species ]";
  }
  
  // if (!resultsPanelOpen) toggleSearchResultsPanel();
  resetSearchResultsHeight();
  if (!resultsPanelOpen) toggleSearchResultsPanel();
}

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

// <ul id="searchResults"></ul>
function gotoMatch(e) {

  currentMap.querySelector(".colorKey").style.opacity = "0.9";

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  //  TODO  : (element.closest()? with polyfill)
  var ev = e || window.event;  // window.event for IE8-
  var clicked = ev.target;

  var clickedPar = clicked.parentNode;
  var clickedClass = clicked.className;

  if (clicked.className.indexOf("simplebar") !== -1) return;
  if (clicked.className.indexOf("fadeIn") !== -1) return;

  if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "no matching results found") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "no search term entered") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "search results will appear here") return;
  else if (clicked.textContent.replace(/^\s+|\s+$/g, "") === "") return;

  // goto family level else to <li>commom scientific
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
    // "INCERTAE SEDIS " for some reason eText returns a space at the end of the INCERTAE SEDIS's

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
    // INCERTAE SEDIS
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

  // if no search results do nothing
  var numSpecies = document.getElementsByClassName("bird").length;
  if (!numSpecies) return;
  
  var divId = evt.target.id;
  if (divId === "printerButton" || evt.target.nodeName === "use") divId = "searchResults";

  var content = document.getElementById(divId).children[2].innerHTML;

  var html = '<html><head><title></title><head>';

  var css = "<style>";
  css += ".simplebar-content { list-style-type: none; padding: 0 0 0 40px; }"
  css += "h3 { margin: 0 0 3ch 0; text-align: center; }";
  css += ".family, .familyOpen { margin: 2ch 0 0.5ch -2.5ch; list-style-type: disc; }";
  css += ".fsc { position: absolute; left: 50%; }";
  css += ".bird>span { padding-left: 10px;}";
  css += ".bird span:last-child { position: absolute; left: 50%; }";
  css += "</style>";
  html += css;
  
  // html += '<link rel="stylesheet" href="./printCSS/printSearchresults.css" />';  old online version that works
  // use below for working in gulp sync
  // html += '<link rel="stylesheet" href="src/printCSS/printSearchResults.css" />';  
  
  html += '</head><body>';
  html += '<h3>' + currentCountry + ' : &nbsp;\'' + lastQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
  html += content;
  html += '</body></html>';

  var printWindow = window.open('_blank', 'Print', 'menubar=yes,scroll=yes,height=600,width=800');
  printWindow.document.write(html);

  setTimeout(function() {
    printWindow.print();
    printWindow.close();
   }, 1000);

  return true;
}