var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "topnav";

    var TopNav = (function () {
        function TopNav($scope) {
            var _this = this;
            this.$scope = $scope;
            // collapse top nav menu when route change starts (only affects mobile)
            $scope.$on("$routeChangeStart", function (event, next, current) {
                _this.isCollapsed = true;
            });

            this.activate();
        }
        // Prototype methods
        TopNav.prototype.activate = function () {
            this.isCollapsed = true;
        };

        TopNav.prototype.toggleCollapsed = function () {
            return this.isCollapsed = !this.isCollapsed;
        };
        TopNav.$inject = ["$scope"];
        return TopNav;
    })();

    angular.module("app").controller(controllerId, TopNav);
})(controllers || (controllers = {}));
//# sourceMappingURL=topnav.js.map
