'use strict';

(function (angular) {

    var sourcesControllerFunction = function (SourcesService, $filter, $stateParams, $state) {
        var sources = this;

        var page = $stateParams.page;
        if (!page || !page.pageId) {
            $state.go('^.page');
            return;
        }

        sources.pageId = page.pageId;
        sources.list = page.sources;
        if (!sources.list || sources.list.length === 0) {
            sources.list = [{}];
        }

        sources.updateOutputString = function (source) {
            source.outputString = $filter('aeraReference')(source);
        };

        sources.addSource = function () {
            sources.sources.push({});
        };


        sources.saveAndContinue = function () {
            SourcesService.save({pageId: page.pageId, sources: sources.list}).then(function () {
                $state.go('^.pageNumber', {page: page});
            });
        }
    };

    angular.module('aera-edit')
            .controller('SourcesController', ['SourcesService', '$filter', '$stateParams', '$state', sourcesControllerFunction])
            .component('aeraEditSources', {
                templateUrl: 'components/edit/sources/sources.html',
                controller: 'SourcesController as sources'
            });
})(angular);