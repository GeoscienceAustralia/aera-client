'use strict';

(function (angular) {

  angular.module('ga-aera', ['ui.router', 'ngMaterial',
        'aera-view', 'aera-edit', 'aera-chapter', 'aera-page', 'aera-resources', 'aera-notifications'])
      .config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider',
        function ($mdThemingProvider, $urlRouterProvider, $stateProvider) {

          var gaPrimaryPalette = $mdThemingProvider.extendPalette('teal',
              {
                'a100': 'deebef',
                'a200': 'b0d0d8',
                'a400': '80b4c1',
                'a700': '4c95a8',
                '400': '267f95',
                '500': '006983',
                '600': '005f77',
                '700': '00556a',
                '800': '004a5d',
                '900': '003644'
              });
          var gaAccentPalette = $mdThemingProvider.extendPalette('deep-orange',
              {
                '500': 'A33F1F'
              });

          $mdThemingProvider.definePalette('gaPrimary', gaPrimaryPalette);
          $mdThemingProvider.definePalette('gaAccent', gaAccentPalette);
          $mdThemingProvider.theme('default')
              .primaryPalette('gaPrimary')
              .accentPalette('gaAccent');

          var view = {
            url: '/view',
            template: '<aera-view></aera-view>'
          };

          var chapter = {
            url: '/chapter/:id',
            template: '<aera-chapter></aera-chapter>'
          };

          var edit = {
            url: '/edit',
            template: '<aera-edit></aera-edit>'
          };

          $urlRouterProvider.otherwise('/view/chapter/1');

          $stateProvider
              .state('view', view)
              .state('view.chapter', chapter)
              .state('edit', edit);
        }]);


})(angular);