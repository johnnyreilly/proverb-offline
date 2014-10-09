var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "about";

    var About = (function () {
        function About(common, config) {
            this.common = common;
            this.config = config;
            this.version = config.version;

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }
        // Prototype methods
        About.prototype.activate = function () {
            var _this = this;
            this.common.activateController([], controllerId, "About").then(function () {
                return _this.log.info("Activated About View");
            });
        };
        About.$inject = ["common", "config"];
        return About;
    })();

    angular.module("app").controller(controllerId, About);
})(controllers || (controllers = {}));
//# sourceMappingURL=about.js.map
