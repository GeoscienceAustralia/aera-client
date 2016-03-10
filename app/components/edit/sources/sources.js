'use strict';

(function (angular) {

    //TODO: fix data error, make display nice, add loading bar, functional testing stuff for error and loading bar, integrate with AWS

    var sourcesControllerFunction = function (SourcesService, NotificationService, $filter, $stateParams, $state) {
        var sources = this;

        sources.page = $stateParams.page;
        if (!sources.page || !(sources.page.pageId >= 0)) {
            $state.go('^.page');
            return;
        }

        var failure = function (error) {
            NotificationService.showError(error.data);
        };

        var updateSourceList = function (response) {
            sources.list = response.data;
            sources.list.forEach(function (source) {
                sources.updateOutputString(source);
            });

            if (!sources.list.length) {
                sources.addSource();
            }
        };
        SourcesService.get(sources.page.pageId).then(updateSourceList, failure);

        sources.updateOutputString = function (source) {
            source.outputString = $filter('aeraReference')(source);
        };

        sources.addSource = function () {
            sources.list.push({});
        };

        var sourcesSaved = function () {
            NotificationService.showMessage('References successfully updated');
            $state.go('^.pageNumber', {page: sources.page});
        };
        sources.saveAndContinue = function () {
            SourcesService.save(sources.page.pageId, sources.list).then(sourcesSaved, failure);
        };
    };

    angular.module('aera-edit')
            .controller('SourcesController', ['SourcesService', 'NotificationService', '$filter', '$stateParams', '$state', sourcesControllerFunction])
            .component('aeraEditSources', {
                templateUrl: 'components/edit/sources/sources.html',
                controller: 'SourcesController as sources'
            });
})(angular);