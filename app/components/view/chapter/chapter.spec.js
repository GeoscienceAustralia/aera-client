'use strict';

describe('A Chapter', function () {

    var chapterId = 1;
    var $location, $q, $rootScope, chapterController, chapterQuery, directiveElement,
            mockChapter, stubChapterService, stubPageService, stubSourcesService, stubNotificationService;

    beforeEach(function () {

        mockChapter = {
            data: {
                title: 'Test Chapter Title',
                pages: [{
                    id: 4,
                    title: 'The First Page'
                }, {}, {}]
            }
        };

        stubChapterService = {};
        stubPageService = {};
        stubSourcesService = {};
        stubNotificationService = { addNotification: function () {} };

        module('aera-view');
        module('ui.router');
        module('components/view/chapter/chapter.html');
        module('components/view/page/page.html');

        module(function ($provide) {
            $provide.value('chapterId', chapterId);
            $provide.factory('ChapterService', function () { return stubChapterService; });
            $provide.factory('NotificationService', function () { return stubNotificationService; });
            $provide.factory('PageService', function () { return stubPageService; });
            $provide.factory('SourcesService', function () { return stubSourcesService; });
        });

        inject(function (_$location_, _$q_, _$rootScope_) {
            $location = _$location_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        stubChapterService.get = function () {
            chapterQuery = $q.defer();
            return chapterQuery.promise;
        };

        stubPageService.get = function () {
            return $q.defer().promise;
        };

        stubSourcesService.get = function () {
            return $q.defer().promise;
        };

        inject(function ($compile) {
            directiveElement = $compile('<aera-chapter></aera-chapter>')($rootScope);
            $rootScope.$digest();
            chapterController = directiveElement.controller('aeraChapter');
        });

    });

    var resolvePromise = function (promise, result) {
        promise.resolve(result);
        $rootScope.$digest();
    };
    var rejectPromise = function (promise, reason) {
        promise.reject(reason);
        $rootScope.$digest();
    };

    it('retrieves its title and list of pages', function () {
        resolvePromise(chapterQuery, mockChapter);
        expect(chapterController.title).toBe(mockChapter.data.title);
        expect(chapterController.pages.length).toBe(mockChapter.data.pages.length);
    });

    it('creates an error message if the list of pages couldn\'t be displayed', function () {
        spyOn(stubNotificationService, 'addNotification');
        rejectPromise(chapterQuery);
        expect(stubNotificationService.addNotification).toHaveBeenCalledWith('Unable to retrieve chapter');
    });

    it('displays links to its pages and the list of pages', function () {
        resolvePromise(chapterQuery, mockChapter);
        expect(directiveElement.find('md-list-item md-button').length).toBe(6);
        expect(directiveElement.find('md-list-item md-button').html()).toBe('The First Page');
        expect(directiveElement.find('aera-page').length).toBe(3);
    });

    it('navigates between the links and the pages', function () {
        resolvePromise(chapterQuery, mockChapter);
        directiveElement.find('md-list-item a').first().click();
        //expect($location.hash()).toBe('page_4');
    });
});