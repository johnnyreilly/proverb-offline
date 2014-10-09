module controllers {

    "use strict";

    var controllerId = "topnav";

    class TopNav {

        isCollapsed: boolean;

        static $inject = ["$scope"];
        constructor(
            private $scope: ng.IScope
            ) {

            // collapse top nav menu when route change starts (only affects mobile)
            $scope.$on("$routeChangeStart", (event, next, current) => {
                this.isCollapsed = true;
            });

            this.activate();
        }

        // Prototype methods

        activate() {
            this.isCollapsed = true;
        }

        toggleCollapsed() {
            return this.isCollapsed = !this.isCollapsed;
        }

        // Instance methods
    }

    angular.module("app").controller(controllerId, TopNav);
}
