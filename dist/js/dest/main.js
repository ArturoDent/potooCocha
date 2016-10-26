"use strict";

var sampleTable;
var leftCheck;
var sciNames;
var italics;
var lineNumbers;
var showEndemics;

var currentChecklistCountry;
var currentChecklistCountryElement;
var checklistAuthorsPanel;

var countryModalOverlay;
var countryModalOpener;

var gNumDays;
var gStartDate;
var previousNumDaysClass;

var numDaysButton;
var checklistCountryButton;
var pdfButton;
var csvButton;
var taxonomyCountryButton;

var map;



/* global  prepareSVGstyles loadCountryTaxonomy selectedCountryFillColor getAjax currentMap selectedFillColor */

document.addEventListener("DOMContentLoaded", function () {
  console.log("herer");
  map   =  document.getElementById("currentMap");

  window.addEventListener("resize", onResizeWindow);

  countryModalOverlay                      =  document.querySelector(".md-overlay");
  countryModalOverlay.addEventListener("click", closeCountryModal);

  document.getElementById("countryModal").addEventListener("click", closeCountryModal);

  checklistCountryButton                   =  document.getElementById("checklistCountryButton");
  taxonomyCountryButton                    =  document.getElementById("taxonomyCountryButton");

  checklistCountryButton.addEventListener("click", showCountryModal);
  taxonomyCountryButton.addEventListener("click", showCountryModal);

  numDaysButton                       =  document.getElementById("numDays");
  numDaysButton.addEventListener("click", setNumDays);

  numDaysButton.children.item(11).classList.add("highlight");
  gNumDays = 10;

  sampleTable = document.getElementById("sampleTable");
  sampleTable.classList.add("numDays" + String(gNumDays));

  previousNumDaysClass = "numDays" + String(gNumDays);

  pdfButton                           =  document.getElementById("pdfButton");
  pdfButton.addEventListener("click", openChecklistPage);

  csvButton                           =  document.getElementById("csvButton");
  csvButton.addEventListener("click", getCSVText);

  lineNumbers  =  document.getElementById("lineNumbers");
  leftCheck    =  document.getElementById("leftCheck");
  showEndemics =  document.getElementById("showEndemics");
  sciNames     =  document.getElementById("sciNames");
  italics      =  document.getElementById("italics");

  previousNumDaysClass = "numDays10";

  lineNumbers.addEventListener("click", toggleSampleTableLineNumbers);
  leftCheck.addEventListener("click", toggleSampleTableLeftChecks);
  showEndemics.addEventListener("click", toggleSampleTableShowEndemics);
  sciNames.addEventListener("click", toggleSampleTableSciNames);
  italics.addEventListener("click", toggleSampleTableItalics);

  checklistAuthorsPanel = document.getElementById("checklistAuthorsPanel");

  [].forEach.call(document.getElementsByClassName("country-menu")[0].getElementsByTagName("a"), function (el) {
    el.addEventListener("click", choseCountry);
  });

  toggleSampleTableLeftChecks();
  leftCheck.checked = true;
});

//   *******************  end of  (document).ready(function() ******************************************

function onResizeWindow() {
  initCurrentMap();
}

function initCurrentMap() {

  prepareSVGstyles("SAMsvg");

  if (!map)  map = document.getElementById("currentMap");
  map.style.opacity = "1";
}

function showCountryModal(evt)  {

  document.querySelector("#countryModal").classList.add("md-show");
  // document.querySelector("#mainContent").classList.add("modal-shrink");
  map.classList.add("modal-shrink");

  if (evt.target.id === "checklistCountryButton") countryModalOpener = "checklistCountryButton";
  else countryModalOpener = "taxonomyCountryButton";
}

function closeCountryModal()  {

  document.querySelector("#countryModal").classList.remove("md-show");
  // document.querySelector("#mainContent").classList.remove("modal-shrink");
  map.classList.remove("modal-shrink");
}

function toggleSampleTableShowEndemics() {

  sampleTable.querySelector("td.endemical").classList.toggle("showEndemics");
}

function toggleSampleTableSciNames()  {

  sampleTable.classList.toggle("noScientificNames");
  italics.disabled = !italics.disabled;
}

function toggleSampleTableItalics()  {

  sampleTable.classList.toggle("noItalics");
}

// add : if no sci names = both line numbers and endemic possible ?

function toggleSampleTableLeftChecks() {

  [].forEach.call(sampleTable.getElementsByClassName("leftCheckBox"), function (el) {
    el.classList.toggle("show");
  });

  [].forEach.call(sampleTable.getElementsByClassName("familyHidden"), function (el) {
    el.classList.toggle("show");
  });
}

function toggleSampleTableLineNumbers() {

  sampleTable.querySelector("td.lineNumbers").classList.toggle("showLineNumbers");
}

// decide which function to call based on which countryButton opened the country menu
function choseCountry(evt)  {

  if (countryModalOpener === "checklistCountryButton") choseChecklistCountry(evt);
  else loadCountryTaxonomy(evt);
}

