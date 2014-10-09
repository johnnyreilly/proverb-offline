var logger;
(function (_logger) {
    "use strict";

    angular.module("common").factory("logger", ["$log", "toastr", logger]);

    function logger($log, toastr) {
        var service = {
            getLogFn: getLogFn,
            getLoggers: getLoggers
        };

        var internals = {
            logError: logError,
            logInfo: logInfo,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function getLogFn(moduleId, fnName) {
            fnName = fnName || "info";
            switch (fnName.toLowerCase()) {
                case "success":
                    fnName = "logSuccess";
                    break;
                case "error":
                    fnName = "logError";
                    break;
                case "warn":
                    fnName = "logWarning";
                    break;
                default:
                    fnName = "logInfo";
                    break;
            }

            var logFn = internals[fnName] || internals.logInfo;
            return function (msg, data, showToast) {
                var displayToast = (showToast === undefined) ? (fnName !== "logInfo") ? true : false : showToast;

                logFn(msg, data, moduleId, displayToast);
            };
        }

        function getLoggers(moduleId) {
            return {
                error: getLogFn(moduleId, "error"),
                info: getLogFn(moduleId, "info"),
                success: getLogFn(moduleId, "success"),
                warn: getLogFn(moduleId, "warn")
            };
        }

        function logInfo(message, data, source, showToast) {
            logIt(message, data, source, showToast, "info");
        }

        function logWarning(message, data, source, showToast) {
            logIt(message, data, source, showToast, "warning");
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, "success");
        }

        function logError(message, data, source, showToast) {
            logIt(message, data, source, showToast, "error");
        }

        function logIt(message, data, source, showToast, logType) {
            var logger;
            var toastType;

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
            if (showToast) {
                toastType(message);
            }
        }
    }
})(logger || (logger = {}));
//# sourceMappingURL=logger.js.map
