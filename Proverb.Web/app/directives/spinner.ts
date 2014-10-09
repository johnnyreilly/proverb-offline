interface spinnerWindowService extends ng.IWindowService {
    Spinner: typeof Spinner;
}

interface spinnerScope extends ng.IScope {
    spinner: Spinner;
}

interface spinnerAttributes extends ng.IAttributes {
    spinner: any;
}

(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("spinner", ["$window", function ($window: spinnerWindowService) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: "A"
        };
        return directive;

        function link(scope: spinnerScope, element: ng.IAugmentedJQuery, attrs: spinnerAttributes) {
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