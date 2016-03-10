'use strict';

(function (angular) {

    var pageNumberControllerFunction  = function (ChapterService, PageService, NotificationService, $state, $stateParams) {
        var number = this;

        var page = $stateParams.page;
        if (!page || !page.pageId) {
            $state.go('^.page');
            return;
        }

        var failure = function (error) {
            NotificationService.addError(error);
        };

        var chaptersRetrieved = function (response) {
            number.chapters = response.data;
        };
        ChapterService.getAll().then(chaptersRetrieved, failure);

        var pagesRetrieved = function (response) {
            number.pages = response.data.pages;
        };
        number.updatePageList = function () {
            ChapterService.get(number.page.chapterId).then(pagesRetrieved, failure);
        };

        number.savePageOrder = function () {

            var pages = [];
            number.pages.forEach(function (page, index) {
                pages[index] = PageService.get(page.pageId);
            });

            $q.all(pages).then(function () {
                pages.forEach(function (page, index) {
                    page.pageNumber = index;
                });
                PageService.saveAll(pages);
            });
        };
    };

    angular.module('aera-edit')
            .controller('PageNumberController',
                    ['ChapterService', 'PageService', 'NotificationService', '$state', '$stateParams', pageNumberControllerFunction])
            .component('aeraEditPageNumber', {
                templateUrl: 'components/edit/page-number/page-number.html',
                controller: 'PageNumberController as number'
            });
})(angular);