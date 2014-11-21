(function () {
    "use strict";
    var serviceId = "repository.saying";
    angular.module("app").factory(serviceId, ["$http", "common", "config", repositorySaying]);
    function repositorySaying($http, common, config) {
        var $q = common.$q;
        var cache = {};
        var log = common.logger.getLogFn(serviceId);
        var rootUrl = config.remoteServiceRoot + "saying";
        var service = {
            getAll: getAll,
            getById: getById,
            remove: remove,
            save: save
        };
        return service;
        function getAll() {
            return $http.get(rootUrl).then(function (response) {
                var sayings = response.data;
                log(sayings.length + " Sayings loaded");
                return sayings;
            });
        }
        function getById(id, forceRemote) {
            var saying;
            if (!forceRemote) {
                saying = cache[id];
                if (saying) {
                    log("Saying [id: " + saying.id + "] loaded from cache");
                    return $q.when(saying);
                }
            }
            return $http.get(rootUrl + "/" + id).then(function (response) {
                saying = response.data;
                cache[saying.id] = saying;
                log("Saying [id: " + saying.id + "] loaded");
                return saying;
            });
        }
        function remove(id) {
            return $http.delete(rootUrl + "/" + id).then(function (response) {
                log("Saying [id: " + id + "] removed");
                return response.data;
            }, function (errorReason) { return $q.reject(errorReason.data); });
        }
        function save(saying) {
            return $http.post(rootUrl, saying).then(function (response) {
                var sayingId = response.data || saying.id;
                log("Saying [id: " + sayingId + "] saved");
                return sayingId;
            }, function (errorReason) { return $q.reject(errorReason.data); });
        }
    }
})();
//# sourceMappingURL=repository.saying.js.map