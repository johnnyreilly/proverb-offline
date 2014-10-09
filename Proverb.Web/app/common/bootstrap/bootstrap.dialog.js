(function () {
    "use strict";

    var bootstrapModule = angular.module("common.bootstrap", ["ui.bootstrap"]);

    bootstrapModule.factory("bootstrap.dialog", ["$modal", "$templateCache", modalDialog]);

    function modalDialog($modal, $templateCache) {
        var service = {
            deleteDialog: deleteDialog,
            confirmationDialog: confirmationDialog
        };

        /*
        $templateCache.put("modalDialog.tpl.html",
        '<div>' +
        '    <div class="modal-header">' +
        '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
        '        <h3>{{title}}</h3>' +
        '    </div>' +
        '    <div class="modal-body">' +
        '        <p>{{message}}</p>' +
        '    </div>' +
        '    <div class="modal-footer">' +
        '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
        '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
        '    </div>' +
        '</div>');
        */
        return service;

        function deleteDialog(message) {
            if (typeof message === "undefined") { message = "Delete item?"; }
            var title = "Confirm";
            return confirmationDialog(title, message);
        }

        function confirmationDialog(title, msg, okText, cancelText) {
            var modalOptions = {
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                },
                templateUrl: "app/common/bootstrap/bootstrap.dialog.html"
            };

            return $modal.open(modalOptions).result;
        }
    }

    var ModalInstance = [
        "$scope", "$modalInstance", "options",
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || "Title";
            $scope.message = options.message || "";
            $scope.okText = options.okText || "OK";
            $scope.cancelText = options.cancelText || "Cancel";
            $scope.ok = function () {
                $modalInstance.close("ok");
            };
            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
            };
        }];
})();
//# sourceMappingURL=bootstrap.dialog.js.map
