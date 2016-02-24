'use strict';

(function (angular) {

    var chapterControllerFunction = function (ChapterService, NotificationService, $stateParams, $location, $anchorScroll) {
        var chapter = this;
        chapter.id = $stateParams.id;

        var chapterRetrieved = function (result) {
            angular.extend(chapter, result.data);
        };
        var chapterRetrievalFailed = function () {
            NotificationService.addError('Unable to retrieve chapter');
        };
        ChapterService.get(chapter.id).then(chapterRetrieved, chapterRetrievalFailed);

        chapter.scrollToPage = function (pageId) {
            $location.hash('page_' + pageId);
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
                    ['ChapterService', 'NotificationService', '$stateParams', '$location', '$anchorScroll', chapterControllerFunction])
            .directive('aeraChapter', chapterDirectiveFunction);

})(angular);