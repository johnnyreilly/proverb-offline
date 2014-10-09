(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("widgetClose", function () {
        // Usage:
        // <a widget-close></a>
        // Creates:
        // <a widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: "A"
        };
        return directive;

        function link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
            attrs.$set("href", "#");
            attrs.$set("wclose", undefined);
            element.click(close);

            function close(e: Event) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });
})(); 