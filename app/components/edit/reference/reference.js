'use strict';

(function (angular) {

  var referenceControllerFunction = function ($filter) {
    var reference = this;

    reference.updateOutputString = function () {
      reference.outputString = $filter('aera-reference')(reference);
    }
  };

  var referenceDirectiveFunction = function () {
    return {
      restrict: 'E',
      templateUrl: 'components/edit/reference/reference.html',
      controller: 'ReferenceController as reference'
    };
  };

  angular.module('aera-edit')
      .controller('ReferenceController', ['$filter', referenceControllerFunction])
      .directive('aeraReference', referenceDirectiveFunction);
})(angular);