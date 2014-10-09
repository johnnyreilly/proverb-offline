module controllers {

    "use strict";

    var controllerId = "about";

    class About {

        log: logger.loggers;
        version: string;

        static $inject = ["common", "config"];
        constructor(
            private common: common,
            private config: config
            ) {

            this.version = config.version;

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }

        // Prototype methods

        activate() {
            this.common.activateController([], controllerId, "About")
                .then(() => this.log.info("Activated About View"));
        }
    }

    angular.module("app").controller(controllerId, About);
}