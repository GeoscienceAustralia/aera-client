'use strict';

(function (angular) {

    var editControllerFunction = function (ChapterService, PageService, NotificationService, AeraCommon) {
        var edit = this;
        edit.page = {};

        var chaptersRetrieved = function (chapters) {
            edit.chapters = chapters;
        };

        var chapterRetrievalFailed = function () {
            NotificationService.addError('Could not retrieve list of chapters');
        };

        ChapterService.getAll(chaptersRetrieved, chapterRetrievalFailed);
//        ChapterService.query().$promise.then(chaptersRetrieved, chapterRetrievalFailed);

        edit.clearForm = function () {
            edit.page = {};
        };

        var pageFound = function (page) {
            edit.page = page.data;
        };

        var pageNotFound = function () {
            NotificationService.addError('No matching page found');
        };

        edit.findPage = function () {
            var page = PageService.get(edit.page.pageId).then(pageFound, pageNotFound());
        };

        var pageCsvFound = function (page) {
            edit.page.csvUrl = page.data.csvUrl;
        };

        var pageCsvFailed = function (err) {
            NotificationService.addError('Unable to retrieve page csv url');
        };

        var pageImageFound = function (page) {
            edit.page.imageUrl = page.data.imageUrl;
        };

        var pageImageFailed = function (err) {
            NotificationService.addError('Unable to retrieve page image url');
        };

        var pageSaved = function (page) {
            edit.page.pageId = page.pageId;
            edit.page.result = page.pageId;

            var page = PageService.getCsvUrl(edit.page.pageId).then(pageCsvFound, pageCsvFailed);
            var page = PageService.getImageUrl(edit.page.pageId).then(pageImageFound, pageImageFailed);

            edit.page.progressBar = false;
        };

        var pageSaveFailed = function (err) {
            NotificationService.addError('Unable to save page');
            edit.page.progressBar = false;
        };

        edit.savePage = function () {
            edit.page.progressBar = true;
            edit.page.result = false;
            var page = PageService.save(edit.page).then(pageSaved, pageSaveFailed);
        };

        AeraCommon.setProgressBar(edit);
    };

    var editDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/edit-page/editPage.html',
            controller: 'EditPageController as edit'
        };
    };

    var fileModelDirective = function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    };

    angular.module('aera-edit-page', [])
        .controller('EditPageController', ['ChapterService', 'PageService', 'NotificationService', 'AeraCommon', editControllerFunction])
        .directive('aeraEditPage', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);