'use strict';

(function (angular) {

    var editChapterControllerFunction = function (ChapterService, NotificationService, AeraCommon) {
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
            var chapter = ChapterService.get(edit.chapter.chapterId).then(chapterFound, chapterNotFound);
        };

        var chapterSaved = function (chapter) {
            edit.chapter.chapterId = chapter.data.chapterId;
            edit.chapter.result = chapter.data.chapterId;

            edit.chapter.progressBar = false;
        };

        var chapterSaveFailed = function (err) {
            NotificationService.addError('Unable to save chapter');
            edit.chapter.progressBar = false;
        };

        edit.saveChapter = function () {
            edit.chapter.progressBar = true;
            edit.chapter.result = false;
            var chapter = ChapterService.save(edit.chapter).then(chapterSaved, chapterSaveFailed);
        };

        AeraCommon.setProgressBar(edit);
    }

    var editChapterDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/edit-chapter/editChapter.html',
            controller: 'EditChapterController as edit'
        };
    };

    angular.module('aera-edit-chapter', [])
        .controller('EditChapterController', ['ChapterService', 'NotificationService', 'AeraCommon', editChapterControllerFunction])
        .directive('aeraEditChapter', editChapterDirectiveFunction)
})(angular);