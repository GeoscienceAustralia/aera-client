'use strict';

(function (angular) {

  var editControllerFunction = function (ChapterService, DatasetService, NotificationService) {
    var edit = this;
    edit.dataset = {};

    var chaptersRetrieved = function (chapters) {
      edit.chapters = chapters;
    };
    var chapterRetrievalFailed = function () {
      NotificationService.addError('Could not retrieve list of chapters');
    };
    ChapterService.query(chaptersRetrieved, chapterRetrievalFailed);

    edit.clearForm = function () {
      edit.dataset = {};
    };

    var datasetFound = function (dataset) {
      edit.dataset = dataset;
    };
    var datasetNotFound = function () {
      NotificationService.addError('No matching dataset found');
    };
    edit.findDataset = function () {
      if (edit.dataset.id)
        DatasetService.get(edit.dataset.id, datasetFound, datasetNotFound);
    };

    var datasetSaved = function (id) {
      edit.dataset.id = id;
    };
    var datasetSaveFailed = function () {
      NotificationService.addError('Unable to save dataset');
    };
    edit.saveDataset = function () {
      DatasetService.save(edit.dataset, datasetSaved, datasetSaveFailed);
    };

    var datasetDeleted = function () {
      NotificationService.addInformation('Dataset deleted');
    };
    var datasetDeleteFailed = function () {
      NotificationService.addError('Unable to delete dataset');
    };
    edit.deleteDataset = function () {
      DatasetService.delete(edit.dataset.id, datasetDeleted, datasetDeleteFailed);
    };

  };

  var editDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/edit/edit.html',
      controller: 'EditController as edit'
    };
  };

  angular.module('aera-edit', [])
      .controller('EditController', ['ChapterService', 'DatasetService', 'NotificationService', editControllerFunction])
      .directive('aeraEdit', editDirectiveFunction);
})(angular);