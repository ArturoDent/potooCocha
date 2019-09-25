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

var titleBanner;
var countryMenuLayer;
var countryButton;

var gNumDays;
var gStartDate;
var previousNumDaysClass;

var numDaysButton;
var pdfButton;
var csvButton;
var requested;

var mailLink;
var observer;
var target;
// var upLoadData = new FormData();
var activityData = [];

var countries2Postals = {   "Argentina": "AR", "Aruba": "AW", "Bolivia": "BO", "Brazil": "BR", "Chile": "CL",
		"Colombia": "CO", "Curaçao": "CW", "Ecuador": "EC", "French Guiana": "GF",
		"Guyana": "GY", "Paraguay": "PY", "Peru": "PE", "Suriname": "SU", "Trinidad": "TT",
		"Uruguay": "UY", "Venezuela": "VE", "Bonaire": "BQ", "Falklands": "FK",
		"South America": "SAM"
};

/* global  map loadCountryTaxonomy selectedCountryFill getAjax currentMap fillSAMmap  */

document.addEventListener("DOMContentLoaded", function () {
  console.log("window.width = " + window.innerWidth);

  countryButton = document.getElementById("countryButton");
  countryButton.addEventListener("click", toggleCountryMenuLayer);
  
  titleBanner = document.getElementById("titleBanner");

  numDaysButton = document.getElementById("numDays");
  numDaysButton.addEventListener("click", setNumDays)
  // onKeyUp listener for tabbing and entering
  numDaysButton.addEventListener('keyup', setNumDays);

  numDaysButton.children.item(11).classList.add("highlight");
  gNumDays = 10;  
  
  sampleTable = document.getElementById("sampleTable");
  sampleTable.classList.add("numDays" + String(gNumDays));

  previousNumDaysClass = "numDays10";

  pdfButton = document.getElementById("pdfButton");
  pdfButton.addEventListener("click", openChecklistPage);

  csvButton = document.getElementById("csvButton");
  csvButton.addEventListener("click", getCSVText);

  lineNumbers = document.getElementById("lineNumbers");
  leftCheck = document.getElementById("leftCheck");
  showEndemics = document.getElementById("showEndemics");
  sciNames = document.getElementById("sciNames");
  italics = document.getElementById("italics");

  lineNumbers.addEventListener("click", toggleSampleTableLineNumbers);
  leftCheck.addEventListener("click", toggleSampleTableLeftChecks);
  showEndemics.addEventListener("click", toggleSampleTableShowEndemics);
  sciNames.addEventListener("click", toggleSampleTableSciNames);
  italics.addEventListener("click", toggleSampleTableItalics);
  
  lineNumbers.nextElementSibling.addEventListener("keyup", toggleSampleTableLineNumbers);
  leftCheck.nextElementSibling.addEventListener("keyup", toggleSampleTableLeftChecks);
  showEndemics.nextElementSibling.addEventListener("keyup", toggleSampleTableShowEndemics);
  sciNames.nextElementSibling.addEventListener("keyup", toggleSampleTableSciNames);
  italics.nextElementSibling.addEventListener("keyup", toggleSampleTableItalics);

  checklistAuthorsPanel = document.getElementById("checklistAuthorsPanel");
  checklistFlyoutText = document.getElementById("checklistFlyoutText");

  document.querySelector("#country-menu").addEventListener("click", setCountry);
  document.querySelector("#country-menu").addEventListener("keyup", setCountry);  
  
  leftCheck.checked = true;

  countryMenuLayer = document.getElementById("countryMenuLayer");

  mailLink = document.getElementById("mailLink");
  mailLink.addEventListener("click", sendEmail);

  target = document.getElementById("checklistArticle");
  
  // updateActivityData("start");
});

window.addEventListener("load", function (event) { 
  updateActivityData("start");
 });

window.addEventListener("unload", function (event) { 
  updateActivityData("stop");
 });

