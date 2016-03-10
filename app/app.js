'use strict';

(function (angular) {

    angular.module('ga-aera', ['ui.router', 'ngMaterial',
                'aera-view', 'aera-edit', 'aera-resources', 'aera-notifications', 'aera-common'])
            .config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider',
                function ($mdThemingProvider, $urlRouterProvider, $stateProvider) {

                    var gaPrimaryPalette = $mdThemingProvider.extendPalette('teal',
                            {
                                'A100': '#deebef',
                                'A200': '#b0d0d8',
                                'A400': '#80b4c1',
                                'A700': '#4c95a8',
                                '400': '#267f95',
                                '500': '#006983',
                                '600': '#005f77',
                                '700': '#00556a',
                                '800': '#004a5d',
                                '900': '#003644'
                            });
                    var gaAccentPalette = $mdThemingProvider.extendPalette('deep-orange',
                            {
                                'A200': '#a33f1f'
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
                    var editPage = {
                        url: '/page',
                        template: '<aera-edit-page></aera-edit-page>'
                    };
                    var editSources = {
                        url: '/sources',
                        template: '<aera-edit-sources></aera-edit-sources>',
                        params: {page: null}
                    };
                    var editPageNumber = {
                        url: '/page-number',
                        template: '<aera-edit-page-number></aera-edit-page-number>',
                        params: {page: null}
                    };
                    var editChapter = {
                        url: '/chapter',
                        template: '<aera-edit-chapter></aera-edit-chapter>'
                    };

                    $urlRouterProvider.otherwise('/view/chapter/1');

                    $stateProvider
                            .state('view', view)
                            .state('view.chapter', chapter)
                            .state('edit', edit)
                            .state('edit.page', editPage)
                            .state('edit.sources', editSources)
                            .state('edit.pageNumber', editPageNumber)
                            .state('edit.chapter', editChapter)
                }]);

})(angular);