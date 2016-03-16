'use strict';

(function (angular) {

    var notificationsFunction = function ($mdToast) {
        var toastPosition = 'top right';

        return {
            showNotification: function (notification) {
                $mdToast.show($mdToast.simple().textContent(notification).hideDelay(120000).action('CLOSE').position(toastPosition));
            }
        };
    };

    angular.module('aera-notifications', ['ngMaterial'])
            .service('NotificationService', ['$mdToast', notificationsFunction]);

})(angular);