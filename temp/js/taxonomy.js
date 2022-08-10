// "use strict";

var lastQuery;
var lastSpecies;

var species;
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

// eslint-disable-next-line no-unused-vars
var simpleBarResults;
var simpleBarTaxPage;

var resultsPanelOpen = false;
var printerButton;
var closeOpenFamiliesButton;

// var searchInput;
// var searchCache = {};
// var previousSearchResults;

var lastResultsSpecies;
var lastIndex;

var searchSlideUpWrapper;
var taxInstructionsButton;
var searchInstructionsOpen = true;


/* global   currentMap  currentCountry  */

document.addEventListener("DOMContentLoaded", function () {

  searchSlideUpWrapper = document.querySelector("#taxonomyArticle > div.slideUpWrapper");
  searchSlideUpWrapper.style.height = searchSlideUpWrapper.clientHeight + "px";

  taxInstructionsButton = document.querySelector(".taxInstructionsButton");

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

  taxInstructionsButton.addEventListener("click", toggleSearchInstructions);

  taxPage = document.getElementById("taxPage");

  searchResults = document.getElementById("searchResults");
  resultsPanel = document.getElementById("results-panel");

  searchResults.addEventListener("click", gotoMatch, false);
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


function toggleSearchInstructions() {

  var taxInstructionTooltip = document.querySelector(".taxInstructionsButton .tooltip");

  if (!searchInstructionsOpen) taxInstructionTooltip.innerHTML = "Close";
  else taxInstructionTooltip.innerHTML = "Open";

  //  do only once, hence no toggle
  if (!taxInstructionsButton.classList.contains("instructionsClosed")) taxInstructionsButton.classList.add("instructionsClosed");

  searchSlideUpWrapper.classList.toggle("closeInstructions");
  resultsPanel.classList.toggle("closeInstructions");

  if (searchInstructionsOpen) {
    moveTaxPanel("searchInstructionsClosing");
    toggleFooterFocusable(true);  // remove tab focus to citations/potoococha links
  }
  else {
    moveTaxPanel("searchInstructionsOpening");
    toggleFooterFocusable(false);  // add tab focus to citations/potoococha links
  }

  searchInstructionsOpen = !searchInstructionsOpen;
}

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

    // so hypotheticals and vagrants aren't selectable if South America is chosen
    searchSpecials.querySelector("div:nth-of-type(3)").classList.add("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(4)").classList.add("notAvailable");

    // searchSpecials.classList.add("SAM");
    taxPage.classList.add("samTax");
  }
  else if (country) {
    getJSON("JSON/" + country + "/" + country + ".json", getCountryJSON);
  }

//  -----------------------------------------------------------------------------------------------

  if (country !== "South America") {
    searchSpecials.querySelector("div:nth-of-type(3)").classList.remove("notAvailable");
    searchSpecials.querySelector("div:nth-of-type(4)").classList.remove("notAvailable");
    // searchSpecials.classList.remove("SAM");
  }

  var specials = /extinct|endemic|hypothetical|vagrant/;

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
  var shift;
  // transform: translateY(-15rem);  // the initial state

  switch (whatIsOpening) {

  case "searchResultsOpening":
    if (searchInstructionsOpen) {
      taxPanel.style.transform = "translateY(-128px)";
    }
    else {
      shift = 100 + parseInt(instructionsHeight) + "px";
      taxPanel.style.transform = "translateY(-" + shift + ")";
    }
    break;

  case "searchInstructionsClosing":
    if (resultsPanelOpen) {
      shift = 100 + parseInt(instructionsHeight) + "px";
      taxPanel.style.transform = "translateY(-" + shift + ")";
    }
    else {
      shift = 200 + parseInt(instructionsHeight) + "px";
      taxPanel.style.transform = "translateY(-" + shift + ")";
    }
    break;

  case "searchInstructionsOpening":
    if (resultsPanelOpen)  {
      shift = -100 + parseInt(instructionsHeight) + "px";
      taxPanel.style.transform = "translateY(-" + shift + ")";
    }
    else {
      shift = 220 + "px";
      taxPanel.style.transform = "translateY(-" + shift + ")";
    }
    break;

  default:
    break;
  }
}

// eslint-disable-next-line no-unused-vars
// function getCountryHTML(data) {

