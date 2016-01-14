describe('A Chapter', function () {

  var chapterId = 1;
  var $location, $q, $rootScope, chapterController, chapterQuery, pageQuery, directiveElement,
      mockChapter, mockChapterService, mockPage, mockPageService, mockNotificationService;

  beforeEach(function () {

    mockChapter = {
      title: 'Test Chapter Title',
      pages: [{
        id: 4,
        title: 'The First Page'
      }, {}, {}]
    };


    mockPage = {
      id: 4,
      title: 'The First Page',
      imageUrl: 'http://cdn.meme.am/instances/24111566.jpg'
    };

    mockChapterService = {};
    mockPageService = {};
    mockNotificationService = { addError: function () {} };

    module('aera-chapter');
    module('aera-page');
    module('components/chapter/chapter.html');
    module('components/page/page.html');

    module(function ($provide) {
      $provide.value('chapterId', chapterId);
      $provide.factory('ChapterService', function () { return mockChapterService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
      $provide.factory('PageService', function () { return mockPageService; });
    });

    inject(function (_$location_, _$q_, _$rootScope_) {
      $location = _$location_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    mockChapterService.get = function () {
      chapterQuery = $q.defer();
      return chapterQuery.promise;
    };

    // Only set up the promise for the one page we're testing
    mockPageService.get = function (id) {
      if (id === mockPage.id) {
        pageQuery = $q.defer();
        return pageQuery.promise;
      } else {
        return $q.defer().promise;
      }
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

  it('displays its title, links to page and the list of pages', function () {
    resolvePromise(chapterQuery, mockChapter);
    resolvePromise(pageQuery, mockPage);
    expect(directiveElement.find('h1').html()).toContain('Test Chapter Title');
    expect(directiveElement.find('li a').length).toBe(3);
    expect(directiveElement.find('li a').html()).toBe('The First Page');
    expect(directiveElement.find('aera-page').length).toBe(3);

    var firstPage = directiveElement.find('aera-page');
    expect(firstPage.find('h2').html()).toBe('The First Page');
    expect(firstPage.find('img').attr('src')).toBe('http://cdn.meme.am/instances/24111566.jpg')
  });

  it('navigates between the links and the pages', function () {
    resolvePromise(chapterQuery, mockChapter);
    directiveElement.find('li a').click();
    expect($location.hash()).toBe('4');
  });
});