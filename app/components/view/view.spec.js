describe('Main Page', function () {

  var $q, $rootScope, $stateParams,
      mockChapters, stubChapterService, mockNotificationService,
      chapterQuery, directiveElement, viewController;

  beforeEach(function () {

    mockChapters = [{
      id: 4,
      title: 'A New Hope'
    }, {
      id: 5,
      title: 'The Empire Strikes Back'
    }, {
      id: 6,
      title: 'Return of the Jedi'
    }];

    stubChapterService = {};

    mockNotificationService = {
      addError: function () { }
    };

    module('ui.router');
    module('aera-view');
    module('components/view/view.html');

    module(function ($provide) {
      $provide.factory('ChapterService', function () { return stubChapterService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
    });

    inject(function (_$q_, _$rootScope_, _$stateParams_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
    });

    stubChapterService.query = function () {
      chapterQuery = $q.defer();
      return {$promise: chapterQuery.promise};
    };

    inject(function ($compile) {
      directiveElement = $compile('<aera-view></aera-view>')($rootScope);
      $rootScope.$digest();
      viewController = directiveElement.controller('aeraView');
    });

  });

  var resolveChapters = function () {
    chapterQuery.resolve(mockChapters);
    $rootScope.$digest();
  };
  var rejectChapters = function () {
    chapterQuery.reject();
    $rootScope.$digest();
  };

  it('has a list of chapters', function () {
    resolveChapters();
    expect(viewController.chapters.length).toBe(mockChapters.length);
    expect(viewController.chapters[0]).toBe(mockChapters[0]);
  });

  it('creates an error if the list of chapters can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectChapters();
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to retrieve data');
  });

  it('displays chapter titles', function () {
    resolveChapters();
    expect(directiveElement.find('md-list.chapter-nav md-list-item').html()).toContain('A New Hope');
  });

  it('displays the title of the first chapter in the title bar by default', function () {
    resolveChapters();
    expect(viewController.selectedChapter.title).toBe('A New Hope');
  });
});