(function () {
    "use strict";
    var app = angular.module("app");
    app.directive("waiter", [function () {
        //Usage:
        //<waiter is-waiting="vm.isBusy" spinner-options="vm.spinnerOptions" waitMessage="vm.busyMessage"></waiter>
        var directive = {
            link: link,
            replace: true,
            restrict: "E",
            scope: {
                "isWaiting": "=",
                "spinnerOptions": "=",
                "waitMessage": "="
            },
            templateUrl: "app/directives/waiter.html"
        };
        return directive;
        function link(scope, element, attrs) {
            //attrs.$set("class", "widget-head");
        }
    }]);
})();
//# sourceMappingURL=waiter.js.map