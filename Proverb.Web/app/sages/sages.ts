module controllers {

    "use strict";

    var controllerId = "sages";

    export class Sages {

        log: logger.loggers;
        sages: sage[];
        title: string;

        static $inject = ["common", "datacontext"];
        constructor(
            private common: common,
            private datacontext: datacontext
            ) {

            this.sages = [];
            this.title = "Sages";

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }

        // Prototype methods

        activate() {
            this.common.activateController([this.getSages()], controllerId, this.title)
                .then(() => this.log.info("Activated Sages View"));
        }

        getSages() {
            return this.datacontext.sage.getAll().then(data => this.sages = data);
        }
    }

    angular.module("app").controller(controllerId, Sages);
}
