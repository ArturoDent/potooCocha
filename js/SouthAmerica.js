"use strict";

function prepareSVGstyles(evt)  {

  var svg;

  if (evt.target && evt.target.id === "SAMsvg") {
    svg = document.getElementById("SAMsvg");
  }
  else {
     svg = document.getElementById(evt);
  }

  var svgDoc = svg.contentDocument;

  // var titles = svgDoc.querySelectorAll('title');
  // var len = titles.length;

  // console.log("titles.length = " + len);

  // for (var i = 0; i < len; i++)  {

  //   titles[i].classList.add("svgTooltip");
  // }


  for (var country in countries) {

    var cc = svgDoc.getElementById(country);

    // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
    if (!cc) continue;

    setSVGstyles(cc, baseColor, baseStrokeColor);
  }
}

function setSVGstyles(obj, fillColor, strokeColor)  {
  // console.log("in setSVGstyles");

  if (obj.nodeName === "path") {

    // 'http://www.w3.org/2000/svg'

    // console.log("obj.getElementsByTagNameNS('title')[0].innerHTML = " + obj.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'title')[0].innerHTML);

      obj.style.transition = "fill 1s";
      // <title> is always the firstChild of <path> too
      // obj.querySelector('title').classList.add("svgTooltip");
  }

  else if (obj.parentNode.nodeName === "g")  {

    var paths = obj.querySelectorAll("path");

    var len = paths.length;

    for (var i = 0; i < len; i++)  {
    // console.log("paths[i].getElementsByTagNameNS('title')[0].innerHTML = " + paths[i].getElementsByTagNameNS('http://www.w3.org/2000/svg', 'title')[0].innerHTML);

      paths[i].style.transition = "fill 1s";
      // paths[i].querySelector('title').classList.add("svgTooltip");
    }
  }
}

function fillSAMmap(color)  {

  if (!color) color = baseColor;

  var svg;

  svg = currentMap.querySelector("#SAMsvg");

  var svgDoc = svg.contentDocument;

  // SAMgroup.each(function(i, children) {

  //     this.removeClass(this.classes()[0]);
  //     this.addClass(baseColor);
  //  });

  for (var country in countries) {

    // Aruba, Bonaire, Curacao, Trinidad and Falklands are not in the svg so cc = null
    var cc = svgDoc.getElementById(country);
    if (!cc) continue;

    newFillColor(cc, color);
  }

  addBirdNameToMap("");
}

function newFillColor(obj, newColor) {

  // svgElement.style.setProperty("fill-opacity", "0.0", "")

  if (obj.nodeName === "path") {
    if (newColor === baseColor) {
      obj.style.fill = "#757570";
    }

    obj.style.fill = newColor;
  }

  else if (obj.parentNode.nodeName === "g")  {

    // if (obj.parentNode.nodeName === "g" )  obj = obj.parentNode;

    var paths = obj.querySelectorAll("path");

    var len = paths.length;
// console.log("len = " + len);
    for (var i = 0; i < len; i++)  {

      // paths[i].setAttribute('fill', newColor);

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
    newFillColor(cc,color);
  }
  else fillSAMmap();
}

function selectedCountryStrokeColor(selectedCountry, color)  {

  var svg = currentMap.querySelector("#SAMsvg");
  var svgDoc = svg.contentDocument;

  var cc = svgDoc.getElementById(selectedCountry);

  if (cc) {
    newStrokeColor(cc,color);
    svg.appendChild(cc);
  }

// d3.selection.prototype.moveToFront = function() { return this.each(function() { this.parentNode.appendChild(this); }); };
  // this.parentNode.appendChild(this);
}

function newStrokeColor(obj, newColor) {

  if (obj.nodeName === "path") {
    // obj.setAttribute('fill', newColor);
    obj.style.stroke = newColor;
  }

  else if (obj.parentNode.nodeName === "g")  {

    // if (obj.parentNode.nodeName === "g" )  obj = obj.parentNode;

    var paths = obj.querySelectorAll("path");

    len = paths.length;
// console.log("len = " + len);
    for (var i = 0; i < len; i++)  {

      // paths[i].setAttribute('fill', newColor);
      paths[i].style.stroke = newColor;

    }
  }
}

function highlightSAMmap(index, current) {

  var svg;

  if (current === "currentMap") {
    svg = currentMap.querySelector("#SAMsvg");
  }
  else {
    svg = document.getElementById(current);
  }
  var svgDoc = svg.contentDocument;;
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
        break

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