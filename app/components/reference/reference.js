'use strict';

(function (angular) {

  var referenceControllerFunction = function ($filter) {
    var reference = this;
    var editPageController;

    reference.setEditPageController = function (controller) {
      editPageController = controller;
    };

    reference.updateOutputString = function () {
      reference.outputString = $filter('aera-reference')(reference);
      editPageController.setReference(reference);
    }
  };

  var referenceDirectiveFunction = function () {
    return {
      restrict: 'E',
      templateUrl: 'components/reference/reference.html',
      controller: 'ReferenceController as reference',
      require: '^EditPageController, ReferenceController',
      link: function (element, attrs, scope, controllers) {
        controllers[1].setEditPageController(controllers[2]);
      }
    };
  };

  angular.module('aera-edit-page')
      .controller('ReferenceController', ['$filter', referenceControllerFunction])
      .directive('aeraReference', referenceDirectiveFunction);
})(angular);