module controllers {

    "use strict";

    var controllerId = "sageDetail";

    interface sageDetailRouteParams extends ng.route.IRouteParamsService {
        id: string;
    }

    class SageDetail {

        log: logger.loggers;
        sage: sage;
        title: string;

        static $inject = ["$location", "$routeParams", "common", "datacontext"];
        constructor(
            private $location: ng.ILocationService,
            private $routeParams: sageDetailRouteParams,
            private common: common,
            private datacontext: datacontext
            ) {

            this.sage = undefined;
            this.title = "Sage Details";

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }

        // Prototype methods

        activate() {
            var id = parseInt(this.$routeParams.id, 10);
            var dataPromises: ng.IPromise<any>[] = [this.datacontext.sage.getById(id, true).then(data => this.sage = data)];

            this.common.activateController(dataPromises, controllerId, this.title)
                .then(() => {
                    this.log.info("Activated Sage Details View");
                    this.title = "Sage Details: " + this.sage.name;
                });
        }

        gotoEdit() {
            this.$location.path("/sages/edit/" + this.sage.id);
        }
    }

    angular.module("app").controller(controllerId, SageDetail);
}
