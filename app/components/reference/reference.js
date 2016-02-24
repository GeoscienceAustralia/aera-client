'use strict';

(function (angular) {

    var referenceControllerFunction = function ($filter) {
        var reference = this;

        reference.updateOutputString = function (source) {
            source.outputString = $filter('aeraReference')(source);
        };

        reference.addSource = function () {
            reference.sources.push({});
        };

        // ensure there is at least one source in the list
        if (reference.sources.length === 0) {
            reference.addSource();
        }
    };

    angular.module('aera-edit-page')
            .controller('ReferenceController', ['$filter', referenceControllerFunction])
            .component('aeraReference', {
                templateUrl: 'components/reference/reference.html',
                controller: 'ReferenceController as reference',
                bindings: { sources: '=references'}
            });
})(angular);