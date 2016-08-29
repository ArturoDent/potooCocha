"use strict";

var deleteMapButton;
var saveMapButton;

var currentID = 0;

var currentMap;
var mapsCollection;

/* global  prepareSVGstyles highlightSAMmap  map lastIndex searchResults */

function initMapFactory()  {

  currentMap  =  document.querySelector("#currentMap");
  mapsCollection = document.querySelector("#mapsCollection");

  saveMapButton = document.querySelector(".saveMapButton");
  saveMapButton.addEventListener("click", saveCurrentMap);
}

function deleteMap()  {

  var birdInstance = this.parentNode;

  birdInstance.addEventListener("transitionend", birdInstance.parentNode.removeChild(this.parentNode), false);

  birdInstance.classList.add("removed");

  // var collection = birdInstance.parentNode;

  currentMap.querySelector(".saveMapButton").style.display = "block";

  var len = mapsCollection.children.length;
  if (len === 0)  {

    mapsCollection.style.height = "0";
    mapsCollection.style.margin = "0";
    map.style.top = searchResults.offsetTop + searchResults.offsetParent.offsetTop - 20 + "px";
  }
}

function saveCurrentMap()  {

  var len = mapsCollection.children.length;

  if (len === 5)  return;

	// clone node, remove ids so not duplicate
	// reattach eventListeners

  var thisInstance = currentMap.children[0];

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

  if (len === 0)  {
    mapsCollection.style.height = "260px";
    mapsCollection.style.margin = "40px 0 30px 0";
  }
  else if (len >= 4)  {
    currentMap.querySelector(".saveMapButton").style.display = "none";
  }

  mapsCollection.appendChild(dupNode);

  deleteMapButton = dupNode.querySelector(".deleteMapButton");
  deleteMapButton.addEventListener("click", deleteMap);

  document.getElementById("thin" + currentID).onload = function () {
    prepareSVGstyles("thin" + currentID);
    highlightSAMmap(lastIndex, "thin" + currentID);
    mapsCollection.lastChild.style.opacity = "1";
    currentID++;
  };
}