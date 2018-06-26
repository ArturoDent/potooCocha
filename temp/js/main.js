"use strict";

var sampleTable;
var leftCheck;
var sciNames;
var italics;
var lineNumbers;
var showEndemics;

// var birds;

var currentChecklistCountry;
var currentChecklistCountryElement;
var checklistAuthorsPanel;
var checklistFlyoutText;

// var countryModalOverlay;
var countryModal;

var gNumDays;
var gStartDate;
var previousNumDaysClass;

var countryButton;
var numDaysButton;
var pdfButton;
var csvButton;

// var map;

/* global  map loadCountryTaxonomy selectedCountryFill getAjax currentMap fillSAMmap  */

document.addEventListener("DOMContentLoaded", function () {
  console.log("window.width = " + window.innerWidth);
  // map   =  document.getElementById("currentMap");

  window.addEventListener("resize", onResizeWindow);

  // countryModalOverlay = document.querySelector(".md-overlay");

  // countryModalOverlay.addEventListener("click", toggleCountryModal);
  countryButton                    =  document.getElementById("countryButton");
  countryButton.addEventListener("click", toggleCountryModal);

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
  checklistFlyoutText = document.getElementById("checklistFlyoutText");

  //  TODO : (below should be changed)

  [].forEach.call(document.getElementsByClassName("country-menu")[0].getElementsByTagName("a"), function (el) {
    el.addEventListener("click", choseCountry);
  });

  // toggleSampleTableLeftChecks();
  leftCheck.checked = true;

  countryModal = document.getElementById("countryModal");

  // only set for smaller widths, here and in onResizeWindow()
  if (window.innerWidth < 870) { window.addEventListener("scroll", checkWindowScroll); }
});

//   *******************  end of  (document).ready(function() ******************************************

function onResizeWindow() {
  // console.log("onResize() called");

  // initCurrentMap();

  if (window.innerWidth < 870) { window.addEventListener("scroll", checkWindowScroll); }
  else window.removeEventListener("scroll", checkWindowScroll);

  // check for mapCollection height
  var mapsCollection = document.querySelector("#mapsCollection");

  var len = mapsCollection.children.length;

  if (len > 0) {

    if (window.innerWidth > 1680) mapsCollection.style.height = "350px";
    else if (window.innerWidth >= 1600) mapsCollection.style.height = "300px";
    else if (window.innerWidth >= 1165) mapsCollection.style.height = "270px";
    else mapsCollection.style.height = "235px";
  }

  console.log("Resize: window.width = " + window.innerWidth);
}

function checkWindowScroll() {

  var docElement = document.documentElement;
  var winElement = window;

  if ((docElement.scrollHeight - winElement.innerHeight) <= winElement.pageYOffset) {
    document.getElementById("currentMap").style.opacity = 0;
  }
  else document.getElementById("currentMap").style.opacity = 1;
}

