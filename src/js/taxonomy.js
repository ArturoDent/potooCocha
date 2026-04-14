// "use strict";

var lastQuery;
var lastSpecies;

// var species;
var families;
var numFamilies;

// eslint-disable-next-line
var birds;

var searchCountryText;
// var taxTreeArticleOpen = false;

var taxPage;
var taxPanel;
var searchSpecials;
var resultsPanel;
var searchResults;
var searchResultsScroller;
var taxPageScroller;

var resultsPanelOpen = false;
var printerButton;
var closeOpenFamiliesButton;

// var searchInput;
// var searchCache = {};
// var previousSearchResults;

var lastResultsSpecies;
var lastIndex;

var searchSlideUpWrapper;
// var taxInstructionsButton;
var searchInstructionsOpen = true;

let taxNodeByKey = new Map();


/* global   currentMap  currentCountry   */

// document.addEventListener("DOMContentLoaded", function () {
window.addEventListener("load", function () {

  // searchSlideUpWrapper = document.querySelector("#taxonomyArticle > div.slideUpWrapper");
  // searchSlideUpWrapper.style.height = searchSlideUpWrapper.clientHeight + "px";

  // taxInstructionsButton = document.querySelector(".taxInstructionsButton");

  printerButton = document.getElementById("printerButton");
  printerButton.addEventListener("click", printSearchResults);

  closeOpenFamiliesButton = document.getElementById("closeOpenFamiliesButton");
  closeOpenFamiliesButton.addEventListener("click", closeAllFamilies);

  searchCountryText = document.getElementById("searchCountryText");

  searchInput = document.getElementById("searchInput");
  searchSpecials = document.getElementById("searchSpecials");

  // searchInput.addEventListener("input", getQuery);
  // "change", "click", "textInput", "focusin"

  searchSpecials.addEventListener("click", getSearchSpecialsQuery);
  searchSpecials.addEventListener("keyup", getSearchSpecialsQuery);

  // taxInstructionsButton.addEventListener("click", toggleSearchInstructions);

  taxPage = document.getElementById("taxPage");
  taxPageScroller = document.getElementById("taxPageScroller");

  searchResults = document.getElementById("searchResults");
  searchResultsScroller = document.getElementById("searchResultsScroller");
  resultsPanel = document.getElementById("results-panel");

  searchResults.addEventListener("click", gotoMatch, false);
  searchResults.addEventListener("dblclick", gotoSACCLink, false);
  searchResults.addEventListener("auxclick", gotoSACCLink, false);
  // searchResults.addEventListener("keyup", gotoSACCLink, false);
  searchResults.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        gotoSACCLink(e);
    }
  }, false);

  taxPage.addEventListener("click", toggleFamilyOpen);
  taxPanel = document.getElementById("tax-panel");

  // preloading the file occurrences.txt
  // getTEXT("../occurrences/occurrences.txt", loadOccurrences);
  getTEXT("../occurrences/occurrences.txt", data => birds = data.split("\n"));

  var SAMTarget = document.getElementById( "SAM" );
  var evt = new Event("click", { "bubbles": true, "cancelable": false });
  SAMTarget.dispatchEvent( evt );
  toggleCountryMenuLayer();
});

// fetch() not supported by IE11
// const response = await fetch('http://example.com/movies.json');
// const myJson = await response.json();
// console.log(JSON.stringify(myJson));

function getTEXT(url, success) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
  };
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
  return xhr;
}

function getJSON(url, success) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      success(xhr.response);
    }
    else {
      throw new Error("getJSON failed : " + xhr.response);
    }
  };
  xhr.send();
}


// function toggleSearchInstructions() {

//   var taxInstructionTooltip = document.querySelector(".taxInstructionsButton .tooltip");

//   if (!searchInstructionsOpen) taxInstructionTooltip.innerHTML = "Close";
//   else taxInstructionTooltip.innerHTML = "Open";

