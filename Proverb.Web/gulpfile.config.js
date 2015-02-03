var tsjsmapjsSuffix = ".{ts,js.map,js}";

var bower = "bower_components/";
var app = "app/";

var config = {

    base: ".",
    buildDir: "./build/",
    debug: "debug",
    release: "release",
    css: "css",

    bundleNames: { scripts: "scripts", styles: "styles" },

    bootFile: app + "index.html",
    bootjQuery: bower + "jquery/dist/jquery.min.js",

    // The fonts we want Gulp to process
    fonts: [bower + "fontawesome/fonts/*.*"],

    // The scripts we want Gulp to process
    scripts: [
        // Vendor Scripts 
        bower + "angular/angular.js",
        bower + "angular-animate/angular-animate.js",
        bower + "angular-route/angular-route.js",
        bower + "angular-sanitize/angular-sanitize.js",
        bower + "angular-bootstrap/ui-bootstrap-tpls.js",

        bower + "toastr/toastr.js",
        bower + "moment/moment.js",
        bower + "spin.js/spin.js",
        bower + "underscore/underscore.js",

        // Bootstrapping
        app + "app" + tsjsmapjsSuffix,
        app + "config.route" + tsjsmapjsSuffix,

        // common Modules
        app + "common/common" + tsjsmapjsSuffix,
        app + "common/logger" + tsjsmapjsSuffix,
        app + "common/spinner" + tsjsmapjsSuffix,

        // common.bootstrap Modules
        app + "common/bootstrap/bootstrap.dialog" + tsjsmapjsSuffix,

        // directives
        app + "directives/**/*" + tsjsmapjsSuffix,

        // services
        app + "services/**/*" + tsjsmapjsSuffix,

        // controllers
        app + "about/**/*" + tsjsmapjsSuffix,
        app + "admin/**/*" + tsjsmapjsSuffix,
        app + "dashboard/**/*" + tsjsmapjsSuffix,
        app + "layout/**/*" + tsjsmapjsSuffix,
        app + "sages/**/*" + tsjsmapjsSuffix,
        app + "sayings/**/*" + tsjsmapjsSuffix
    ],

    // The styles we want Gulp to process
    styles: [
        "content/ie10mobile.css",
        bower + "bootstrap/dist/css/bootstrap.css",
        bower + "fontawesome/css/font-awesome.css",
        bower + "toastr/toastr.css",
        "content/styles.css"
    ]
};

config.debugFolder = config.buildDir + config.debug + "/";
config.releaseFolder = config.buildDir + config.release + "/";

module.exports = config;
