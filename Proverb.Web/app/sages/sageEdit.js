var controllers;
(function (controllers) {
    "use strict";
    var controllerId = "sageEdit";
    var SageEdit = (function () {
        function SageEdit($location, $routeParams, $scope, bsDialog, common, datacontext) {
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.$scope = $scope;
            this.bsDialog = bsDialog;
            this.common = common;
            this.datacontext = datacontext;
            this.dateOfBirthDatePickerIsOpen = false;
            this.errors = {};
            this.log = common.logger.getLoggers(controllerId);
            this.sage = undefined;
            this.title = "Sage Edit";
            this._isSavingOrRemoving = false;
            this.activate();
        }
        // Prototype methods
        SageEdit.prototype.activate = function () {
            var _this = this;
            var id = parseInt(this.$routeParams.id, 10);
            var dataPromises = [this.datacontext.sage.getById(id).then(function (sage) { return _this.sage = sage; })];
            this.common.activateController(dataPromises, controllerId, this.title).then(function () {
                _this.log.info("Activated Sage Edit View");
                _this.title = "Sage Edit: " + _this.sage.name;
            });
        };
        SageEdit.prototype.dateOfBirthDatePickerOpen = function () {
            this.dateOfBirthDatePickerIsOpen = true;
        };
        SageEdit.prototype.remove = function () {
            var _this = this;
            var sageToRemove = this.sage.name;
            this.bsDialog.deleteDialog("Do you want to remove " + sageToRemove + "?").then(function () {
                _this._isSavingOrRemoving = true;
                _this.common.waiter(_this.datacontext.sage.remove(_this.sage.id), controllerId, "Removing " + sageToRemove).then(function (response) {
                    _this.log.success("Removed " + sageToRemove);
                    _this.$location.path("/sages");
                }).catch(function (response) {
                    _this.log.error("Failed to remove " + sageToRemove, response);
                }).finally(function () { return _this._isSavingOrRemoving = false; });
            });
        };
        SageEdit.prototype.save = function () {
            var _this = this;
            this.errors = {}; //Wipe server errors
            this._isSavingOrRemoving = true;
            var sageToSave = this.sage.name;
            this.common.waiter(this.datacontext.sage.save(this.sage), controllerId, "Saving " + sageToSave).then(function (response) {
                _this.log.success("Saved " + sageToSave);
                _this.$location.path("/sages/detail/" + _this.sage.id);
            }).catch(function (response) {
                if (response.errors) {
                    angular.forEach(response.errors, function (errors, field) {
                        var model = _this.$scope.form[field];
                        if (model) {
                            model.$setValidity("server", false);
                        }
                        else {
                            // No screen element to tie failure message to so pop a toast
                            _this.log.error(errors);
                        }
                        _this.errors[field] = errors.join(",");
                    });
                }
                else {
                    _this.log.error("Failed to save " + sageToSave, response);
                }
            }).finally(function () { return _this._isSavingOrRemoving = false; });
        };
        Object.defineProperty(SageEdit.prototype, "hasChanges", {
            // Properties
            get: function () {
                return this.$scope.form.$dirty;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SageEdit.prototype, "canSave", {
            get: function () {
                return this.hasChanges && !this.isSavingOrRemoving && this.$scope.form.$valid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SageEdit.prototype, "isSavingOrRemoving", {
            get: function () {
                return this._isSavingOrRemoving;
            },
            enumerable: true,
            configurable: true
        });
        SageEdit.$inject = ["$location", "$routeParams", "$scope", "bootstrap.dialog", "common", "datacontext"];
        return SageEdit;
    })();
    angular.module("app").controller(controllerId, SageEdit);
})(controllers || (controllers = {}));
//# sourceMappingURL=sageEdit.js.map