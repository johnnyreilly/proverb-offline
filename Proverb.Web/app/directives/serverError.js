(function () {
    "use strict";
    var app = angular.module("app");
    // Thanks @Basarat! http://stackoverflow.com/a/24863256/761388
    function safeWatch(expression) {
        return function () {
            try {
                return expression();
            }
            catch (e) {
                return null;
            }
        };
    }
    // Plant a validation message to the right of the element when it is declared invalid by the server
    app.directive("serverError", [function () {
        // Usage:
        // <input class="col-xs-12 col-sm-9" name="sage.name" ng-model="vm.sage.name" server-error="vm.errors" />
        var directive = {
            link: link,
            restrict: "A",
            require: "ngModel" // Make Angular supply the ngModel controller as the 4th parameter in the link function
        };
        return directive;
        function link(scope, element, attrs, ngModelController) {
            // Extract values from attributes (deliberately not using isolated scope because using Angular UI)
            var errorKey = attrs["name"]; // eg "sage.name"
            var errorDictionaryExpression = attrs["serverError"]; // eg "vm.errors"
            // Bootstrap alert template for error
            var template = '<div class="alert alert-danger" role="alert"><i class="glyphicon glyphicon-warning-sign larger"></i> %error%</div>';
            // Create an element to hold the validation message
            var decorator = angular.element('<div></div>');
            element.after(decorator);
            // Watch ngModelController.$error.server & show/hide validation accordingly
            scope.$watch(safeWatch(function () { return ngModelController.$error.server; }), showHideValidation);
            function showHideValidation(serverError) {
                // Display an error if serverError is true otherwise clear the element
                var errorHtml = "";
                if (serverError) {
                    var errorDictionary = scope.$eval(errorDictionaryExpression);
                    errorHtml = template.replace(/%error%/, errorDictionary[errorKey] || "Unknown error occurred...");
                }
                decorator.html(errorHtml);
            }
            // wipe the server error message upon keyup or change events so can revalidate with server 
            element.on("keyup change", function (event) {
                scope.$apply(function () {
                    ngModelController.$setValidity("server", true);
                });
            });
        }
    }]);
    // upon keyup / change events set validity to true - to be used alongside tooltip
    app.directive("serverErrorTooltip", ["$compile", function ($compile) {
        // Usage:
        // <input class="col-xs-12 col-sm-9" name="sage.name" ng-model="vm.sage.name"
        //        server-error-tooltip tooltip="{{vm.errors['sage.name']}}" />
        var directive = {
            link: link,
            restrict: "A",
            require: "ngModel",
        };
        return directive;
        function link(scope, element, attrs, ngModelController) {
            // wipe the server error message upon keyup or change events so can revalidate with server 
            element.on("keyup change", function (event) {
                scope.$apply(function () {
                    ngModelController.$setValidity("server", true);
                });
            });
        }
    }]);
})();
//# sourceMappingURL=serverError.js.map