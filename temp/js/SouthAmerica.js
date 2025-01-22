"use strict";

// eslint-disable-next-line no-unused-vars
var map;

var countries = {
  "Argentina": 0, "Aruba": 1, "Bolivia": 2, "Brazil": 3, "Chile": 4,
  "Colombia": 5, "Curaçao": 6, "Ecuador": 7, "FrenchGuiana": 8,
  "Guyana": 9, "Paraguay": 10, "Peru": 11, "Suriname": 12, "Trinidad": 13,
  "Uruguay": 14, "Venezuela": 15, "Bonaire": 16, "Falklands": 17
};

// ['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4']

var endemicColor = "#d73027";
var extinctColor = "#000";
var residentColor = "#fc8d59";

// var nonBreederColor = "url(#pattern-horizStripes)";
var nonBreederColor = "#579ac4";

var vagrantColor = "#54ca30";
var hypotheticalColor = "#ddd";
var introducedColor = "#fee090";

var baseColor = "#8a8a7c";
// var baseStrokeColor = "#bbb";
// var baseStrokeColor = "#333";
var baseStrokeColor = "#eee";
var highlightStrokeColor = "#6a7377";
var darkerStrokeColor = "#333";
var selectedCountryFillColor = "#f33";

// loaded map was #737b7f and #333b3f

/* global addBirdNameToMap birds currentMap */

// eslint-disable-next-line
function initCurrentMap() {

  prepareSVGstyles("SAMsvg");

  map = document.getElementById("currentMap");
}

//  TODO : (is this necessary? Straight to setSVGstyles()?)
// eslint-disable-next-line
function prepareSVGstyles(obj) {

  // var svg = document.getElementById(obj);
  // // currentBirdMap

  let currentBirdMap = document.getElementById("currentBirdMap");
  // let Ecuador = currentBirdMap.querySelector("#Ecuador").nodeName;

  let svgDoc;

  // svgDoc = svg.contentDocument;
  // if (!svgDoc) svgDoc = svg.getSVGDocument();

  for (var country in countries) {

    // var cc = svgDoc.getElementById(country);
    var cc = currentBirdMap.querySelector("#" + country);

    if (!cc) continue;

    setSVGstyles(cc);
  }
}

// eslint-disable-next-line
function setSVGstyles(obj) {

  if (obj.nodeName === "path" || obj.nodeName === "circle") {

    obj.style.transition = "fill 1s";
  }

  else if (obj.parentNode.nodeName === "g") {

    var paths = obj.querySelectorAll("path");
    var len = paths.length;

    for (var i = 0; i < len; i++) {
      paths[i].style.transition = "fill 1s";
    }
  }
}

function fillSAMmap(skipCountry) {

  // var svg;
  // svg = currentMap.querySelector("#SAMsvg");
  // // var svgDoc = svg.contentDocument;
  
  // svgDoc = svg.contentDocument;
  // if (!svgDoc) svgDoc = svg.getSVGDocument();

  let currentBirdMap = document.getElementById("currentBirdMap");


  for (var country in countries) {

    // var cc = svgDoc.getElementById(country);
    var cc = currentBirdMap.querySelector("#" + country);

    if (!cc || cc === skipCountry) continue;
    newFillColor(cc, baseColor);
    newStrokeColor(cc, baseStrokeColor);
  }
  addBirdNameToMap("");
}

function newFillColor(obj, newColor) {

  if (obj.nodeName === "path" || obj.nodeName === "circle") {
    //  HACK : (why does this have to be hardcoded? And below.)
    if (newColor === baseColor) {
      // obj.style.fill = "#535B5F";
      obj.style.fill = "#8a8a7c";
    }
    else obj.style.fill = newColor;

    if (newColor !== residentColor) obj.style.stroke = baseStrokeColor;
  }

  else if (obj.parentNode.nodeName === "g") {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
    for (var i = 0; i < len; i++) {

      if (newColor === baseColor) {
        // paths[i].style.fill = "#535B5F";
        paths[i].style.fill = "#8a8a7c";
      }
      else paths[i].style.fill = newColor;

      if (newColor !== residentColor) paths[i].style.stroke = baseStrokeColor;
    }
  }
}

