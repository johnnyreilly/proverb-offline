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

        function link(scope, element, attrs) {
            attrs.$set("href", "#");
            attrs.$set("wclose", undefined);
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });
})();
//# sourceMappingURL=widgetClose.js.map
