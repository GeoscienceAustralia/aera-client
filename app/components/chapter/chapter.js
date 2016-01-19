'use strict';

(function (angular) {

  var chapterControllerFunction = function (ChapterService, NotificationService, $location, $anchorScroll, $stateParams) {
    var chapter = this;

    var chapterRetrieved = function (result) {
      angular.extend(chapter, result);
    };
    var chapterRetrievalFailed = function () {
      NotificationService.addError('Unable to retrieve chapter');
    };
    ChapterService.get({chapterId: $stateParams.id}).$promise.then(chapterRetrieved, chapterRetrievalFailed);

    chapter.scrollToPage = function (pageId) {
      $location.hash(pageId);
      $anchorScroll();
    }
  };

  var chapterDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {id: '=chapterId'},
      templateUrl: 'components/chapter/chapter.html',
      controller: 'ChapterController as chapter'
    };
  };

  angular.module('aera-chapter', [])
      .controller('ChapterController',
          ['ChapterService', 'NotificationService', '$location', '$anchorScroll', '$stateParams', chapterControllerFunction])
      .directive('aeraChapter', chapterDirectiveFunction);

})(angular);