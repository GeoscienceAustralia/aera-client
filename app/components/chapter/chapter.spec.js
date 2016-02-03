describe('A Chapter', function () {

  var chapterId = 1;
  var $location, $q, $rootScope, chapterController, chapterQuery, directiveElement,
      mockChapter, stubChapterService, stubPageService, mockNotificationService;

  beforeEach(function () {

    mockChapter = {
      title: 'Test Chapter Title',
      pages: [{
        id: 4,
        title: 'The First Page'
      }, {}, {}]
    };

    stubChapterService = {};
    stubPageService = {};
    mockNotificationService = { addError: function () {} };

    module('aera-chapter');
    module('aera-page');
    module('ui.router');
    module('components/chapter/chapter.html');
    module('components/page/page.html');

    module(function ($provide) {
      $provide.value('chapterId', chapterId);
      $provide.factory('ChapterService', function () { return stubChapterService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
      $provide.factory('PageService', function () { return stubPageService; });
    });

    inject(function (_$location_, _$q_, _$rootScope_) {
      $location = _$location_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    stubChapterService.get = function () {
      chapterQuery = $q.defer();
      return {$promise: chapterQuery.promise};
    };

    stubPageService.get = function () {
      return {$promise: $q.defer().promise};
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
    expect(chapterController.title).toBe(mockChapter.title);
    expect(chapterController.pages.length).toBe(mockChapter.pages.length);
  });

  it('creates an error message if the list of pages couldn\'t be displayed', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(chapterQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to retrieve chapter');
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