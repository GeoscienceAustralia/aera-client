'use strict';

(function (angular) {

  var editControllerFunction = function (ChapterService, PageService, NotificationService) {
    var edit = this;
    edit.page = {};

    var chaptersRetrieved = function (chapters) {
      edit.chapters = chapters;
    };
    var chapterRetrievalFailed = function () {
      NotificationService.addError('Could not retrieve list of chapters');
    };
    ChapterService.query(chaptersRetrieved, chapterRetrievalFailed);

    edit.clearForm = function () {
      edit.page = {};
    };

    var pageFound = function (page) {
      edit.page = page;
    };
    var pageNotFound = function () {
      NotificationService.addError('No matching page found');
    };
    edit.findPage = function () {
      if (edit.page.id)
        PageService.get(edit.page.id, pageFound, pageNotFound);
    };

    var pageSaved = function (id) {
      edit.page.id = id;
    };
    var pageSaveFailed = function () {
      NotificationService.addError('Unable to save page');
    };
    edit.savePage = function () {
      PageService.save(edit.page, pageSaved, pageSaveFailed);
    };

    var pageDeleted = function () {
      NotificationService.addInformation('Page deleted');
    };
    var pageDeleteFailed = function () {
      NotificationService.addError('Unable to delete page');
    };
    edit.deletePage = function () {
      PageService.delete(edit.page.id, pageDeleted, pageDeleteFailed);
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
      .controller('EditController', ['ChapterService', 'PageService', 'NotificationService', editControllerFunction])
      .directive('aeraEdit', editDirectiveFunction);
})(angular);