'use strict';

(function (angular) {

  var notificationsFunction = function () {
    return {
      addError: function (error) {
        console.log(error);
      },
      addInformation: function (information) {
        console.log(information);
      }
    };
  };

  angular.module('aera-notifications', [])
      .service('NotificationService', [notificationsFunction]);

})(angular);