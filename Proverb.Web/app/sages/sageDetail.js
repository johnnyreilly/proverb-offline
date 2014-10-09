var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "sageDetail";

    var SageDetail = (function () {
        function SageDetail($location, $routeParams, common, datacontext) {
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.common = common;
            this.datacontext = datacontext;
            this.sage = undefined;
            this.title = "Sage Details";

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }
        // Prototype methods
        SageDetail.prototype.activate = function () {
            var _this = this;
            var id = parseInt(this.$routeParams.id, 10);
            var dataPromises = [this.datacontext.sage.getById(id, true).then(function (data) {
                    return _this.sage = data;
                })];

            this.common.activateController(dataPromises, controllerId, this.title).then(function () {
                _this.log.info("Activated Sage Details View");
                _this.title = "Sage Details: " + _this.sage.name;
            });
        };

        SageDetail.prototype.gotoEdit = function () {
            this.$location.path("/sages/edit/" + this.sage.id);
        };
        SageDetail.$inject = ["$location", "$routeParams", "common", "datacontext"];
        return SageDetail;
    })();

    angular.module("app").controller(controllerId, SageDetail);
})(controllers || (controllers = {}));
//# sourceMappingURL=sageDetail.js.map
