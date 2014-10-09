(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("widgetHeader", [function() {
        //Usage:
        //<div widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            restrict: "A",
            scope: {
                "title": "@",
                "subtitle": "@",
                "rightText": "@",
                "allowCollapse": "@"
            },
            templateUrl: "app/directives/widgetHeader.html"
        };
        return directive;

        function link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
            attrs.$set("class", "widget-head");
        }
    }]);
})();