//   *******************   end of  (document).ready(function()   ******************************************

// function setUpMapBodyIntersectionObserver() {
//   var options = {

//     root: null,
//     // root: document.getElementsByTagName("body")[0],
//     rootMargin: "0px",
//     // rootMargin: "0% 0% 50% 0%",
//     threshold: 0.4
//   };

//   observer = new IntersectionObserver(fadeMap, options);
//   observer.observe(target);
// }

// function fadeMap(entries, observer) {

//   var map = document.getElementById("currentMap");
//   map.classList.toggle("fadeMap");
// }

function sendEmail() {
  // TODO : can this be obfuscated?  unicode??
  window.location.href = "mailto:mark@potoococha.net";
}

function toggleCountryMenuLayer(evt) {

  countryMenuLayer.classList.toggle("show");
  countryButton.classList.toggle("slideLeft");
  
  // if (!countryButton.classList.contains("wasOpened")) countryButton.classList.add("wasOpened");

  if (evt) evt.stopPropagation();
  
  document.getElementById("tax-panel").classList.add("setTaxPanelHeight");
}

function toggleSampleTableShowEndemics(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup") {
    if (evt.keyCode !== 13) {
      return;
    }
    else {
      evt.target.previousElementSibling.checked = !evt.target.previousElementSibling.checked;
    }
  }

  sampleTable.querySelector("td.endemical").classList.toggle("showEndemics");
}

function toggleSampleTableSciNames(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup") {
    if (evt.keyCode !== 13) {
      return;
    }
    else {
      evt.target.previousElementSibling.checked = !evt.target.previousElementSibling.checked;
    }
  }

  sampleTable.classList.toggle("noScientificNames");
  italics.disabled = !italics.disabled;
}

function toggleSampleTableItalics(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup") {
    if (evt.keyCode !== 13) {
      return;
    }
    else {
      evt.target.previousElementSibling.checked = !evt.target.previousElementSibling.checked;
    }
  }

  sampleTable.classList.toggle("noItalics");
}

function toggleSampleTableLeftChecks(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup") {
    if (evt.keyCode !== 13) {
      return;
    }
    else {
      evt.target.previousElementSibling.checked = !evt.target.previousElementSibling.checked;
    }
  }

  var list = sampleTable.querySelectorAll(".leftCheckBox, .familyHidden");
  
  Array.prototype.forEach.call(list, function (item) {
    item.classList.toggle("show");
  });
}

function toggleSampleTableLineNumbers(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup") {
    if (evt.keyCode !== 13) {
      return;
    }
    else {
      evt.target.previousElementSibling.checked = !evt.target.previousElementSibling.checked;
    }
  }

  sampleTable.querySelector("td.lineNumbers").classList.toggle("showLineNumbers");
}

function setCountry(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup" && evt.keyCode !== 13) {
    return;
  }

  // find and remove the previous highlighted Country
  var previousHighlightedCountry = evt.target.parentNode.parentNode.querySelector(".highlight");
  if (previousHighlightedCountry) previousHighlightedCountry.classList.remove("highlight");

  evt.target.classList.add("highlight");

  if (!currentCountry) {

    // TODO : put code for scrolling page here
    map.getElementsByClassName("drawing")[0].classList.add("active");
  }

  toggleCountryMenuLayer();

  currentCountry = evt.target.innerText;
  updateActivityData("select");
  
  // uploadActivity();
  // countryButton.innerHTML = currentCountry;
  
  if (!titleBanner.classList.contains("countryChosen")) titleBanner.classList.add("countryChosen");
  
  if (!countryButton.classList.contains("countryChosen")) countryButton.classList.add("countryChosen");
  countryButton.innerHTML = countries2Postals[currentCountry];

  setChecklistCountryAuthors(currentCountry);
  loadCountryTaxonomy(currentCountry);
}

