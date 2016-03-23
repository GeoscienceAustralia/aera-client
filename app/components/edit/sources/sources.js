'use strict';

(function (angular) {

    //TODO: integrate with AWS

    var sourcesControllerFunction = function (SourcesService, NotificationService, $filter, $stateParams, $state) {
        var sources = this;
        sources.progressBar = true;

        sources.page = $stateParams.page;
        if (!sources.page || !(sources.page.pageId >= 0)) {
            $state.go('^.page');
            return;
        }

        var failure = function (error) {
            sources.progressBar = false;
            NotificationService.showNotification(error.data.error);
        };

        var updateSourceList = function (response) {
            sources.list = response.data;
            sources.list.forEach(function (source) {
                sources.updateOutputString(source);
            });

            if (!sources.list.length) {
                sources.addSource();
            }

            sources.progressBar = false;
        };
        SourcesService.get(sources.page.pageId).then(updateSourceList, failure);

        sources.updateOutputString = function (source) {
            source.outputString = $filter('aeraReference')(source);
        };

        sources.addSource = function () {
            sources.list.push({});
        };

        var sourcesSaved = function () {
            sources.progressBar = false;
            NotificationService.showNotification('Sources saved');
            $state.go('^.pageNumber', {page: sources.page});
        };
        sources.saveAndContinue = function () {
            sources.progressBar = true;
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