var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "dashboard";

    var Dashboard = (function () {
        function Dashboard(common, datacontext) {
            this.common = common;
            this.datacontext = datacontext;
            this.sages = [];

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }
        // Prototype methods
        Dashboard.prototype.activate = function () {
            var _this = this;
            var promises = [this.getSages()];
            this.common.activateController(promises, controllerId, "Dashboard").then(function () {
                return _this.log.info("Activated Dashboard View");
            });
        };

        Dashboard.prototype.getSages = function () {
            var _this = this;
            return this.datacontext.sage.getAll().then(function (data) {
                return _this.sages = data;
            });
        };
        Dashboard.$inject = ["common", "datacontext"];
        return Dashboard;
    })();

    angular.module("app").controller(controllerId, Dashboard);
})(controllers || (controllers = {}));
//# sourceMappingURL=dashboard.js.map
