var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

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

var imageMin = require("gulp-imagemin");

// var gutil = require("gulp-util");
// var ftp = require("vinyl-ftp");
// var notify = require("gulp-notify");

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./",
      // directory: true,
      index: "home.html"
    },
    ghostMode: false
  });
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
}

var paths = {
  html: {
    src: "home.html",
    temp: "./temp",
    deploy: "./deploy"
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
  gulp.watch(paths.sass.src, gulp.series(sass2css));
  gulp.watch("./*.html").on("change", reload);
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
    .pipe(gulp.dest("."))
    .pipe(reload({ stream:true }));
}

function moveJStoTemp() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.temp));
}

const scriptOrder = [
  "./temp/js/simplebar.js",
  "./temp/js/main.js",
  "./js/SouthAmerica.js",
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

function processImages() {
  return gulp.src(paths.flags.src)
  .pipe(imageMin())
  .pipe(gulp.dest(paths.flags.deploy));
}

function copyFLAGS() {
  return gulp.src(paths.flags.src)
    .pipe(newer(paths.flags.deploy))
    .pipe(gulp.dest(paths.flags.deploy));
}


// gulp.task("ftp:experimental", function() {
//   var conn = ftp.create( {
//     host:     "hostname.com",
//     user:     "user",
//     password: "password",
//     parallel: 3,
//     log:      gutil.log
//   } );

//   /* list all files you wish to ftp in the glob variable */
//   var globs = [
//     "**/*",
//     "*",
//     "!node_modules/**" // if you wish to exclude directories, start the item with an !
//   ];

//   return gulp.src( globs, { base: ".", buffer: false } )
//     .pipe( conn.newer( "server_directory/" ) ) // only upload newer files
//     .pipe( conn.dest( "server_directory/" ) )
//     .pipe(notify("Dev site updated!"));
// });

// gulp.task("default", function () {
//     gulp.watch(["*", "**/*"], ["ftp:experimental"]);
// });

gulp.task("sync", gulp.series(sass2css, moveJStoTemp, reloadJS, serve, watch));

// gulp.task("sync", gulp.series(sass2css, reloadJS, serve));
// gulp.task("reloadJS", gulp.series(moveJStoTemp));

gulp.task("serve:watch", gulp.series(serve, watch));
gulp.task("serve:deploy", gulp.series(serveTest));

gulp.task("production", gulp.series(processJS));

gulp.task("deploy:final", gulp.series(processHTML, processCSS, processJS, copySVG,  copyFLAGS ));