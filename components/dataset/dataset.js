'use strict';

(function (angular) {

  var datasetControllerFunction = function (DatasetService, dataset) {

    angular.extend(this, dataset);

    this.download = function () {
      DatasetService.downloadDataset(12345);
    };
  };

  var datasetDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/dataset/dataset.html',
      controller: 'DatasetController as dataset'
    };
  };

  angular.module('aera-dataset', [])
      .controller('DatasetController', ['DatasetService', datasetControllerFunction])
      .directive('aeraDataset', datasetDirectiveFunction);


})(angular);