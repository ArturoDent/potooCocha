"use strict";

var endemicColor         =  "#C23BC3";
var extinctColor         =  "#ddd";
var residentColor        =  "#3030cc";
var nonBreederColor      =  "#ff9900";
var vagrantColor         =  "#ffff00";
var hypotheticalColor    =  "#33cc66";
var introducedColor      =  "#111";

var baseColor            =  "#444";
var baseStrokeColor      =  "#6f8a91";
// var selectedFillColor    =  "#eee";
// var selectedStrokeColor  =  "#eee";


/* global   countries birds currentMap */

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
  }

  else if (obj.parentNode.nodeName === "g")  {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;

    for (var i = 0; i < len; i++)  {

      paths[i].style.transition = "fill 1s";
    }
  }
}

// function fillSAMmap(color)  {

//   if (!color) color = baseColor;
//   var svg;
//   svg = currentMap.querySelector("#SAMsvg");
//   var svgDoc = svg.contentDocument;

//   for (var country in countries) {

//     // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
//     var cc = svgDoc.getElementById(country);
//     if (!cc) continue;

//     newFillColor(cc, color);
//   }
//   addBirdNameToMap("");
// }

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

// function selectedCountryFillColor(selectedCountry, color)  {

//   var svg = currentMap.querySelector("#SAMsvg");
//   var svgDoc = svg.contentDocument;

//   var cc = svgDoc.getElementById(selectedCountry);

//   if (cc) {
//     fillSAMmap();
//     newFillColor(cc,color);
//   }
//   else fillSAMmap();
// }

// function selectedCountryStrokeColor(selectedCountry, color)  {

//   var svg = currentMap.querySelector("#SAMsvg");
//   var svgDoc = svg.contentDocument;

//   var cc = svgDoc.getElementById(selectedCountry);

//   if (cc) {
//     newStrokeColor(cc,color);
//     svg.appendChild(cc);
//   }

// }

// function newStrokeColor(obj, newColor) {

//   if (obj.nodeName === "path") {
//     obj.style.stroke = newColor;
//   }

//   else if (obj.parentNode.nodeName === "g")  {

//     var paths = obj.querySelectorAll("path");

//     var len = paths.length;
//     for (var i = 0; i < len; i++)  {

//       paths[i].style.stroke = newColor;
//     }
//   }
// }

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

    var cc = svgDoc.getElementById(country); // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null

    if (!cc) continue;

  // SAMgroup.each(function(i, children) {

  //     this.removeClass(this.classes()[0]);
  //     this.addClass(baseColor);
  //  });

  // SAMgroup.each(function(i, children) {

    // switch(cList[countries[ this.id() ]])  {
    switch(cList[countries[country]])  {

    case "X(e)":

      // this.removeClass(this.classes()[0]);
      // this.addClass('endemic');
      newFillColor(cc, endemicColor);

      break;

    case "X":

      // this.removeClass(this.classes()[0]);
      // this.addClass('resident');
      newFillColor(cc, residentColor);
      break;

    case "NB":

      // this.removeClass(this.classes()[0]);
      // this.addClass('nonBreeder');
      newFillColor(cc, nonBreederColor);
      break;

    case "V":

      // this.removeClass(this.classes()[0]);
      // this.addClass('vagrant');
      newFillColor(cc, vagrantColor);
      break;

    case "H":

      // this.removeClass(this.classes()[0]);
      // this.addClass('hypothetical');
      newFillColor(cc, hypotheticalColor);
      break;

    case "IN":

      // this.removeClass(this.classes()[0]);
      // this.addClass('introduced');
      newFillColor(cc, introducedColor);
      break;

    case "EX" :

      // this.removeClass(this.classes()[0]);
      // this.addClass('extinct');
      newFillColor(cc, extinctColor);
      break;

    case "EX(e)":

      // this.removeClass(this.classes()[0]);
      // this.addClass('extinct');
      newFillColor(cc, extinctColor);
      break;

    default:
      // this.removeClass(this.classes()[0]);
      newFillColor(cc, baseColor);
      // this.addClass('baseColor');
    }
  }

  if ( (current === "currentMap") && (mapsCollection.children.length < 5) ) {  saveMapButton.style.display = "block";  }

  // if ( (current == "currentMap") && (mapsCollection.children.length < 5) ) {  saveMapButton.style.opacity = "1";  }
}