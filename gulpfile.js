const gulp = require("gulp");
const browserSync = require("browser-sync").create("index.html");
const reload = browserSync.reload;

const newer = require('gulp-newer');
const sass = require("gulp-sass");

const concat = require("gulp-concat");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

const stripComments = require("gulp-strip-comments");
const stripdebug = require("gulp-strip-debug");
const modifyHTMLlinks = require("gulp-processhtml");  // or try gulp-useref
const addVersionString = require("gulp-version-number");
const print = require('gulp-print').default;


function serve (done) {        // serve:    ./home.html 
  browserSync.init({
    port: 3000,
    server: {
      baseDir: "./",
      index: "home.html",
    },
    ghostMode: false
  });
  done();
}

function serveDeploy (done) {      // serve:    deploy/home.html 
  browserSync.init({
    server: {
      baseDir: "deploy",
      index: "home.html"
    },
    ghostMode: false
  });
  done();
};

const paths = {
  html: {
    src: "home.html",
    temp: "./temp",
    deploy: "./deploy"
  },
  citations: {
    src: "citations.html"
  },
  authors: {
    src: "Authors/*.txt",
    deploy: "./deploy/Authors"
  },
  occurrences: {
    src: "occurrences/occurrences.txt",
    deploy: "./deploy/occurrences"
  },
  countries: {
    src: "Countries/*.*",
    deploy: "./deploy/Countries"
  },
  sass: {
    src: "./src/styles/scss/**/*.scss",
    stylesFile: "./src/styles/scss/styles.scss"
  },
  css: {
    src: "./temp/css/*.css",
    temp: "./temp/css",
    deploy: "./deploy/css"
  },
  printCSS: {
    src: "./src/printCSS/printSearchResults.css",
    temp: "./temp/css",
    deploy: "./deploy/printCSS"
  },
  php: {
    src: "./src/php/**/*.php",
    // temp: "./temp/js",
    deploy: "./deploy/php"
  },
  js: {
    src: "./src/js/**/*.js",
    temp: "./temp/js",
    deploy: "./deploy/js"
  },
  svg: {
    src: "./svg/SouthAmerica.svg",
    deploy: "./deploy/svg"
  },
  flags: {
    src: "./flags/32/*.png",
    deploy: "./deploy/flags"
  }
};

function watch() {
  gulp.watch(paths.js.src, reloadJS);
  gulp.watch(paths.sass.src, sass2css);
  gulp.watch("./*.html", { events: 'all' }, function(cb) {
    reload();
    cb();
  });
}

function sass2css() {
  return gulp.src(paths.sass.stylesFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.css.temp))
    .pipe(reload({ stream: true }));
}

function reloadJS() {
  return gulp.src(paths.js.src)
    .pipe(newer(paths.js.src))    // does newer() do anything here?
    .pipe(reload({ stream: true }));
}

function moveJStoTemp() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.temp));
}

function movePrintCSStoTemp() {
  return gulp.src(paths.printCSS.src)
    .pipe(gulp.dest(paths.printCSS.temp));
}

const scriptOrder = [
  "./temp/js/simplebar.js",
  "./temp/js/main.js",
  "./temp/js/SouthAmerica.js",
  "./temp/js/numLists.js",
  "./temp/js/taxonomy.js",
  "./temp/js/birdMapFactory.js"
];

function processJS() {

  return gulp.src(scriptOrder)
    .pipe(stripdebug())
    .pipe(stripComments())
    .pipe(concat("app.js"))
    .pipe(rename({
      basename: "app",
      suffix: ".min",
      extname: ".js"
    }))
    // why no minify ?????
    // .pipe(uglifyES())
    .pipe(gulp.dest(paths.js.deploy));
}

const stripOptions = {
  trim: true,
  // <!--[if true] will not be removed with safe = true
  safe: true
  // ignore:///<!\[CDATA\[(\n*.*\n*){20}\s*//\]\]>/g
};

const versionConfig = {
  "value": "%DT%",
  "append": {
    "key": "v",
    "to": ["css", "js"],
  },
}

function processHTML() {
  return gulp.src(paths.html.src)
    .pipe(print())

    // modifyHTMLlinks: remove browserSync script link
    // update css/js links to .min.css or .min.js
    .pipe(modifyHTMLlinks())

    .pipe(stripComments.html(stripOptions))

    // add ?v=dateTime stamp to css and js links
    .pipe(addVersionString(versionConfig))
    
    .pipe(gulp.dest(paths.html.deploy));
}

function processCSS() {
  return gulp.src(paths.css.src)
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest(paths.css.deploy));
}

// Replace Autoprefixer browsers option to Browserslist config.
// Use browserslist key in package.json or .browserslistrc file.

// # last 2 versions: the last 2 versions for each browser.
// # defaults: Browserslist’s default browsers (> 0.5%, last 2 versions, Firefox ESR, not dead).

// Using browsers option cause some error. Browserslist config 
// can be used for Babel, Autoprefixer, postcss-normalize and other tools.

// If you really need to use option, rename it to overrideBrowserslist.

// Learn more at:
// https://github.com/browserslist/browserslist#readme
// https://twitter.com/browserslist

function processPrintCSS() {
  return gulp.src(paths.css.src)
    .pipe(gulp.dest(paths.printCSS.deploy));
}

