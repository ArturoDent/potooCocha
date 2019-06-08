const gulp = require("gulp");
// const pump = require('pump');

const browserSync = require("browser-sync").create("index.html");
// const browserSync2 = require("browser-sync").create("citations.html");
const reload = browserSync.reload;

const newer = require('gulp-newer');
const sass = require("gulp-sass");

// const uglify = require("gulp-uglify");
// const minify = require("gulp-minfy");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
// const sourcemaps = require("gulp-sourcemaps");
// const cached = require("gulp-cached");
// const remember = require("gulp-remember");
const stripComments = require("gulp-strip-comments");
const stripdebug = require("gulp-strip-debug");
const modifyHTMLlinks = require("gulp-processhtml");
const addVersionString = require("gulp-version-number");
const print = require('gulp-print').default;

// const imageMin = require("gulp-imagemin");
// const gutil = require("gulp-util");
// const notify = require("gulp-notify");

function serve(done) {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: "./",
      index: "home.html",
    },
    // open: false,
    ghostMode: false
  });
  // browserSync2.init({
  //   port: 3003,
  //   ui: {
  //     port: 3004
  //   },
  //   server: {
  //     baseDir: "./",
  //     index: "citations.html",
  //   },
  //   // open: false,
  //   ghostMode: false
  // });
  // gulp.watch(paths.js.src, gulp.series(reloadJS));
  // gulp.watch(paths.sass.src, gulp.series(sass2css));
  // // gulp.watch("./*.html").on("change", reload);
  // gulp.watch("./*.html").on("change", stream);

  done();
}

function serveTest(done) {
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
    // src: "data/occurrences.txt",
    src: "occurrences/occurrences.txt",
    // deploy: "./deploy/data"
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


//  FIXME : use gulp.series here)(
function watch() {
  gulp.watch(paths.js.src, reloadJS);
  gulp.watch(paths.sass.src, sass2css);
  // gulp.watch("./*.html").on("change", reload);
  gulp.watch("./*.html", { events: 'all' }, function(cb) {
    reload();
    cb();
  });
}

/**
* How VSCode indents it
*/

/**
 * How I want it
 */

function sass2css() {
  return gulp.src(paths.sass.stylesFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.css.temp))
    .pipe(reload({ stream: true }));
}

function reloadJS() {
  return gulp.src(paths.js.src)
    .pipe(newer(paths.js.src))
    // .pipe(sourcemaps.init())
    // .pipe(sourcemaps.write("sourcemaps"))
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
    // .pipe(uglify())
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
    // .pipe(concat("concat.css"))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest(paths.css.deploy));
}

function processPrintCSS() {
  return gulp.src(paths.css.src)
    .pipe(gulp.dest(paths.printCSS.deploy));
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

// to get Countries and occurrences.txt from BuildSACC folder
const buildGlobs = {
  // occurrences: '../BuildSACC/data/occurrences.txt',
  occurrences: '../BuildSACC/occurrences/occurrences.txt',
  countries: '../BuildSACC/Countries/*.*'
  // '../BuildSACC/workFlow.txt'
};

function getBuildSACCdata() {
  return gulp.src(buildGlobs.occurrences)
    // .pipe(newer("./data"))
    .pipe(newer("./occurrences"))
    .pipe(print())
    // .pipe(gulp.dest("./data"));
    .pipe(gulp.dest("./occurrences"));
}

// show files transported
function getBuildSACCcountries() {
  return gulp.src(buildGlobs.countries)
    .pipe(newer("./Countries"))
    .pipe(print())
    .pipe(gulp.dest("./Countries"));
}

const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
// const notify = require('gulp-notify');

// TODO : (php folder and logFileRequests.txt?)
/* list all files you wish to ftp in the glob variable */
const ftpGlobs = [
  'deploy/css/*.css',
  // 'deploy/printCSS/printSearchResults',
  'deploy/js/*.js',
  'deploy/svg/SouthAmerica.svg',
  // 'deploy/flags/*.png',
  'deploy/home.html',
  'deploy/citations.html',
  'deploy/Authors/*.txt',
  // 'deploy/data/occurrences.txt',
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
  // console.log(gulpftp);

  const conn = ftp.create({
    host: gulpftp.config.host,
    user: gulpftp.config.user,
    password: gulpftp.config.pass,
    parallel: 3,
    log: gutil.log
  });

  return gulp.src(ftpGlobs, { base: './deploy', buffer: false })
    .pipe(conn.newer('.')) // only upload newer files
    .pipe(conn.dest('.'));
}

exports.sync = gulp.series(sass2css, reloadJS, serve, watch);
// exports.default = exports.sync;   this works

exports.serve = gulp.series(serve);
exports.scss = gulp.series(sass2css);

exports.watch = gulp.series(watch);

exports.production = gulp.series(moveJStoTemp, processJS);

// TODO : (include php and logFileRequests.txt)
exports.build = gulp.series(processHTML, processCSS, moveJStoTemp, processJS,
                            copySVG, copyFLAGS, copyCitations, copyAuthors,
                            copyOccurrences, copyCountries, movePrintCSStoTemp);

exports.getSACC = gulp.series(getBuildSACCdata, getBuildSACCcountries);

exports.deploy_E = gulp.series(deployExperimental);
exports.deploy_P = gulp.series(deployPotoococha);

// **********************************  pump  *****************************

// gulp.task('compress', function (cb) {
  // pump([
      // gulp.src('lib/*.js'),
      // uglify(),
      // gulp.dest('dist')
    // ],
    // cb
  // );
// });

// does the following work? with the return??
// function compress () {
  // return pump([
      // gulp.src('lib/*.js'),
      // uglify(),
      // gulp.dest('dist')
    // ]
  // );
// });

// *****************************  env vars  *****************************

// if (process.env.NODE_ENV === 'production') {
  // exports.build = series(transpile, minify);
// } else {
  // exports.build = series(transpile, livereload);
// }

// ********************************  chokidar  ***************************

// npm install chokidar --save

// Initialize watcher.
// var watcher = chokidar.watch('file, dir, glob, or array', {
//   ignored: /(^|[\/\\])\../,
//   persistent: true
// });

// watcher.on('change', (path, stats) => {
//   if (stats) console.log(`File ${path} changed size to ${stats.size}`);
// });

// ************************** async/await  ********************************

// const fs = require('fs');

// async function asyncAwaitTask() {
//   const { version } = fs.readFileSync('package.json');
//   console.log(version);
//   await Promise.resolve('some result');
// }

// exports.default = asyncAwaitTask;
