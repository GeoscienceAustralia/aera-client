'use strict';

(function (angular) {

  angular.module('ga-aera', ['ui.router', 'ngMaterial',
        'aera-view', 'aera-edit', 'aera-chapter', 'aera-page', 'aera-resources', 'aera-notifications'])
      .config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider',
        function ($mdThemingProvider, $urlRouterProvider, $stateProvider) {

          var gaPrimaryPalette = $mdThemingProvider.extendPalette('teal',
              {
                '500': '006983'
              });

          $mdThemingProvider.definePalette('gaPrimary', gaPrimaryPalette);
          $mdThemingProvider.theme('default')
              .primaryPalette('gaPrimary')
              .accentPalette('deep-orange');

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