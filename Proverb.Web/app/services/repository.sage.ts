interface sage {
    id: number;
    name: string;
    username: string;
    email: string;
    dateOfBirth: Date;
    sayings?: saying[];
}

interface repositorySage {
    getAll: () => ng.IPromise<sage[]>;
    getById: (id: number, forceRemote?: boolean) => ng.IPromise<sage>;
    remove: (id: number) => ng.IPromise<void>;
    save: (sage: sage) => ng.IPromise<void>;
}

(function () {
    "use strict";

    var serviceId = "repository.sage";
    angular.module("app").factory(serviceId, ["$http", "common", "config", repositorySage]);

    function repositorySage($http: ng.IHttpService, common: common, config: config) {

        var $q = common.$q;
        var log = common.logger.getLogFn(serviceId);
        var rootUrl = config.remoteServiceRoot + "sage";
        var cache: { [id: number]: sage } = {};

        var service: repositorySage = {
            getAll: getAll,
            getById: getById,
            remove: remove,
            save: save
        };

        return service;

        function getAll() {
            return $http.get<sage[]>(rootUrl).then(response => {
                var sages = response.data;
                log(sages.length + " Sages loaded");
                return sages;
            });
        }

        function getById(id: number, forceRemote?: boolean) {

            var sage: sage;
            if (!forceRemote) {
                sage = cache[id];
                if (sage) {
                    log("Sage " + sage.name + " [id: " + sage.id + "] loaded from cache");
                    return $q.when(sage);
                }
            }

            return $http.get<sage>(rootUrl + "/" + id).then(response => {
                sage = response.data;
                cache[sage.id] = sage;
                log("Sage " + sage.name + " [id: " + sage.id + "] loaded");
                return sage;
            });
        }

        function remove(id: number) {

            return $http.delete<void>(rootUrl + "/" + id).then(response => {
                log("Sage [id: " + id + "] removed");

                return response.data;
            }, errorReason => $q.reject(errorReason.data));
        }

        function save(sage: sage) {
            return $http.post<void>(rootUrl, sage).then(response => {
                log("Sage " + sage.name + " [id: " + sage.id + "] saved");

                return response.data;
            }, errorReason => $q.reject(errorReason.data));
        }
    }
})();
