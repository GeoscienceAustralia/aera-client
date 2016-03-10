'use strict';

(function (angular) {

    var editControllerFunction = function (PageService, NotificationService, AeraCommon, $state) {
        var edit = this;

        edit.clearForm = function () {
            edit.page = {};
            edit.references = [];
        };
        edit.clearForm();

        var failure = function (error) {
            NotificationService.addError(error);
        };


        var pageFound = function (page) {
            edit.page = page.data;
        };
        //var referencesFound = function (references) {
        //    edit.references = references.data;
        //    edit.references.forEach(function (source) {
        //        if (source.dateAccessed) {
        //            source.dateAccessed = new Date(source.dateAccessed);
        //        }
        //    });
        //};
        edit.findPage = function () {
            PageService.get(edit.page.pageId).then(pageFound, failure);
            //ReferenceService.get(edit.page.pageId).then(referencesFound, failure);
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
            //ReferenceService.save(edit.page.pageId, edit.references).then(referencesSaved, failure);
        };
        edit.saveAndContinue = function () {
            PageService.save(edit.page).then(function (response) {
                pageSaved(response);
                $state.go('^.sources', {page: edit.page});
            }, failure);
        };

        AeraCommon.setProgressBar(edit);
    };

    var editDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/edit/page/page.html',
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

    angular.module('aera-edit')
        .controller('EditPageController', ['PageService', 'NotificationService', 'AeraCommon', '$state', editControllerFunction])
        .directive('aeraEditPage', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);