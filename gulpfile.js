
// gulp.task("default", ["scss"], function () {
//   gulp.watch("*.scss", ["scss"]);
// });

var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
// var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
// var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var sourcemaps = require("gulp-sourcemaps");
var cached = require("gulp-cached");
// var remember = require("gulp-remember");


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

function reload(done) {
  browserSync.reload();
  done();
}

var paths = {
  styles: {
    src: "./scss/*.scss",
    dest: "./css"
  },
  scripts: {
    src: "./js/*.js",
    dest: "./js"
  }
};

function watch() {
  gulp.watch(paths.scripts.src, gulp.series(processJS, reload));
  gulp.watch(paths.styles.src, gulp.series(sass2css, reload));
  gulp.watch("./*.html").on("change", browserSync.reload);
}

var build = gulp.series(serve, watch);

gulp.task("sync", build);

function sass2css() {
  return gulp.src("./scss/*.scss")
    .pipe(cached("removing scss cached"))
    // .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    // .pipe(sourcemaps.write("./css/sourceMaps"))
    .pipe(gulp.dest("./css"));
}

function processJS() {
  return gulp.src("./js/*.js")
    .pipe(sourcemaps.init())
    // .pipe(concat("concat.js"))
    // .pipe(gulp.dest("./concats/"))
    // .pipe(rename({ suffix: ".min" }))
    // .pipe(uglify())
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./js/dest/"));
}

gulp.task("minify-css", function () {
  return gulp.src("./src/*.css")
    // .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest("minified"));
});

gulp.task("autoprefix", function () {
  return gulp.src("./css/*.css")
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(gulp.dest("prefixed"));
});

gulp.task("process css", function () {
  return gulp.src("./css/*.css")
    // .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(concat("concat.css"))
    // .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("concats"));
});



// gulp.task("default", gulp.series("browsersync", function () { }));