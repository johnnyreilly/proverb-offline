(function () {
    "use strict";

    var app = angular.module("app");

    app.directive("imgPerson", [
        "config", function (config) {
            //Usage:
            //<img img-person="{{s.speaker.imageSource}}"/>
            var basePath = config.imageSettings.imageBasePath;
            var unknownImage = config.imageSettings.unknownPersonImageSource;
            var directive = {
                link: link,
                restrict: "A"
            };
            return directive;

            function link(scope, element, attrs) {
                attrs.$observe("ccImgPerson", function (value) {
                    value = basePath + (value || unknownImage);
                    attrs.$set("src", value);
                });
            }
        }]);
})();
//# sourceMappingURL=imgPerson.js.map
