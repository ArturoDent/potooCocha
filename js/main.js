"use strict";

var leftCheck;
var sciNames;
var italics;
var lineNumbers;
var showEndemics;

var titleBanner;
var footer;

var currentChecklistCountry;
var currentChecklistCountryElement;

var countryModalOverlay;
var countryModalOpener;

  // these are global vars that the opened checklist window will read
var gNumDays;  /* exported gNumDays */
var gStartDate;  /* exported gStartDate */
var previousNumDaysClass;

var checklistArticle;
var numDaysButton;
var checklistCountryButton;
var pdfButton;
var csvButton;
var taxonomyCountryButton;

var map;
var taxonomyArticle;

/* global  initMapFactory prepareSVGstyles loadCountryTaxonomy selectedCountryFillColor currentMap selectedFillColor */

// svg4everybody();

$(function () {

  // smallBanner is header[0]
  // titleBanner = document.getElementsByTagName("header")[1];
  titleBanner = document.getElementById("bigBanner");

  footer = document.getElementsByTagName("footer")[0];

  map   =  document.getElementById("currentMap");
  taxonomyArticle = document.getElementById("taxonomyArticle");

  setFooterBannerDimensions();
  // window.onresize = setFooterBannerDimensions;
  // window.onresize = initCurrentMap;

  window.addEventListener("resize", onResizeWindow);

  countryModalOverlay                      =  document.querySelector(".md-overlay");
  countryModalOverlay.addEventListener("click", closeCountryModal);

  document.getElementById("countryModal").addEventListener("click", closeCountryModal);

  checklistArticle                         =  document.getElementById("checklistArticle");
  checklistCountryButton                   =  document.getElementById("checklistCountryButton");
  taxonomyCountryButton                    =  document.getElementById("taxonomyCountryButton");

  checklistCountryButton.addEventListener("click", showCountryModal);
  taxonomyCountryButton.addEventListener("click", showCountryModal);

  numDaysButton                       =  document.getElementById("numDays");
  numDaysButton.addEventListener("click", setNumDays);

  numDaysButton.children.item(11).classList.add("highlight");
  gNumDays = 10;
  $("#sampleTable").addClass("numDays" + String(gNumDays));
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

  $("#lineNumbers").on("click", toggleSampleTableLineNumbers);
  $("#leftCheck").on("click", toggleSampleTableLeftChecks);
  $("#showEndemics").on("click", toggleSampleTableShowEndemics);
  $("#sciNames").on("click", toggleSampleTableSciNames);
  $("#italics").on("click", toggleSampleTableItalics);

  $(".country-menu a").on("click", choseCountry);

  $("#SAMsvg").on("SVGLoad", initCurrentMap);
  // map.querySelector('#SAMsvg').addEventListener('SVGLoad', initCurrentMap);

  initMapFactory();
});

//   *******************  end of  $(document).ready(function() ******************************************

function onResizeWindow() {
  setFooterBannerDimensions();
  initCurrentMap();
}

function initCurrentMap() {

  prepareSVGstyles("SAMsvg");

  var inner = document.documentElement.clientWidth;
  var bodyRightMargin = document.body.getBoundingClientRect().right;

  var panelWidth = taxonomyArticle.getBoundingClientRect().width;

  var left = panelWidth + (inner - bodyRightMargin)/2 - 85;

  if (document.documentElement.clientWidth > 1024) {
    map.style.left = left + "px";
  }
  // else map.style.left = left + 20 + "px";

  else map.style.left = left + (0.25 * map.getBoundingClientRect().width) + "px";


  map.style.opacity = "1";
}

function setFooterBannerDimensions()  {

  // console.log("document.documentElement.clientWidth = " + document.documentElement.clientWidth);

  // var reducedBodyLeftMargin;
  var bodyLeftMargin = document.body.getBoundingClientRect().left;
  var reducedBodyLeftMargin = bodyLeftMargin;
  // console.log("bodyLeftMargin = " + bodyLeftMargin);

  if (document.documentElement.clientWidth <= 1024) {
    document.getElementsByClassName("articles")[0].style.left = -(0.8 * bodyLeftMargin) + "px";
    return;
  }
  else {
    document.getElementsByClassName("articles")[0].style.left = -(0.7 * bodyLeftMargin) + "px";
    reducedBodyLeftMargin = 0.7 * bodyLeftMargin;
  }

  // var left = 0.87 * bodyLeftMargin;

  var rightFooterMargin = 0.35 * bodyLeftMargin;

  var inner = document.documentElement.clientWidth;

  footer.style.left  =  -bodyLeftMargin + "px";
  footer.style.width =  inner - rightFooterMargin + "px";

  titleBanner.style.left = -bodyLeftMargin + "px";
  titleBanner.style.width = (0.4 * reducedBodyLeftMargin) + "px";

  titleBanner.style.lineHeight = parseInt(titleBanner.style.width) - 10 + "px";
}

function showCountryModal(evt)  {

  document.querySelector("#countryModal").classList.add("md-show");
  document.querySelector("#mainContent").classList.add("modal-shrink");

  if (evt.target.id === "checklistCountryButton") countryModalOpener = "checklistCountryButton";
  else countryModalOpener = "taxonomyCountryButton";
}

