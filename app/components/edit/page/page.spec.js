'use strict';

describe('Edit Page', function () {

    var controller, mockPage, mockPageService, getCsvPromise, getImagePromise, savePagePromise, $controller, $q, $rootScope, $state;

    beforeEach(function () {

        var mockCommonService = { setProgressBar: function () {}};
        var mockNotificationService = { showNotification: function () {}};
        mockPageService = {};

        mockPage = {pageId: 4};

        module('aera-common');
        module('ui.router');
        module('aera-edit');
        module(function ($provide) {
            $provide.factory('AeraCommon', function () { return mockCommonService; });
            $provide.factory('PageService', function () { return mockPageService; });
            $provide.factory('NotificationService', function () { return mockNotificationService; });
        });

        inject(function (_$controller_, _$q_, _$rootScope_, _$state_) {
            $controller = _$controller_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $state = _$state_;
        });

        mockPageService.get = function () {
            return $q.defer().promise;
        };
        mockPageService.save = function () {
            savePagePromise = $q.defer();
            return savePagePromise.promise;
        };
        mockPageService.getCsvUrl = function () {
            getCsvPromise = $q.defer();
            return getCsvPromise.promise;
        };
        mockPageService.getImageUrl = function () {
            getImagePromise = $q.defer();
            return getImagePromise.promise;
        };

        controller = $controller('EditPageController');
    });

    var resolvePromise = function (promise, response) {
        promise.resolve({data: response});
        $rootScope.$digest();
    };

    xit('searches for a page by ID', function () {
        spyOn(mockPageService, 'get').and.callThrough();
        controller.page.pageId = mockPage.pageId;

        controller.findPage();
        expect(mockPageService.get).toHaveBeenCalledWith(mockPage.pageId);
    });

    it('saves and redirects to the next page', function () {
        spyOn(mockPageService, 'save').and.callThrough();
        spyOn($state, 'go');

        controller.page = mockPage;
        controller.saveAndContinue();

        resolvePromise(savePagePromise, {pageId: 4});
        resolvePromise(getCsvPromise, {});
        resolvePromise(getImagePromise, {});

        expect(mockPageService.save).toHaveBeenCalledWith(mockPage);
        expect($state.go).toHaveBeenCalledWith('^.sources', {page: mockPage});
    });

});