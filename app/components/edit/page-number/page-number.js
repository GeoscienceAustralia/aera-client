'use strict';

(function (angular) {

    //TODO: loading bar, functional test for loading bar

    var pageNumberControllerFunction  = function (ChapterService, PageService, NotificationService, $state, $stateParams, $q) {
        var number = this;

        number.page = $stateParams.page;
        if (!number.page || !(number.page.pageId >= 0)) {
            $state.go('^.page');
            return;
        }

        var failure = function (error) {
            NotificationService.showError(error.data);
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

        var pageOrderSaved = function () {
            NotificationService.showMessage('Page order updated');
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

            if (!pagesToBeUpdated.length) {
                NotificationService.showMessage('Page order hasn\'t changed');
                return;
            }

            // Build the list of pages to be updated, with the updated page numbers
            $q.all(savedPages).then(function (responses) {
                responses.forEach(function (response, index) {
                    savedPages[index] = response.data;
                    savedPages[index].pageNumber = pagesToBeUpdated[index].pageNumber;
                });

                PageService.saveAll(savedPages).then(pageOrderSaved, failure);
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