// "use strict";

//  Caller :  ("#searchInput").on ("input", getQuery);    keyup removed
// function modifyQuery(term) {
// eslint-disable-next-line no-unused-vars
function modifyQuery(term) {
  
  var searcFormContents = document.querySelector(".searchForm_contents");
  // keep a minimum of 20 ch's width in input field and add 1 ch width for every query.length > 8

  term = term.trimStart();
  // if (term.length === 0) searchInput.value = "";
  if (term.length < 2) return;

  if (term.length > 6) {
    searcFormContents.style.left = "-" + (term.length - 6)/5 + "ch";
    searchInput.size = 20 + (term.length - 6);
  }
  
  // term = term.replace(/^\s+|\s+$/g, ""); // strip trailing and leading whitespaces
  // TODO: term = term.trim();

  //  wildcards * and ? ::
  // term = term.replace(/\\\*/g, "[a-zA-Z'ñã\\s-]+");
  // term = term.replace(/\\\?/g, "[a-zA-Z'ñã\\s-]");

  // SACC only uses Marañon, Nariño, Española and São, no other accented characters
  // don't have to do both, but how?
  term = term.replace(/n/g, "(n|ñ)");
  term = term.replace(/a/g, "(a|ã)");

  var regex = RegExp("[úáóíç]", "i");
  var unusedAccent = regex.test(term);
  
  if (unusedAccent) {
    term = term.replace(/ú/g, "u");
    term = term.replace(/á/g, "a");
    term = term.replace(/ó/g, "o");
    term = term.replace(/í/g, "i");
    term = term.replace(/ç/g, "c");
  }

  // now database can have any number of spaces between genus and species
  //  : fuzzy or not?
  // term = term.replace(/\s+/g, "\\s+"); // inserts a literal "\s+" but screws up fuzzy searching
  
  //  : use next 2 lines to enable fuzzy searching
  //   but gets very weird with the accented characters
    // query = query.replace(/(\S|\s)/g, "$1.*?");   // add '.*?' behind every character, even spaces
  // term = term.replace(/(\S|\s)/g, "$1[a-z' -]*?");   // add '.*?' behind every character, even spaces
  
    // query = query.replace(/(\S|\s)/g, "$1.{2}?");   // to limit the possible characters between inputs, sorta weird
  
  // term = term.replace(/(-| )/g, "(-| )");   // replace a space or hyphen with (space | hyphen)
  term = term.replace(/[ -]/g, "(-| )");   // replace a space or hyphen with (space | hyphen)
  // term = term.replace(/^\s+|\s+$/g, ""); // strip trailing and leading whitespaces
  // term = term.trimEnd();
  
  lastQuery = term;
  return term;
}

//  ---------------------------------------------------------------------------------------------------------  //

// eslint-disable-next-line no-unused-vars
function escapeRegExp(string) {
  return string.replace(/[.*+?^@#!+=_${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
