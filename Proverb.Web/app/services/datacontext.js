(function () {
    "use strict";
    var serviceId = "datacontext";
    angular.module("app").factory(serviceId, ["repositories", datacontext]);
    function datacontext(repositories) {
        var service = {
            // Undefined members will be replaced with properties in defineLazyLoadedRepos
            saying: undefined,
            sage: undefined
        };
        defineLazyLoadedRepos();
        return service;
        /**
         * Replace undefined members on service with ES5 properties for each repo
         */
        function defineLazyLoadedRepos() {
            var repoNames = [];
            for (var key in service) {
                if (service.hasOwnProperty(key) && (service[key] === undefined)) {
                    repoNames.push(key);
                }
            }
            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true,
                    get: function () {
                        // The 1st time the repo is request via this property, 
                        // we ask the repositories for it (which will inject it).
                        var repo = repositories.getRepo(name);
                        // Rewrite this property to always return this repo;
                        // no longer redefinable
                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }
    }
})();
//# sourceMappingURL=datacontext.js.map