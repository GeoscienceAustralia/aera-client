describe('Edit Page', function () {

  var $q, $rootScope,
      mockChapters, stubChapterService, stubPageService, mockNotificationService, mockPage,
      chaptersQuery, pageQuery, directiveElement, editController;

  beforeEach(function () {

    mockChapters = [
      { id: 4, title: 'A New Hope'},
      { id: 5, title: 'The Empire Strikes Back'},
      { id: 6, title: 'Return of the Jedi'},
      { id: 7, title: 'The Force Awakens'}
    ];

    mockPage = {
      pageId: 83,
      title: 'Number of Ewoks on Endor',
      summary: 'The effect of having the Deathstar destroyed on the native Ewok population of Endor',
      chapter: 4,
      dataFile: 'some/file',
      imageFile: 'a/pretty/picture'
    };

    stubChapterService = {};
    stubPageService = {};
    mockNotificationService = { addError: function () {}, addInformation: function () {} };

    module('aera-edit-page');
    module('components/edit-page/editPage.html');
    module(function ($provide) {
      $provide.factory('ChapterService', function () { return stubChapterService; });
      $provide.factory('PageService', function () { return stubPageService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
    });

    inject(function (_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    stubChapterService.query = function () {
      chaptersQuery = $q.defer();
      return {$promise: chaptersQuery.promise};
    };

    stubPageService.get = function () {
      pageQuery = $q.defer();
      return pageQuery.promise;
    };
    stubPageService.save = stubPageService.get;
    stubPageService.delete = stubPageService.get;

    inject(function ($compile) {
      directiveElement = $compile('<aera-edit></aera-edit>')($rootScope);
      $rootScope.$digest();
      editController = directiveElement.controller('aeraEdit');
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
  var getDeletePageButton = function () {
    return directiveElement.find('md-button#delete');
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

  xit('allows the user to search for an existing page by ID', function () {
    expect(getPageIdInput().length).toBe(1);
    expect(getFindPageButton().length).toBe(1);

    spyOn(stubPageService, 'get').and.callThrough();
    editController.page.pageId = mockPage.pageId;
    $rootScope.$apply();
    getFindPageButton().click();
    expect(stubPageService.get).toHaveBeenCalledWith(mockPage.pageId);
    resolvePromise(pageQuery, mockPage);

    expect(getPageIdInput().val()).toBe(mockPage.pageId + '');
    expect(directiveElement.find('input#title').val()).toBe(mockPage.title);
    expect(directiveElement.find('textarea#summary').val()).toBe(mockPage.summary);
  });

  xit('creates an error message when the user tries to find a page that doesn\'t exist', function () {
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

  xit('calls the Page service when a user deletes and notifies user of success', function () {
    spyOn(stubPageService, 'delete').and.callThrough();
    spyOn(mockNotificationService, 'addInformation');
    editController.page = mockPage;
    getDeletePageButton().click();
    resolvePromise(pageQuery);
    expect(stubPageService.delete).toHaveBeenCalledWith(mockPage.pageId);
    expect(mockNotificationService.addInformation).toHaveBeenCalledWith('Page deleted');
  });

  xit('creates an error when delete fails', function () {
    spyOn(mockNotificationService, 'addError').and.callThrough();
    getDeletePageButton().click();
    rejectPromise(pageQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to delete page');
  });
});