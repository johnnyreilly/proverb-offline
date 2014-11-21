(function () {
    "use strict";
    var app = angular.module("app");
    // Collect the routes
    app.constant("routes", getRoutes());
    // Define the routes 
    function getRoutes() {
        return [
            {
                url: "/",
                config: {
                    templateUrl: "app/dashboard/dashboard.html",
                    title: "Dashboard",
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: "/sages",
                config: {
                    title: "Sages",
                    templateUrl: "app/sages/sages.html",
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-users"></i> Sages'
                    }
                }
            },
            {
                url: "/sages/detail/:id",
                config: {
                    title: "sage details",
                    templateUrl: "app/sages/sageDetail.html",
                    settings: {}
                }
            },
            {
                url: "/sages/edit/:id",
                config: {
                    title: "Sage Edit",
                    templateUrl: "app/sages/sageEdit.html",
                    settings: {}
                }
            },
            {
                url: "/sayings/",
                config: {
                    title: "Sayings",
                    templateUrl: "app/sayings/sayings.html",
                    reloadOnSearch: false,
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-comment"></i> Sayings'
                    }
                }
            },
            {
                url: "/sayings/edit/:id",
                config: {
                    title: "Sage Edit",
                    templateUrl: "app/sayings/sayingEdit.html",
                    settings: {}
                }
            },
            {
                url: "/about/",
                config: {
                    title: "About",
                    templateUrl: "app/about/about.html",
                    settings: {}
                }
            }
        ];
    }
})();
//# sourceMappingURL=config.route.js.map