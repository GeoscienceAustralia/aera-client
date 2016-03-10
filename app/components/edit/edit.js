'use strict';

(function (angular) {

    angular.module('aera-edit', ['ngSanitize', 'as.sortable'])
            .component('aeraEdit', {
                templateUrl: 'components/edit/edit.html'
            });
})(angular);