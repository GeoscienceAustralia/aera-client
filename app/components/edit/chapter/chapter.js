'use strict';

(function (angular) {

    var editChapterControllerFunction = function (ChapterService, ResourceService, NotificationService, AeraCommon) {
        var edit = this;
        edit.chapter = {};

        edit.clearForm = function () {
            edit.chapter = {};
        };

        var chapterFound = function (chapter) {
            edit.chapter = chapter.data;
        };

        var chapterNotFound = function () {
            NotificationService.addError('No matching chapter found');
        };

        edit.findChapter = function () {
            ChapterService.get(edit.chapter.chapterId).then(chapterFound, chapterNotFound);
        };

        var chapterSaved = function (chapter) {
            edit.chapter.chapterId = chapter.data.chapterId;
            edit.chapter.result = chapter.data.chapterId;

            edit.chapter.progressBar = false;
        };

        var chapterSaveFailed = function () {
            NotificationService.addError('Unable to save chapter');
            edit.chapter.progressBar = false;
        };

        edit.saveChapter = function () {
            edit.chapter.progressBar = true;
            edit.chapter.result = false;
            ChapterService.save(edit.chapter).then(chapterSaved, chapterSaveFailed);
        };

        var resourcesRetrieveFailed = function (error) {
            NotificationService.addError(error);
        };

        var resourcesRetrieved = function (resources) {
            edit.resources = resources.data;
        };

        ResourceService.get().then(resourcesRetrieved, resourcesRetrieveFailed);

        AeraCommon.setProgressBar(edit);
    };

    var editChapterDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/edit/chapter/chapter.html',
            controller: 'EditChapterController as edit'
        };
    };

    angular.module('aera-edit')
        .controller('EditChapterController', ['ChapterService', 'ResourceService', 'NotificationService', 'AeraCommon', editChapterControllerFunction])
        .directive('aeraEditChapter', editChapterDirectiveFunction)
})(angular);