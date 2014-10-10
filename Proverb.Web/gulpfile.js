/// <vs AfterBuild='default' />
var gulp = require("gulp");

// Include Our Plugins
var concat = require("gulp-concat");
var ignore = require("gulp-ignore");
var manifest = require("gulp-asset-manifest");
var uglify = require("gulp-uglify");
var rev = require('gulp-rev');
var del = require("del");
var path = require("path");

var tsjsmapjsSuffix = ".{ts,js.map,js}";
var excludetsjsmap = "**/*.{ts,js.map}";

var filesAndFolders = {

    base: ".",
    buildBaseFolder: "./build/",
    debug: "debug",
    release: "release",

    // The scripts we want Gulp to process
    scripts: [
        // Vendor Scripts 
        "./scripts/angular.js",
        "./scripts/angular-animate.js",
        "./scripts/angular-route.js",
        "./scripts/angular-sanitize.js",
        "./scripts/angular-ui/ui-bootstrap-tpls.js",

        "./scripts/toastr.js",
        "./scripts/moment.js",
        "./scripts/spin.js",
        "./scripts/underscore.js",

        // Bootstrapping
        "./app/app" + tsjsmapjsSuffix,
        "./app/config.route" + tsjsmapjsSuffix,

        // common Modules
        "./app/common/common" + tsjsmapjsSuffix,
        "./app/common/logger" + tsjsmapjsSuffix,
        "./app/common/spinner" + tsjsmapjsSuffix,

        // common.bootstrap Modules
        "./app/common/bootstrap/bootstrap.dialog" + tsjsmapjsSuffix,

        // directives
        "./app/directives/**/*" + tsjsmapjsSuffix,

        // services
        "./app/services/**/*" + tsjsmapjsSuffix,

        // controllers
        "./app/about/**/*" + tsjsmapjsSuffix,
        "./app/admin/**/*" + tsjsmapjsSuffix,
        "./app/dashboard/**/*" + tsjsmapjsSuffix,
        "./app/layout/**/*" + tsjsmapjsSuffix,
        "./app/sages/**/*" + tsjsmapjsSuffix,
        "./app/sayings/**/*" + tsjsmapjsSuffix
    ]
};

/**
 * Create a manifest depending upon the supplied isDebug flag
 * 
 * @param {boolean} isDebug
 */
function getManifest(isDebug) {

    // Determine filename ("./build/manifest-debug.json" or "./build/manifest-release.json"
    var manifestFile = filesAndFolders.buildBaseFolder + "manifest-" +
        ((isDebug) ? filesAndFolders.debug : filesAndFolders.release) + 
        ".json";

    return manifest({
        bundleName: "scripts",
        manifestFile: manifestFile,
        includeRelativePath: isDebug, // Don't need relative paths in release mode
        log: true
    });
}

// Delete the build folder
gulp.task("clean", function (cb) {
    del([filesAndFolders.buildBaseFolder], cb);
});

// Copy across all files in src to build/debug
gulp.task("scripts-debug", ["clean"], function () {

    return gulp
        .src(filesAndFolders.scripts, { base: filesAndFolders.base })
        .pipe(gulp.dest(filesAndFolders.buildBaseFolder + "/" + filesAndFolders.debug));
});

// Create a manifest.json for the debug build - this should have lots of files in
gulp.task("manifest-debug", ["scripts-debug"], function () {

    return gulp
        .src(filesAndFolders.scripts, { base: filesAndFolders.base })
        .pipe(ignore.exclude("**/*.{ts,js.map}")) // Exclude ts and js.map files from the manifest (as they won't become script tags)
        .pipe(getManifest(true));
});

// Concatenate & Minify JS for release into a single file
gulp.task("scripts-release", ["clean"], function () {

    var releaseFolder = filesAndFolders.buildBaseFolder + filesAndFolders.release;

    return gulp
        .src(filesAndFolders.scripts)
        .pipe(ignore.exclude("**/*.{ts,js.map}")) // Exclude ts and js.map files - not needed in release mode

        .pipe(concat("app.js"))                   // Make a single file - if you want to see the contents then include the line below
        //.pipe(gulp.dest(releaseFolder))

        .pipe(uglify())                           // Make the file titchy tiny small
        .pipe(rev())                              // Suffix a version number to it
        .pipe(gulp.dest(releaseFolder));          // Write single versioned file to build/release folder
});

// Create a manifest.json for the release build - this should just have a single file in
gulp.task("manifest-release", ["scripts-release"], function () {

    return gulp
        .src(filesAndFolders.buildBaseFolder + filesAndFolders.release + "/*.js")
        .pipe(getManifest(false));
});

// Default Task
gulp.task("default", ["scripts-debug", "manifest-debug", "scripts-release", "manifest-release"]);
