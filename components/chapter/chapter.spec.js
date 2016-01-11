describe('A Chapter', function () {

  var chapterId = 1;
  var $q, $rootScope, chapterController, chapterQuery, mockChapterService, mockNotificationService;

  beforeEach(function () {

    mockChapter = {
      title: 'Test Chapter Title',
      datasets: [{}, {}, {}]
    };

    mockChapterService = {};
    mockNotificationService = { addError: function () {} };

    module(function ($provide) {
      $provide.factory('ChapterService', function () { return mockChapterService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
    });

    inject(function (_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    mockChapterService.query = function () {
      chapterQuery = $q.defer();
      return chapterQuery.promise;
    };

    chapterController = function (ChapterService, NotificationService) {
      var chapter = this;

      var chapterRetrieved = function (result) {
        angular.extend(chapter, result);
      };
      var chapterRetrievalFailed = function () {
        NotificationService.addError('Unable to retrieve chapter');
      };
      ChapterService.query(chapterId).then(chapterRetrieved, chapterRetrievalFailed);

    };

    inject(function ($controller) {
      chapterController = $controller(chapterController, {});
    });

  });

  it('retrieves its title and list of datasets', function () {
    chapterQuery.resolve(mockChapter);
    $rootScope.$digest();
    expect(chapterController.title).toBe(mockChapter.title);
    expect(chapterController.datasets.length).toBe(mockChapter.datasets.length);
  });

  it('creates an error message if the list of datasets couldn\'t be displayed', function () {
    spyOn(mockNotificationService, 'addError');
    chapterQuery.reject();
    $rootScope.$digest();
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to retrieve chapter');
  });

  xit('displays its title and list of datasets', function () {
    expect(directiveElement.find('h1')).toContain('Test Chapter Title');
    expect(directiveElement.find('li').length).toBe(3);
  });

  xit('redirects to the selected dataset', function () {
    expect($location.url).toBe('/chapter/1/dataset/12345');
  });
});