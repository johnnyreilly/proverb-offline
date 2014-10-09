angularApp.start({
    thirdPartyLibs: {
        moment: window.moment,
        toastr: window.toastr,
        underscore: window._
    },
    appConfig: {
        appRoot: "/",
        inDebug: true,
        remoteServiceRoot: "/api/",
        version: "Testing"
    }
});
