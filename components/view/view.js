'use strict';

(function (angular) {

  var viewControllerFunction = function (ChapterService, NotificationService, $location) {
    var view = this;

    var chaptersRetrieved = function (result) {
      view.chapters = result;
    };
    var chapterRetrievalFailed = function () {
      NotificationService.addError('Unable to retrieve data');
    };
    ChapterService.query().then(chaptersRetrieved, chapterRetrievalFailed);

    view.navigateToChapter = function (chapterId) {
      $location.url('chapter/' + chapterId)
    }
  };

  var viewDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'components/view/view.html',
      controller: 'ViewController as view'
    };
  };

  angular.module('aera-view', [])
      .controller('ViewController', ['ChapterService', 'NotificationService', '$location', viewControllerFunction])
      .directive('aeraView', viewDirectiveFunction);
})(angular);