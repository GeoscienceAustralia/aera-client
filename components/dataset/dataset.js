'use strict';

(function (angular) {

  var datasetControllerFunction = function (DatasetService, datasetId) {
    var dataset = this;

    var datasetRetrieved = function (result) {
      angular.extend(dataset, result);
    };
    var datasetRetrievalFailed = function () {

    };
    DatasetService.get(datasetId).then(datasetRetrieved, datasetRetrievalFailed);

    dataset.download = function () {
      DatasetService.downloadDataset(datasetId);
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