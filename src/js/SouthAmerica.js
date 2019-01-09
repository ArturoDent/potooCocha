"use strict";

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
var nonBreederColor = "#ddd";

var vagrantColor = "#caca30";
// var hypotheticalColor = "url(#pattern-vertStripes)";
var hypotheticalColor = "#579ac4";
// var introducedColor = "url(#pattern-circles)";
var introducedColor = "#fee090";

var baseColor = "​#535b5f";
var baseStrokeColor = "#fff";
var selectedCountryFillColor = "#f33";

/* global addBirdNameToMap birds currentMap */

// eslint-disable-next-line
function initCurrentMap() {

  prepareSVGstyles("SAMsvg");

  map = document.getElementById("currentMap");
  // map.style.opacity = "1";
}

//  TODO : (is this necessary? Straight to setSVGstyles()?)
// eslint-disable-next-line
function prepareSVGstyles(obj) {

  // var svg;
  var svg = document.getElementById(obj);

  // if (evt.target && evt.target.id === "SAMsvg") {
  //   svg = document.getElementById("SAMsvg");
  // }
  // else {
  //   svg = document.getElementById(evt);
  // }

  var svgDoc = svg.contentDocument;

  for (var country in countries) {

    var cc = svgDoc.getElementById(country);

    if (!cc) continue;

    setSVGstyles(cc);
  }
}

// eslint-disable-next-line
function setSVGstyles(obj) {

  if (obj.nodeName === "path" || obj.nodeName === "circle") {

    // obj.style.transition = "fill 1s, stroke 1s";
    obj.style.transition = "fill 1s";
  }

  else if (obj.parentNode.nodeName === "g") {
    // obj.parentNode.style.filter = "blur(1.54rem)";

    var paths = obj.querySelectorAll("path");
    var len = paths.length;

    for (var i = 0; i < len; i++) {
      paths[i].style.transition = "fill 1s";
    }
  }
}

function fillSAMmap(skipCountry) {

  var svg;
  svg = currentMap.querySelector("#SAMsvg");
  var svgDoc = svg.contentDocument;

  for (var country in countries) {

    var cc = svgDoc.getElementById(country);
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
      obj.style.fill = "#535b5f";
      // obj.style.fill = "url(#circles)";
    }
    else obj.style.fill = newColor;
    // obj.style.fill = newColor;

    if (newColor !== residentColor) obj.style.stroke = baseStrokeColor;
  }

  else if (obj.parentNode.nodeName === "g") {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
    for (var i = 0; i < len; i++) {

      if (newColor === baseColor) {
        paths[i].style.fill = "#535b5f";
        // paths[i].style.fill = "url(#circles)";
      }
      else paths[i].style.fill = newColor;
      // paths[i].style.fill = newColor;

      if (newColor !== residentColor) paths[i].style.stroke = baseStrokeColor;
    }
  }
}

// eslint-disable-next-line
function selectedCountryFill(selectedCountry) {

  var svg = currentMap.querySelector("#SAMsvg");
  var svgDoc = svg.contentDocument;

  var cc = svgDoc.getElementById(selectedCountry);

  // if (cc) {
  fillSAMmap(cc);
  newFillColor(cc, selectedCountryFillColor);
  newStrokeColor(cc, baseStrokeColor);
  // }
  // else fillSAMmap(baseColor, selectedCountry);
}

function newStrokeColor(obj, newColor) {

  // TODO : (boost the Falklands stroke color?)
  if (obj.nodeName === "path" || obj.nodeName === "circle") {
    obj.style.stroke = newColor;
  }

  else if (obj.parentNode.nodeName === "g") {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
    for (var i = 0; i < len; i++) {

      if (obj.id === "Falklands") {
        paths[i].style.stroke = "#fff";
      }

      else paths[i].style.stroke = newColor;
    }
  }
}

/* global  mapsCollection saveMapButton  */
// eslint-disable-next-line
function highlightSAMmap(index, current) {
  // console.log("in highlightSAMmap, index = " + index);
  var svg;

  if (current === "currentMap") {
    svg = currentMap.querySelector("#SAMsvg");
  }
  else {
    svg = document.getElementById(current);
  }
  var svgDoc = svg.contentDocument;
  var cList = birds[index].split("-");

  for (var country in countries) {

    var cc = svgDoc.getElementById(country);

    if (!cc) continue;

    // because the Falklands is the last country in the occurrence lists apparently split() is returning an extra character (newline?)
    if (country === "Falklands") cList[countries[country]] = cList[countries[country]].trim();

    switch (cList[countries[country]]) {

      case "X(e)":

        newFillColor(cc, endemicColor);
        break;

      case "X":

        newFillColor(cc, residentColor);
        newStrokeColor(cc, '#444')
        break;

      case "NB":

        newFillColor(cc, nonBreederColor);
        newStrokeColor(cc, '#444')
        break;

      case "V":

        newFillColor(cc, vagrantColor);
        newStrokeColor(cc, '#444');
        break;

      case "H":
        newFillColor(cc, hypotheticalColor);
        // newStrokeColor(cc, '#444')
        break;

      case "IN":

        newFillColor(cc, introducedColor);
        newStrokeColor(cc, '#444')
        break;

      case "EX":

        newFillColor(cc, extinctColor);
        break;

      case "EX(e)":

        newFillColor(cc, extinctColor);
        break;

      default:
        newFillColor(cc, baseColor);
    }

    if (current !== "currentMap") newStrokeColor(cc, "#fff");
  }

  if ((current === "currentMap") && (mapsCollection.children.length < 5)) { saveMapButton.style.display = "block"; }
}
