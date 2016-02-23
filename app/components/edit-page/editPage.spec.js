'use strict';

describe('Edit Page', function () {

  var $q, $rootScope,
      mockChapters, stubChapterService, stubPageService, mockNotificationService, mockPage,
      chaptersQuery, pageQuery, directiveElement, editController;

  beforeEach(function () {

    mockChapters = {
      data:         [
        { id: 4, title: 'A New Hope'},
        { id: 5, title: 'The Empire Strikes Back'},
        { id: 6, title: 'Return of the Jedi'},
        { id: 7, title: 'The Force Awakens'}
      ]
    };

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

    stubChapterService = {};
    stubPageService = {};
    mockNotificationService = { addError: function () {}, addInformation: function () {} };

    module('ngSanitize');
    module('aera-common');
    module('aera-edit-page');
    module('components/edit-page/editPage.html');
    module('components/reference/reference.html');
    module(function ($provide) {
      $provide.factory('ChapterService', function () { return stubChapterService; });
      $provide.factory('PageService', function () { return stubPageService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
    });

    inject(function (_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    stubChapterService.getAll = function () {
      chaptersQuery = $q.defer();
      return chaptersQuery.promise;
    };

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
  var rejectPromise = function (promise) {
    promise.reject();
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
  var getChapterSelector = function () {
    return directiveElement.find('md-select#chapter');
  };
  var getSavePageButton = function () {
    return directiveElement.find('md-button#save');
  };
  var getClearButton = function () {
    return directiveElement.find('md-button#new-page');
  };

  it('populates a dropdown box with a list of chapters', function () {
    resolvePromise(chaptersQuery, mockChapters);
    $rootScope.$apply();
    expect(getChapterSelector().children().length).toBe(4);
    expect(getChapterSelector().children(':nth-child(1)').html()).toContain('A New Hope');
  });

  it('creates an error if the list of chapters can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(chaptersQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Could not retrieve list of chapters');
  });

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
    spyOn(mockNotificationService, 'addError');
    editController.page.pageId = 44;
    getFindPageButton().click();
    rejectPromise(pageQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('No matching page found');
  });

  it('calls the Page service when a user saves', function () {
    spyOn(stubPageService, 'save').and.callThrough();
    editController.page = mockPage;
    getSavePageButton().click();
    expect(stubPageService.save).toHaveBeenCalledWith(mockPage);
  });

  it('creates an error when the save fails', function () {
    spyOn(mockNotificationService, 'addError').and.callThrough();
    getSavePageButton().click();
    rejectPromise(pageQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to save page');
  });

  it('clears all fields when the clear button is clicked', function () {
    findPage();
    getClearButton().click();
    expect(editController.page).toEqual({});
    expect(editController.page.pageId).toBeUndefined();
  });

});