module controllers {

    "use strict";

    var controllerId = "shell";

    interface shellRootScope extends ng.IRootScopeService {
        title: string;
    }

    interface spinnerToggleEvent extends ng.IAngularEvent {
        show: boolean;
    }

    class Shell {

        busyMessage: string;
        isBusy: boolean;
        log: logger.loggers;
        spinnerOptions: SpinnerOptions;
        urlSidebar: string;
        urlTopNav: string;

        static $inject = ["$rootScope", "common", "config"];
        constructor(
            private $rootScope: shellRootScope,
            private common: common,
            private config: config
            ) {

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

        activate() {
            this.common.activateController([], controllerId, "Loading....")
                .then(() => {
                    this.log.success("Proverb v" + this.config.version + " loaded!", null, true);
                });
        }

        wireUpEventListeners() {

            var events = this.config.events;

            this.$rootScope.$on("$routeChangeStart",
                (event, next, current) => {
                    this.busyMessage = "Please wait ...";
                    this.toggleSpinner(true);
                });

            this.$rootScope.$on(events.controllerActivateSuccess,
                (event: ng.IAngularEvent, data: controllerActivateSuccessData) => {
                    // Deactivate spinner as long as the controller that has been activated is not the shell
                    if (data.controllerId !== controllerId) {
                        this.toggleSpinner(false);
                    }
                    this.$rootScope.title = "Proverb - " + data.title;
                });

            this.$rootScope.$on(events.failure,
                (event: ng.IAngularEvent, data: failureData) => {
                    this.toggleSpinner(false);

                    var message = this.config.inDebug
                        ? JSON.stringify(data.failureReason) // If in debug mode then let's have the full error
                        : "There was a problem with " + data.controllerId + ". Please contact support.";
                    this.log.error(message, data.failureReason, data.showToast);
                });

            this.$rootScope.$on(events.spinnerToggle,
                (event: ng.IAngularEvent, data: spinnerToggleEvent) => {
                    this.toggleSpinner(data.show);
                });

            this.$rootScope.$on(events.waiterStart,
                (event: ng.IAngularEvent, data: waiterStartData) => {
                    this.busyMessage = data.message;
                    this.toggleSpinner(true);
                });

            this.$rootScope.$on(events.waiterSuccess,
                (event: ng.IAngularEvent, data: controllerActivateSuccessData) => {
                    this.toggleSpinner(false);
                });
        }

        toggleSpinner(onOrOff: boolean) {
            this.isBusy = onOrOff;
        }
    }

    angular.module("app").controller(controllerId, Shell);
}
