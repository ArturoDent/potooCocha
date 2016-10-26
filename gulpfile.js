
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
    src: "./scss/**/*.scss",
    dest: "./dist/css"
  },
  scripts: {
    src: "./js/**/*.js",
    dest: "./dist/js"
  }
};

function watch() {
  gulp.watch(paths.scripts.src, gulp.series(processJS, reload));
  gulp.watch(paths.styles.src, gulp.series(sass2css, reload));
  gulp.watch("./*.html").on("change", browserSync.reload);
}

var build = gulp.series(sass2css, processJS, serve, watch);

gulp.task("sync", build);

function sass2css() {
  return gulp.src(paths.styles.src)
    // .pipe(cached("removing scss cached"))
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("../sourcemaps"))
    .pipe(gulp.dest(paths.styles.dest));
}

function processJS() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    // .pipe(concat("concat.js"))
    // .pipe(gulp.dest("./concats/"))
    // .pipe(rename({ suffix: ".min" }))
    // .pipe(uglify())
    // .pipe(sourcemaps.write("./sourceMaps"))
    .pipe(sourcemaps.write("../sourcemaps"))
    .pipe(gulp.dest(paths.scripts.dest));
}

gulp.task("minify-css", function () {
  return gulp.src(paths.styles.dest)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("./sourceMaps"))
    .pipe(gulp.dest(paths.styles.dest + "/minified"));
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