function choseChecklistCountry(evt)  {

  var pageScrollTop = document.body.scrollTop;

  closeCountryModal();

  var selectedCountry = evt.target.innerHTML;

  if (currentChecklistCountry) {
    currentChecklistCountryElement.classList.remove("checkHighlight");
    currentChecklistCountryElement.classList.remove("bothHighlights");
  }

  if (selectedCountry === "South America")  currentChecklistCountry = "SouthAmerica";
  else if (selectedCountry === "French Guiana")  currentChecklistCountry = "FrenchGuiana";
  else if (selectedCountry === "Falklands/Malv.")  currentChecklistCountry = "Falklands";
  // else if (selectedCountry === "Malvinas")  currentChecklistCountry = "Falklands";
  else if (selectedCountry === "Curaçao")  currentChecklistCountry = "Curacao";
  else   currentChecklistCountry = selectedCountry;

  checklistCountryButton.innerHTML = selectedCountry;
  if (selectedCountry === "Falklands/Malv.")  checklistCountryButton.innerHTML = "Falklands";
  currentChecklistCountryElement = evt.target;
  currentChecklistCountryElement.classList.add("checkHighlight");
  if (currentChecklistCountryElement.classList.contains("taxHighlight")) currentChecklistCountryElement.classList.add("bothHighlights");

  var buttonDisplace = document.getElementById("checklistCountryButton").getBoundingClientRect().width;
  document.getElementById("checklistCountryButton").style.right = -buttonDisplace / 2 - 20 + "px";

  checklistCountryButton.classList.remove("needsAttention");
  checklistCountryButton.classList.add("highlight");

  pdfButton.classList.add("highlight");
  csvButton.classList.add("highlight");

  document.body.scrollTop = pageScrollTop;

  currentMap.querySelector(".saveMapButton").style.display = "none";
  currentMap.querySelector(".colorKey").style.opacity = "0";

  selectedCountryFillColor(currentChecklistCountry, selectedFillColor);

  getAjax("Authors/" + currentChecklistCountry + ".txt", setChecklistAuthors);
}

// ^(.*\\.) \\d\\d\\d\\d\\..*(Version.*$)
function setChecklistAuthors(data) {

  if (currentChecklistCountry === "SouthAmerica") {
    checklistAuthorsPanel.innerHTML = "<a href='citations.html' target='_blank'>citations</a>";
    checklistAuthorsPanel.classList.add("show");
    return;
  }

  var authors = data.replace(/^(.*\.) \d\d\d\d\..*Version(.*$)/g, "$1 $2");
  checklistAuthorsPanel.innerHTML = authors;
  checklistAuthorsPanel.classList.add("show");
}

function setNumDays(evt)  {

  var day = evt.target;

  if (day.classList.contains("highlight")) {  // if click on already highlighted target ignore
    return;
  }
  else if (gNumDays || gNumDays === 0)   {
    numDaysButton.children[gNumDays+1].classList.remove("highlight");
  }

  day.classList.add("highlight");
  gNumDays = parseInt(day.innerHTML);

  sampleTable.classList.remove(previousNumDaysClass);
  sampleTable.classList.add("numDays" + String(gNumDays));

  previousNumDaysClass = "numDays" + String(gNumDays);

  // rules for column double border right vs. number of days

  [].forEach.call(sampleTable.querySelectorAll("td:nth-child(6)"), function (el) {
    el.classList.remove("cds");
  });

  sampleTable.querySelector("th:nth-child(4)").classList.remove("cds");

  [].forEach.call(sampleTable.querySelectorAll("td:nth-child(8)"), function (el) {
    el.classList.remove("cds");
  });

  sampleTable.querySelector("th:nth-child(6)").classList.remove("cds");

  if (gNumDays === 6 || gNumDays === 7) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(6)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(4)").classList.add("cds");
  }
  else if (gNumDays === 10) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(13)"), function (el) {
      el.classList.remove("cds");
    });

    sampleTable.querySelector("th:nth-child(11)").classList.remove("cds");

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(8)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(6)").classList.add("cds");
  }
  else if (gNumDays !== 5) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(8)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(6)").classList.add("cds");

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(13)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(11)").classList.add("cds");
  }

  if (gNumDays !== 0) {

    [].forEach.call(sampleTable.getElementsByTagName("th"), function (el) {
      el.classList.remove("flashDays");
    });

    sampleTable.querySelector("th:nth-child(" + (gNumDays + 1) + ")").classList.add("flashDays");
  }
}

function getCSVText()  {

  if (currentChecklistCountry)  {

    // var form = $('<form method="post" action="../php/sendCSV.php?country=' + currentChecklistCountry + '"></form>');
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "../php/sendCSV.php?country=" + currentChecklistCountry + "");

    document.body.appendChild(form);

    form.submit();
    form.remove();
  }
  else  checklistCountryButton.classList.add("needsAttention");
}

function openChecklistPage()  {

  var vars;

  if (!currentChecklistCountry)  {
    checklistCountryButton.innerHTML = "Select Country";
    checklistCountryButton.classList.add("needsAttention");
    return;
  }

  if (gNumDays === undefined)   gNumDays = 12;
  if (gStartDate === undefined) gStartDate = 1;

  vars = "?country="       + currentChecklistCountry;
  vars += "&num_days="     + gNumDays;
  vars += "&start_date="   + gStartDate;

  vars += "&line_nos="     + lineNumbers.checked;
  vars += "&left_check="   + leftCheck.checked;
  vars += "&endemics="     + showEndemics.checked;
  vars += "&sci_names="    + !sciNames.checked;
  vars += "&italics="      + !italics.checked;

  window.open( "../php/makePDF.php" + vars, "_blank" );
}
//# sourceMappingURL=maps/main.js.map

//# sourceMappingURL=../../sourcemaps/dest/main.js.map
