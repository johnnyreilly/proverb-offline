/// <vs AfterBuild='default' />
var gulp = require("gulp");

// Include Our Plugins
var concat = require("gulp-concat");
var ignore = require("gulp-ignore");
var manifest = require("gulp-asset-manifest");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var rev = require("gulp-rev");
var del = require("del");
var path = require("path");
var templateCache = require("gulp-angular-templatecache");
var eventStream = require("event-stream");
var order = require("gulp-order");
var gulpUtil = require("gulp-util");
//var sourcemaps = require('gulp-sourcemaps');

//var tsjsmapjsSuffix = ".js";
var tsjsmapjsSuffix = ".{ts,js.map,js}";
var excludetsjsmap = "**/*.{ts,js.map}";

var bundleNames = { scripts: "scripts", styles: "styles" };

var paths = {

    base: ".",
    buildDir: "./build/",
    debug: "debug",
    release: "release",
    css: "css",

    // The fonts we want Gulp to process
    fonts: ["bower_components/fontawesome/fonts/*.*"],

    // The scripts we want Gulp to process
    scripts: [
        // Vendor Scripts 
        "bower_components/angular/angular.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-route/angular-route.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",

        "bower_components/toastr/toastr.js",
        "bower_components/moment/moment.js",
        "scripts/spin.js",
        "bower_components/underscore/underscore.js",

        // Bootstrapping
        "app/app" + tsjsmapjsSuffix,
        "app/config.route" + tsjsmapjsSuffix,

        // common Modules
        "app/common/common" + tsjsmapjsSuffix,
        "app/common/logger" + tsjsmapjsSuffix,
        "app/common/spinner" + tsjsmapjsSuffix,

        // common.bootstrap Modules
        "app/common/bootstrap/bootstrap.dialog" + tsjsmapjsSuffix,

        // directives
        "app/directives/**/*" + tsjsmapjsSuffix,

        // services
        "app/services/**/*" + tsjsmapjsSuffix,

        // controllers
        "app/about/**/*" + tsjsmapjsSuffix,
        "app/admin/**/*" + tsjsmapjsSuffix,
        "app/dashboard/**/*" + tsjsmapjsSuffix,
        "app/layout/**/*" + tsjsmapjsSuffix,
        "app/sages/**/*" + tsjsmapjsSuffix,
        "app/sayings/**/*" + tsjsmapjsSuffix
    ],

    // The styles we want Gulp to process
    styles: [
        "content/ie10mobile.css",
        "bower_components/bootstrap/dist/css/bootstrap.css",
        "bower_components/fontawesome/css/font-awesome.css",
        "bower_components/toastr/toastr.css",
        "content/styles.css"
    ]
};

paths.debugFolder = paths.buildDir + paths.debug + "/";
paths.releaseFolder = paths.buildDir + paths.release + "/";


/**
 * Create a manifest depending upon the supplied arguments
 * 
 * @param {string} manifestName
 * @param {string} bundleName
 */
function getManifest(manifestName, bundleName) {

    // Determine filename ("./build/manifest-debug.json" or "./build/manifest-release.json"
    var manifestFile = paths.buildDir + "manifest-" + manifestName + ".json";

    gulpUtil.log("Creating manifest: " + manifestFile);

    return manifest({
        bundleName: bundleName,
        includeRelativePath: true,
        manifestFile: manifestFile,
        log: false,
        pathSeparator: "/"
    });
}

/**
 * Get the scripts and the templates combined streams
 * 
 * @param {boolean} isDebug
 */
function getScriptsAndTemplates(isDebug) {

    //Get the view templates for $templateCache
    var templates = gulp.src("app/**/*.html").pipe(templateCache({ module: "app", root: "app/" }));

    var options = isDebug ? { base: paths.base } : undefined;
    var scripts = gulp.src(paths.scripts, options);

    var combined = eventStream.merge(scripts, templates);

    return combined;
}

// Delete the build folder
gulp.task("clean", function (cb) {

    return del([paths.buildDir], cb);
});