function toggleCountryModal(evt)  {

  countryModal.classList.toggle("menu-show");
  countryModal.classList.toggle("md-show");
  countryButton.classList.toggle("expand");

  if (evt) evt.stopPropagation();
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
function choseCountry(evt) {

  // if (!currentChecklistCountry && !parseInt) map.getElementsByClassName("drawing")[0].classList.add("active");
  if (!currentChecklistCountry) map.getElementsByClassName("drawing")[0].classList.add("active");

  // if (countryModalOpener === "checklistCountryButton") choseChecklistCountry(evt);
  // else loadCountryTaxonomy(evt);

  choseChecklistCountry(evt);
  loadCountryTaxonomy(evt);
}

function choseChecklistCountry(evt) {

  var selectedCountry;

  var pageScrollTop = document.body.scrollTop;

  toggleCountryModal();

  if (currentChecklistCountry) {
    currentChecklistCountryElement.classList.remove("checkHighlight");
    currentChecklistCountryElement.classList.remove("bothHighlights");
  }

  selectedCountry = evt.target.innerText;

  if (evt.target.tagName === "A") {
    currentChecklistCountryElement = evt.target;
    // selectedCountry = evt.target.children[1].innerHTML;
  }
  else if (evt.target.tagName === "SPAN") {
    currentChecklistCountryElement = evt.target.parentNode;
    // selectedCountry = evt.target.innerHTML;
  }
  // else {  //  evt.target.tagName === "IMG")
  //   currentChecklistCountryElement = evt.target.parentNode;
  //   selectedCountry = evt.target.nextElementSibling.innerHTML;
  // }

  if (selectedCountry === "South America")  currentChecklistCountry = "SouthAmerica";
  else if (selectedCountry === "French Guiana")  currentChecklistCountry = "FrenchGuiana";
  // else if (selectedCountry === "Falklands/Malv.")  currentChecklistCountry = "Falklands";
  // else if (selectedCountry === "Malvinas")  currentChecklistCountry = "Falklands";
  // else if (selectedCountry === "Curaçao")  currentChecklistCountry = "Curacao";
  else   currentChecklistCountry = selectedCountry;

  // checklistCountryButton.innerHTML = selectedCountry;
  if (selectedCountry === "Falklands") countryButton.innerHTML = "Malvinas/Falklands";
  else countryButton.innerHTML = selectedCountry;

  checklistFlyoutText.innerHTML = "Make a checklist for " + selectedCountry;

  countryButton.classList.add("highlight");

  pdfButton.classList.add("highlight");
  csvButton.classList.add("highlight");

  document.body.scrollTop = pageScrollTop;

  currentMap.querySelector(".saveMapButton").style.display = "none";
  currentMap.querySelector(".colorKey").style.opacity = "0";

  if (selectedCountry !== "South America") selectedCountryFill(currentChecklistCountry);
  else fillSAMmap("");

  if (currentChecklistCountry === "Curaçao") {
    getAjax("Authors/" + "Curacao.txt", setChecklistAuthors);
  }
  else getAjax("Authors/" + currentChecklistCountry + ".txt", setChecklistAuthors);
}

function setChecklistAuthors(data) {

  // Remsen, J. V., Jr., J. I. Areta, C. D. Cadena, S. Claramunt, A. Jaramillo, J. F. Pacheco, M. B. Robbins, F. G. Stiles, D. F. Stotz, and K. J. Zimmer.
  // Version 21 June 2018. A classification of the bird species of South America.American Ornithologists' Union.

  var authors;

  if (currentChecklistCountry === "SouthAmerica") {
    authors = data.replace(/^.*(Version.*)$/g, "$1");
  }

  else if (currentChecklistCountry === "Colombia") {
    authors = "Asociación Colombiana de Ornitología checklist committee. 16 Feb. 2018.";
  }

  // Asociación Colombiana de Ornitología checklist committee (Jorge E. Avendaño, Clara I. Bohórquez, Loreta Rosselli, Diana Arzuza-Buelvas,
  // Felipe A.Estela, Andrés M.Cuervo, F.Gary Stiles, and Luis Miguel Renjifo). 2018.
  // Species lists of birds for South American countries and territories: Colombia.Version 16 February 2018.

  // Freile, J. F., R. Ahlman, R. S. Ridgely, A. Solano-Ugalde, D. Brinkhuizen, L. Navarrete, and P. J. Greenfield.
  // 2018. Species lists of birds for South American countries and territories: Ecuador.Version 15 February 2017.

  else {
    authors = data.replace(/^(.*\.) \d\d\d\d\..*Version(.*$)/g, "$1 $2");
  }

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

  // clear all cds classes

  [].forEach.call(sampleTable.querySelectorAll("td"), function (el) {
    el.classList.remove("cds");
  });

  [].forEach.call(sampleTable.querySelectorAll("th"), function (el) {
    el.classList.remove("cds");
  });

  // [].forEach.call(sampleTable.querySelectorAll("td:nth-child(6)"), function (el) {
  //   el.classList.remove("cds");
  // });

  // sampleTable.querySelector("th:nth-child(4)").classList.remove("cds");

  // [].forEach.call(sampleTable.querySelectorAll("td:nth-child(8)"), function (el) {
  //   el.classList.remove("cds");
  // });

  // sampleTable.querySelector("th:nth-child(6)").classList.remove("cds");

  if (gNumDays === 6) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(6)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(4)").classList.add("cds");
  }
  else if (gNumDays ===  7 || gNumDays === 8) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(7)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(5)").classList.add("cds");
  }
  else if (gNumDays ===  9 || gNumDays === 10) {

    [].forEach.call(sampleTable.querySelectorAll("td:nth-child(8)"), function (el) {
      el.classList.add("cds");
    });

    sampleTable.querySelector("th:nth-child(6)").classList.add("cds");
  }
  else if (gNumDays === 11 || gNumDays === 12) {

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
}

function openChecklistPage()  {

  var vars;

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