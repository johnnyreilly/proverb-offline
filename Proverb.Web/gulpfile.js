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

var config = require("./gulpfile.config.js");

/**
 * Create a manifest depending upon the supplied arguments
 * 
 * @param {string} manifestName
 * @param {string} bundleName
 */
function getManifest(manifestName, bundleName) {

    // Determine filename ("./build/manifest-debug.json" or "./build/manifest-release.json"
    var manifestFile = config.buildDir + "manifest-" + manifestName + ".json";

    gulpUtil.log("Creating " + bundleName + " manifest: " + manifestFile);

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
    var templates = gulp.src([
            "app/**/*.html",
            "!app/index.html" // Exclude the launch page
        ])
        .pipe(templateCache({ module: "app", root: "app/" }));

    var options = isDebug ? { base: config.base } : undefined;
    var scripts = gulp.src(config.scripts, options);

    var combined = eventStream.merge(scripts, templates);

    return combined;
}

// Delete the build folder
gulp.task("clean", function (cb) {

    return del([config.buildDir], cb);
});

// Create a manifest.json for the debug build - this should have lots of script files in
gulp.task("boot-dependencies", ["clean"], function () {

    return gulp
        .src([config.bootFile, config.bootjQuery])
        .pipe(gulp.dest(config.buildDir));
});

// Copy across all files in config.scripts to build/debug
gulp.task("scripts-debug", ["clean"], function () {

    return getScriptsAndTemplates(true)
        .pipe(gulp.dest(config.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of script files in
gulp.task("manifest-scripts-debug", ["scripts-debug"], function () {

    return gulp
        .src(config.debugFolder + "**/*.js")
        .pipe(order(config.scripts)) // templates.js is not in config.scripts and so this will be the last script (which is fine)
        .pipe(getManifest(config.debug, config.bundleNames.scripts));
});

// Copy across all files in config.styles to build/debug
gulp.task("styles-debug", ["clean"], function () {

    return gulp
        .src(config.styles, { base: config.base })
        .pipe(gulp.dest(config.debugFolder));
});

// Create a manifest.json for the debug build - this should have lots of style files in
gulp.task("manifest-styles-debug", ["styles-debug", "manifest-scripts-debug"], function () {

    return gulp
        .src(config.debugFolder + "**/*.css*")
        .pipe(order(config.styles))
        .pipe(getManifest(config.debug, config.bundleNames.styles));
});

// Concatenate & Minify JS for release into a single file
gulp.task("scripts-release", ["clean"], function () {

    return getScriptsAndTemplates(false)
        .pipe(ignore.exclude("**/*.{ts,js.map}"))        // Exclude ts and js.map files - not needed in release mode
        .pipe(concat("app.js"))                          // Make a single file                                                         
        .pipe(uglify())                                  // Make the file titchy tiny small
        .pipe(rev())                                     // Suffix a version number to it
        .pipe(gulp.dest(config.releaseFolder)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the release build - this should just have a single file for scripts
gulp.task("manifest-scripts-release", ["scripts-release"], function () {

    return gulp
        .src(config.releaseFolder + "**/*.js") // Should only be 1 file
        .pipe(getManifest(config.release, config.bundleNames.scripts));
});

// Copy across all files in config.styles to build/debug
gulp.task("styles-release", ["clean"], function () {

    return gulp
        .src(config.styles)
        .pipe(concat("app.css"))          // Make a single file
        .pipe(minifyCss())                // Make the file titchy tiny small
        .pipe(rev())                      // Suffix a version number to it
        .pipe(gulp.dest(config.releaseFolder + "/" + config.css)); // Write single versioned file to build/release folder
});

// Create a manifest.json for the debug build - this should have a single style files in
gulp.task("manifest-styles-release", ["styles-release", "manifest-scripts-release"], function () {

    return gulp
        .src(config.releaseFolder + "**/*.css") // Should only be 1 file
        .pipe(getManifest(config.release, config.bundleNames.styles));
});

// Copy across all fonts in config.fonts to both release and debug locations
gulp.task("fonts-debug", ["clean"], function () {

    return gulp
        .src(config.fonts, { base: config.base })
        .pipe(gulp.dest(config.debugFolder));
});

// Copy across all fonts in config.fonts to both release and debug locations
gulp.task("fonts-release", ["clean"], function () {

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.releaseFolder + "/fonts"));
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
