interface common {
    $broadcast: (...args: any[]) => ng.IAngularEvent;
    $q: ng.IQService;
    $timeout: ng.ITimeoutService;

    activateController: (promises: ng.IPromise<any>[], controllerId: string, title: string) => ng.IPromise<void>;
    createSearchThrottle: (viewmodel: { [list: string]: any }, list: string, filteredList: string, filter: string, delay: number) => void;
    debouncedThrottle: (key: string, callback: Function, delay: number, immediate: boolean) => void;
    isNumber: (val: string) => boolean;
    logger: logger.logger;
    textContains: (text: string, searchText: string) => boolean;
    waiter: <T>(promise: ng.IPromise<T>, controllerId: string, message?: string) => ng.IPromise<T>;
}

interface commonConfigProvider {
    config: {
        events: configEvents;
    };
}

interface controllerActivateSuccessData {
    controllerId: string;
    title: string;
}

interface failureData {
    controllerId: string;
    showToast: boolean;
    failureReason: any;
}

interface waiterStartData {
    controllerId: string;
    message: string;
}

interface waiterSuccessData {
    controllerId: string;
}


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
        this.config = {
            // This will be populated in app.ts via the app.config(["commonConfigProvider", function ...
        };

        this.$get = function (): commonConfigProvider {
            return {
                config: this.config
            };
        };

        return this;
    });

    commonModule.factory("common",
        ["$q", "$rootScope", "$timeout", "commonConfig", "logger", common]);

    function common(
        $q: ng.IQService,
        $rootScope: ng.IRootScopeService,
        $timeout: ng.ITimeoutService,
        commonConfigProvider: commonConfigProvider,
        logger: logger.logger) {
        var throttles: { [key: string]: ng.IPromise<any> } = {};

        var service: common = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            activateController: activateController,
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger, // for accessibility
            textContains: textContains,
            waiter: waiter
        };

        return service;

        function activateController(promises: ng.IPromise<any>[], controllerId: string, title: string) {

            var events = commonConfigProvider.config.events;

            var allPromise = $q.all(promises).then(
                (eventArgs) => {
                    var data: controllerActivateSuccessData = {
                        controllerId: controllerId,
                        title: title
                    };
                    $broadcast(events.controllerActivateSuccess, data);
                },
                (reason) => {
                    var data: failureData = {
                        controllerId: controllerId,
                        showToast: true,
                        failureReason: reason
                    };
                    $broadcast(events.failure, data);
                });

            return allPromise;
        }

        function $broadcast(...args: any[]): ng.IAngularEvent {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function createSearchThrottle(viewmodel: { [list: string]: any }, list: string, filteredList: string, filter: string, delay: number) {
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
                viewmodel[filteredList] = viewmodel[list].filter(function(item: any) {
                    return viewmodel[filter](item);
                });
            };

            return (function () {
                // Wrapped in outer IFFE so we can use closure 
                // over filterInputTimeout which references the timeout
                var filterInputTimeout: ng.IPromise<any>;

                // return what becomes the 'applyFilter' function in the controller
                return function(searchNow: boolean) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    } else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }

        function debouncedThrottle(key: string, callback: Function, delay: number, immediate: boolean) {
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
            } else {
                throttles[key] = $timeout(callback, delay);
            }
        }

        function isNumber(val: string) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }

        function textContains(text: string, searchText: string) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        function waiter<T>(promise: ng.IPromise<T>, controllerId: string, message?: string): ng.IPromise<T> {

            var events = commonConfigProvider.config.events;

            var data: waiterStartData = {
                controllerId: controllerId,
                message: message
            };
            $broadcast(events.waiterStart, data);

            return promise.then(
                (promiseData) => {
                    var data: waiterSuccessData = { controllerId: controllerId };
                    $broadcast(events.waiterSuccess, data);

                    return promiseData;
                },
                (reason) => {
                    var data: failureData = {
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