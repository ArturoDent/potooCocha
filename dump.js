`  <!-- build:remove -->
  <script src="src/js/familyMap.js"></script>

  <script src="src/js/numList.js"></script>
  <script src="src/js/taxonomy.js"></script>
  <script src="src/js/search/search_entry.js"></script>
  <script src="src/js/search/search_handleQuery.js"></script>
  <script src="src/js/search/search_functions.js"></script>
  <script src="src/js/search/search_handleResults.js"></script>
  <script src="src/js/birdMapFactory.js"></script>
  <!-- /build -->"`;


let divId = "searchResults";

var content = '<ul class="print-results">' + document.getElementById( divId ).innerHTML + "</ul>";

var html = '<html><head><title></title><head>';

var css = "<style>";
css += ".print-results { list-style-type: none; margin: 0; padding: 0 0 0 40px; }";
css += "h3 { margin: 0 0 3ch 0; text-align: center; padding-left: 0; }";
css += ".family, .familyOpen { margin: 2ch 0 0.5ch 10%; list-style-type: disc; }";
css += ".birds, .bird { list-style-type: none; margin-left: 10%; padding-left: 0; }";
css += ".fsc { position: absolute; left: 60%; }";
css += ".bird>span { padding-left: 10px;}";
css += ".bird span:last-child { position: absolute; left: 60%; }";
css += "</style>";
html += css;

html += '</head><body>';


  // < !--build:js js / app.min.js-- >
  // <script type="module" src="src/js/main.js"></script>
  // <!-- /build -->;
  
  
  // for .htaccess
//   <FilesMatch "\.(js|css)$">
//     Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
// </FilesMatch>