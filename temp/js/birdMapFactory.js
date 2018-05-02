"use strict";

var deleteMapButton;
var saveMapButton;
var mapsCollection;
var deleteAllMapsButton;

var currentID = 0;

/* global  highlightSAMmap map lastIndex  */

document.addEventListener("DOMContentLoaded", function () {
  saveMapButton = document.querySelector(".saveMapButton");
  saveMapButton.addEventListener("click", saveCurrentMap);
  mapsCollection = document.getElementById("mapsCollection");

  deleteAllMapsButton = document.getElementById("deleteAllMapsButton");

  deleteAllMapsButton.addEventListener("click", deleteAllMaps);

  deleteAllMapsButton.addEventListener("mouseenter", function () {

    var mouseenterEvent = new Event('mouseenter');
    var numMaps = mapsCollection.children.length - 1;

    for (var index = 0; index < numMaps; index++) {
      mapsCollection.children[numMaps - index].children[1].dispatchEvent(mouseenterEvent);
    }
  }, false);

  deleteAllMapsButton.addEventListener("mouseleave", function () {

    var mouseleaveEvent = new Event('mouseleave');
    var numMaps = mapsCollection.children.length - 1;

    for (var index = 0; index < numMaps; index++) {
      mapsCollection.children[numMaps - index].children[1].dispatchEvent(mouseleaveEvent);
    }
  }, false);

});

function revealMapsCollection() {

  mapsCollection.classList.toggle("open");
  map.classList.toggle("shiftUp");
}

function deleteMap(evt)  {

  evt.stopPropagation();

  var birdInstance = this.parentNode;

  //  FIXME  :  (rmemove any listeners first)

  birdInstance.parentNode.removeChild(this.parentNode);

  // birdInstance.addEventListener("transitionend", birdInstance.parentNode.removeChild(this.parentNode), false);
  // birdInstance.classList.add("removed");

  map.querySelector(".saveMapButton").style.display = "block";

  // var len = mapsCollection.children.length;
  var len = mapsCollection.getElementsByClassName("thinify smallBird").length;

  if (len === 0)  {

    mapsCollection.classList.remove("namesOnlySeen");
    mapsCollection.removeEventListener("click", revealMapsCollection);
    // mapsCollection.removeEventListener("mouseenter", revealMapsCollection);
    deleteAllMapsButton.removeEventListener("click", deleteAllMaps);

    mapsCollection.classList.remove("open");
    map.classList.remove("shiftUp");
  }
}

function saveCurrentMap()  {

  // var len = mapsCollection.children.length;

  var len = mapsCollection.getElementsByClassName("thinify smallBird").length;
  if (len === 5)  return;

  // clone node, remove ids so not duplicate
  // reattach eventListeners

  var thisInstance = map.children[0];

  var dupNode = thisInstance.cloneNode(true);
  dupNode.classList.remove("birdMapInstance");
  dupNode.classList.add("thinify");
  dupNode.classList.add("smallBird");

  dupNode.querySelector(".birdName").classList.add("smallBirdText");
  dupNode.querySelector(".colorKey").style.opacity = "0";
  dupNode.querySelector(".colorKey").style.display = "none";

  dupNode.querySelector(".birdName").removeAttribute("id");
  dupNode.querySelector(".drawing").removeAttribute("id");
  dupNode.querySelector(".drawing").classList.add("smallBirdDrawing");

  dupNode.querySelector(".drawing").firstElementChild.setAttribute("id", "thin" + currentID);

  dupNode.removeAttribute("id");

  if (len === 0) {
    mapsCollection.addEventListener("click", revealMapsCollection);
    mapsCollection.classList.add("namesOnlySeen");

    // deleteAllMapsButton = document.getElementById("deleteAllMapsButton");
    deleteAllMapsButton.addEventListener("click", deleteAllMaps);
  }
  else if (len === 4)  {
    map.querySelector(".saveMapButton").style.display = "none";
  }

  mapsCollection.appendChild(dupNode);
  
  deleteMapButton = dupNode.querySelector(".deleteMapButton");
  deleteMapButton.addEventListener("click", deleteMap);

  // var numMaps = mapsCollection.children.length - 1;

  deleteMapButton.addEventListener("mouseenter", function () {
    this.classList.add("hover");
  });

  deleteMapButton.addEventListener("mouseleave", function () {
    this.classList.remove("hover");
  });


  document.getElementById("thin" + currentID).onload = function () {
    // prepareSVGstyles("thin" + currentID);

    highlightSAMmap(lastIndex, "thin" + currentID);
    dupNode.querySelector(".birdName.smallBirdText").classList.add("highlightName");

    mapsCollection.lastChild.style.opacity = "1";
    currentID++;
  };
}

function deleteAllMaps(evt) {

  evt.stopPropagation();

  var maps = mapsCollection.getElementsByClassName("thinify smallBird");
  var len = maps.length;

  for (var i = 1; i <= len; i++) {
    mapsCollection.removeChild(mapsCollection.childNodes[3]);
  }

  mapsCollection.classList.remove("namesOnlySeen");
  mapsCollection.removeEventListener("click", revealMapsCollection);
  deleteAllMapsButton.removeEventListener("click", deleteAllMaps);

  mapsCollection.classList.remove("open");
  map.classList.remove("shiftUp");
  map.querySelector(".saveMapButton").style.display = "block";
}