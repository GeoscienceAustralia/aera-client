'use strict';

(function (angular) {

  var chapterControllerFunction = function (chapterId, ChapterService, NotificationService, $location, $anchorScroll) {
    var chapter = this;

    var chapterRetrieved = function (result) {
      angular.extend(chapter, result);
    };
    var chapterRetrievalFailed = function () {
      NotificationService.addError('Unable to retrieve chapter');
    };
    ChapterService.get(chapterId).then(chapterRetrieved, chapterRetrievalFailed);

    chapter.scrollToDataset = function (datasetId) {
      $location.hash(datasetId);
      $anchorScroll();
    }
  };

  var chapterDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/chapter/chapter.html',
      controller: 'ChapterController as chapter'
    };
  };

  angular.module('aera-chapter', [])
      .controller('ChapterController',
          ['chapterId', 'ChapterService', 'NotificationService', '$location', '$anchorScroll', chapterControllerFunction])
      .directive('aeraChapter', chapterDirectiveFunction);

})(angular);