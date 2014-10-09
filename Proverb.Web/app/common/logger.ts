module logger {

    "use strict";

    export interface loggerFunction {
        (message: string, data?: Object, showToast?: boolean): void;
    }

    export interface logger {
        getLogFn(moduleId: string, fnName?: string): loggerFunction;
        getLoggers(moduleId: string): loggers;
    }

    export interface loggers {
        info: loggerFunction;
        error: loggerFunction;
        success: loggerFunction;
        warn: loggerFunction;
    }

    interface loggerFunctionWithSource {
        (message: string, data: Object, source: string, showToast: boolean): void;
    }

    interface loggerInternals {
        [fnName: string]: any;
        logError: loggerFunctionWithSource;
        logInfo: loggerFunctionWithSource;
        logSuccess: loggerFunctionWithSource;
        logWarning: loggerFunctionWithSource;
    }

    angular.module("common").factory("logger", ["$log", "toastr", logger]);

    function logger($log: ng.ILogService, toastr: Toastr) {
        var service: logger = {
            getLogFn: getLogFn,
            getLoggers: getLoggers
        };

        var internals: loggerInternals = {
            logError: logError,
            logInfo: logInfo,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function getLogFn(moduleId: string, fnName?: string) {
            fnName = fnName || "info";
            switch (fnName.toLowerCase()) { // convert aliases
                case "success":
                    fnName = "logSuccess"; break;
                case "error":
                    fnName = "logError"; break;
                case "warn":
                    fnName = "logWarning"; break;
                default:
                    fnName = "logInfo"; break;
            }

            var logFn: loggerFunctionWithSource = internals[fnName] || internals.logInfo;
            return function (msg: string, data: Object, showToast: boolean) {

                var displayToast = (showToast === undefined)
                    ? (fnName !== "logInfo") ? true : false
                    : showToast;

                logFn(msg, data, moduleId, displayToast);
            };
        }

        function getLoggers(moduleId: string): loggers {

            return {
                error: getLogFn(moduleId, "error"),
                info: getLogFn(moduleId, "info"),
                success: getLogFn(moduleId, "success"),
                warn: getLogFn(moduleId, "warn")
            }
        }

        function logInfo(message: string, data: Object, source: string, showToast: boolean) {
            logIt(message, data, source, showToast, "info");
        }

        function logWarning(message: string, data: Object, source: string, showToast: boolean) {
            logIt(message, data, source, showToast, "warning");
        }

        function logSuccess(message: string, data: Object, source: string, showToast: boolean) {
            logIt(message, data, source, showToast, "success");
        }

        function logError(message: string, data: Object, source: string, showToast: boolean) {
            logIt(message, data, source, showToast, "error");
        }

        function logIt(message: string, data: Object, source: string, showToast: boolean, logType: string) {

            var logger: ng.ILogCall;
            var toastType: ToastrDisplayMethod;

            if (logType === "error") {
                logger = $log.error;
                toastType = toastr.error;
            } else if (logType === "warning") {
                logger = $log.warn;
                toastType = toastr.warning;
            } else if (logType === "success") {
                logger = $log.log;
                toastType = toastr.success;
            } else {
                logger = $log.debug;
                toastType = toastr.info;
            }

            source = source ? "[" + source + "] " : "";

            // Perform log 
            logger(source, message, data);

            // Show toast if required
            if (showToast) { toastType(message); }
        }
    }
}