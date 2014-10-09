var controllers;
(function (controllers) {
    "use strict";

    var controllerId = "sayings";

    var Sayings = (function () {
        function Sayings($location, common, datacontext) {
            var _this = this;
            this.$location = $location;
            this.common = common;
            this.datacontext = datacontext;
            // Instance methods
            this.bySelectedSage = function (saying) {
                if (!_this.selectedSage) {
                    return true;
                }
                return saying.sage === _this.selectedSage;
            };
            this.sageDictionary = {};
            this.sages = [];
            this.sayings = [];
            this.selectedSage = undefined;
            this.title = "Sayings";

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }
        // Prototype methods
        Sayings.prototype.activate = function () {
            var _this = this;
            var dataPromises = [this.getProverbs(), this.getSages()];
            var combinerPromise = this.common.$q.all(dataPromises).then(function () {
                return _this.combineData();
            });

            this.common.activateController([combinerPromise], controllerId, this.title).then(function () {
                return _this.log.info("Activated Sayings View");
            });
        };

        Sayings.prototype.combineData = function () {
            var _this = this;
            // Populate dictionary with sages
            this.sages.forEach(function (sage) {
                return _this.sageDictionary[sage.id.toString()] = sage;
            });

            // Set the sage on each saying using the sage dictionary
            this.sayings.forEach(function (saying) {
                return saying.sage = _this.sageDictionary[saying.sageId.toString()];
            });

            var search = this.$location.search();
            if (search.sageId) {
                this.selectedSage = this.sageDictionary[search.sageId];
            }
        };

        Sayings.prototype.getProverbs = function () {
            var _this = this;
            return this.datacontext.saying.getAll().then(function (data) {
                return _this.sayings = data;
            });
        };

        Sayings.prototype.getSages = function () {
            var _this = this;
            return this.datacontext.sage.getAll().then(function (data) {
                return _this.sages = data;
            });
        };

        Sayings.prototype.gotoAdd = function () {
            this.$location.path("/sayings/edit/add");
        };

        Sayings.prototype.selectedSageChange = function () {
            this.$location.search("sageId", this.selectedSage.id);
        };
        Sayings.$inject = ["$location", "common", "datacontext"];
        return Sayings;
    })();

    angular.module("app").controller(controllerId, Sayings);
})(controllers || (controllers = {}));
//# sourceMappingURL=sayings.js.map
