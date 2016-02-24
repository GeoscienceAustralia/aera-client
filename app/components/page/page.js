'use strict';

(function (angular) {

    var pageControllerFunction = function (PageService, ReferenceService, NotificationService) {
        var page = this;
        page.sources = [];

        var failure = function (error) {
            NotificationService.addError(error);
        };

        var pageRetrieved = function (result) {
            angular.extend(page, result.data);
        };
        var sourcesRetrieved = function (result) {
            result.data.forEach(function (source, index) {
                page.sources[index] = source;
            });
        };
        PageService.get(page.id).then(pageRetrieved, failure);
        ReferenceService.get(page.id).then(sourcesRetrieved, failure);
    };

    var pageDirectiveFunction = function () {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                id: '=pageId'
            },
            templateUrl: 'components/page/page.html',
            controller: 'PageController as page'
        };
    };

    angular.module('aera-page', [])
            .controller('PageController', ['PageService', 'ReferenceService', 'NotificationService', pageControllerFunction])
            .directive('aeraPage', pageDirectiveFunction);


})(angular);