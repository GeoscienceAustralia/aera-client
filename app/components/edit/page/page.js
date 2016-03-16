'use strict';

(function (angular) {

    //TODO: make sure it works with real API

    var editControllerFunction = function (PageService, NotificationService, AeraCommon, $q, $state) {
        var edit = this;
        edit.page = {};

        var failure = function (response) {
            edit.progressBar = false;
            NotificationService.showNotification(response.data.error || response.data.warning);
        };

        edit.findPage = function () {
            edit.progressBar = true;
            PageService.get(edit.page.pageId).then(pageFound, pageNotFound);
        };
        var pageFound = function (page) {
            edit.progressBar = false;
            edit.page = page.data;
        };
        var pageNotFound = function (error) {
            edit.page = {};
            failure(error);
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
            NotificationService.showNotification('Page saved');

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