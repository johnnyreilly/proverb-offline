describe("Proverb.Web -> app-> controllers ->", function () {

    beforeEach(function () {

        module("app");
    });

    describe("sageEdit ->", function () {

        var $rootScope,
            getById_deferred, // deferred used for promises
            $location, $scope, $routeParams_stub, common, datacontext, // controller dependencies
            sageEditController; // the controller

        beforeEach(inject(function (_$controller_, _$location_, _$rootScope_, _$q_, _common_, _datacontext_) {

            $rootScope = _$rootScope_;
            $q = _$q_;

            $location = _$location_;
            $scope = $rootScope.$new();
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

            sageEditController = _$controller_("sageEdit", {
                $location: $location,
                $scope: $scope,
                $routeParams: $routeParams_stub,
                common: common,
                datacontext: datacontext
            });
        }));

        describe("on creation ->", function () {

            it("controller should have a title of 'Sage Edit'", function () {

                expect(sageEditController.title).toBe("Sage Edit");
            });

            it("controller should have no sage", function () {

                expect(sageEditController.sage).toBeUndefined();
            });

            it("datacontext.sage.getById should be called", function () {

                expect(datacontext.sage.getById).toHaveBeenCalledWith(10);
            });
        });

        describe("activateController ->", function () {

            var sage_stub;
            beforeEach(function () {
                sage_stub = { name: "John" };
            });

            it("should set sage to be the resolved promise values", function () {

                getById_deferred.resolve(sage_stub);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sageEditController.sage).toBe(sage_stub);
            });

            it("should log 'Activated Sage Edit View' and set title with name", function () {

                getById_deferred.resolve(sage_stub);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sageEditController.log.info).toHaveBeenCalledWith("Activated Sage Edit View");
                expect(sageEditController.title).toBe("Sage Edit: " + sage_stub.name);
            });
        });

        //describe("gotoEdit ->", function () {
        //
        //    var sage_stub;
        //    beforeEach(function () {
        //        sage_stub = { id: 20 };
        //    });
        //
        //    it("should set $location.path to edit URL with the sage id", function () {
        //
        //        sageEditController.sage = sage_stub;
        //
        //        sageEditController.gotoEdit();
        //
        //        expect($location.path).toHaveBeenCalledWith("/sages/edit/" + sage_stub.id);
        //    });
        //});
    });
});
