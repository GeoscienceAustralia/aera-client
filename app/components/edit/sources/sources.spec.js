'use strict';

describe('Sources Input', function () {

    var controller, mockPage, mockSources, mockSourcesService, getSourcesPromise,
            $controller, $q, $rootScope, $state, $stateParams;
    beforeEach(function () {

        module('aera-common');
        module('ui.router');
        module('aera-edit');

        mockSourcesService = {};
        var mockNotificationService = {};
        mockPage = {pageId: 0};

        module(function ($provide) {
            $provide.factory('SourcesService', function () { return mockSourcesService; });
            $provide.factory('NotificationService', function () { return mockNotificationService; });
        });

        inject(function (_$controller_, _$q_, _$rootScope_, _$state_, _$stateParams_) {
            $controller = _$controller_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $state = _$state_;
            $stateParams = _$stateParams_;
        });

        mockSourcesService.get = function () {
            getSourcesPromise = $q.defer();
            return getSourcesPromise.promise;
        };
        mockSourcesService.save = function () {
            return $q.defer().promise;
        };

        $stateParams.page = mockPage;
        controller = $controller('SourcesController');

        mockSources = [{}, {}, {}];
        mockSources[0].author = 'Blogger, Q. R.';
        mockSources[0].publicationYear = 2016;
        mockSources[0].title = 'Article Title';
        mockSources[0].dateAccessed = new Date(2016, 1, 22);
        mockSources[0].url = 'http://myblog.com';
        mockSources[0].outputString = 'Blogger, Q. R. (2016). Article Title. Retrieved February 22, 2016, from http://myblog.com';

        mockSources[1].author = 'Scientist, M. S.';
        mockSources[1].publicationYear = 2014;
        mockSources[1].title = 'Article Title';
        mockSources[1].publication = 'Journal Title';
        mockSources[1].dateAccessed = new Date(2016, 1, 22);
        mockSources[1].url = 'publisher-url.com';
        mockSources[1].outputString = 'Scientist, M. S. (2014). Article Title. <i>Journal Title</i>. Retrieved February 22, 2016, from publisher-url.com';

        mockSources[2].author = 'Author, C. J.';
        mockSources[2].publicationYear = 2016;
        mockSources[2].publication = 'The Book Title';
        mockSources[2].dateAccessed = new Date(2015, 1, 23);
        mockSources[2].outputString = 'Author, C. J. (2016). <i>The Book Title</i>. ';
    });

    var resolvePromise = function (promise, response) {
        promise.resolve({data: response});
        $rootScope.$digest();
    };

    it('correctly generates a reference string for a website', function () {

        resolvePromise(getSourcesPromise, []);

        controller.list[0].author = mockSources[0].author;
        controller.list[0].publicationYear = mockSources[0].publicationYear;
        controller.list[0].title = mockSources[0].title;
        controller.list[0].dateAccessed = mockSources[0].dateAccessed;
        controller.list[0].url = mockSources[0].url;

        controller.updateOutputString(controller.list[0]);

        expect(controller.list[0].outputString).toBe(mockSources[0].outputString);
    });

    it('correctly generates a reference string for a journal article', function () {

        resolvePromise(getSourcesPromise, []);

        controller.list[0].author = mockSources[1].author;
        controller.list[0].publicationYear = mockSources[1].publicationYear;
        controller.list[0].title = mockSources[1].title;
        controller.list[0].publication = mockSources[1].publication;
        controller.list[0].dateAccessed = mockSources[1].dateAccessed;
        controller.list[0].url = mockSources[1].url;

        controller.updateOutputString(controller.list[0]);

        expect(controller.list[0].outputString).toBe(mockSources[1].outputString);
    });

    it('correctly generates a reference string for a book', function () {

        resolvePromise(getSourcesPromise, []);

        controller.list[0].author = mockSources[2].author;
        controller.list[0].publicationYear = mockSources[2].publicationYear;
        controller.list[0].publication = mockSources[2].publication;

        controller.updateOutputString(controller.list[0]);

        expect(controller.list[0].outputString).toBe(mockSources[2].outputString);
    });

    it('retrieves the list of existing sources for the page', function () {
        spyOn(mockSourcesService, 'get').and.callThrough();
        $controller('SourcesController');
        expect(mockSourcesService.get).toHaveBeenCalledWith(mockPage.pageId);
    });

    it('generates the output string for existing sources', function () {
        spyOn(controller, 'updateOutputString');
        resolvePromise(getSourcesPromise, mockSources);
        expect(controller.updateOutputString).toHaveBeenCalled();
    });

    it('allows a user to add multiple sources', function () {
        resolvePromise(getSourcesPromise, []);
        controller.addSource();
        controller.addSource();
        expect(controller.list.length).toBe(3);
    });

    it('redirects to the start page if no page has been selected', function () {
        spyOn($state, 'go');

        $stateParams.page = {};
        $controller('SourcesController');

        expect($state.go).toHaveBeenCalledWith('^.page');
    });

    it('calls the source service to save references', function () {
        resolvePromise(getSourcesPromise, mockSources);

        spyOn(mockSourcesService, 'save').and.callThrough();
        controller.saveAndContinue();

        expect(mockSourcesService.save).toHaveBeenCalledWith(mockPage.pageId, mockSources);
    });

});