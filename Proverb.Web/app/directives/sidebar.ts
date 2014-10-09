(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("sidebar", function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div sidebar>
        // Creates:
        //  <div sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: "A"
        };
        return directive;

        function link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {

            var $sidebarInner = element.find(".sidebar-inner");
            var $dropdownElement = element.find(".sidebar-dropdown a");
            var sideBarIsExpanded = false;
            var sideBarIsExpandedClass = "sideBarIsExpanded";

            element.addClass("sidebar");

            $dropdownElement.click(e => {
                e.preventDefault();

                // Show or hide the sidebar
                if (sideBarIsExpanded) {
                    collapseSidebar();
                } else {
                    expandSidebar();
                }
            });

            // collapse sidebar when route change starts (only affects mobile)
            scope.$on("$routeChangeStart", (event, next, current) => {
                if (sideBarIsExpanded) {
                    collapseSidebar();
                }
            });

            /**
             * Slide up and hide the sidebar (only used when in mobile view mode)
             */
            function collapseSidebar() {

                $sidebarInner.slideUp(350);
                $dropdownElement.removeClass(sideBarIsExpandedClass);
                sideBarIsExpanded = false;
            }

            /**
             * Slide down and show the sidebar (only used when in mobile view mode)
             */
            function expandSidebar() {

                $sidebarInner.slideDown(350);
                $dropdownElement.addClass(sideBarIsExpandedClass);
                sideBarIsExpanded = true;
            }
        }
    });

})(); 