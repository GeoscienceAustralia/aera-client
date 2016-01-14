'use strict';

(function (angular) {

  var datasetControllerFunction = function (datasetId, DatasetService, NotificationService) {
    var dataset = this;

    var datasetRetrieved = function (result) {
      angular.extend(dataset, result);
    };
    var datasetRetrievalFailed = function () {
      NotificationService.addError('The dataset could not be retrieved');
    };
    DatasetService.get(datasetId).then(datasetRetrieved, datasetRetrievalFailed);

    var datasetDownloaded = function () {
      NotificationService.addInformation('Dataset successfully downloaded');
    };
    var datasetDownloadFailed = function () {
      NotificationService.addError('The dataset could not be downloaded');
    };

    dataset.download = function () {
      DatasetService.downloadDataset(datasetId).then(datasetDownloaded, datasetDownloadFailed);
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
      .controller('DatasetController', ['datasetId', 'DatasetService', 'NotificationService', datasetControllerFunction])
      .directive('aeraDataset', datasetDirectiveFunction);


})(angular);