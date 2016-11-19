"use strict";

var deleteMapButton;
var saveMapButton;
var mapsCollection;

var currentID = 0;

/* global  prepareSVGstyles highlightSAMmap map lastIndex  */

document.addEventListener("DOMContentLoaded", function () {
  saveMapButton = document.querySelector(".saveMapButton");
  saveMapButton.addEventListener("click", saveCurrentMap);
  mapsCollection = document.querySelector("#mapsCollection");
});

function deleteMap()  {

  var birdInstance = this.parentNode;

  birdInstance.addEventListener("transitionend", birdInstance.parentNode.removeChild(this.parentNode), false);

  birdInstance.classList.add("removed");

  map.querySelector(".saveMapButton").style.display = "block";

  var len = mapsCollection.children.length;
  if (len === 0)  {

    mapsCollection.style.height = "0";
    mapsCollection.style.margin = "0";
  }
}

function saveCurrentMap()  {

  var len = mapsCollection.children.length;

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

  if (len === 0)  {
    mapsCollection.style.height = "350px";
    mapsCollection.style.margin = "30px 0 -35px 0";
    // mapsCollection.style.left = -10vw;
  }
  else if (len >= 4)  {
    map.querySelector(".saveMapButton").style.display = "none";
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
// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

// # sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=maps/birdMapFactory.js.map

//# sourceMappingURL=../../sourcemaps/dest-Quintessence/birdMapFactory.js.map
