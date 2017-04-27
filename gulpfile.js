var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

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

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "home.html"
    },
    ghostMode: false
  });
  done();
}


function serveTest(done) {
  browserSync.init({
    server: {
      baseDir: "test",
      index: "home.html"
    },
    ghostMode: false
  });
  done();
}

var paths = {
  html: {
    src: "home.html",
    test: "./test",
    final: "."
  },
  sass: {
    src: "./scss/**/*.scss",
    stylesFile: "./scss/styles.scss",
    dest: "./dist/css"
  },
  css: {
    src: "./dist/css/styles.css",
    test: "./test",
    final: "./css"
  },
  js: {
    src: "./js/**/*.js",
    dest: "./test/js",
    test: "./test",
    final: "./js"
  }
};

function watch() {
  gulp.watch(paths.js.src, gulp.series(reloadJS));
  gulp.watch(paths.sass.src, gulp.series(sass2css));
  gulp.watch("./*.html").on("change", reload);
}

function sass2css() {
  return gulp.src(paths.sass.stylesFile)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(reload({ stream:true }));
}

function reloadJS() {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("../sourcemaps", {includeContent:false,sourceRoot:"/js"}))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(reload({ stream:true }));
}

const scriptOrder = [
  "./js/main.js",
  "./js/SouthAmerica.js",
  "./js/taxonomy.js",
  "./js/birdMapFactory.js"
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
    .pipe(gulp.dest(paths.js.test));
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

      // modifyHTMLlinks: remove browserSync script link
      // update css/js links to .min.css or .min.js
    .pipe(modifyHTMLlinks())

    .pipe(stripComments.html(stripOptions))

      // add ?v=dateTime stamp to css and js links
    .pipe(addVersionString(versionConfig))
    .pipe(gulp.dest(paths.html.test));
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
    .pipe(gulp.dest(paths.css.test));
}

gulp.task("sync", gulp.series(sass2css, reloadJS, serve, watch));

gulp.task("serve:watch", gulp.series(serve, watch));
gulp.task("serve:deploy", gulp.series(serveTest));

gulp.task("production", gulp.series(processJS));

gulp.task("deploy:final", gulp.series(processHTML, processCSS, processJS));