describe("Proverb.Web -> app-> controllers ->", function () {

    beforeEach(function () {

        module("app");
    });

    describe("sages ->", function () {

        var $rootScope: ng.IRootScopeService,
            $q: ng.IQService,
            common: common,
            datacontext: datacontext,
            getAll_deferred: ng.IDeferred<sage[]>,
            sagesController: controllers.Sages;

        beforeEach(inject(function (
                _$controller_: ng.IControllerService,
                _$rootScope_: ng.IRootScopeService,
                _$q_: ng.IQService,
                _common_: common,
                _datacontext_: datacontext) {

            $rootScope = _$rootScope_;
            $q = _$q_;
            common = _common_;
            datacontext = _datacontext_;

            getAll_deferred = $q.defer();

            spyOn(datacontext.sage, "getAll").and.returnValue(getAll_deferred.promise);
            spyOn(common, "activateController").and.callThrough();
            spyOn(common.logger, "getLoggers").and.returnValue({
                info: jasmine.createSpy("logInfo")
            });

            sagesController = _$controller_("sages", {
                common: common,
                datacontext: datacontext
            });


        }));

        describe("on creation ->", function () {

            it("controller should have a title of 'Sages'", function () {

                expect(sagesController.title).toBe("Sages");
            });

            it("controller should have no sages", function () {

                expect(sagesController.sages.length).toBe(0);
            });

            it("datacontext.sage.getAll should be called", function () {

                expect(datacontext.sage.getAll).toHaveBeenCalled();
            });
        });

        describe("activateController ->", function () {

            var stubSages: sage[];
            beforeEach(function () {
                stubSages = [{ id: 1, name: "John", username: "johnny_reilly", email: "johnny_reilly@hotmail.com", dateOfBirth: null }];
            });

            it("should set sages to be the resolved promise values", function () {

                getAll_deferred.resolve(stubSages);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sagesController.sages).toBe(stubSages);
            });

            it("should log 'Activated Sages View'", function () {

                getAll_deferred.resolve(stubSages);
                $rootScope.$digest(); // So Angular processes the resolved promise

                expect(sagesController.log.info).toHaveBeenCalledWith("Activated Sages View");
            });
        });
    });
});
