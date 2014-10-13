/// <vs AfterBuild='default' />
var gulp = require("gulp");

// Include Our Plugins
var concat = require("gulp-concat");
var ignore = require("gulp-ignore");
var manifest = require("gulp-asset-manifest");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var rev = require('gulp-rev');
var del = require("del");
var path = require("path");

var tsjsmapjsSuffix = ".{ts,js.map,js}";
var excludetsjsmap = "**/*.{ts,js.map}";

var bundleNames = { scripts: "scripts", styles: "styles" };

var filesAndFolders = {

    base: ".",
    buildBaseFolder: "./build/",
    debug: "debug",
    release: "release",
    css: "css",

    // The fonts we want Gulp to process
    fonts: ["./fonts/*.*"],

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
    ],

    // The styles we want Gulp to process
    styles: [
        "./content/ie10mobile.css",
        "./content/bootstrap.css",
        "./content/font-awesome.css",
        "./content/toastr.css",
        "./content/styles.css"
    ]
};

filesAndFolders.debugFolder = filesAndFolders.buildBaseFolder + "/" + filesAndFolders.debug + "/";
filesAndFolders.releaseFolder = filesAndFolders.buildBaseFolder + "/" + filesAndFolders.release + "/";

/**
 * Create a manifest depending upon the supplied arguments
 * 
 * @param {string} manifestName
 * @param {string} bundleName
 * @param {boolean} includeRelativePath
 * @param {string} pathPrepend
 */
function getManifest(manifestName, bundleName, includeRelativePath, pathPrepend) {

    // Determine filename ("./build/manifest-debug.json" or "./build/manifest-release.json"
    var manifestFile = filesAndFolders.buildBaseFolder + "manifest-" + manifestName + ".json";

    return manifest({
        bundleName: bundleName,
        includeRelativePath: includeRelativePath,
        manifestFile: manifestFile,
        log: true,
        pathPrepend: pathPrepend,
        pathSeparator: "/"
    });
}

// Delete the build folder
gulp.task("clean", function (cb) {
    del([filesAndFolders.buildBaseFolder], cb);
});

// Copy across all files in filesAndFolders.scripts to build/debug
gulp.task("scripts-debug", ["clean"], function () {

    return gulp
        .src(filesAndFolders.scripts, { base: filesAndFolders.base })
        .pipe(gulp.dest(filesAndFolders.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of script files in
gulp.task("manifest-scripts-debug", ["scripts-debug"], function () {

    return gulp
        .src(filesAndFolders.scripts, { base: filesAndFolders.base })
        .pipe(ignore.exclude("**/*.{ts,js.map}")) // Exclude ts and js.map files from the manifest (as they won't become script tags)
        .pipe(getManifest(filesAndFolders.debug, bundleNames.scripts, true));
});

// Copy across all files in filesAndFolders.styles to build/debug
gulp.task("styles-debug", ["clean"], function () {

    return gulp
        .src(filesAndFolders.styles, { base: filesAndFolders.base })
        .pipe(gulp.dest(filesAndFolders.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of style files in
gulp.task("manifest-styles-debug", ["styles-debug", "manifest-scripts-debug"], function () {

    return gulp
        .src(filesAndFolders.styles, { base: filesAndFolders.base })
        //.pipe(ignore.exclude("**/*.{ts,js.map}")) // Exclude ts and js.map files from the manifest (as they won't become script tags)
        .pipe(getManifest(filesAndFolders.debug, bundleNames.styles, true));
});

// Concatenate & Minify JS for release into a single file
gulp.task("scripts-release", ["clean"], function () {

    return gulp
        .src(filesAndFolders.scripts)
        .pipe(ignore.exclude("**/*.{ts,js.map}"))        // Exclude ts and js.map files - not needed in release mode
                                                         
        .pipe(concat("app.js"))                          // Make a single file - if you want to see the contents then include the line below                                          
        //.pipe(gulp.dest(releaseFolder))                
                                                         
        .pipe(uglify())                                  // Make the file titchy tiny small
        .pipe(rev())                                     // Suffix a version number to it
        .pipe(gulp.dest(filesAndFolders.releaseFolder)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the release build - this should just have a single file for scripts
gulp.task("manifest-scripts-release", ["scripts-release"], function () {

    return gulp
        .src(filesAndFolders.buildBaseFolder + filesAndFolders.release + "/*.js")
        .pipe(getManifest(filesAndFolders.release, bundleNames.scripts, false));
});

// Copy across all files in filesAndFolders.styles to build/debug
gulp.task("styles-release", ["clean"], function () {

    return gulp
        .src(filesAndFolders.styles)
        .pipe(concat("app.css"))          // Make a single file - if you want to see the contents then include the line below
        //.pipe(gulp.dest(releaseFolder))

        .pipe(minifyCss())                // Make the file titchy tiny small
        .pipe(rev())                      // Suffix a version number to it
        .pipe(gulp.dest(filesAndFolders.releaseFolder + "/" + filesAndFolders.css)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the debug build - this should have a single style files in
gulp.task("manifest-styles-release", ["styles-release", "manifest-scripts-release"], function () {

    return gulp
        .src(filesAndFolders.releaseFolder + "**/*.css")
        .pipe(getManifest(filesAndFolders.release, bundleNames.styles, false, filesAndFolders.css + "/"));
});

// Copy across all fonts in filesAndFolders.fonts to both release and debug locations
gulp.task("fonts", ["clean"], function () {

    return gulp
        .src(filesAndFolders.fonts, { base: filesAndFolders.base })
        .pipe(gulp.dest(filesAndFolders.debugFolder))
        .pipe(gulp.dest(filesAndFolders.releaseFolder));
});

// Default Task
gulp.task("default", [
    "scripts-debug", "manifest-scripts-debug", "styles-debug", "manifest-styles-debug",
    "scripts-release", "manifest-scripts-release", "styles-release", "manifest-styles-release",
    "fonts"
]);
