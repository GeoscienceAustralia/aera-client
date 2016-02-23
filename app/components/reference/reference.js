'use strict';

(function (angular) {

  var referenceControllerFunction = function ($filter) {
    var ctrl = this;
    var editPageController;

    ctrl.setEditPageController = function (controller) {
      editPageController = controller;
    };

    ctrl.updateOutputString = function () {
      ctrl.outputString = $filter('aera-reference')(ctrl.reference);
      editPageController.setReference(ctrl.reference);
    }
  };

  var referenceDirectiveFunction = function () {
    return {
      restrict: 'E',
      templateUrl: 'components/reference/reference.html',
      controller: 'ReferenceController as reference',
      require: ['^aeraEditPage', 'aeraReference'],
      link: function (element, attrs, scope, controllers) {
        controllers[1].setEditPageController(controllers[0]);
      }
    };
  };

  angular.module('aera-edit-page')
      .controller('ReferenceController', ['$filter', referenceControllerFunction])
      .directive('aeraReference', referenceDirectiveFunction);
})(angular);