var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "shell";

    var Shell = (function () {
        function Shell($rootScope, common, config) {
            this.$rootScope = $rootScope;
            this.common = common;
            this.config = config;
            this.log = common.logger.getLoggers(controllerId);
            this.busyMessage = "Please wait ...";
            this.isBusy = true;
            this.spinnerOptions = {
                radius: 40,
                lines: 7,
                length: 0,
                width: 30,
                speed: 1.7,
                corners: 1.0,
                trail: 100,
                color: "#F58A00"
            };
            this.urlSidebar = "app/layout/sidebar.html";
            this.urlTopNav = "app/layout/topnav.html";

            this.wireUpEventListeners();
            this.activate();
        }
        // Prototype methods
        Shell.prototype.activate = function () {
            var _this = this;
            this.common.activateController([], controllerId, "Loading....").then(function () {
                _this.log.success("Proverb v" + _this.config.version + " loaded!", null, true);
            });
        };

        Shell.prototype.wireUpEventListeners = function () {
            var _this = this;
            var events = this.config.events;

            this.$rootScope.$on("$routeChangeStart", function (event, next, current) {
                _this.busyMessage = "Please wait ...";
                _this.toggleSpinner(true);
            });

            this.$rootScope.$on(events.controllerActivateSuccess, function (event, data) {
                // Deactivate spinner as long as the controller that has been activated is not the shell
                if (data.controllerId !== controllerId) {
                    _this.toggleSpinner(false);
                }
                _this.$rootScope.title = "Proverb - " + data.title;
            });

            this.$rootScope.$on(events.failure, function (event, data) {
                _this.toggleSpinner(false);

                var message = _this.config.inDebug ? JSON.stringify(data.failureReason) : "There was a problem with " + data.controllerId + ". Please contact support.";
                _this.log.error(message, data.failureReason, data.showToast);
            });

            this.$rootScope.$on(events.spinnerToggle, function (event, data) {
                _this.toggleSpinner(data.show);
            });

            this.$rootScope.$on(events.waiterStart, function (event, data) {
                _this.busyMessage = data.message;
                _this.toggleSpinner(true);
            });

            this.$rootScope.$on(events.waiterSuccess, function (event, data) {
                _this.toggleSpinner(false);
            });
        };

        Shell.prototype.toggleSpinner = function (onOrOff) {
            this.isBusy = onOrOff;
        };
        Shell.$inject = ["$rootScope", "common", "config"];
        return Shell;
    })();

    angular.module("app").controller(controllerId, Shell);
})(controllers || (controllers = {}));
//# sourceMappingURL=shell.js.map
