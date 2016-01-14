'use strict';

(function (angular) {

  angular.module('ga-aera', ['ngRoute',
    'aera-view', 'aera-edit', 'aera-chapter', 'aera-page', 'aera-resources', 'aera-notifications'])
      .config(['$routeProvider', function($routeProvider) {


        var view = {
          template: '<aera-view></aera-view>'
        };

        var chapter = {
          template: '<aera-chapter chapter-id="chapterId"></aera-chapter>',
          controller: ['$routeParams', '$scope', function ($routeParams, $scope) {
            $scope.chapterId = $routeParams.id;
          }]
        };

        var edit = {
          name: 'edit',
          url: '/edit',
          template: '<aera-edit></aera-edit>'
        };

        $routeProvider
            .when('/', view)
            .when('/chapter/:id', chapter)
            .when('/edit', edit);
      }]);


})(angular);