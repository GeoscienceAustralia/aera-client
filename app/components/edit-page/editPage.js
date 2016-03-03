'use strict';

(function (angular) {

    var editControllerFunction = function (ChapterService, PageService, NotificationService, AeraCommon, ReferenceService) {
        var edit = this;

        edit.clearForm = function () {
            edit.page = {};
            edit.references = [];
        };
        edit.clearForm();

        var failure = function (error) {
            NotificationService.addError(error);
        };

        var chaptersRetrieved = function (chapters) {
            edit.chapters = chapters.data;
        };
        ChapterService.getAll().then(chaptersRetrieved, failure);

        var pageFound = function (page) {
            edit.page = page.data;
        };
        var referencesFound = function (references) {
            edit.references = references.data;
            edit.references.forEach(function (source) {
                if (source.dateAccessed) {
                    source.dateAccessed = new Date(source.dateAccessed);
                }
            });
        };
        edit.findPage = function () {
            PageService.get(edit.page.pageId).then(pageFound, failure);
            ReferenceService.get(edit.page.pageId).then(referencesFound, failure);
        };

        var savingPage, savingReferences;
        var pageCsvFound = function (page) {
            edit.page.csvUrl = page.data.csvUrl;
        };
        var pageImageFound = function (page) {
            edit.page.imageUrl = page.data.imageUrl;
        };
        var pageSaved = function (response) {
            edit.page.pageId = response.data.pageId;
            edit.result = response.data.pageId;

            PageService.getCsvUrl(edit.page.pageId).then(pageCsvFound, failure);
            PageService.getImageUrl(edit.page.pageId).then(pageImageFound, failure);

            savingPage = false;
            edit.progressBar = savingReferences;
        };
        var referencesSaved = function () {
            savingReferences = false;
            edit.progressBar = savingPage;
        };
        edit.savePage = function () {
            edit.progressBar = true;
            edit.result = false;
            PageService.save(edit.page).then(pageSaved, failure);
            ReferenceService.save(edit.page.pageId, edit.references).then(referencesSaved, failure);
        };

        AeraCommon.setProgressBar(edit);
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

    var pageListControllerFunction = function (ChapterService, NotificationService, $scope) {
        var list = this;

        var failure = function (error) {
            NotificationService.addError(error);
        };

        var chapterRetrieved = function (result) {
            list.pages = result.data.pages;
        };
        ChapterService.get(list.chapter).then(chapterRetrieved, failure);

        $scope.$watch(function () { return list.editPageController.page.chapterId; }, function () {
            console.log('value changed');
        })

    };

    angular.module('aera-edit-page', ['ngSanitize'])
            .controller('EditPageController', ['ChapterService', 'PageService', 'NotificationService', 'AeraCommon', 'ReferenceService', editControllerFunction])
            .controller('PageListController', ['ChapterService', 'NotificationService', '$scope', pageListControllerFunction])
            .directive('fileModel', ['$parse', fileModelDirective])
            .component('aeraEditPage', {
                templateUrl: 'components/edit-page/editPage.html',
                controller: 'EditPageController as edit'
            })
            .component('aeraPageList', {
                templateUrl: 'components/edit-page/pageList.html',
                controller: 'PageListController as list',
                require: {
                    editPageController: '^aeraEditPage'
                }
            })
})(angular);