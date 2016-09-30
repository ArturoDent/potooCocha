
// gulp.task("default", ["scss"], function () {
//   gulp.watch("*.scss", ["scss"]);
// });

var gulp = require("gulp");
var changedInPlace = require("gulp-changed-in-place");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
// var sourcemaps = require("gulp-sourcemaps");
// var runSequence = require("run-sequence");


// Static Server + watching scss/html files
gulp.task("browsersync", ["sass"], function() {

  browserSync.init({
    server: {
      baseDir: "./",
      index: "home.html"
    },
    ghostMode: false
  });

// browserSync : Here you can disable/enable each feature individually
// ghostMode: {
//     clicks: true,
//     forms: true,
//     scroll: false
// }

// Or switch them all off in one go
// ghostMode: false

// browser: ["google chrome", "firefox"]


  gulp.watch("./scss/*.scss", ["sass"]);
  gulp.watch("./*.html").on("change", browserSync.reload);
  // gulp.watch("./css/*.css").on("change", browserSync.reload);
  gulp.watch("./js/*.js").on("change", browserSync.reload);
});

gulp.task("sass", function() {
  return gulp.src("./scss/*.scss")
    .pipe(changedInPlace())
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});

// gulp.task("js", function () {
//   gulp.src("./js/*.js")
//    .pipe(uglify())
//    .pipe(concat("all.js"))
//    .pipe(gulp.dest("./js"));
// });

gulp.task("process js", function() {
  return gulp.src("./js/*.js")
    .pipe(concat("concat.js"))
    .pipe(gulp.dest("./concats/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("./minified/"));
});

gulp.task("minify-css", function() {
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



// gulp.task("default", ["serve"]);