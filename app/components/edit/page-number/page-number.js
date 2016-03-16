'use strict';

(function (angular) {

    //TODO: integrate with AWS, set chapter originally

    var pageNumberControllerFunction  = function (ChapterService, PageService, NotificationService, $state, $stateParams, $q) {
        var number = this;
        number.progressBar = true;

        number.page = $stateParams.page;
        if (!number.page || !(number.page.pageId >= 0)) {
            $state.go('^.page');
            return;
        }

        var failure = function (error) {
            number.progressBar = false;
            NotificationService.showNotification(error.data.error);
        };

        var chaptersRetrieved = function (response) {
            number.chapters = response.data;
            number.progressBar = false;
        };
        ChapterService.getAll().then(chaptersRetrieved, failure);

        var pagesRetrieved = function (response) {
            number.pages = response.data.pages;
            number.progressBar = false;
        };
        var pagesFailed = function (response) {
            number.list = [];
            failure(response);
        };
        number.updatePageList = function () {
            number.progressBar = true;
            ChapterService.get(number.chapterId).then(pagesRetrieved, pagesFailed);
        };

        var pageOrderSaved = function () {
            number.progressBar = false;
            NotificationService.showNotification('Page order updated');
        };
        number.savePageOrder = function () {
            number.progressBar = true;

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
                number.progressBar = false;
                NotificationService.showNotification('Page order hasn\'t changed');
                return;
            }

            // Build the list of pages to be updated, with the updated page numbers
            var saveAll = function (responses) {
                responses.forEach(function (response, index) {
                    savedPages[index] = response.data;
                    savedPages[index].pageNumber = pagesToBeUpdated[index].pageNumber;
                });

                PageService.saveAll(savedPages).then(pageOrderSaved, failure);
            };
            $q.all(savedPages).then(saveAll, failure);
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