'use strict';

(function (angular) {

    var editControllerFunction = function (PageService, NotificationService, AeraCommon, $q, $state, $stateParams) {
        var edit = this;

        edit.page = $stateParams.page;

        var failure = function (response) {
            edit.progressBar = false;
            NotificationService.showNotification(response.data.Error || response.data.Warning);
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
            PageService.save(edit.page).then(pageSaved, failure);
        };
        var pageSaved = function (response) {
            edit.page.pageId = response.data.pageId;
            NotificationService.showNotification('Page saved');

            if (edit.page.csvFile)
                edit.page.csvUrl = '';

            if (edit.page.imageFile)
                edit.page.imageUrl = '';

            var urlPromises = {csvUrlRequest: PageService.getCsvUrl(edit.page.pageId), imageUrlRequest: PageService.getImageUrl(edit.page.pageId)};
            $q.all(urlPromises).then(urlsRetrieved, failure);
        };
        var urlsRetrieved = function (responses) {
            edit.progressBar = false;

            edit.page.csvUrlRequest = responses.csvUrlRequest.data.csvUrl;
            edit.page.imageUrlRequest = responses.imageUrlRequest.data.imageUrl;

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
        .controller('EditPageController', ['PageService', 'NotificationService', 'AeraCommon', '$q', '$state', '$stateParams', editControllerFunction])
        .directive('aeraEditPage', editDirectiveFunction)
        .directive('fileModel', ['$parse', fileModelDirective])
})(angular);