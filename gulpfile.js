var gulp = require("gulp");
var browserSync = require("browser-sync").create("index.html");
// var browserSync2 = require("browser-sync").create("citations.html");

var reload = browserSync.reload;
// var reload2 = browserSync2.reload;

var newer = require('gulp-newer');
var sass = require("gulp-sass");
// minify js files

var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var sourcemaps = require("gulp-sourcemaps");
// var cached = require("gulp-cached");
// var remember = require("gulp-remember");
var stripComments = require("gulp-strip-comments");
var stripdebug = require("gulp-strip-debug");
var modifyHTMLlinks = require("gulp-processhtml");
var addVersionString = require("gulp-version-number");
var print = require('gulp-print').default;

// var imageMin = require("gulp-imagemin");

// var gutil = require("gulp-util");
// var notify = require("gulp-notify");

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
  done();
}

// function serve2(done) {
//   browserSync2.init({
//     port: 3003,
//     ui: {
//       port: 3004
//     },
//     server: {
//       baseDir: "./",
//       index: "citations.html",
//     },
//     // open: false,
//     ghostMode: false
//   });
//   done();
// }

function serveTest(done) {
  browserSync.init({
    server: {
      baseDir: "deploy",
      index: "home.html"
    },
    ghostMode: false
  });
  done();
}

var paths = {
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
    src: "data/occurrences.txt",
    deploy: "./deploy/data"
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
    src: "./temp/css/styles.css",
    temp: "./temp/css",
    deploy: "./deploy/css"
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
  gulp.watch(paths.js.src, gulp.series(moveJStoTemp, reloadJS));
  // gulp.watch(paths.sass.src, gulp.series(sass2css));
  gulp.watch(paths.sass.src, sass2css);
  gulp.watch("./*.html").on("change", reload);
  // gulp.watch("./*.html").on("change", reload2);
}

function sass2css() {
  return gulp.src(paths.sass.stylesFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.css.temp))
    .pipe(reload({ stream:true }));
}

function reloadJS() {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("sourcemaps"))
    // .pipe(gulp.dest("."))
    .pipe(reload({ stream:true }));
}

function moveJStoTemp() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.temp));
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
    .pipe(uglify())
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
};

function processHTML()  {
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

function processCSS()  {
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

function copySVG() {
  return gulp.src(paths.svg.src)
    .pipe(newer(paths.svg.deploy))
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
  occurrences: '../BuildSACC/data/occurrences.txt',
  countries: '../BuildSACC/Countries/*.*'
  // '../BuildSACC/workFlow.txt'
};

function copyBuildSACCdata() {
  return gulp.src(buildGlobs.occurrences)
    .pipe(newer("./data"))
    .pipe(print())
    .pipe(gulp.dest("./data"));
}

// show files transported
function copyBuildSACCcountries() {
  return gulp.src(buildGlobs.countries)
    .pipe(newer("./Countries"))
    .pipe(print())
    .pipe(gulp.dest("./Countries"));
}

const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
// const notify = require('gulp-notify');

/* list all files you wish to ftp in the glob variable */
const ftpGlobs = [
  'deploy/css/*.css',
  'deploy/js/*.js',
  'deploy/svg/SouthAmerica.svg',
  // 'deploy/flags/*.png',
  'deploy/home.html',
  'deploy/citations.html',
  'deploy/Authors/*.txt',
  'deploy/data/occurrences.txt',
  'deploy/Countries/*.*',
  '!ftpConfig.js'
];

const gulpftp = require('./ftpConfig.js');

function deployExperimental  () {

  console.log(gulpftp);

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

    .pipe(conn.newer('./experimental.net')) // only upload newer files
    .pipe(conn.dest('./experimental.net'));
  // .pipe(notify("experimental.net updated"));
}

function deployPotoococha () {

  console.log(gulpftp);

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

    .pipe(conn.newer('.')) // only upload newer files
    .pipe(conn.dest('.'));
// .pipe(notify("potoococha updated"));
}

gulp.task("sync", gulp.series(sass2css, moveJStoTemp, reloadJS, serve, watch));

gulp.task("serve", gulp.series(serve));
gulp.task("watch", gulp.series(watch));

// gulp.task("sync", gulp.series(sass2css, reloadJS, serve));
// gulp.task("reloadJS", gulp.series(moveJStoTemp));

gulp.task("serve:watch", gulp.series(serve, watch));
gulp.task("serve:deploy", gulp.series(serveTest));

gulp.task("production", gulp.series(moveJStoTemp, processJS));

gulp.task("build", gulp.series(processHTML, processCSS, moveJStoTemp, processJS,
  copySVG, copyFLAGS, copyCitations, copyAuthors, copyOccurrences, copyCountries));

gulp.task("getBuild", gulp.series(copyBuildSACCdata, copyBuildSACCcountries));

// gulp.task("default", gulp.series(deployExperimental));

gulp.task('deploy:E', gulp.series(deployExperimental));
gulp.task('deploy:P', gulp.series(deployPotoococha));