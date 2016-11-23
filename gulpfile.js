
// gulp.task("default", ["scss"], function () {
//   gulp.watch("*.scss", ["scss"]);
// });

var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

var sass = require("gulp-sass");
// var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
// var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var sourcemaps = require("gulp-sourcemaps");
// var cached = require("gulp-cached");
// var remember = require("gulp-remember");
// var stripdebug = require("gulp-strip-debug");


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

// function reload(done) {
//   browserSync.reload();
//   done();
// }

// function stream(done) {
//   browserSync.stream();
//   done();
// }

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
  gulp.watch(paths.scripts.src, gulp.series(reloadJS));
  gulp.watch(paths.styles.src, gulp.series(sass2css));
  gulp.watch("./*.html").on("change", reload);
}

gulp.task("sync", gulp.series(sass2css, reloadJS, serve, watch));
// var dev = gulp.series(sass2css, reloadJS, serve, watch);

gulp.task("serve:watch", gulp.series(serve, watch));

// gulp.task("build", gulp.series(sass2css, processJS, editHTML));
// editHTML : strip browserSync, make dist/js links

function sass2css() {
  return gulp.src(paths.styles.src)
    // .pipe(cached("removing scss cached"))
    // .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    // .pipe(sourcemaps.write("../sourcemaps"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(reload({ stream:true }));
}

function reloadJS() {
  return gulp.src(paths.scripts.src)
    // .pipe(sourcemaps.init())
    // .pipe(concat("concat.js"))
    // .pipe(gulp.dest("./concats/"))
    // .pipe(rename({ suffix: ".min" }))
    // .pipe(uglify())
    // .pipe(sourcemaps.write("../sourcemaps"))
    // .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({ stream:true }));
}

function processJS() {
  return gulp.src(paths.scripts.src)
    // .pipe(concat("concat.js"))
    // .pipe(gulp.dest("./concats/"))
    // .pipe(rename({ suffix: ".min" }))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({ stream:true }));
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