'use strict';

describe('Edit Page', function () {

    var $q, $rootScope, stubPageService, stubNotificationService, mockPage,
            pageQuery, directiveElement, editController;

    beforeEach(function () {

        mockPage = {
            data: {
                pageId: 83,
                title: 'Number of Ewoks on Endor',
                summary: 'The effect of having the Deathstar destroyed on the native Ewok population of Endor',
                chapter: 4,
                dataFile: 'some/file',
                imageFile: 'a/pretty/picture'
            }
        };

        stubPageService = {};
        stubNotificationService = { addError: function () {}, addInformation: function () {} };

        module('aera-edit-page');
        module('components/edit-page/editPage.html');
        module(function ($provide) {
            $provide.factory('PageService', function () { return stubPageService; });
            $provide.factory('NotificationService', function () { return stubNotificationService; });
        });

        inject(function (_$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        stubPageService.get = function () {
            pageQuery = $q.defer();
            return pageQuery.promise;
        };
        stubPageService.save = stubPageService.get;

        inject(function ($compile) {
            directiveElement = $compile('<aera-edit-page></aera-edit-page>')($rootScope);
            $rootScope.$digest();
            editController = directiveElement.controller('aeraEditPage');
        });
    });

    var resolvePromise = function (promise, result) {
        promise.resolve(result);
        $rootScope.$digest();
    };
    var rejectPromise = function (promise, error) {
        promise.reject(error);
        $rootScope.$digest();
    };

    var findPage = function () {
        editController.page.pageId = mockPage.data.pageId;
        getFindPageButton().click();
        resolvePromise(pageQuery, mockPage);
    };

    var getPageIdInput = function () {
        return directiveElement.find('input#pageId');
    };
    var getFindPageButton = function () {
        return directiveElement.find('md-button#find-page');
    };
    var getSavePageButton = function () {
        return directiveElement.find('md-button#save');
    };
    var getClearButton = function () {
        return directiveElement.find('md-button#new-page');
    };
    var getSourcesButton = function () {
        return directiveElement.find('md-button#add-sources');
    };

    it('allows the user to search for an existing page by ID', function () {
        expect(getPageIdInput().length).toBe(1);
        expect(getFindPageButton().length).toBe(1);

        spyOn(stubPageService, 'get').and.callThrough();
        findPage();
        expect(stubPageService.get).toHaveBeenCalledWith(mockPage.data.pageId);
        resolvePromise(pageQuery, mockPage);

        expect(getPageIdInput().val()).toBe(mockPage.data.pageId + '');
        expect(directiveElement.find('input#title').val()).toBe(mockPage.data.title);
        expect(directiveElement.find('textarea#text').val()).toBe(mockPage.data.summary);
    });

    it('creates an error message when the user tries to find a page that doesn\'t exist', function () {
        var errorMessage = 'No matching page found';
        spyOn(stubNotificationService, 'addError');
        editController.page.pageId = 44;
        getFindPageButton().click();
        rejectPromise(pageQuery, errorMessage);
        expect(stubNotificationService.addError).toHaveBeenCalledWith(errorMessage);
    });

    it('calls the Page service when a user saves', function () {
        spyOn(stubPageService, 'save').and.callThrough();
        editController.page = mockPage;
        getSavePageButton().click();
        expect(stubPageService.save).toHaveBeenCalledWith(mockPage);
    });

    it('creates an error when the save fails', function () {
        var errorMessage = 'Unable to save page';
        spyOn(stubNotificationService, 'addError').and.callThrough();
        getSavePageButton().click();
        rejectPromise(pageQuery, errorMessage);
        expect(stubNotificationService.addError).toHaveBeenCalledWith(errorMessage);
    });

    it('clears all fields when the clear button is clicked', function () {
        findPage();
        getClearButton().click();
        expect(editController.page).toEqual({});
        expect(editController.page.pageId).toBeUndefined();
    });

    it('navigates to the references page', function () {
        expect(getSourcesButton().length).toBe(1);
        getSourcesButton().click();
        $rootScope.$digest();
        expect($location.hash).toContain('sources');
    });

});