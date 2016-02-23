'use strict';

(function (angular) {

    var viewControllerFunction = function (ChapterService, NotificationService, $stateParams) {
        var view = this;
        view.showChapterList = false;

        var chaptersRetrieved = function (result) {
            view.chapters = result.data;
            view.selectedChapter = view.chapters[$stateParams.id] || view.chapters[0];
        };
        var chapterRetrievalFailed = function () {
            NotificationService.addError('Unable to retrieve data');
        };
        ChapterService.getAll().then(chaptersRetrieved, chapterRetrievalFailed);

        view.toggleChapterList = function () {
            view.showChapterList = !view.showChapterList;
        };

        view.updateSelectedChapter = function (id) {
            view.selectedChapter = view.chapters[id];
            view.showChapterList = false;
        };

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
            .controller('ViewController', ['ChapterService', 'NotificationService', '$stateParams', viewControllerFunction])
            .directive('aeraView', viewDirectiveFunction);
})(angular);