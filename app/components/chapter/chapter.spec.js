describe('A Chapter', function () {

  var chapterId = 1;
  var $location, $q, $rootScope, chapterController, chapterQuery, datasetQuery, directiveElement,
      mockChapter, mockChapterService, mockDataset, mockDatasetService, mockNotificationService;

  beforeEach(function () {

    mockChapter = {
      title: 'Test Chapter Title',
      datasets: [{
        id: 4,
        title: 'The First Dataset'
      }, {}, {}]
    };

    mockDataset = {
      id: 4,
      title: 'The First Dataset',
      imageUrl: 'http://cdn.meme.am/instances/24111566.jpg'
    };

    mockChapterService = {};
    mockDatasetService = {};
    mockNotificationService = { addError: function () {} };

    module('aera-chapter');
    module('aera-dataset');
    module('components/chapter/chapter.html');
    module('components/dataset/dataset.html');

    module(function ($provide) {
      $provide.value('chapterId', chapterId);
      $provide.factory('ChapterService', function () { return mockChapterService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
      $provide.factory('DatasetService', function () { return mockDatasetService; });
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

    // Only set up the promise for the one dataset we're testing
    mockDatasetService.get = function (id) {
      if (id === mockDataset.id) {
        datasetQuery = $q.defer();
        return datasetQuery.promise;
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

  it('retrieves its title and list of datasets', function () {
    resolvePromise(chapterQuery, mockChapter);
    expect(chapterController.title).toBe(mockChapter.title);
    expect(chapterController.datasets.length).toBe(mockChapter.datasets.length);
  });

  it('creates an error message if the list of datasets couldn\'t be displayed', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(chapterQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to retrieve chapter');
  });

  it('displays its title, links to dataset and the list of datasets', function () {
    resolvePromise(chapterQuery, mockChapter);
    resolvePromise(datasetQuery, mockDataset);
    expect(directiveElement.find('h1').html()).toContain('Test Chapter Title');
    expect(directiveElement.find('li a').length).toBe(3);
    expect(directiveElement.find('li a').html()).toBe('The First Dataset');
    expect(directiveElement.find('aera-dataset').length).toBe(3);

    var firstDataset = directiveElement.find('aera-dataset');
    expect(firstDataset.find('h2').html()).toBe('The First Dataset');
    expect(firstDataset.find('img').attr('src')).toBe('http://cdn.meme.am/instances/24111566.jpg')
  });

  it('navigates between the links and the datasets', function () {
    resolvePromise(chapterQuery, mockChapter);
    directiveElement.find('li a').click();
    expect($location.hash()).toBe('4');
  });
});