'use strict';

(function (angular) {

    var notificationsFunction = function ($mdToast) {
        var toastPosition = 'top right';

        var showToast = function (message) {
            $mdToast.show($mdToast.simple().textContent(message).hideDelay(120000).action('CLOSE').position(toastPosition));
        };

        return {
            showError: function (error) {
                showToast(error);
            },
            showMessage: function (message) {
                showToast(message);
            }
        };
    };

    angular.module('aera-notifications', ['ngMaterial'])
            .service('NotificationService', ['$mdToast', notificationsFunction]);

})(angular);