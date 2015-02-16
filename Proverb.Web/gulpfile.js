/// <vs AfterBuild='default' />
var gulp = require("gulp");

// Include Our Plugins
var concat = require("gulp-concat");
var ignore = require("gulp-ignore");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var rev = require("gulp-rev");
var del = require("del");
var path = require("path");
var templateCache = require("gulp-angular-templatecache");
var eventStream = require("event-stream");
var order = require("gulp-order");
var gulpUtil = require("gulp-util");
var wiredep = require("wiredep");
var inject = require("gulp-inject");

// Get our config
var config = require("./gulpfile.config.js");

/**
 * Get the scripts or styles the app requires by combining bower dependencies and app dependencies
 */
function getScriptsOrStyles(jsOrCss) {

    var bowerScriptsAbsolute = wiredep(config.wiredepOptions)[jsOrCss];

    var bowerScriptsRelative = bowerScriptsAbsolute.map(function makePathRelativeToCwd(file) {
        return path.relative('', file); 
    });

    var appScripts = bowerScriptsRelative.concat(jsOrCss === "js" ? config.scripts : config.styles);

    return appScripts;
}

/**
 * Get the scripts the app requires
 */
function getScripts() {

    return getScriptsOrStyles("js");
}

/**
 * Get the styles the app requires
 */
function getStyles() {

    return getScriptsOrStyles("css");
}

/**
 * Get the scripts and the templates combined streams
 * 
 * @param {boolean} isDebug
 */
function getScriptsAndTemplates(isDebug) {

    var options = isDebug ? { base: config.base } : undefined;
    var appScripts = gulp.src(getScripts(), options);

    //Get the view templates for $templateCache
    var templates = gulp.src([
                "app/**/*.html",
                "!app/index.html" // Exclude the launch page
            ])
        .pipe(templateCache({ module: "app", root: "app/" }));

    var combined = eventStream.merge(appScripts, templates);

    return combined;
}

gulp.task("clean", function (cb) {

    gulpUtil.log("Delete the build folder");

    return del([config.buildDir], cb);
});

gulp.task("boot-dependencies", ["clean"], function () {

    gulpUtil.log("Get dependencies needed for boot (just jQuery for now)");

    return gulp
        .src([config.bootjQuery])
        .pipe(gulp.dest(config.buildDir));
});

gulp.task("inject-debug", ["styles-debug", "scripts-debug"], function () {

    gulpUtil.log("Inject debug links and script tags into " + config.bootFile);

    var scriptsAndStyles = [].concat(getScripts(), getStyles());

    return gulp
        .src(config.bootFile)
        .pipe(inject(
                gulp.src([
                        config.debugFolder + "**/*.{js,css}",
                        "!build\\debug\\bower_components\\spin.js" // Exclude weird spin js path
                    ], { read: false })
                    .pipe(order(scriptsAndStyles))
            ))
        .pipe(gulp.dest(config.buildDir));
});

gulp.task("inject-release", ["styles-release", "scripts-release"], function () {

    gulpUtil.log("Inject release links and script tags into " + config.bootFile);

    return gulp
        .src(config.bootFile)
        .pipe(inject(gulp.src(config.releaseFolder + "**/*.{js,css}", { read: false })))
        .pipe(gulp.dest(config.buildDir));
});

gulp.task("scripts-debug", ["clean"], function () {

    gulpUtil.log("Copy across all files in config.scripts to build/debug");

    return getScriptsAndTemplates(true)
        .pipe(gulp.dest(config.debugFolder));
});

gulp.task("styles-debug", ["clean"], function () {

    gulpUtil.log("Copy across all files in config.styles to build/debug");

    return gulp
        .src(getStyles(), { base: config.base })
        .pipe(gulp.dest(config.debugFolder));
});

gulp.task("scripts-release", ["clean"], function () {

    gulpUtil.log("Concatenate & Minify JS for release into a single file");

    return getScriptsAndTemplates(false)
        .pipe(ignore.exclude("**/*.{ts,js.map}")) // Exclude ts and js.map files - not needed in release mode
        .pipe(concat("app.js"))                   // Make a single file                                                         
        .pipe(uglify())                           // Make the file titchy tiny small
        .pipe(rev())                              // Suffix a version number to it
        .pipe(gulp.dest(config.releaseFolder));   // Write single versioned file to build/release folder
});

gulp.task("styles-release", ["clean"], function () {

    gulpUtil.log("Copy across all files in config.styles to build/debug");

    return gulp
        .src(getStyles())
        .pipe(concat("app.css"))          // Make a single file
        .pipe(minifyCss())                // Make the file titchy tiny small
        .pipe(rev())                      // Suffix a version number to it
        .pipe(gulp.dest(config.releaseFolder + "/" + config.css)); // Write single versioned file to build/release folder
});

gulp.task("fonts-debug", ["clean"], function () {

    gulpUtil.log("Copy across all fonts in config.fonts to debug location");

    return gulp
        .src(config.fonts, { base: config.base })
        .pipe(gulp.dest(config.debugFolder));
});

gulp.task("fonts-release", ["clean"], function () {

    gulpUtil.log("Copy across all fonts in config.fonts to release location");

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.releaseFolder + "/fonts"));
});

gulp.task("build-debug", [
    "boot-dependencies", "inject-debug", "scripts-debug", "styles-debug", "fonts-debug"
]);

gulp.task("build-release", [
    "boot-dependencies", "inject-release", "scripts-release", "styles-release", "fonts-release"
]);

// Default Task
gulp.task("default", ["build-debug"]);