//   //  do only once, hence no toggle
//   if (!taxInstructionsButton.classList.contains("instructionsClosed")) taxInstructionsButton.classList.add("instructionsClosed");

//   searchSlideUpWrapper.classList.toggle("closeInstructions");
//   resultsPanel.classList.toggle("closeInstructions");

//   if (searchInstructionsOpen) {
//     moveTaxPanel("searchInstructionsClosing");
//     toggleFooterFocusable(true);  // remove tab focus to citations/potoococha links
//   }
//   else {
//     moveTaxPanel("searchInstructionsOpening");
//     toggleFooterFocusable(false);  // add tab focus to citations/potoococha links
//   }

//   searchInstructionsOpen = !searchInstructionsOpen;
// }

function toggleFooterFocusable(disable) {

  var links = document.querySelectorAll("footer a");

  if (disable) {
    links.forEach(function (link) { link.setAttribute("tabindex", "-1"); });
  }
  else {
    links.forEach(function (link) { link.setAttribute("tabindex", "0"); });
  }
}

// function enableSearchSpecials() {

  // document.querySelector("#searchForm span.grayed").classList.remove("grayed");
  // searchSpecials.classList.remove("grayed");

  // var list = searchSpecials.querySelectorAll("a");
  //   // set tabIndex from -1 to 0 so tabbing works through searchSpecials after country is chosen

  // list.forEach(function(element) {
  //   element.setAttribute("tabindex", "0");
  // });

  // searchInput.setAttribute("tabindex", "0");
// }

