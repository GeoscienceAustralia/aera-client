'use strict';

(function (angular) {

    var editControllerFunction = function (ChapterService, PageService, NotificationService) {
        var edit = this;
        edit.page = {};

        var chaptersRetrieved = function (chapters) {
            edit.chapters = chapters;
        };

        var chapterRetrievalFailed = function () {
            NotificationService.addError('Could not retrieve list of chapters');
        };

        ChapterService.query().$promise.then(chaptersRetrieved, chapterRetrievalFailed);

        edit.clearForm = function () {
            edit.page = {};
        };

        var pageFound = function (page) {
            edit.page = page;
        };

        var pageNotFound = function () {
            NotificationService.addError('No matching page found');
        };

        edit.findPage = function () {
            if (edit.page.pageId)
                PageService.get(edit.page.pageId).then(function (result) {
                    pageFound(result);
                }, function error() {
                    pageNotFound();
                });
        };

        var pageSaved = function (pageId) {
            edit.page.pageId = pageId;
            edit.page.result = pageId;
        };

        var pageSaveFailed = function () {
            NotificationService.addError('Unable to save page');
        };

        edit.savePage = function () {
            PageService.save(edit.page).then(pageSaved, pageSaveFailed);
        };

        var pageDeleted = function () {
            NotificationService.addInformation('Page deleted');
        };

        var pageDeleteFailed = function () {
            NotificationService.addError('Unable to delete page');
        };
        
        edit.deletePage = function () {
            PageService.delete(edit.page.id).then(pageDeleted, pageDeleteFailed);
        };
    };

    var editDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/edit/edit.html',
            controller: 'EditController as edit'
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

    angular.module('aera-edit', [])
        .controller('EditController', ['ChapterService', 'PageService', 'NotificationService', editControllerFunction])
        .directive('aeraEdit', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);