'use strict';

(function (angular) {

    var pageNumberControllerFunction  = function (ChapterService, PageService, NotificationService, $state, $stateParams, $q) {
        var number = this;

        var page = $stateParams.page;
        if (!page || !(page.pageId >= 0)) {
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
            ChapterService.get(number.chapterId).then(pagesRetrieved, failure);
        };

        number.savePageOrder = function () {

            // Work out which pages have had their page number updated and
            // retrieve those pages from the server for updating
            var pagesToBeUpdated = [], savedPages = [];
            number.pages.forEach(function (page, index) {
                if (page.pageNumber !== index) {
                    page.pageNumber = index;
                    pagesToBeUpdated.push(page);
                    savedPages.push(PageService.get(page.pageId));
                }
            });

            // Build the list of pages to be updated, with the updated page numbers
            $q.all(savedPages).then(function (responses) {
                responses.forEach(function (response, index) {
                    savedPages[index] = response.data;
                    savedPages[index].pageNumber = pagesToBeUpdated[index].pageNumber;
                });

                PageService.saveAll(savedPages);
            });
        };
    };

    angular.module('aera-edit')
            .controller('PageNumberController',
                    ['ChapterService', 'PageService', 'NotificationService', '$state', '$stateParams', '$q', pageNumberControllerFunction])
            .component('aeraEditPageNumber', {
                templateUrl: 'components/edit/page-number/page-number.html',
                controller: 'PageNumberController as number'
            });
})(angular);