function setChecklistCountryAuthors(country) {

  checklistFlyoutText.innerHTML = "Make a checklist for " + country;

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

  if (currentCountry === "South America") {
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

function setNumDays(evt) {
  
  // KeyboardEvent, type keyup, 13 === Enter
  if (evt.type === "keyup" && evt.keyCode !== 13) {
    return;
  }
  
  var day = evt.target;
  var list;   // will be a NodeList of th/td's with cds class applies to them

  if (day.classList.contains("highlight")) {  // if click on already highlighted target ignore
    return;
  }
  else if (gNumDays || gNumDays === 0) {
    numDaysButton.children[gNumDays + 1].classList.remove("highlight");
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
  else if (gNumDays === 7 || gNumDays === 8) {

    list = sampleTable.querySelectorAll("td:nth-child(7), th:nth-child(5)");
    Array.prototype.forEach.call(list, function (item) {
      item.classList.add("cds");
    });

  }
  else if (gNumDays === 9 || gNumDays === 10) {

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
}

function getCSVText() {

  if (!currentCountry) return;

  requested = "csv";
  // uploadDownloads();
  updateActivityData("download");

  var tempCountry;

  if (currentCountry === "French Guiana") tempCountry = "FrenchGuiana";
  else if (currentCountry === "South America") tempCountry = "SouthAmerica";
  else if (currentCountry === "Curaçao") tempCountry = "Curacao";
  else tempCountry = currentCountry;

  if (tempCountry) {

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
  // uploadDownloads();
  updateActivityData("download");

  var vars;
  var tempCountry;

  if (currentCountry === "French Guiana") tempCountry = "FrenchGuiana";
  else if (currentCountry === "South America") tempCountry = "SouthAmerica";
  else if (currentCountry === "Curaçao") tempCountry = "Curacao";
  else tempCountry = currentCountry;

  if (gNumDays === undefined) gNumDays = 12;
  if (gStartDate === undefined) gStartDate = 1;

  vars = "?country=" + tempCountry;
  vars += "&num_days=" + gNumDays;
  vars += "&start_date=" + gStartDate;

  vars += "&line_nos=" + lineNumbers.checked;
  vars += "&left_check=" + leftCheck.checked;
  vars += "&endemics=" + showEndemics.checked;
  vars += "&sci_names=" + !sciNames.checked;
  vars += "&italics=" + !italics.checked;

  window.open("../php/makePDF.php" + vars, "_blank");
}

function uploadDownloads() {

  if (!navigator.sendBeacon) {
    console.log("sendBeacon(uploadDownloads) not supported");
    return true;
  }

  var downloadsURL = "./php/collectDownloads.php";

  var downloadData = new FormData();
  downloadData.append('country', currentCountry);
  downloadData.append('document', requested);

  navigator.sendBeacon(downloadsURL, downloadData);
}

function updateActivityData(stage, query) {
  
  var action = [];
  
  switch (stage) {
    
    case "start":
      action.push("start");
      break;
    
    case "select":
      action.push("select");
      action.push(currentCountry);
      break;

    case "search":
      action.push("search");
      if (query)  action.push(query);
      break;
    
    case "download":
      action.push("download");
      action.push(requested);
      break;
    
    case "stop":
      action.push("stop");
      break;
  
    default:
      break;
  }
  
 uploadActivity(action);
}

function uploadActivity(action) {

  if (!navigator.sendBeacon) {
    return true;
  }
  var activityURL = "./php/collectActivity.php";
  
  // var JSONstringData = JSON.stringify(["start"]);
  // var JSONstringData = JSON.stringify(["select", currentCountry]);
  // var JSONstringData = JSON.stringify(["search"]);
  // var JSONstringData = JSON.stringify(["download", "checklist"]);
  // var JSONstringData = JSON.stringify(["stop"]);
  
  var JSONstringData = JSON.stringify(action);
  
  var downloadData = new FormData();
  downloadData.append('action', JSONstringData);
  navigator.sendBeacon(activityURL, downloadData);
}