function copyPHP() {
  return gulp.src(paths.php.src)
    .pipe(newer(paths.php.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.php.deploy));
}

function copySVG() {
  return gulp.src(paths.svg.src)
    .pipe(newer(paths.svg.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.svg.deploy));
}

function copyCitations() {
  return gulp.src(paths.citations.src)
    .pipe(newer(paths.html.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.html.deploy));
}

function copyAuthors() {
  return gulp.src(paths.authors.src)
    .pipe(newer(paths.authors.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.authors.deploy));
}

function copyOccurrences() {
  return gulp.src(paths.occurrences.src)
    .pipe(newer(paths.occurrences.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.occurrences.deploy));
}

function copyCountries() {
  return gulp.src(paths.countries.src)
    .pipe(newer(paths.countries.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.countries.deploy));
}

// function processImages() {
//   return gulp.src(paths.flags.src)
//     .pipe(imageMin())
//     .pipe(gulp.dest(paths.flags.deploy));
// }

function copyFLAGS() {
  return gulp.src(paths.flags.src)
    .pipe(newer(paths.flags.deploy))
    .pipe(gulp.dest(paths.flags.deploy));
}

// ************************   get the SACC data from the BuildSACC directory   **********************  //

// to get Countries and occurrences.txt from BuildSACC directory
const buildGlobs = {
  occurrences: '../BuildSACC/occurrences/occurrences.txt',
  countries: '../BuildSACC/Countries/*.*',
  // numLists: '../BuildSACC/numLists/numLists.js'
};

function getBuildSACC_Data() {
  return gulp.src(buildGlobs.occurrences)
    .pipe(newer("./occurrences"))
    .pipe(print())
    .pipe(gulp.dest("./occurrences"));
}

function getBuildSACC_Countries() {
  return gulp.src(buildGlobs.countries)
    .pipe(newer("./Countries"))
    .pipe(print())
    .pipe(gulp.dest("./Countries"));
}

// function getBuildSACC_NumLists() {
//   return gulp.src(buildGlobs.numLists)
//     .pipe(newer("./js/numLists.js"))
//     .pipe(print())
//     .pipe(gulp.dest("./js"));
// }

// ************************   ftp to experimental.potoococha.net and potoococha.net    **********************  //

const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

// TODO : (logFileRequests.txt?)
/* list all files you wish to ftp in the glob variable */
const ftpGlobs = [
  'deploy/css/*.css',
  // 'deploy/printCSS/printSearchResults',
  'deploy/js/*.js',
  'deploy/php/*.php',
  'deploy/svg/SouthAmerica.svg',
  // 'deploy/flags/*.png',
  'deploy/home.html',
  'deploy/citations.html',
  'deploy/Authors/*.txt',
  'deploy/occurrences/occurrences.txt',
  'deploy/Countries/*.*',
  '!ftpConfig.js'
];

const gulpftp = require('./ftpConfig.js');

function deployExperimental() {

    const conn = ftp.create({
      host: gulpftp.config.host,
      user: gulpftp.config.user,
      password: gulpftp.config.pass,
      parallel: 3,
      log: gutil.log
    });

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
    return gulp.src(ftpGlobs, { base: './deploy', buffer: false })
      .pipe(conn.newer('./experimental.net'))
      .pipe(conn.dest('./experimental.net'));
    }

function deployPotoococha() {

  const conn = ftp.create({
    host: gulpftp.config.host,
    user: gulpftp.config.user,
    password: gulpftp.config.pass,
    parallel: 3,
    log: gutil.log
  });

  return gulp.src(ftpGlobs, { base: './deploy', buffer: false })
    .pipe(conn.newer('.'))
    .pipe(conn.dest('.'));
}

//  ****************************   compose and export tasks  *****************************  //

exports.sync = gulp.series(sass2css, reloadJS, serve, watch);
// exports.default = exports.sync;   this works

exports.serve = gulp.series(serve);
exports.scss = gulp.series(sass2css);

exports.watch = gulp.series(watch);

exports.production = gulp.series(moveJStoTemp, processJS);

// TODO : (include php and logFileRequests.txt)
exports.build = gulp.series(processHTML, processCSS, moveJStoTemp, processJS,
                            copyPHP, copySVG, copyFLAGS, copyCitations, copyAuthors,
                            copyOccurrences, copyCountries, movePrintCSStoTemp);

exports.getSACC = gulp.series(getBuildSACC_Data, getBuildSACC_Countries);
// exports.getSACC = gulp.series(getBuildSACC_Data, getBuildSACC_Countries, getBuildSACC_NumLists);    

exports.deploy_E = gulp.series(deployExperimental);
exports.deploy_P = gulp.series(deployPotoococha);



// *************************** not used ************************************ //

// const pump = require('pump');
// const uglifyES = require("uglify-es");  // check package name
// const minify = require("gulp-minfy");
// const cached = require("gulp-cached");
// const remember = require("gulp-remember");
// const imageMin = require("gulp-imagemin");
// const gutil = require("gulp-util");
// const debug  = require("gulp-debug");  // to see which files are in the stream
// const notify = require("gulp-notify");

// *****************************  env vars  *****************************

// if (process.env.NODE_ENV === 'production') {
//   exports.build = series(transpile, minify);
// } else {
//   exports.build = series(transpile, livereload);
// }