//   // <ul id='tree'>
//   //  TODO  : tabindex="0" on all families and species !!
//   taxPage.innerHTML = data;

//   // so "species" includes the family level _and_ individual bird species
//   species = document.getElementById("tree").getElementsByTagName("li");

//   resetTaxPageHeight();
// }

function buildTaxTree(thisCountryFamilies, country) {

  // why building this here instead of using the *SACC.html file?

  var occ = "";
  var json2html = {
    "V": "va", "IN": "intr", "H": "hy", "NB": "nb", "X(e)": "endemic",
	  "EX(e)": "endemic extinct", "EX": "extinct", "X": ""  };

  var results = `<ul id='tree'>\n\n`;

  thisCountryFamilies.forEach(function(family) {    // forEach is okay, there will be no `break`s

  //   <li class='family'><span class='fTitle'><span class='fco'>FLAMINGOS</span><span class='fsc'>PHOENICOPTERIDAE</span></span>
	//     <ul class='birds'></ul>

    results += `<li class='family'><span class='fTitle'><span class='fco'>${family.FamilyCommon}</span>`;
    results += `<span class='fsc'>${family.Family}</span></span>\n`;
    results += `  <ul class='birds'>\n\n`;

    family.genera.forEach(function (genus) {

      genus.spp.forEach(function (bird) {

        // <li data-i='160'><span>Chilean Flamingo</span><span>Phoenicopterus chilensis</span></li>
        // <li data-i='162'><span class='nb'>Andean Flamingo</span><span>Phoenicoparrus andinus</span></li>

        occ = bird[country];
        if (occ && occ !== "X")
          results += `  <li data-i='${bird.index}'><span class='${json2html[bird[country]]}'>${bird.name}</span>`;
        else
          results += `  <li data-i='${bird.index}'><span>${bird.name}</span>`;

        results += `<span>${genus.Genus} ${bird.species}</span></li>\n`;
      });
    });
    results += `  </ul></li>\n\n`;
  });

  results += `</ul>\n`;

  taxPage.innerHTML = results;

  // so "species" includes the family level _and_ individual bird species
  species = document.getElementById("tree").getElementsByTagName("li");

  resetTaxPageHeight();
}


function getCountryJSON(data) {

  families = data.birds.families;
  numFamilies = families.length;

  if (lastQuery) {
    var results = {};
    var specials = /extinct|endemic|hypothetical|vagrant/;
    if (specials.test(lastQuery)) results = specialSearch(families, lastQuery);
    // false will avoid modifyQuery()  sanitize, add accents, etc. - has already been done on the lastQuery
    else results = searchRegexTree(families, lastQuery, countries2Postals[currentCountry]), false;

    loadSearchResults(results);
  }

  //  just pre-download all the country.json's and build each taxTree?  delayed somehow?
  buildTaxTree(families, countries2Postals[currentCountry]);
}

