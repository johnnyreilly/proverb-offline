interface datacontext {
    [index: string]: any; // Because of this issue: https://typescript.codeplex.com/discussions/535628
    saying: repositorySaying;
    sage: repositorySage;
}

(function () {
    "use strict";

    var serviceId = "datacontext";
    angular.module("app").factory(serviceId, ["repositories", datacontext]);

    function datacontext(repositories: repositories) {

        var service: datacontext = {
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

            var repoNames: string[] = [];
            for (var key in service) {
                if (service.hasOwnProperty(key) && (service[key] === undefined)) {
                    repoNames.push(key);
                }
            }

            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true, // will redefine this property once
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