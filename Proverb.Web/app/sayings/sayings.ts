module controllers {

    "use strict";

    var controllerId = "sayings";

    export class Sayings {

        log: logger.loggers;
        sageDictionary: { [id: string]: sage };
        sages: sage[];
        sayings: saying[];
        selectedSage: sage;
        title: string;

        static $inject = ["$location", "common", "datacontext"];
        constructor(
            private $location: ng.ILocationService,
            private common: common,
            private datacontext: datacontext
            ) {

            this.sageDictionary = {};
            this.sages = [];
            this.sayings = [];
            this.selectedSage = undefined;
            this.title = "Sayings";

            this.log = common.logger.getLoggers(controllerId);

            this.activate();
        }

        // Prototype methods

        activate() {

            var dataPromises: ng.IPromise<any>[] = [this.getProverbs(), this.getSages()];
            var combinerPromise = this.common.$q.all(dataPromises).then(() => this.combineData());

            this.common.activateController([combinerPromise], controllerId, this.title)
                .then(() => this.log.info("Activated Sayings View"));
        }

        combineData() {

            // Populate dictionary with sages
            this.sages.forEach(sage => this.sageDictionary[sage.id.toString()] = sage);

            // Set the sage on each saying using the sage dictionary
            this.sayings.forEach(saying => saying.sage = this.sageDictionary[saying.sageId.toString()]);

            var search = this.$location.search()
            if (search.sageId) {
                this.selectedSage = this.sageDictionary[search.sageId];
            }
        }

        getProverbs() {
            return this.datacontext.saying.getAll().then(data => this.sayings = data);
        }

        getSages() {
            return this.datacontext.sage.getAll().then(data => this.sages = data);
        }

        gotoAdd() {
            this.$location.path("/sayings/edit/add");
        }

        selectedSageChange() {
            this.$location.search("sageId", this.selectedSage.id);
        }

        // Instance methods

        bySelectedSage = (saying: saying) => {
            if (!this.selectedSage) { return true; }
            return saying.sage === this.selectedSage
        }
    }

    angular.module("app").controller(controllerId, Sayings);
}
