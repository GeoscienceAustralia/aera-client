'use strict';

describe('Page List Component', function () {

    var $q, $rootScope, controller, mockResult, anotherMockResult, mockChapterService, chapterPromise;

    beforeEach(function () {

        mockResult = {
            data: {
                pages: ['page1', 'page2']
            }
        };
        anotherMockResult = {
            data: {
                pages: ['page3', 'page4']
            }
        };
        mockChapterService = {};
        var mockNotificationService = { addError: function () {}};

        module('aera-edit-page');
        module(function ($provide) {
            $provide.factory('ChapterService', function () { return mockChapterService });
            $provide.factory('NotificationService', function () { return mockNotificationService; })
        });

        inject(function (_$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        mockChapterService.get = function () {
            chapterPromise = $q.defer();
            return chapterPromise.promise;
        };

        spyOn(mockChapterService, 'get').and.callThrough();

        inject(function ($controller) {
            controller = $controller('PageListController', {}, {chapter: 1});
        });
    });

    it('calls the chapter service', function () {
        expect(mockChapterService.get).toHaveBeenCalledWith(1);
    });
    it('displays a list of pages in the given chapter', function () {
        chapterPromise.resolve(mockResult);
        $rootScope.$digest();
        expect(controller.pages).toEqual(mockResult.data.pages);
    });

    it('updates the list when the chapter id updates', function () {
        expect(controller.pages).toEqual(anotherMockResult.data.pages);
    });
});