'use strict';

(function (angular) {

    var editControllerFunction = function (ChapterService, PageService, NotificationService, AeraCommon) {
        var edit = this;
        edit.page = {};

        var chaptersRetrieved = function (chapters) {
            edit.chapters = chapters.data;
        };

        var chapterRetrievalFailed = function () {
            NotificationService.addError('Could not retrieve list of chapters');
        };

        ChapterService.getAll().then(chaptersRetrieved, chapterRetrievalFailed);

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
            PageService.get(edit.page.pageId).then(pageFound, pageNotFound);
        };

        var pageCsvFound = function (page) {
            edit.page.csvUrl = page.data.csvUrl;
        };

        var pageCsvFailed = function () {
            NotificationService.addError('Unable to retrieve page csv url');
        };

        var pageImageFound = function (page) {
            edit.page.imageUrl = page.data.imageUrl;
        };

        var pageImageFailed = function () {
            NotificationService.addError('Unable to retrieve page image url');
        };

        var pageSaved = function (response) {
            edit.page.pageId = response.data.pageId;
            edit.result = response.data.pageId;

            PageService.getCsvUrl(edit.page.pageId).then(pageCsvFound, pageCsvFailed);
            PageService.getImageUrl(edit.page.pageId).then(pageImageFound, pageImageFailed);

            edit.progressBar = false;
        };

        var pageSaveFailed = function () {
            NotificationService.addError('Unable to save page');
            edit.progressBar = false;
        };

        edit.savePage = function () {
            edit.progressBar = true;
            edit.result = false;
            PageService.save(edit.page).then(pageSaved, pageSaveFailed);
        };

        edit.setReference = function (reference) {
            edit.reference = reference;
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

    angular.module('aera-edit-page', ['ngSanitize'])
        .controller('EditPageController', ['ChapterService', 'PageService', 'NotificationService', 'AeraCommon', editControllerFunction])
        .directive('aeraEditPage', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);