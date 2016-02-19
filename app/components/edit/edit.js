'use strict';

(function (angular) {

    var editControllerFunction = function (ChapterService, PageService, NotificationService, $interval) {
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

        // Angular Material linear progress bar
        var j = 0, counter = 0;
        edit.mode = 'query';
        edit.activated = true;
        edit.modes = [ ];

        $interval(function () {
            edit.determinateValue += 1;
            edit.determinateValue2 += 1.5;

            if (edit.determinateValue > 100) edit.determinateValue = 30;
            if (edit.determinateValue2 > 100) edit.determinateValue2 = 30;
            if ((j < 2) && !edit.modes[j] && edit.activated) {
                edit.modes[j] = (j == 0) ? 'buffer' : 'query';
            }
            if (counter++ % 4 == 0) j++;
            if (j == 2) edit.contained = "indeterminate";
        }, 100, 0, true);

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
        .controller('EditController', ['ChapterService', 'PageService', 'NotificationService', '$interval', editControllerFunction])
        .directive('aeraEdit', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);