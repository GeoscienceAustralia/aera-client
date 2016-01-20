'use strict';

(function (angular) {

  angular.module('ga-aera', ['ui.router', 'ngMaterial',
    'aera-view', 'aera-edit', 'aera-chapter', 'aera-page', 'aera-resources', 'aera-notifications'])
      .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {


        var view = {
          url: '/view',
          template: '<aera-view></aera-view>'
        };

        var chapter = {
          url: 'chapter/:id',
          template: '<aera-chapter></aera-chapter>'
        };

        var edit = {
          url: '/edit',
          template: '<aera-edit></aera-edit>'
        };

        $urlRouterProvider.otherwise('/view');

        $stateProvider
            .state('view', view)
            .state('view.chapter', chapter)
            .state('edit', edit);
      }]);


})(angular);