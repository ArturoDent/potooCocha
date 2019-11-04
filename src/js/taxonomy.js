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
// var searchCache = {};
// var previousSearchResults;

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

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(xhr.response);
    } else {
      callback(xhr.response);
      //  TODO  :  throw new Error()
    }
  };
  xhr.send();
};


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
  
  if (country === "French Guiana") {
    getAjax("Countries/FrenchGuianaSACC.html", getCountryHTML);
    getJSON("JSON/French Guiana/French Guiana.json", getCountryJSON);
  }
  // because Curaçao is accented here but not in filenames
  else if (country === "Curaçao") {
    getAjax("Countries/CuracaoSACC.html", getCountryHTML);
    getJSON("JSON/Curacao/Curacao.json", getCountryJSON);
  }
  else if (country === "South America") {
    getAjax("Countries/SouthAmericaSACC.html", getCountryHTML);
    getJSON("JSON/South America/South America.json", getCountryJSON);
    searchResults.classList.add("samTax");

    // so hypotheticals and vagrants aren't selectable if South America is chosen
    searchSpecials.querySelector("div:nth-of-type(3)").classList.add("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(4)").classList.add("notAvailable");

    searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }
  else if (country) {
    getAjax("Countries/" + country + "SACC.html", getCountryHTML);
    getJSON("JSON/" + country + "/" + country + ".json", getCountryJSON);
  }
  
//  -----------------------------------------------------------------------------------------------
  
  if (country !== "South America") {
    searchSpecials.querySelector("div:nth-of-type(3)").classList.remove("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(4)").classList.remove("notAvailable");
    searchSpecials.classList.remove("SAM");
  }
  
  var specials = /extinct|endemic|hypothetical|vagrant/;

  if (!lastQuery) {
    currentMap.querySelector(".saveMapButton").style.display = "none";
    document.querySelector(".colorKey").style.opacity = "0.9";
  }
  else if (specials.test(lastQuery)) {
          // else if (lastQuery === "endemic" || lastQuery === "hypothetical" || lastQuery === "vagrant"
          //   || lastQuery === "extinct") {

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

function getCountryHTML(data) {

  // <ul id='tree'>
  //  TODO  : tabindex="0" on all families and species !! ***
  taxPage.innerHTML = data;

  // so "species" includes the family level _and_ individual bird species
  species = document.getElementById("tree").getElementsByTagName("li");

  // var htmlFamilies = taxPage.querySelectorAll("#tree .family");
  // numFamilies = htmlFamilies.length;

  resetTaxPageHeight();
}

function getCountryJSON(data) {
  families = data.birds.families;
  numFamilies = families.length;
  
  if (lastQuery) {
    var results = {};
    var specials = /extinct|endemic|hypothetical|vagrant/;
    if (specials.test(lastQuery)) results = specialSearch(families, lastQuery);
    else results = searchRegexTree(families, lastQuery, countries2Postals[currentCountry]), false;
    
    loadSearchresults(results);
  }
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