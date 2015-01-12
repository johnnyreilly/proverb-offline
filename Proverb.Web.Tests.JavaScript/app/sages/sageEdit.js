describe("Proverb.Web -> app-> controllers ->", function () {

    beforeEach(function () {

        module("app");
    });

    describe("sageEdit ->", function () {

        var $rootScope,
            getById_deferred, // deferred used for promises
            $location, $scope, $routeParams_stub, common, datacontext, // controller dependencies
            $controller, sageEditController; // the controller

        beforeEach(inject(function (_$controller_, _$location_, _$rootScope_, _$q_, _common_, _datacontext_) {

            $rootScope = _$rootScope_;
            $q = _$q_;

            $controller = _$controller_;
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
        }));

        /**
         * Construct a new controller
         */
        function makeController() {
            return $controller("sageEdit", {
                $location: $location,
                $scope: $scope,
                $routeParams: $routeParams_stub,
                common: common,
                datacontext: datacontext
            });
        }

        describe("on creation ->", function () {

            beforeEach(function () {

                sageEditController = makeController();
            });

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

                sageEditController = makeController();
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

        describe("save ->", function () {
        
            var sage_stub, save_deferred;
            beforeEach(function () {
                sage_stub = { id: 20, name: "John" };

                save_deferred = $q.defer();

                spyOn(datacontext.sage, "save").and.returnValue(save_deferred.promise);
                spyOn(common, "waiter").and.callThrough();
                spyOn($location, "path");

                sageEditController = makeController();
                sageEditController.sage = sage_stub;
            });

            it("_isSavingOrRemoving should be set true", function () {

                expect(sageEditController._isSavingOrRemoving).toBe(false);
                sageEditController.save();
                expect(sageEditController._isSavingOrRemoving).toBe(true);
            });

            it("serverErrors should be wiped", function () {

                sageEditController.errors = { "errors": "aplenty" };
                sageEditController.save();
                expect(sageEditController.errors).toEqual({});
            });

            it("datacontext.sage.save should be called", function () {

                sageEditController.save();
                expect(datacontext.sage.save).toHaveBeenCalledWith(sage_stub);
            });

            it("common.waiter should be called", function () {

                sageEditController.save();
                expect(common.waiter).toHaveBeenCalledWith(save_deferred.promise, "sageEdit", "Saving " + sage_stub.name);
            });

            xit("should set $location.path to edit URL with the sage id", function () {
        
                sageEditController.sage = sage_stub;
        
                sageEditController.save();
        
                expect($location.path).toHaveBeenCalledWith("/sages/detail/" + sage_stub.id);
            });
        });
    });
});
