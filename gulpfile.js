const gulp = require("gulp");
const browserSync = require("browser-sync").create("index.html");
const reload = browserSync.reload;

const newer = require('gulp-newer');  // try gulp-changed ?

const cleanCSS = require("gulp-clean-css");

const modifyHTMLlinks = require("gulp-processhtml");  // or try gulp-useref
const addVersionString = require("gulp-version-number");
const print = require('gulp-print').default;
const { Transform } = require('node:stream');


function serve (done) {        // serve:    ./home.html
  browserSync.init({
    port: 3000,
    server: {
      baseDir: "./",
      index: "home.html",
      // files: 
      // serveStaticOptions: 
    },
    ghostMode: false
  });
  done();
}

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
    src: "Authors/*.{txt,json}",
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
  json: {
    src: "JSON/**/*.json",
    deploy: "./deploy/JSON"
  },
  css: {
    src: "./src/styles/css/styles.css",
    watch: "./src/styles/css/**/*.css",
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
    src: "./flags/*.png",
    deploy: "./deploy/flags"
  },
  images: {
    src: "./images/*.png",
    deploy: "./deploy/images"
  }
};

function watch() {
  gulp.watch(paths.js.src, reloadJS);

  gulp.watch(paths.css.watch).on('change', function () {
    browserSync.reload();
  }); 

  gulp.watch("./*.html", { events: 'all' }, function(cb) {
    reload();
    cb();
  });
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
  "./temp/js/main.js",
  "./temp/js/SouthAmerica.js",
  "./temp/js/numList.js",

  "./temp/js/search/search_entry.js",
  "./temp/js/search/search_handleQuery.js",
  "./temp/js/search/search_functions.js",
  "./temp/js/search/search_handleResults.js",

  "./temp/js/taxonomy.js",

  "./temp/js/birdMapFactory.js"
];


const fs = require('node:fs/promises');
const path = require('node:path');
const strip = require('strip-comments');

async function processJS() {
  const pieces = await Promise.all(
    scriptOrder.map(async (file) => {
      const source = await fs.readFile(file, 'utf8');
      return strip(source, { language: 'javascript' });
    })
  );

  await fs.mkdir(paths.js.deploy, { recursive: true });

  await fs.writeFile(
    path.join(paths.js.deploy, 'app.min.js'),
    pieces.join('\n;\n'),
    'utf8'
  );
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

function stripHtmlCommentsFromFile() {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new Error('Streaming HTML is not supported.'));
        return;
      }

      const contents = file.contents.toString('utf8');
      file.contents = Buffer.from(
        contents.replace(/<!--(?!\[if\b)[\s\S]*?-->/gi, ''),
        'utf8'
      );

      cb(null, file);
    }
  });
}

function processHTML() {
  return gulp.src(paths.html.src)
    .pipe(print())

    // modifyHTMLlinks: remove browserSync script link
    // update css/js links to .min.css or .min.js
    .pipe(modifyHTMLlinks())

    .pipe(stripHtmlCommentsFromFile())

    // add ?v=dateTime stamp to css and js links
    .pipe(addVersionString(versionConfig))

    .pipe(gulp.dest(paths.html.deploy));
}

function renameTo(filename) {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      file.path = path.join(file.base, filename);
      cb(null, file);
    }
  });
}

function processCSS() {
  return gulp.src(paths.css.src)
    // .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(renameTo('styles.min.css'))
    .pipe(gulp.dest(paths.css.deploy));
}


// function processPrintCSS() {
//   return gulp.src(paths.css.src)
//     .pipe(gulp.dest(paths.printCSS.deploy));
// }

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

function copyJSON() {
  return gulp.src(paths.json.src)
    .pipe(newer(paths.json.deploy))
    .pipe(print())
    .pipe(gulp.dest(paths.json.deploy));
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

function copyIMAGES() {
  return gulp.src(paths.images.src, {encoding: false})
    .pipe(newer(paths.images.deploy))
    .pipe(gulp.dest(paths.images.deploy));
}

// ************************   get the SACC data from the BuildSACC directory   **********************  //

// to get Countries and occurrences.txt from BuildSACC directory
const buildGlobs = {
  occurrences: '../BuildSACC/occurrences/occurrences.txt',
  countries: '../BuildSACC/Countries/*.*',   // does this to be glob'ed first
  jsons: '../BuildSACC/JSON/**/*.json',      // does this to be glob'ed first
  numLists: '../BuildSACC/numLists/numList.js'
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

function getBuildSACC_JSON() {
  return gulp.src(buildGlobs.jsons)
    .pipe(newer("./JSON"))
    .pipe(print())
    .pipe(gulp.dest("./JSON"));
}

function getBuildSACC_NumLists() {
  return gulp.src(buildGlobs.numLists)
    .pipe(newer("./src/js/numList.js"))
    .pipe(print())
    .pipe(gulp.dest("./src/js"));
}

// ****************   ftp to System Domain (potoococha.net) and potoococha.net    **********************  //

const deployRoot = './deploy';

/* list all files you wish to ftp in the glob variable */
// const ftpGlobs = [
//   'deploy/css/*.css',
//   // 'deploy/printCSS/printSearchResults',
//   'deploy/js/*.js',
//   'deploy/php/*.php',
//   // 'deploy/svg/SouthAmerica.svg',
//   // // 'deploy/flags/*.png',
//   'deploy/home.html',
//   'deploy/citations.html',
//   'deploy/Authors/*.{txt,json}',
//   'deploy/occurrences/occurrences.txt',
//   'deploy/Countries/*.*',
//   'deploy/JSON/**/*.json',
//   '!ftpConfig.js'
// ];

const gulpSFTP = require('./sftpConfig.js');
const SftpClient = require('ssh2-sftp-client');

function getSftpConnectionConfig(config) {
  return {
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.pass
  };
}

async function uploadDeployDirectory(config, label) {
  const client = new SftpClient(label);

  try {
    await client.connect(getSftpConnectionConfig(config));
    console.log(`Uploading ${deployRoot} to ${label} at /`);
    await client.uploadDir(deployRoot, '/', { useFastput: false });
  } finally {
    await client.end().catch(() => undefined);
  }
}

function deploySystemDomain() {
  return uploadDeployDirectory(gulpSFTP.systemConfig, 'system domain');
}

function deployPotoococha() {
  return uploadDeployDirectory(gulpSFTP.potooConfig, 'potoococha');
}

//  ****************************   compose and export tasks  *****************************  //

exports.sync = gulp.series(reloadJS, serve, watch);
// exports.default = exports.sync;   this works

exports.serve = gulp.series(serve);
exports.css = gulp.series(processCSS);
exports.scss = gulp.series(processCSS);

exports.movePHP = gulp.series(copyPHP);

exports.watch = gulp.series(watch);

exports.production = gulp.series(moveJStoTemp, processJS);

// TODO : (include php and logFileRequests.txt) movePrintCSStoTemp? not used anymore - keep as backup?
exports.build = gulp.series(processHTML, processCSS, moveJStoTemp, processJS,
  copyPHP, copySVG, copyFLAGS, copyIMAGES, copyCitations, copyAuthors,
  copyOccurrences, copyCountries, copyJSON);  // movePrintCSStoTemp

exports.getSACC = gulp.series(getBuildSACC_Data, getBuildSACC_Countries, getBuildSACC_JSON, getBuildSACC_NumLists);

exports.deploy_S = gulp.series(deploySystemDomain);
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

// node --trace-deprecation node_modules/gulp/bin/gulp.js build  // this works but runs gulp build as well
// gulp-rename → vinyl → clone-stats → new fs.Stats()