// eslint-disable-next-line
function selectedCountryFill(selectedCountry) {

  // var svg = currentMap.querySelector("#SAMsvg");
  // // var svgDoc = svg.getSVGDocument();
  // // var svgDoc = svg.contentDocument;
  
  // svgDoc = svg.contentDocument;
  // if (!svgDoc) svgDoc = svg.getSVGDocument();

  // var cc = svgDoc.getElementById(selectedCountry);

  let currentBirdMap = document.getElementById("currentBirdMap");
  let cc = currentBirdMap.querySelector("#" + selectedCountry);

  fillSAMmap(cc);
  newFillColor(cc, selectedCountryFillColor);
  newStrokeColor(cc, baseStrokeColor);
}

function newStrokeColor(obj, newColor) {

  // TODO : (reduce the Falklands filter dropShadow if possible?)
  if (obj.nodeName === "path" || obj.nodeName === "circle") {
    obj.style.stroke = newColor;
  }

  else if (obj.parentNode.nodeName === "g") {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
    for (var i = 0; i < len; i++) {

      if (obj.id === "Falklands") {
        paths[i].style.stroke = "#ddd";
      }

      else paths[i].style.stroke = newColor;
    }
  }
}

/* global  mapsCollection saveMapButton  currentMap */
// eslint-disable-next-line
function highlightSAMmap(index, current) {
  // var svg;

  let currentBirdMap = document.getElementById("currentBirdMap");
  // let cc = currentBirdMap.querySelector(selectedCountry);

  // TODO: figure this out ***
  // if (current === "currentMap") {
  //   svg = currentMap.querySelector("#SAMsvg");
  // }
  // else {
  //   svg = document.getElementById(current);
  // }

  // var svgDoc = svg.contentDocument;
  // // var svgDoc = svg.getSVGDocument();
  
  // svgDoc = svg.contentDocument;
  // if (!svgDoc) svgDoc = svg.getSVGDocument();

  var cList = birds[index].split("-");  // cList = []

  for (var country in countries) {

    // var cc = svgDoc.getElementById(country);
    let cc = currentBirdMap.querySelector("#" + country);

    if (!cc) continue;

    // because the Falklands is the last country in the occurrence lists apparently split() is returning an extra character (newline?)
    if (country === "Falklands") cList[countries[country]] = cList[countries[country]].trim();

      // cList[countries["Ecuador"]] = 7, so 8th item in the cList
    switch (cList[countries[country]]) {

    case "X(e)":

      newFillColor(cc, endemicColor);
      newStrokeColor(cc, baseStrokeColor);
      break;

    case "X":

      newFillColor(cc, residentColor);
      // newStrokeColor(cc, baseStrokeColor);
      newStrokeColor(cc, darkerStrokeColor);
      break;

    case "NB":

      newFillColor(cc, nonBreederColor);
      // newStrokeColor(cc, baseStrokeColor);
      newStrokeColor(cc, darkerStrokeColor);
      break;

    case "V":

      newFillColor(cc, vagrantColor);
      newStrokeColor(cc, darkerStrokeColor);

      break;

    case "H":
      newFillColor(cc, hypotheticalColor);
      // newStrokeColor(cc, darkerStrokeColor);
      newStrokeColor(cc, highlightStrokeColor);
      break;

    case "IN":

      newFillColor(cc, introducedColor);
      // newStrokeColor(cc, darkerStrokeColor);
      newStrokeColor(cc, highlightStrokeColor);
      break;

    case "EX":

      newFillColor(cc, extinctColor);
      newStrokeColor(cc, baseStrokeColor);
      break;

    case "EX(e)":

      newFillColor(cc, extinctColor);
      newStrokeColor(cc, baseStrokeColor);
      break;

    default:
      newFillColor(cc, baseColor);
      newStrokeColor(cc, baseStrokeColor);
    }
  }

  if ((current === "currentMap") && (mapsCollection.children.length < 5)) { saveMapButton.style.display = "block"; }
}
