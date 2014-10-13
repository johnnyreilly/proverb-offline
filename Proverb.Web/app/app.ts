interface bootstrapper {
    thirdPartyLibs: thirdPartyLibs;
    appConfig: appConfig;
}

interface thirdPartyLibs {
    moment: MomentStatic;
    toastr: Toastr;
    underscore: UnderscoreStatic;
}

interface appConfig {
    appName: string;
    appRoot: string;
    inDebug: boolean;
    remoteServiceRoot: string;
    version: string;
}

interface configEvents {
    controllerActivateSuccess: string;
    failure: string;
    spinnerToggle: string;
    waiterStart: string;
    waiterSuccess: string;
}

interface config extends appConfig {
    appErrorPrefix: string;
    docTitle: string;
    events: configEvents;
    imageSettings?: {
        imageBasePath: string;
        unknownPersonImageSource: string;
    }
    urlCacheBusterSuffix: string;
}

var angularApp = (function () {
    "use strict";

    var appName = "app";

    // Create Angular "app" module so all modules that depend on it use it
    var app = angular.module(appName, [
    // Angular modules 
        "ngAnimate",        // animations
        "ngRoute",          // routing
        "ngSanitize",       // sanitizes html bindings (ex: sidebar.js)

    // Custom modules 
        "common",           // common functions, logger, spinner
        "common.bootstrap", // bootstrap dialog wrapper functions

    // 3rd Party Modules
        "ui.bootstrap"      // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);
    
    return {
        start: start
    }

    /**
     * Add 3rd party libraries to Angular app
     */
    function addThirdPartyLibs(thirdPartyLibs: thirdPartyLibs) {

        // Toastr
        var toastr = thirdPartyLibs.toastr;
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = "toast-bottom-right";
        app.constant("toastr", toastr);

        // Underscore
        var _ = thirdPartyLibs.underscore;
        app.constant("_", _);

        // Moment
        var moment = thirdPartyLibs.moment;
        app.constant("moment", moment);
    }

    /**
     * Configure application
     */
    function configureApp(appConfig: appConfig) {

        var config: config = {
            appErrorPrefix: "[Error] ", //Configure the exceptionHandler decorator
            appName: appConfig.appName,
            appRoot: appConfig.appRoot,
            docTitle: appConfig.appName + ": ",
            events: {
                controllerActivateSuccess: "controller.activateSuccess",
                failure: "failure",
                spinnerToggle: "spinner.toggle",
                waiterStart: "waiter.start",
                waiterSuccess: "waiter.success"
            },
            inDebug: appConfig.inDebug,
            remoteServiceRoot: appConfig.remoteServiceRoot,
            urlCacheBusterSuffix: "?v=" + ((appConfig.inDebug) ? Date.now().toString() : appConfig.version),
            version: appConfig.version
        };

        app.value("config", config);

        app.config(["$logProvider", function ($logProvider: ng.ILogProvider) {
            // turn debugging off/on (no info or warn)
            if ($logProvider.debugEnabled) {
                $logProvider.debugEnabled(config.inDebug);
            }
        }]);

        // Copy across config settings to commonConfigProvider to configure the common services
        app.config(["commonConfigProvider", function (commonConfigProvider: commonConfigProvider) {

            // Copy events across from config.events
            commonConfigProvider.config.events = _.extend({}, config.events);
        }]);
    }

    /**
     * Configure the HTTP Provider
     */
    function configureHttpProvider() {

        var serviceId = "urlInterceptor";
        app.factory(serviceId, ["$templateCache", "config", function ($templateCache: ng.ITemplateCacheService, config: config) {

            var service = {
                request: request
            };

            return service;

            function request(requestConfig: ng.IRequestConfig) {

                // For the loading of HTML templates we want the appRoot to be prefixed to the path
                // and we want a suffix to either allow caching or prevent caching 
                // (depending on whether in debug mode or not)
                if (requestConfig.method === "GET" && endsWith(requestConfig.url.toLowerCase(), ".html")) {

                    // If this has already been placed into a primed template cache then we should leave the URL as is
                    // so that the version in templateCache is served.  If we tweak the URL then it will not be found
                    var cachedAlready = $templateCache.get(requestConfig.url);
                    if (!cachedAlready) {
                        requestConfig.url = config.appRoot + requestConfig.url + config.urlCacheBusterSuffix;
                    }
                }

                return requestConfig;
            }

            function endsWith(str: string, suffix: string) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            }
        }]);

        app.config(["$httpProvider", function ($httpProvider: ng.IHttpProvider) {
            $httpProvider.interceptors.push(serviceId);
        }]);
    }

    /**
     * Configure the routes and route resolvers
     */
    function configureRoutes() {

        var routesConfigured = false;
        app.config(["$routeProvider", "routes", function ($routeProvider: ng.route.IRouteProvider, routes: configRoute[]) {

            // Ensure routes are only configured once (unit tests attempt to configure twice)
            if (routesConfigured) { return; }

            routes.forEach(function (r) {
                $routeProvider.when(r.url, r.config);
            });
            $routeProvider.otherwise({ redirectTo: "/" });

            routesConfigured = true;
        }]);

    }

    /**
     * Configure by setting an optional string value for appErrorPrefix.
     * Accessible via config.appErrorPrefix (via config value).
     */
    function decorateExceptionHandler() {

        app.config(["$provide", function ($provide: ng.auto.IProvideService) {

            // Extend the $exceptionHandler service to also display a toast.
            $provide.decorator("$exceptionHandler",
                ["$delegate", "config", "logger", extendExceptionHandler]);

            function extendExceptionHandler($delegate: ng.IExceptionHandlerService, config: config, logger: logger.logger) {
                var appErrorPrefix = config.appErrorPrefix;
                var logError = logger.getLogFn("app", "error");
                return function (exception: Error, cause: string) {
                    $delegate(exception, cause);
                    if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) { return; }

                    var errorData = { exception: exception, cause: cause };
                    var msg = appErrorPrefix + exception.message;
                    logError(msg, errorData, true);
                };
            }
        }]);

    }

    function initialise(bootstrapper: bootstrapper) {

        addThirdPartyLibs(bootstrapper.thirdPartyLibs);

        configureApp(bootstrapper.appConfig);

        decorateExceptionHandler();

        configureRoutes();

        configureHttpProvider();

        // Handle routing errors and success events
        app.run(["$route", function ($route: ng.route.IRouteService) {
            // Include $route to kick start the router.
        }]);
    }

    /**
     * Initialise and then start the application
     * 
     * @param bootstrapper The 3rd party libraries and app config data from the server
     */
    function start(bootstrapper: bootstrapper) {

        // Initialise the app
        initialise(bootstrapper);

        // Start Angular
        angular.element(document).ready(function () {
            angular.bootstrap(document, [appName]);
        });
    }
})();