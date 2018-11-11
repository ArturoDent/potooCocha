"use strict";      

var sampleTable;
var leftCheck;
var sciNames;
var italics;
var lineNumbers;
var showEndemics;

var currentCountry;
var checklistAuthorsPanel;
var checklistFlyoutText;

var countryModal;

var gNumDays;
var gStartDate;
var previousNumDaysClass;

var countryButton;
var numDaysButton;
var pdfButton;
var csvButton;
var requested;

/* global  map loadCountryTaxonomy selectedCountryFill getAjax currentMap fillSAMmap  */

document.addEventListener("DOMContentLoaded", function () {
  console.log("window.width = " + window.innerWidth);

  window.addEventListener("resize", onResizeWindow);

  countryButton                    =  document.getElementById("countryButton");
  countryButton.addEventListener("click", toggleCountryModal);

  numDaysButton                       =  document.getElementById("numDays");
  numDaysButton.addEventListener("click", setNumDays);

  numDaysButton.children.item(11).classList.add("highlight");
  gNumDays = 10;

  sampleTable = document.getElementById("sampleTable");
  sampleTable.classList.add("numDays" + String(gNumDays));

  // previousNumDaysClass = "numDays" + String(gNumDays);
  previousNumDaysClass = "numDays10";

  pdfButton                           =  document.getElementById("pdfButton");
  pdfButton.addEventListener("click", openChecklistPage);

  csvButton                           =  document.getElementById("csvButton");
  csvButton.addEventListener("click", getCSVText);

  lineNumbers  =  document.getElementById("lineNumbers");
  leftCheck    =  document.getElementById("leftCheck");
  showEndemics =  document.getElementById("showEndemics");
  sciNames     =  document.getElementById("sciNames");
  italics      =  document.getElementById("italics");

  lineNumbers.addEventListener("click", toggleSampleTableLineNumbers);
  leftCheck.addEventListener("click", toggleSampleTableLeftChecks);
  showEndemics.addEventListener("click", toggleSampleTableShowEndemics);
  sciNames.addEventListener("click", toggleSampleTableSciNames);
  italics.addEventListener("click", toggleSampleTableItalics);

  checklistAuthorsPanel = document.getElementById("checklistAuthorsPanel");
  checklistFlyoutText = document.getElementById("checklistFlyoutText");

  document.querySelector(".country-menu").addEventListener("click", setCountry);
  leftCheck.checked = true;

  countryModal = document.getElementById("countryModal");

  // only set for smaller widths, here and in onResizeWindow()
  if (window.innerWidth < 870) { window.addEventListener("scroll", checkWindowScroll); }
});

//   *******************   end of  (document).ready(function()   ******************************************

// TODO : (is this needed?)

