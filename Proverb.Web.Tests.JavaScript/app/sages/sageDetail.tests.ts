describe("Proverb.Web -> app-> controllers ->", function () {

    beforeEach(function () {

        module("app");
    });

    describe("sageDetail ->", function () {

        var $rootScope: ng.IRootScopeService,
            $q: ng.IQService,
            getById_deferred: ng.IDeferred<sage>, // deferred used for promises
            $location: ng.ILocationService,
            $routeParams_stub: controllers.sageDetailRouteParams,
            common: common,
            datacontext: datacontext, // controller dependencies
            sageDetailController: controllers.SageDetail; // the controller

        beforeEach(inject(function (
                _$controller_: ng.IControllerService,
                _$location_: ng.ILocationService,
                _$rootScope_: ng.IRootScopeService,
                _$q_: ng.IQService,
                _common_: common,
                _datacontext_: datacontext) {

            $rootScope = _$rootScope_;
            $q = _$q_;

            $location = _$location_;
            common = _common_;
            datacontext = _datacontext_;

            $routeParams_stub = { id: "10" };
            getById_deferred = $q.defer();

            spyOn(datacontext.sage, "getById").and.returnValue(getById_deferred.promise);
            spyOn(common, "activateController").and.callThrough();
            spyOn(common.logger, "getLoggers").and.returnValue({
                info: jasmine.createSpy("logInfo")
            });
            spyOn($location, "path")/*.and.returnValue(jasmine.createSpy("path"))*/;

            sageDetailController = _$controller_("sageDetail", {
                $location: $location,
                $routeParams: $routeParams_stub,
                common: common,
                datacontext: datacontext
            });


        }));

        describe("on creation ->", function () {

            it("controller should have a title of 'Sage Details'", function () {

                expect(sageDetailController.title).toBe("Sage Details");
            });

            it("controller should have no sage", function () {

                expect(sageDetailController.sage).toBeUndefined();
            });

            it("datacontext.sage.getById should be called", function () {

                expect(datacontext.sage.getById).toHaveBeenCalledWith(10, true);
            });
        });

        describe("activateController ->", function () {

            var sage_stub: sage;
            beforeEach(function () {
                sage_stub = { id: 1, name: "John", username: "john", email: "johnny_reilly@hotmail.com", dateOfBirth: null };
            });

            it("should set sage to be the resolved promise values", function () {

                getById_deferred.resolve(sage_stub);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sageDetailController.sage).toBe(sage_stub);
            });

            it("should log 'Activated Sage Details View' and set title with name", function () {

                getById_deferred.resolve(sage_stub);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sageDetailController.log.info).toHaveBeenCalledWith("Activated Sage Details View");
                expect(sageDetailController.title).toBe("Sage Details: " + sage_stub.name);
            });
        });

        describe("gotoEdit ->", function () {

            var sage_stub: sage;
            beforeEach(function () {
                sage_stub = { id: 1, name: "John", username: "john", email: "johnny_reilly@hotmail.com", dateOfBirth: null };
            });

            it("should set $location.path to edit URL with the sage id", function () {

                sageDetailController.sage = sage_stub;

                sageDetailController.gotoEdit();

                expect($location.path).toHaveBeenCalledWith("/sages/edit/" + sage_stub.id);
            });
        });
    });
});
