'use strict';

(function (angular) {

  var datasetControllerFunction = function (DatasetService) {
    this.download = function () {
      DatasetService.downloadDataset(12345);
    };
  };

  var datasetDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      template: '<h2>Test Title</h2>',
      controller: 'DatasetController as dataset'
    }
  };

  angular.module('aera-dataset', [])
      .controller('DatasetController', ['DatasetService', datasetControllerFunction])
      .directive('aeraDataset', datasetDirectiveFunction);


})(angular);