function closeCountryModal()  {

  document.querySelector("#countryModal").classList.remove("md-show");
  document.querySelector("#mainContent").classList.remove("modal-shrink");
}

// function clearChecklistOptions()  {

//   $("#sampleTable td.endemical").removeClass("showEndemics");
//   showEndemics.checked = false;

//   $("#sampleTable").removeClass("noScientificNames");
//   sciNames.checked = false;

//   $("#sampleTable").removeClass("noItalics");
//   italics.checked = false;
//   italics.disabled = false;

//   $("#sampleTable td.lineNumbers").removeClass("showLineNumbers");
//   lineNumbers.checked = false;

//   $("#sampleTable td.leftCheckBox").removeClass("show");
//   $("#sampleTable td.familyHidden").removeClass("show");

//   leftCheck.checked = false;
// }

function toggleSampleTableShowEndemics() {

  $("#sampleTable td.endemical").toggleClass("showEndemics");
}

function toggleSampleTableSciNames()  {

  $("#sampleTable").toggleClass("noScientificNames");
  italics.disabled = !italics.disabled;
}

function toggleSampleTableItalics()  {

  $("#sampleTable").toggleClass("noItalics");
}

// add : if no sci names = both line numbers and left check possible

function toggleSampleTableLeftChecks() {

  $("#sampleTable td.leftCheckBox").toggleClass("show");
  $("#sampleTable td.familyHidden").toggleClass("show");
}

function toggleSampleTableLineNumbers() {

  $("#sampleTable td.lineNumbers").toggleClass("showLineNumbers");
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
	else if (selectedCountry === "Malvinas")  currentChecklistCountry = "Falklands";
  else if (selectedCountry === "Malvinas")  currentChecklistCountry = "Falklands";
	else if (selectedCountry === "Curaçao")  currentChecklistCountry = "Curacao";
	else   currentChecklistCountry = selectedCountry;

  checklistCountryButton.innerHTML = selectedCountry;
  currentChecklistCountryElement = evt.target;
  currentChecklistCountryElement.classList.add("checkHighlight");
  if (currentChecklistCountryElement.classList.contains("taxHighlight")) currentChecklistCountryElement.classList.add("bothHighlights");

  var buttonDisplace = $("#checklistCountryButton").width();
  $("#checklistCountryButton").css({"right":-buttonDisplace/2 - 20 + "px"});

  checklistCountryButton.classList.remove("needsAttention");
  checklistCountryButton.classList.add("highlight");

  pdfButton.classList.add("highlight");
  csvButton.classList.add("highlight");

  document.body.scrollTop = pageScrollTop;

  currentMap.querySelector(".saveMapButton").style.display = "none";
  currentMap.querySelector(".colorKey").style.opacity = "0";

  selectedCountryFillColor(currentChecklistCountry, selectedFillColor);
  map.style.top = checklistArticle.offsetTop + 20 + "px";
}

// function resetNumDays() {

//   numDaysButton.children.item(gNumDays).classList.remove("highlight");
//   $("#sampleTable").removeClass("numDays" + String(gNumDays));

//   numDaysButton.children.item(11).classList.add("highlight");
//   gNumDays = 10;
//   $("#sampleTable").addClass("numDays" + String(gNumDays));
//   previousNumDaysClass = "numDays" + String(gNumDays);
// }

// function setStartDate (evt)  {

//   var start_date = evt.target;

//   gStartDate = start_date;
// }

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

  $("#sampleTable").removeClass(previousNumDaysClass);
  $("#sampleTable").addClass("numDays" + String(gNumDays));
  previousNumDaysClass = "numDays" + String(gNumDays);

  // rules for column double border right vs. number of days

  $("#sampleTable td:nth-child(6)").removeClass("cds");
  $("#sampleTable th:nth-child(4)").removeClass("cds");

  $("#sampleTable td:nth-child(8)").removeClass("cds");
  $("#sampleTable th:nth-child(6)").removeClass("cds");

  if (gNumDays === 6 || gNumDays === 7) {
    $("#sampleTable td:nth-child(6)").addClass("cds");
    $("#sampleTable th:nth-child(4)").addClass("cds");
  }
  else if (gNumDays === 10) {
    $("#sampleTable td:nth-child(13)").removeClass("cds");
    $("#sampleTable th:nth-child(11)").removeClass("cds");

    $("#sampleTable td:nth-child(8)").addClass("cds");
    $("#sampleTable th:nth-child(6)").addClass("cds");
  }
  else if (gNumDays !== 5) {
    $("#sampleTable td:nth-child(8)").addClass("cds");
    $("#sampleTable th:nth-child(6)").addClass("cds");

    $("#sampleTable td:nth-child(13)").addClass("cds");
    $("#sampleTable th:nth-child(11)").addClass("cds");
  }

  if (gNumDays !== 0) {
    $("#sampleTable th").removeClass("flashDays");
    $("#sampleTable th:nth-child(" + (gNumDays+1) + ")").addClass("flashDays");
  }
}

function getCSVText()  {

  if (currentChecklistCountry)  {

    var form = $('<form method="post" action="../php/sendCSV.php?country=' + currentChecklistCountry + '"></form>');

    $("body").append(form);

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

  // var otherWindow = window.open();
  // otherWindow.opener = null;
  // otherWindow.location = url;
  window.open( "../php/makePDF.php" + vars, "_blank" );
}