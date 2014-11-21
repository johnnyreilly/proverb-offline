(function () {
    "use strict";
    // Define the common module 
    // Contains services:
    //  - common
    //  - logger
    //  - spinner
    var commonModule = angular.module("common", []);
    // Must configure the common service and set its 
    // events via the commonConfigProvider
    commonModule.provider("commonConfig", function () {
        this.config = {};
        this.$get = function () {
            return {
                config: this.config
            };
        };
        return this;
    });
    commonModule.factory("common", ["$q", "$rootScope", "$timeout", "commonConfig", "logger", common]);
    function common($q, $rootScope, $timeout, commonConfigProvider, logger) {
        var throttles = {};
        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            activateController: activateController,
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger,
            textContains: textContains,
            waiter: waiter
        };
        return service;
        function activateController(promises, controllerId, title) {
            var events = commonConfigProvider.config.events;
            var allPromise = $q.all(promises).then(function (eventArgs) {
                var data = {
                    controllerId: controllerId,
                    title: title
                };
                $broadcast(events.controllerActivateSuccess, data);
            }, function (reason) {
                var data = {
                    controllerId: controllerId,
                    showToast: true,
                    failureReason: reason
                };
                $broadcast(events.failure, data);
            });
            return allPromise;
        }
        function $broadcast() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }
        function createSearchThrottle(viewmodel, list, filteredList, filter, delay) {
            // After a delay, search a viewmodel's list using 
            // a filter function, and return a filteredList.
            // custom delay or use default
            delay = +delay || 300;
            // if only vm and list parameters were passed, set others by naming convention 
            if (!filteredList) {
                // assuming list is named sessions, filteredList is filteredSessions
                filteredList = "filtered" + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
                // filter function is named sessionFilter
                filter = list + "Filter"; // function in string form
            }
            // create the filtering function we will call from here
            var filterFn = function () {
                // translates to ...
                // vm.filteredSessions 
                //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
                viewmodel[filteredList] = viewmodel[list].filter(function (item) {
                    return viewmodel[filter](item);
                });
            };
            return (function () {
                // Wrapped in outer IFFE so we can use closure 
                // over filterInputTimeout which references the timeout
                var filterInputTimeout;
                // return what becomes the 'applyFilter' function in the controller
                return function (searchNow) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    }
                    else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }
        function debouncedThrottle(key, callback, delay, immediate) {
            // Perform some action (callback) after a delay. 
            // Track the callback by key, so if the same callback 
            // is issued again, restart the delay.
            var defaultDelay = 1000;
            delay = delay || defaultDelay;
            if (throttles[key]) {
                $timeout.cancel(throttles[key]);
                throttles[key] = undefined;
            }
            if (immediate) {
                callback();
            }
            else {
                throttles[key] = $timeout(callback, delay);
            }
        }
        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }
        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }
        function waiter(promise, controllerId, message) {
            var events = commonConfigProvider.config.events;
            var data = {
                controllerId: controllerId,
                message: message
            };
            $broadcast(events.waiterStart, data);
            return promise.then(function (promiseData) {
                var data = { controllerId: controllerId };
                $broadcast(events.waiterSuccess, data);
                return promiseData;
            }, function (reason) {
                var data = {
                    controllerId: controllerId,
                    showToast: false,
                    failureReason: reason
                };
                $broadcast(events.failure, data);
                // if you "catch" an error via a promise error callback and you want to forward the error to the promise derived from the current promise, you have to "rethrow" the error by returning a rejection constructed via reject. - https://docs.angularjs.org/api/ng/service/$q#reject
                return $q.reject(reason);
            });
        }
    }
})();
//# sourceMappingURL=common.js.map