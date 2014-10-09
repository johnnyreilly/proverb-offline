(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("spinner", [
        "$window", function ($window) {
            // Description:
            //  Creates a new Spinner and sets its options
            // Usage:
            //  <div spinner="vm.spinnerOptions"></div>
            var directive = {
                link: link,
                restrict: "A"
            };
            return directive;

            function link(scope, element, attrs) {
                scope.spinner = null;
                scope.$watch(attrs.spinner, function (options) {
                    if (scope.spinner) {
                        scope.spinner.stop();
                    }
                    scope.spinner = new $window.Spinner(options);
                    scope.spinner.spin(element[0]);
                }, true);
            }
        }]);
})();
//# sourceMappingURL=spinner.js.map
