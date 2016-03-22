'use strict';

describe('The Page Number Editor', function () {

    var controller;
    var mockChapterList, mockPageList, mockPageService;
    var chapterPromise, pagesPromise, pagePromises = [];
    var $controller, $q, $rootScope, $state, $stateParams;

    beforeEach(function () {

        mockPageService = { saveAll: function () {}};
        var mockChapterService = {}, stubNotificationService = {};

        var mockPage1 = {pageId: 0, title: "1", pageNumber: 0};
        var mockPage2 = {pageId: 1, title: "2", pageNumber: 1};
        var mockPage3 = {pageId: 2, title: "3", pageNumber: 2};
        mockChapterList = [
            {chapterId: 1, title: "1"}
        ];
        mockPageList = [mockPage1, mockPage2, mockPage3];

        module('aera-edit');
        module('ui.router');
        module(function ($provide) {
            $provide.factory('ChapterService', function () { return mockChapterService; });
            $provide.factory('PageService', function () { return mockPageService; });
            $provide.factory('NotificationService', function () { return stubNotificationService; });
        });

        inject(function (_$controller_, _$q_, _$rootScope_, _$state_, _$stateParams_) {
            $controller = _$controller_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $state = _$state_;
            $stateParams = _$stateParams_;
        });

        mockChapterService.getAll = function () {
            chapterPromise = $q.defer();
            return chapterPromise.promise;
        };
        mockChapterService.get = function () {
            pagesPromise = $q.defer();
            return pagesPromise.promise;
        };
        mockPageService.get = function (pageId) {
            pagePromises[pageId] = $q.defer();
            return pagePromises[pageId].promise;
        };
        mockPageService.saveAll = function () {
            return $q.defer().promise;
        };

        $stateParams.page = mockPage1;
        controller = $controller('PageNumberController');
    });

    var resolvePromise = function (promise, result) {
        promise.resolve({data: result});
        $rootScope.$apply();
    };
    var updatePageList = function () {
        controller.updatePageList();
        resolvePromise(pagesPromise, {pages: mockPageList});
    };

    it('has a list of chapters', function () {
        resolvePromise(chapterPromise, mockChapterList);
        expect(controller.chapters).toBe(mockChapterList);
    });

    it('retrieves the list of pages for the selected chapter', function () {
        updatePageList();
        expect(controller.pages).toBe(mockPageList);
    });

    it('updates the pages whose order has changed', function () {

        updatePageList();

        // reorder the pages
        controller.pages = [controller.pages[0], controller.pages[2], controller.pages[1]];

        spyOn(mockPageService, 'saveAll').and.callThrough();
        controller.savePageOrder();

        pagePromises.forEach(function (promise, index) {
            resolvePromise(promise, mockPageList[index]);
        });

        expect(mockPageService.saveAll).toHaveBeenCalledWith([mockPageList[2], mockPageList[1]]);
    });

    it('redirects to the start page if no page has been selected', function () {
        spyOn($state, 'go');

        $stateParams.page = {};
        $controller('PageNumberController');

        expect($state.go).toHaveBeenCalledWith('^.page');
    });
});