// Create a manifest.json for the debug build - this should have lots of script files in
gulp.task("boot-dependencies", ["clean"], function () {

    return gulp
        .src("bower_components/jquery/dist/jquery.min.js")
        .pipe(gulp.dest(paths.buildDir));
});

// Copy across all files in paths.scripts to build/debug
gulp.task("scripts-debug", ["clean"], function () {

    return getScriptsAndTemplates(true)
        //.pipe(sourcemaps.init({ loadMaps: true, debug: true }))
        //.pipe(sourcemaps.write('maps', { includeContent: true, sourceRoot: "/app" }))
        .pipe(gulp.dest(paths.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of script files in
gulp.task("manifest-scripts-debug", ["scripts-debug"], function () {

    return gulp
        .src(paths.debugFolder + "**/*.js")
        .pipe(order(paths.scripts)) // templates.js is not in paths.scripts and so this will be the last script (which is fine)
        .pipe(getManifest(paths.debug, bundleNames.scripts));
});

// Copy across all files in paths.styles to build/debug
gulp.task("styles-debug", ["clean"], function () {

    return gulp
        .src(paths.styles, { base: paths.base })
        .pipe(gulp.dest(paths.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of style files in
gulp.task("manifest-styles-debug", ["styles-debug", "manifest-scripts-debug"], function () {

    return gulp
        .src(paths.debugFolder + "**/*.css*")
        .pipe(order(paths.styles))
        .pipe(getManifest(paths.debug, bundleNames.styles));
});

// Concatenate & Minify JS for release into a single file
gulp.task("scripts-release", ["clean"], function () {

    return getScriptsAndTemplates(false)
        .pipe(ignore.exclude("**/*.{ts,js.map}"))        // Exclude ts and js.map files - not needed in release mode
        .pipe(concat("app.js"))                          // Make a single file                                                         
        .pipe(uglify())                                  // Make the file titchy tiny small
        .pipe(rev())                                     // Suffix a version number to it
        .pipe(gulp.dest(paths.releaseFolder)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the release build - this should just have a single file for scripts
gulp.task("manifest-scripts-release", ["scripts-release"], function () {

    return gulp
        .src(paths.releaseFolder + "**/*.js") // Should only be 1 file
        .pipe(getManifest(paths.release, bundleNames.scripts));
});

// Copy across all files in paths.styles to build/debug
gulp.task("styles-release", ["clean"], function () {

    return gulp
        .src(paths.styles)
        .pipe(concat("app.css"))          // Make a single file
        .pipe(minifyCss())                // Make the file titchy tiny small
        .pipe(rev())                      // Suffix a version number to it
        .pipe(gulp.dest(paths.releaseFolder + "/" + paths.css)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the debug build - this should have a single style files in
gulp.task("manifest-styles-release", ["styles-release", "manifest-scripts-release"], function () {

    return gulp
        .src(paths.releaseFolder + "**/*.css") // Should only be 1 file
        .pipe(getManifest(paths.release, bundleNames.styles));
});

// Copy across all fonts in paths.fonts to both release and debug locations
gulp.task("fonts-debug", ["clean"], function () {

    return gulp
        .src(paths.fonts, { base: paths.base })
        .pipe(gulp.dest(paths.debugFolder));
});

// Copy across all fonts in paths.fonts to both release and debug locations
gulp.task("fonts-release", ["clean"], function () {

    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest(paths.releaseFolder + "/fonts"));
});

// Default Task
gulp.task("release-build", [
    "boot-dependencies",

    "scripts-release", "manifest-scripts-release", "styles-release", "manifest-styles-release", "fonts-release"
]);

// Default Task
gulp.task("default", [
    "boot-dependencies",

    "scripts-debug", "manifest-scripts-debug", "styles-debug", "manifest-styles-debug", "fonts-debug",

    "scripts-release", "manifest-scripts-release", "styles-release", "manifest-styles-release", "fonts-release"
]);
