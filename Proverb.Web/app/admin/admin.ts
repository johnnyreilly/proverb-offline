interface adminVm {
    title: string;
}

(function () {
    "use strict";
    var controllerId = "admin";
    angular.module("app").controller(controllerId, ["common", admin]);

    function admin(common: common) {
        var log = common.logger.getLoggers(controllerId);

        var vm: adminVm = this;
        vm.title = "Admin";

        activate();

        function activate() {
            common.activateController([], controllerId, vm.title)
                .then(function () { log.info("Activated Admin View"); });
        }
    }
})();