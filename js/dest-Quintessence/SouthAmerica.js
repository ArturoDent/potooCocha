"use strict";

var countries  = { "Argentina":0, "Aruba":1, "Bolivia":2, "Brazil":3, "Chile":4,
                  "Colombia":5, "Curacao":6, "Ecuador":7, "FrenchGuiana":8,
                  "Guyana":9, "Paraguay":10, "Peru":11, "Suriname":12, "Trinidad":13,
                  "Uruguay":14, "Venezuela":15, "Bonaire":16, "Falklands":17};


var endemicColor         =  "#C23BC3";
var extinctColor         =  "#ddd";
var residentColor        =  "#3030cc";
var nonBreederColor      =  "#ff9900";
var vagrantColor         =  "#ffff00";
var hypotheticalColor    =  "#33cc66";
var introducedColor      =  "#111";
var baseColor            =  "#444740";

var baseStrokeColor      =  "#8a8b86";

/* global addBirdNameToMap birds currentMap  */

function prepareSVGstyles(evt)  {

  var svg;

  if (evt.target && evt.target.id === "SAMsvg") {
    svg = document.getElementById("SAMsvg");
  }
  else {
    svg = document.getElementById(evt);
  }

  var svgDoc = svg.contentDocument;

  for (var country in countries) {

    var cc = svgDoc.getElementById(country);

    // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
    if (!cc) continue;

    setSVGstyles(cc, baseColor, baseStrokeColor);
  }
}

function setSVGstyles(obj )  {

  if (obj.nodeName === "path") {

    obj.style.transition = "fill 1s";
    // obj.style.filter = "blur(20px)";
  }

  else if (obj.parentNode.nodeName === "g")  {
    // obj.parentNode.style.filter = "blur(20px)";

    var paths = obj.querySelectorAll("path");
    var len = paths.length;

    for (var i = 0; i < len; i++)  {
      paths[i].style.transition = "fill 1s";
    }
  }
}

function fillSAMmap(color)  {

  if (!color) color = baseColor;
  var svg;
  svg = currentMap.querySelector("#SAMsvg");
  var svgDoc = svg.contentDocument;

  for (var country in countries) {

    // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
    var cc = svgDoc.getElementById(country);
    if (!cc) continue;

    newFillColor(cc, color);
  }
  addBirdNameToMap("");
}

function newFillColor(obj, newColor) {

  if (obj.nodeName === "path") {
    if (newColor === baseColor) {
      obj.style.fill = "#757570";
    }

    obj.style.fill = newColor;
  }

  else if (obj.parentNode.nodeName === "g")  {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
    for (var i = 0; i < len; i++)  {

      if (newColor === baseColor) {
        paths[i].style.fill = "#757570";
      }

      paths[i].style.fill = newColor;
    }
  }
}

function selectedCountryFillColor(selectedCountry, color)  {

  var svg = currentMap.querySelector("#SAMsvg");
  var svgDoc = svg.contentDocument;

  var cc = svgDoc.getElementById(selectedCountry);

  if (cc) {
    fillSAMmap();
    newFillColor(cc, color);
  }
  else fillSAMmap();
}

/* global  mapsCollection saveMapButton */

function highlightSAMmap(index, current) {

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

    // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
    var cc = svgDoc.getElementById(country);

    if (!cc) continue;

    switch(cList[countries[country]])  {

    case "X(e)":

      newFillColor(cc, endemicColor);
      break;

    case "X":

      newFillColor(cc, residentColor);
      break;

    case "NB":

      newFillColor(cc, nonBreederColor);
      break;

    case "V":

      newFillColor(cc, vagrantColor);
      break;

    case "H":

      newFillColor(cc, hypotheticalColor);
      break;

    case "IN":

      newFillColor(cc, introducedColor);
      break;

    case "EX" :

      newFillColor(cc, extinctColor);
      break;

    case "EX(e)":

      newFillColor(cc, extinctColor);
      break;

    default:
      newFillColor(cc, baseColor);
    }
  }

  if ( (current === "currentMap") && (mapsCollection.children.length < 5) ) {  saveMapButton.style.display = "block";  }
}
// # sourceMappingURL=maps/SouthAmerica.js.map
//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map

//# sourceMappingURL=maps/SouthAmerica.js.map
