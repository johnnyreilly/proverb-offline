interface saying {
    id: number;
    sageId: number;
    sage?: sage;
    text: string;
}

interface repositorySaying {
    getAll: () => ng.IPromise<saying[]>;
    getById: (id: number, forceRemote?: boolean) => ng.IPromise<saying>;
    remove: (id: number) => ng.IPromise<void>;
    save: (saying: saying) => ng.IPromise<number>;
}

(function () {
    "use strict";

    var serviceId = "repository.saying";
    angular.module("app").factory(serviceId, ["$http", "common", "config", repositorySaying]);

    function repositorySaying($http: ng.IHttpService, common: common, config: config) {

        var $q = common.$q;
        var cache: { [id: number]: saying } = {};
        var log = common.logger.getLogFn(serviceId);
        var rootUrl = config.remoteServiceRoot + "saying";

        var service: repositorySaying = {
            getAll: getAll,
            getById: getById,
            remove: remove,
            save: save
        };

        return service;

        function getAll() {
            return $http.get<saying[]>(rootUrl).then(response => {
                var sayings = response.data;
                log(sayings.length + " Sayings loaded");
                return sayings;
            });
        }

        function getById(id: number, forceRemote?: boolean) {

            var saying: saying;
            if (!forceRemote) {
                saying = cache[id];
                if (saying) {
                    log("Saying [id: " + saying.id + "] loaded from cache");
                    return $q.when(saying);
                }
            }

            return $http.get<saying>(rootUrl + "/" + id).then(response => {
                saying = response.data;
                cache[saying.id] = saying;
                log("Saying [id: " + saying.id + "] loaded");
                return saying;
            });
        }

        function remove(id: number) {

            return $http.delete<void>(rootUrl + "/" + id).then(response => {
                log("Saying [id: " + id + "] removed");

                return response.data;
            }, errorReason => $q.reject(errorReason.data));
        }

        function save(saying: saying) {
            return $http.post<number>(rootUrl, saying).then(response => {
                var sayingId = response.data || saying.id;

                log("Saying [id: " + sayingId + "] saved");

                return sayingId;
            }, errorReason => $q.reject(errorReason.data));
        }
    }
})();