// eslint-disable-next-line
function loadCountryTaxonomy(country) {

  // if (searchSpecials.classList.contains("grayed")) {
  //   enableSearchSpecials();
  //   closeOpenFamiliesButton.setAttribute("tabindex", "0");
  // }

  // lastQuery.slice(0, 24) to limit lastQuery length in the searchTerm flyout
  if (lastQuery) {
    // document.getElementById("countrySearch").classList.remove("closed");
    document.getElementById("searchTerm").innerHTML = country + " : <span>" + lastQuery + "</span>";
  }
  else
    document.getElementById("searchTerm").innerHTML = country + " : <span>" + "enter a search term above</span>";

  if (country !== "South America") {
    searchResults.classList.remove("samTax");
    taxPage.classList.remove("samTax");
  }

//  -----------------------------------------------------------------------------------------------

  if (country === "French Guiana") {
    getJSON("JSON/FrenchGuiana/FrenchGuiana.json", getCountryJSON);
  }
  // because Curaçao is accented here but not in filenames
  else if (country === "Curaçao") {
    getJSON("JSON/Curacao/Curacao.json", getCountryJSON);
  }
  else if (country === "South America") {
    getJSON("JSON/SouthAmerica/SouthAmerica.json", getCountryJSON);
    searchResults.classList.add("samTax");

    // <div id="searchSpecials">
    //   <div class="searchSpecialWrapper" data-special="extinct"><span class="specialLabel" tabindex="0">extinct</a></span></div>
    //   <div class="searchSpecialWrapper" data-special="endemic"><span class="specialLabel" tabindex="0">endemic</a></span></div>
    
    //   <div class="searchSpecialWrapper" data-special="endemic-breeder"  title="'Endemic breeders: a species whose breeding population is restricted to one country, but nonbreeding populations are part of the regular avifauna of other countries.'">
    //     <span class="specialLabel" tabindex="0">endemic Breeder</span> 
    //     <a  class="citationLink"  href="https://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm" target="_blank" rel="noopener noreferrer">*</a>
    //   </div>

    //   <div class="searchSpecialWrapper" data-special="unconfirmed"><span class="specialLabel" tabindex="0">unconfirmed</a></span></div>
    //   <div class="searchSpecialWrapper" data-special="vagrant"><span class="specialLabel" tabindex="0">vagrant</a></span></div>
    // </div>

    // so unconfirmeds and vagrants aren't selectable if South America is chosen
    // searchSpecials.querySelector("div:nth-of-type(3)").classList.add("notAvailable");
    // searchSpecials.querySelector("div:nth-of-type(4)").classList.add("notAvailable");
    searchSpecials.querySelector('[data-special="unconfirmed"]').classList.add("notAvailable");
    searchSpecials.querySelector('[data-special="vagrant"]').classList.add("notAvailable");


    // searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }
  else if (country) {
    getJSON("JSON/" + country + "/" + country + ".json", getCountryJSON);
  }

//  -----------------------------------------------------------------------------------------------

  if (country !== "South America") {
    // searchSpecials.querySelector("div:nth-of-type(3)").classList.remove("notAvailable");
    // searchSpecials.querySelector("div:nth-of-type(4)").classList.remove("notAvailable");
    searchSpecials.querySelector('[data-special="unconfirmed"]').classList.remove("notAvailable");
    searchSpecials.querySelector('[data-special="vagrant"]').classList.remove("notAvailable");
  }

  // TODO: endemic breeder|unconfirmed ?
  var specials = /extinct|endemic|unconfirmed|vagrant|endemic-breeder/;

  if (!lastQuery) {
    currentMap.querySelector(".saveMapButton").style.display = "none";
    document.querySelector(".colorKey").style.opacity = "0.9";
  }
  else if (specials.test(lastQuery)) {
    currentMap.querySelector(".saveMapButton").style.display = "none";
  }

  
  if (country === "South America") searchCountryText.innerHTML = "South America";
  else if (country === "Falklands") searchCountryText.innerHTML = "the Falkland Islands";
  else searchCountryText.innerHTML = country;

  if (country === "Falklands")
    document.querySelector("#treeIntroText").innerHTML = "Falklands/Malvinas" + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";
  else document.querySelector("#treeIntroText").innerHTML = country + " &nbsp; : &nbsp; " + numFamiliesList[country] + " families, " + numSpeciesList[country] + " species";
}

// eslint-disable-next-line no-unused-vars
function toggleSearchResultsPanel() {

  resultsPanel.classList.toggle("resultsPanelBoolean");

  if (!resultsPanelOpen) {      // results-panel was not open
    // moveTaxPanel("searchResultsOpening");
    printerButton.setAttribute("tabindex", "0");
  }
  else {                        // results-panel was open
    // moveTaxPanel("searchResultsClosing");
    printerButton.setAttribute("tabindex", "-1");
  }

  resultsPanelOpen = !resultsPanelOpen;
}

// function moveTaxPanel(whatIsOpening) {

//   //    "searchResultsOpening", "searchResultsClosing"
//   //    "searchInstructionsClosing", "searchInstructionsOpening"

//   var instructionsHeight = searchSlideUpWrapper.style.height;
//   var shift;
//   // transform: translateY(-15rem);  // the initial state

//   switch (whatIsOpening) {

//   case "searchResultsOpening":
//     if (searchInstructionsOpen) {
//       taxPanel.style.transform = "translateY(-128px)";
//     }
//     else {
//       shift = 100 + parseInt(instructionsHeight) + "px";
//       taxPanel.style.transform = "translateY(-" + shift + ")";
//     }
//     break;

//   case "searchInstructionsClosing":
//     if (resultsPanelOpen) {
//       shift = 100 + parseInt(instructionsHeight) + "px";
//       taxPanel.style.transform = "translateY(-" + shift + ")";
//     }
//     else {
//       shift = 200 + parseInt(instructionsHeight) + "px";
//       taxPanel.style.transform = "translateY(-" + shift + ")";
//     }
//     break;

//   case "searchInstructionsOpening":
//     if (resultsPanelOpen)  {
//       shift = -100 + parseInt(instructionsHeight) + "px";
//       taxPanel.style.transform = "translateY(-" + shift + ")";
//     }
//     else {
//       shift = 220 + "px";
//       taxPanel.style.transform = "translateY(-" + shift + ")";
//     }
//     break;

//   default:
//     break;
//   }
// }

// eslint-disable-next-line no-unused-vars
// function getCountryHTML(data) {

// <ul id="tree">
//  TODO  : tabindex="0" on all families and species !!
//   taxPage.innerHTML = data;

//   // so "species" includes the family level _and_ individual bird species
//   species = document.getElementById("tree").getElementsByTagName("li");

//   resetTaxPageHeight();
// }

function buildTaxTree(thisCountryFamilies, country) {

  // TODO: why building this here instead of using the *SACC.html file??

  var occ = "";
  // TODO: "E(eb)": "eb", "U": "u"
  var json2html = {
    "V": "va", "IN": "intr", "U": "u", "NB": "nb", "X(e)": "endemic",
	   "X(eb)": "endemic-breeder", "EX(e)": "endemic extinct", "EX": "extinct", "X": ""  };

  var results = `<ul id="tree">\n\n`;

  thisCountryFamilies.forEach(function(family) {    // forEach is okay, there will be no `break`s

    //   <li class="family"><span class="fTitle"><span class="fco">FLAMINGOS</span><span class="fsc">PHOENICOPTERIDAE</span></span>
    //      <ul class="birds"></ul>
    // data-family="ANHIMIDAE"

    // results += `<li class="family"><span class="fTitle"><span class="fco">${family.FamilyCommon}</span>`;
    results += `<li class="family" data-family="${family.Family}"><span class="fTitle"><span class="fco">${family.FamilyCommon}</span>`;
    results += `<span class="fsc">${family.Family}</span></span>\n`;
    results += `  <ul class="birds">\n\n`;

    family.genera.forEach(function (genus) {

      genus.spp.forEach(function (bird) {

        // <li data-i="160"><span>Chilean Flamingo</span><span>Phoenicopterus chilensis</span></li>
        // <li data-i="162"><span class="nb">Andean Flamingo</span><span>Phoenicoparrus andinus</span></li>

        occ = bird[country];
        if (occ && occ !== "X")
          results += `  <li data-i="${bird.index}"><span class="${json2html[bird[country]]}">${bird.name}</span>`;
        else
          results += `  <li data-i="${bird.index}"><span>${bird.name}</span>`;

        results += `<span>${genus.Genus} ${bird.species}</span></li>\n`;
      });
    });
    results += `  </ul></li>\n\n`;
  });

  results += `</ul>\n`;

  taxPage.innerHTML = results;

  // so "species" includes the family level _and_ individual bird species
  // species = document.getElementById("tree").getElementsByTagName("li");

  resetTaxPageHeight();

  indexTaxTree();
}


function indexTaxTree() {
  taxNodeByKey.clear();

  document.querySelectorAll("#tree li[data-i]").forEach(li => {
    taxNodeByKey.set(`bird:${li.dataset.i}`, li);
  });

  document.querySelectorAll("#tree li.family[data-family], #tree li.familyOpen[data-family]").forEach(li => {
    taxNodeByKey.set(`family:${li.dataset.family}`, li);
  });
}


function getCountryJSON(data) {

  families = data.birds.families;
  numFamilies = families.length;

  if (lastQuery) {
    var results = {};
    // TODO: endemic breeder|unconfirmed
    var specials = /extinct|endemic|unconfirmed|vagrant|endemic-breeder/;
    if (specials.test(lastQuery)) results = specialSearch(families, lastQuery);
    // false will avoid modifyQuery()  sanitize, add accents, etc. - has already been done on the lastQuery
    else results = searchRegexTree(families, lastQuery, countries2Postals[currentCountry]), false;

    loadSearchResults(results);
  }

  //  just pre-download all the country.json's and build each taxTree?  delayed somehow?
  buildTaxTree(families, countries2Postals[currentCountry]);
}

/* global   currentMap  currentCountry  familyMap */

function gotoSACCLink(e) {

  let familyItem = e.target.dataset.family;
  // 1. Identify what was clicked (the 'bird' container or 'family' container)
  const birdItem = e.target.closest('.bird');
  // if (birdItem) familyItem = e.target.closest('.family');
  // if (birdItem) familyItem = e.target.dataset.family;
  // else familyItem = 

  e.preventDefault();
  e.stopImmediatePropagation();

  // clicked between common and scientific family name, or after scientific or before common
  if (e.target.className === "family") navigateToFamily(e.target.lastChild.innerText);

  // clicked on common family name
  else if (e.target.className === 'fco') navigateToFamily(e.target.parentNode.lastChild.innerText);

  // clicked on scientific family name
  else if (e.target.className === 'fsc') navigateToFamily(e.target.innerText);

  else if (e.target.parentNode.classList.contains('bird')) navigateToFamily(e.target.parentNode.dataset.family, e.target.parentNode.innerText);

  else if (e.target.classList.contains('bird')) navigateToFamily(e.target.dataset.family, e.target.innerText);
}

// <ul id="searchResults"></ul>
function gotoMatch(e) {

  // e.target === 'Mergus octosetaceus' or 'Brazilian Merganser'

  if (e.ctrlKey || e.metaKey) {
    // Find the specific item (bird or family) that was clicked
    // const item = e.target.closest('.bird-item-class, .family-header-class'); // Replace with your actual classes
    // if (!item) return;

    // 2. Prevent the "normal" click behavior
    // e.preventDefault();
    // e.stopImmediatePropagation();
    gotoSACCLink(e);
    return;
  }

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  // <li class="family"><span class="fco">HUMMINGBIRDS</span><span class="fsc">TROCHILIDAE</span></li>
  // <li data-i="316" class="bird"><span>Fiery Topaz</span><span>Topaza pyra</span></li>

  var ev = e || window.event;  // window.event for IE8-  TODO: simplify with ??=
  var clicked = ev.target.closest("li");  // works

  if (clicked) var clickedClass = clicked.className;
  else return;  // clicked was null so clicked on scrollBar or outside the searchResults

  if (clicked.className !== 'family' && clicked.className !== 'bird') return;

  // eText = "Horned ScreamerAnhima cornuta"
  // clicked.children[1].innerText = "Anhima cornuta"
  // map.children.currentBird.children.currentBirdName.children[2].innerText = "Anhima cornuta"

  // map already shows the bird selected in results or taxTree
  // but last species was a family; lastSpecies.className === 'fTitle'

  if (lastSpecies?.className !== 'fTitle') {
    if (sciNameSpan = map.querySelector("#currentBirdName span:last-of-type")) {
      const mapSciName = sciNameSpan.innerText;
      if (mapSciName === clicked.querySelector("span:last-of-type").innerText) {
        return;
      }
    }
  }

  let familyLi = clicked;
  // if 'bird', get family from resultsPanel
  if (clicked.className === 'bird') {
    while (familyLi && !familyLi.classList.contains("family")) {
      familyLi = familyLi.previousElementSibling;
    }
  }

  const birdNode = taxNodeByKey.get(`bird:${clicked.dataset.i}`);
  const familyNode = taxNodeByKey.get(`family:${familyLi.dataset.family}`);

  var elem;

  if (clicked.className !== "family") {

    const familyUList = familyNode?.querySelector(":scope > ul.birds");
    if (!familyNode || !familyUList || !birdNode) return;

    if (!familyUList.classList.contains("open")) {
      familyUList.classList.add("open");
      familyNode.classList.remove("family");
      familyNode.classList.add("familyOpen");
    }

    // can't offset down easily for some reason with scroll-margin-top on '.active' elements
    // birdNode.scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    //   container: "nearest"
    // });

    const top =
      birdNode.getBoundingClientRect().top -
      taxPageScroller.getBoundingClientRect().top +
      taxPageScroller.scrollTop -
      60;     // offset

    taxPageScroller.scroll({
      top,
      behavior: "smooth"
    });

    birdNode.classList.add("active");

    lastSpecies = birdNode;
    lastIndex = Number(clicked.dataset.i);

    if (lastResultsSpecies && lastResultsSpecies !== clicked) {
      lastResultsSpecies.classList.remove("active");
    }
    clicked.classList.add("active");
    lastResultsSpecies = clicked;  // not birdNode which is a taxTree node, clicked is in the resultsPanel
    addBirdNameToMap(clicked);

    highlightSAMmap(lastIndex, "currentMap");

    if (mapsCollection.getElementsByClassName("smallBird").length === 5 || alreadyInMapsCollection()) {
      saveMapButton.style.display = "none";
    }
    else 
      saveMapButton.style.display = "block";
  }

  else if (clicked.className === "family") {

    if (lastResultsSpecies) {
      lastResultsSpecies.classList.remove("active");
      lastResultsSpecies = null;
    }

    const top =
      familyNode.getBoundingClientRect().top -
      taxPageScroller.getBoundingClientRect().top +
      taxPageScroller.scrollTop -
      30;

    taxPageScroller.scroll({
      top,
      behavior: "smooth"
    });
   
    lastSpecies = familyNode.firstChild;  // remove active from lastSpecies before this
    lastSpecies.classList.add("active");  
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

  if (event.target.id === "taxPage") return;

  // taxPage is not open yet
  if (!numFamilies) return;

  event = event || window.event;  // window.event for IE8-  TODO: use ??= instead

  var familyUList;
  var familyHeader;
  var speciesTarget;
  
  if (event.target.closest("ul.birds")) speciesTarget = event.target.closest("ul.birds li");
  else {
    familyHeader = event.target.closest("li.family, li.familyOpen");
    familyUList = familyHeader.childNodes[1].nextSibling;
    // want familyUList to == <ul class="birds [open]"> to toggle display
  }

  //  <ul id="tree">
  //    <li class="familyOpen"><span class="fTitle"><span class="fco">RHEAS</span><span class="fsc">RHEIDAE</span></span>
  //      <ul class="birds open">

  //         <li data-i="0"><span>Greater Rhea</span><span>Rhea americana</span></li>
  //         <li data-i="1"><span>Lesser Rhea</span><span>Rhea pennata</span></li>
  //      </ul></li>

  if (familyUList && !familyUList.classList.contains("open")) {  // not open

    familyUList.classList.add("open");

    familyHeader.className = "familyOpen";

    // clicked on a closed family
    // check to see if family at bottom of taxPage, if so, open and move up ?*

    var taxPageHeight = taxPage.getBoundingClientRect().height;

    if (familyUList.offsetTop - taxPage.scrollTop > taxPageHeight - 24) {

      //  will the entire family fit in taxPage ?

      if (familyHeader.clientHeight > taxPageHeight)
        taxPage.scrollTop = familyHeader.offsetTop;

      else
        taxPage.scrollTop += familyUList.lastElementChild.offsetTop + familyUList.lastElementChild.clientHeight;
    }
    //  show family and numSpecies in that family
    var scientificFamily = familyHeader.firstChild.children[1].textContent;
    if (!scientificFamily) scientificFamily = familyHeader.firstChild.children[0].textContent;

    document.querySelector("#treeIntroText").innerHTML = currentCountry + "  &nbsp; : &nbsp; " + scientificFamily + " has " + familyUList.children.length + " species";
  }

  else if (familyUList) {    // was open
    familyUList.classList.remove("open");
    familyHeader.className = "family";

    var reset = familyHeader.querySelectorAll(".active");

    if (reset.length) {
      reset[0].classList.remove("active");
    }
    document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species";
  }

  //   clicked on a species in the taxTree
  if (!familyUList) {

    //    <ul class="birds open">
    //      <li data-i="2692"><span>Tepui Wren</div><div>Troglodytes rufulus</span></li>

    speciesTarget.classList.add("active");

    if (speciesTarget !== lastSpecies) {

      if (lastSpecies && lastSpecies.classList.contains("active")) {
        lastSpecies.classList.remove("active");
      }
    }

    lastSpecies = speciesTarget;
    if (lastResultsSpecies) lastResultsSpecies.classList.remove("active");
    lastResultsSpecies = null;

    addBirdNameToMap(speciesTarget);

    lastIndex = Number(speciesTarget.dataset.i);
    highlightSAMmap(lastIndex, "currentMap");

    document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : &nbsp; " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species *";

    if (mapsCollection.getElementsByClassName("smallBird").length === 5 || alreadyInMapsCollection()) {
      saveMapButton.style.display = "none";
    }
    else 
      saveMapButton.style.display = "block";
  }

  taxPage.style.zIndex = 5;
}

function closeAllFamilies() {

  for (const node of taxNodeByKey.values()) {
    if (node.matches("li.familyOpen")) {

      const familyUList = node?.querySelector(":scope > ul.birds");

      familyUList.classList.remove("open");
      familyUList.classList.add("closed");

      node.classList.add("family");
      node.classList.remove("familyOpen");
    }
  }


  // var openedFamilies = taxPage.querySelectorAll("#tree .familyOpen ul");
  // var len = openedFamilies.length;

  // for (var i = 0; i < len; i++) {

  //   openedFamilies[i].classList.remove("open");
  //   openedFamilies[i].classList.add("closed");

  //   openedFamilies[i].parentNode.className = "family";  // TODO :  why not removing .familyOpen here?
  // }

  // **** reset families and species of country
  document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species *";
}

function printSearchResults (evt) {

  // if no search results do nothing
  var numSpecies = document.getElementsByClassName("bird").length;
  if (!numSpecies) return;

  let divId = "searchResults";

  var content = '<ul class="print-results">' + document.getElementById(divId).innerHTML + "</ul>";

  var html = '<html><head><title></title><head>';

  var css = "<style>";
  css += ".print-results { list-style-type: none; margin: 0; padding: 0 0 0 40px; }";
  css += "h3 { margin: 0 0 3ch 0; text-align: center; padding-left: 0; }";
  css += ".family, .familyOpen { margin: 2ch 0 0.5ch 10%; list-style-type: disc; }";
  css += ".birds, .bird { list-style-type: none; margin-left: 10%; padding-left: 0; }";
  css += ".fsc { position: absolute; left: 60%; }";
  css += ".bird>span { padding-left: 10px;}";
  css += ".bird span:last-child { position: absolute; left: 60%; }";
  css += "</style>";
  html += css;

  html += '</head><body>';

  // `normalize lastQuery (remove accented regex's):: South America : 's(a|ã)o' 2 species
  //          'm(a|ã)r(a|ã)(n|ñ)o(n|ñ)'
  var normalizedQuery = lastQuery.replace(/\(a\|ã\)/gi, "a").replace(/\(n\|ñ\)/gi, "n");

  html += '<h3>' + currentCountry + ' : &nbsp;\'' + normalizedQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
  html += content;
  //  TODO  : add SACC?
  html+= 	"<br><br><br>Mark Pearman, Juan Freile, Jhonathan Miranda, and Van Remsen (coordinators). Country lists. &nbsp;26&nbsp;March&nbsp;2026. A classification of the bird species of South America. American Ornithological Society. http://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm";
  html += '</body></html>';

  // var printWindow = window.open('_blank', 'Print', 'menubar=yes,scroll=yes,height=600,width=800');
  // printWindow.document.write(html);

  // setTimeout(function() {
  //   printWindow.print();
  //   printWindow.close();
  // }, 1000);

  var iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  var doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(function () {
    iframe.contentWindow.print();
    iframe.remove();
  }, 250);

  return true;
}