// <ul id="searchResults"></ul>
function gotoMatch(e) {

  // currentMap.querySelector(".colorKey").style.opacity = "0.9";

  if (lastSpecies && lastSpecies.classList.contains("active")) {
    lastSpecies.classList.remove("active");
  }

  // <li class="family"><span class="fco">HUMMINGBIRDS</span><span class="fsc">TROCHILIDAE</span></li>
  // <li data-i="316" class="bird"><span>Fiery Topaz</span><span>Topaza pyra</span></li>

  var ev = e || window.event;  // window.event for IE8-
  var clicked = ev.target.closest("li");  // works

  if (clicked) var clickedClass = clicked.className;
  else return;  // clicked was null so clicked on scrollBar or outside the searchResults

  var clickedcontent = clicked.textContent.replace(/^\s+|\s+$/g, "");

  if (clickedcontent === "no matches found") return;
  else if (clickedcontent === "character not allowed") return;
  // else if (clickedcontent === "search results will appear here") return;
  else if (clickedcontent === "") return;  // necessary?

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

      // put highlighted bird at "top" (100px down) of taxPage
      // entry.scrollIntoView(true);  //  TODO : might work now w/o IE, test on edge
      elem = simpleBarTaxPage.getScrollElement();
      // elem.scrollTop = familyTemp.parentNode.offsetTop + entry.offsetTop - 100;
      
      // a little buggy on firefox for some reason
      elem.scroll({top: familyTemp.parentNode.offsetTop + entry.offsetTop - 100, behavior: 'smooth'});

      entry.className = "active";

      lastSpecies = entry;
      lastIndex = Number(entry.dataset.i);
      highlightSAMmap(lastIndex, "currentMap");

      if (lastResultsSpecies) lastResultsSpecies.classList.toggle("active");

      clicked.classList.toggle("active");
      lastResultsSpecies = clicked;
      addBirdNameToMap(entry);
      break;
    }

    // match in family, fcommon, fscientific

    // <li class='family'><span class='fTitle'><span class='fco'>SCREAMERS</span><span class='fsc'>ANHIMIDAE</span></span>
	  //   <ul class='birds'>
	  //     <li data-i='47'><span>Horned Screamer</span><span>Anhima cornuta</span></li>
	  //     <li data-i='49'><span>Northern Screamer</span><span>Chauna chavaria</span></li>
    //   </ul>
    // </li>

    else if (entryTextTrimmed === eText && clickedClass === "family") {

      if (lastResultsSpecies) {
        lastResultsSpecies.classList.remove("active");
        lastResultsSpecies = null;
      }

      elem = simpleBarTaxPage.getScrollElement();
      // family clicked on in searchResults
          //    put family at top of taxPage
          //   entry.scrollIntoView(true);  screws up IE
      elem.scroll({top: entry.offsetTop, behavior: 'smooth'});  // ssems to work

      lastSpecies = entry.firstChild;
      lastSpecies.classList.add("active");
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

  event = event || window.event;  // window.event for IE8-

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

    speciesTarget.className = "active";

    if (speciesTarget !== lastSpecies) {

      if (lastSpecies && lastSpecies.classList.contains("active")) {
        lastSpecies.classList.remove("active");
      }
    }

    lastSpecies = speciesTarget;
    if (lastResultsSpecies) lastResultsSpecies.classList.toggle("active");
    lastResultsSpecies = null;

    addBirdNameToMap(speciesTarget);

    lastIndex = Number(speciesTarget.dataset.i);
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

    openedFamilies[i].parentNode.className = "family";  // TODO :  why not removing .familyOpen here?
  }
  // **** reset families and species of country
  document.querySelector("#treeIntroText").innerHTML = currentCountry + "   &nbsp; : " + numFamiliesList[currentCountry] + " families, " + numSpeciesList[currentCountry] + " species *";
}

function printSearchResults (evt) {

  // if no search results do nothing
  var numSpecies = document.getElementsByClassName("bird").length;
  if (!numSpecies) return;

  var divId = evt.target.id;
  if (divId === "printerButton" || evt.target.nodeName === "use") divId = "searchResults";

  var content = document.getElementById(divId).children[2].innerHTML;

  var html = '<html><head><title></title><head>';

  var css = "<style>";
  css += ".simplebar-content { list-style-type: none; padding: 0 0 0 40px; }";
  css += "h3 { margin: 0 0 3ch 0; text-align: left; padding-left: 80px; }";
  css += ".family, .familyOpen { margin: 2ch 0 0.5ch -2.5ch; list-style-type: disc; }";
  css += ".fsc { position: absolute; left: 50%; }";
  css += ".bird>span { padding-left: 10px;}";
  css += ".bird span:last-child { position: absolute; left: 50%; }";
  css += "</style>";
  html += css;

  html += '</head><body>';

  // `normalize lastQuery (remove accented regex's):: South America : 's(a|ã)o' 2 species
  //          'm(a|ã)r(a|ã)(n|ñ)o(n|ñ)'
  var normalizedQuery = lastQuery.replace(/\(a\|ã\)/gi, "a").replace(/\(n\|ñ\)/gi, "n");

  html += '<h3>' + currentCountry + ' : &nbsp;\'' + normalizedQuery + '\'  &nbsp;&nbsp;' + numSpecies + ' species</h3>';
  html += content;
  //  TODO  : add SACC and country authors?
  html += '</body></html>';

  var printWindow = window.open('_blank', 'Print', 'menubar=yes,scroll=yes,height=600,width=800');
  printWindow.document.write(html);

  setTimeout(function() {
    printWindow.print();
    printWindow.close();
  }, 1000);

  return true;
}