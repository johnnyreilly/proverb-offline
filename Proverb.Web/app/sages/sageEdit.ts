module controllers {

    "use strict";

    var controllerId = "sageEdit";

    export interface sageEditRouteParams extends ng.route.IRouteParamsService {
        id: string;
    }

    export interface sageEditScope extends ng.IScope {
        form: ng.IFormController;
    }

    export class SageEdit {

        dateOfBirthDatePickerIsOpen: boolean;
        errors: { [field: string]: string };
        log: logger.loggers;
        sage: sage;
        title: string;

        _isSavingOrRemoving: boolean;

        static $inject = ["$location", "$routeParams", "$scope", "bootstrap.dialog", "common", "datacontext"];
        constructor(
            private $location: ng.ILocationService,
            private $routeParams: sageEditRouteParams,
            public  $scope: sageEditScope,
            private bsDialog: bootstrapDialog,
            private common: common,
            private datacontext: datacontext
            ) {

            this.dateOfBirthDatePickerIsOpen = false;
            this.errors = {};
            this.log = common.logger.getLoggers(controllerId);
            this.sage = undefined;
            this.title = "Sage Edit";

            this._isSavingOrRemoving = false;

            this.activate();
        }

        // Prototype methods

        activate() {
            var id = parseInt(this.$routeParams.id, 10);
            var dataPromises: ng.IPromise<any>[] = [this.datacontext.sage.getById(id).then(sage => this.sage = sage)];

            this.common.activateController(dataPromises, controllerId, this.title)
                .then(() => {
                    this.log.info("Activated Sage Edit View");
                    this.title = "Sage Edit: " + this.sage.name;
                });
        }

        dateOfBirthDatePickerOpen() {
            this.dateOfBirthDatePickerIsOpen = true;
        }

        remove() {

            var sageToRemove = this.sage.name;

            this.bsDialog.deleteDialog("Do you want to remove " + sageToRemove + "?")
                .then(() => {

                    this._isSavingOrRemoving = true;

                    this.common.waiter(this.datacontext.sage.remove(this.sage.id), controllerId, "Removing " + sageToRemove)
                        .then(response => {

                            this.log.success("Removed " + sageToRemove);
                            this.$location.path("/sages");
                        })
                        .catch(response => {
                            this.log.error("Failed to remove " + sageToRemove, response);
                        })
                        .finally(() => this._isSavingOrRemoving = false);
                });
        }

        save() {

            this.errors = {}; //Wipe server errors
            this._isSavingOrRemoving = true;

            var sageToSave = this.sage.name;

            this.common.waiter(this.datacontext.sage.save(this.sage), controllerId, "Saving " + sageToSave)
                .then(response => {

                    this.log.success("Saved " + sageToSave);
                    this.$location.path("/sages/detail/" + this.sage.id);
                })
                .catch(response => {

                    if (response.errors) {

                        angular.forEach(response.errors, (errors, field) => {
                            var model: ng.INgModelController = this.$scope.form[field];
                            if (model) {
                                model.$setValidity("server", false);
                            }
                            else {
                                // No screen element to tie failure message to so pop a toast
                                this.log.error(errors);
                            }
                            this.errors[field] = errors.join(",");
                        });
                    }
                    else {
                        this.log.error("Failed to save " + sageToSave, response);
                    }
                })
                .finally(() => this._isSavingOrRemoving = false);
        }

        // Properties

        get hasChanges(): boolean {
            return this.$scope.form.$dirty;
        }

        get canSave(): boolean {
            return this.hasChanges && !this.isSavingOrRemoving && this.$scope.form.$valid;
        }

        get isSavingOrRemoving(): boolean {
            return this._isSavingOrRemoving;
        }
    }

    angular.module("app").controller(controllerId, SageEdit);
}
