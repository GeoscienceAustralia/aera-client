'use strict';

(function (angular) {

    //TODO: resources, the progress bar, functional test support, AWS integration, make enter search, make buttons on same row as text, disable save when there's nothing to save

    var editControllerFunction = function (PageService, NotificationService, AeraCommon, $q, $state) {
        var edit = this;
        edit.page = {};

        var failure = function (error) {
            NotificationService.addError(error.data);
        };

        var pageFound = function (page) {
            edit.page = page.data;
        };
        edit.findPage = function () {
            PageService.get(edit.page.pageId).then(pageFound, failure);
        };

        edit.clearForm = function () {
            edit.page = {};
        };

        edit.saveAndContinue = function () {
            edit.progressBar = true;
            edit.page.csvUrl = '';
            edit.page.imageUrl = '';
            PageService.save(edit.page).then(pageSaved, failure);
        };
        var pageSaved = function (response) {
            edit.page.pageId = response.data.pageId;
            NotificationService.showMessage('Page saved');

            var urlPromises = {csvUrl: PageService.getCsvUrl(edit.page.pageId), imageUrl: PageService.getImageUrl(edit.page.pageId)};
            $q.all(urlPromises).then(urlsRetrieved, failure);
        };
        var urlsRetrieved = function (response) {
            edit.progressBar = false;

            edit.page.csvUrl = response.csvUrl;
            edit.page.imageUrl = response.imageUrl;

            $state.go('^.sources', {page: edit.page});
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
        .controller('EditPageController', ['PageService', 'NotificationService', 'AeraCommon', '$q', '$state', editControllerFunction])
        .directive('aeraEditPage', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);