function onResizeWindow() {

  // initCurrentMap();

  if (window.innerWidth < 870) { window.addEventListener("scroll", checkWindowScroll); }
  else window.removeEventListener("scroll", checkWindowScroll);

  // check for mapCollection height
  var mapsCollection = document.querySelector("#mapsCollection");

  var len = mapsCollection.children.length;

  if (len > 0) {    
    
    if (window.innerWidth > 1680) mapsCollection.style.height = "26.92rem";
    else if (window.innerWidth >= 1600) mapsCollection.style.height = "23.1rem";
    else if (window.innerWidth >= 1165) mapsCollection.style.height = "20.8rem";
    else mapsCollection.style.height = "18.1rem";
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

// FIXME : why is this called twice? for each countryButton select

function toggleCountryModal(evt)  {

  countryModal.classList.toggle("menu-show");

  // countryModal.classList.toggle("show");
  document.getElementsByClassName("md-overlay")[0].classList.toggle("show");
  // countryButton.classList.toggle("expand");

  if (evt) evt.stopPropagation();
  
  // TODO : if scroll at bottom (i.e., looking at checklists ), set it there again
  
  // console.log("")
  
  // if (document.body.scrollTop > ____) {
  
  // both of below do not work on the first choice of country - height of page changing?
  // doesn't go all the way to botton of page
  // numDaysButton.scrollIntoView(false);
  
  // does go to the bottom of page
  // document.body.scrollTop = 2000;
  // };
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

function toggleSampleTableLeftChecks() {

  var list = sampleTable.querySelectorAll(".leftCheckBox, .familyHidden");
  Array.prototype.forEach.call(list, function (item) {
    item.classList.toggle("show");
  });
}

function toggleSampleTableLineNumbers() {

  sampleTable.querySelector("td.lineNumbers").classList.toggle("showLineNumbers");
}

function setCountry(evt) {

  // find and remove the previous highlighted Country
  var previousHighlightedCountry = evt.target.parentNode.parentNode.querySelector(".highlight");
  if (previousHighlightedCountry) previousHighlightedCountry.classList.remove("highlight");

  evt.target.classList.add("highlight");

  if (!currentCountry) {
    
   // TODO : put code for scrolling page here 
    map.getElementsByClassName("drawing")[0].classList.add("active");
  }
  else {
    
  }

  toggleCountryModal();

  currentCountry = evt.target.innerText;

  if (currentCountry === "Falklands") countryButton.innerHTML = "Malvinas/Falklands";
  else countryButton.innerHTML = currentCountry;

  setChecklistCountryAuthors(currentCountry);
  loadCountryTaxonomy(currentCountry);
}

function setChecklistCountryAuthors(country) {

  checklistFlyoutText.innerHTML = "Make a checklist for " + country;

  countryButton.classList.add("highlight");

  pdfButton.classList.add("highlight");
  csvButton.classList.add("highlight");

  currentMap.querySelector(".saveMapButton").style.display = "none";
  currentMap.querySelector(".colorKey").style.opacity = "0";

  if (country === "French Guiana") selectedCountryFill("FrenchGuiana");
  else if (country !== "South America") selectedCountryFill(country);
  else fillSAMmap("");

  if (country === "Curaçao") {
    getAjax("Authors/" + "Curacao.txt", setChecklistAuthors);
  }
  else if (country === "French Guiana") {
    getAjax("Authors/" + "FrenchGuiana.txt", setChecklistAuthors);
  }
  else if (country === "South America") {
    getAjax("Authors/" + "SouthAmerica.txt", setChecklistAuthors);
  }
  else getAjax("Authors/" + country + ".txt", setChecklistAuthors);
}

function setChecklistAuthors(data) {

  // Remsen, J. V., Jr., J. I. Areta, C. D. Cadena, S. Claramunt, A. Jaramillo, J. F. Pacheco, M. B. Robbins, F. G. Stiles, D. F. Stotz, and K. J. Zimmer.
  // Version 21 June 2018. A classification of the bird species of South America.American Ornithologists' Union.

  var authors;

  if (currentCountry === "SouthAmerica") {
    // authors = data.replace(/^.*(Version.*)$/g, "$1");
    authors = data.replace(/^.*Version(.*)$/g, "Remsen, et al. $1");
  }

  else if (currentCountry === "Colombia") {
    authors = data.replace(/^(.*)\s+\(.*\).*Version(.*)$/g, "$1. $2");
    // authors = "Asociación Colombiana de Ornitología checklist committee. 16 Feb. 2018.";
  }

  // Asociación Colombiana de Ornitología checklist committee (Jorge E. Avendaño, Clara I. Bohórquez, Loreta Rosselli, Diana Arzuza-Buelvas,
  // Felipe A.Estela, Andrés M.Cuervo, F.Gary Stiles, and Luis Miguel Renjifo). 2018.
  // Species lists of birds for South American countries and territories: Colombia.Version 16 February 2018.

  // Freile, J. F., R. Ahlman, R. S. Ridgely, A. Solano-Ugalde, D. Brinkhuizen, L. Navarrete, and P. J. Greenfield.
  // 2018. Species lists of birds for South American countries and territories: Ecuador. Version 15 February 2017.

  else {
    authors = data.replace(/^(.*\.) \d\d\d\d\..*Version(.*$)/g, "$1 $2");
  }

  checklistAuthorsPanel.innerHTML = authors;
  checklistAuthorsPanel.classList.add("show");
}

function setNumDays(evt)  {

  var day = evt.target;
  var list;   // will be a NodeList of th/td's with cds class applies to them

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

  // first clear all cds classes

  list = sampleTable.querySelectorAll("td.cds, th.cds");
  Array.prototype.forEach.call(list, function (item) {
    item.classList.remove("cds");
  });

  if (gNumDays === 6) {

    list = sampleTable.querySelectorAll("td:nth-child(6), th:nth-child(4)");
    Array.prototype.forEach.call(list, function (item) {
      item.classList.add("cds");
    });
  }
  else if (gNumDays ===  7 || gNumDays === 8) {

    list = sampleTable.querySelectorAll("td:nth-child(7), th:nth-child(5)");
    Array.prototype.forEach.call(list, function (item) {
      item.classList.add("cds");
    });

  }
  else if (gNumDays ===  9 || gNumDays === 10) {

    list = sampleTable.querySelectorAll("td:nth-child(8), th:nth-child(6)");
    Array.prototype.forEach.call(list, function (item) {
      item.classList.add("cds");
    });
  }
  else if (gNumDays === 11 || gNumDays === 12) {

    list = sampleTable.querySelectorAll("td:nth-child(8), td:nth-child(13), th:nth-child(6), th:nth-child(11)");
    Array.prototype.forEach.call(list, function (item) {
      item.classList.add("cds");
    });
  }

  if (gNumDays !== 0) {

    var item = sampleTable.querySelector("th.flashDays");
    if (item)  item.classList.remove("flashDays");

    sampleTable.querySelector("th:nth-child(" + (gNumDays + 1) + ")").classList.add("flashDays");
  }
}

function getCSVText() {

  if (!currentCountry) return;

  requested = "csv";
  logVisit();  // could update the log in sendCSV.php

  var tempCountry;

  if (currentCountry === "French Guiana") tempCountry = "FrenchGuiana";
  else if (currentCountry === "South America") tempCountry = "SouthAmerica";
  else if (currentCountry === "Curaçao") tempCountry = "Curacao";
  else tempCountry = currentCountry;

  if (tempCountry)  {

    // var form = $('<form method="post" action="../php/sendCSV.php?country=' + currentCountry + '"></form>');
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "../php/sendCSV.php?country=" + tempCountry + "");

    document.body.appendChild(form);

    form.submit();
    form.remove();
  }
}

function openChecklistPage() {

  if (!currentCountry) return;

  requested = "checklist";
  logVisit();  // could update the log in makePDF.php

  var vars;
  var tempCountry;

  if (currentCountry === "French Guiana") tempCountry = "FrenchGuiana";
  else if (currentCountry === "South America") tempCountry = "SouthAmerica";
  else if (currentCountry === "Curaçao") tempCountry = "Curacao";
  else tempCountry = currentCountry;

  if (gNumDays === undefined)   gNumDays = 12;
  if (gStartDate === undefined) gStartDate = 1;

  vars = "?country="       + tempCountry;
  vars += "&num_days="     + gNumDays;
  vars += "&start_date="   + gStartDate;

  vars += "&line_nos="     + lineNumbers.checked;
  vars += "&left_check="   + leftCheck.checked;
  vars += "&endemics="     + showEndemics.checked;
  vars += "&sci_names="    + !sciNames.checked;
  vars += "&italics="      + !italics.checked;

  window.open( "../php/makePDF.php" + vars, "_blank" );
}

function logVisit() {

  if (!navigator.sendBeacon) {
    console.log("sendBeacon() not supported");
    return true;
  }

  var url = "./php/collectVisits.php";

  var data = new FormData();
  data.append('country', currentCountry);
  data.append('document', requested);

  navigator.sendBeacon(url, data);
}