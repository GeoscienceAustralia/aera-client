describe('Edit Page', function () {

  var $q, $rootScope,
      mockChapters, mockChapterService, mockDatasetService, mockNotificationService, mockDataset,
      chaptersQuery, datasetQuery, directiveElement, editController;

  beforeEach(function () {

    mockChapters = [
      { id: 4, title: 'A New Hope'},
      { id: 5, title: 'The Empire Strikes Back'},
      { id: 6, title: 'Return of the Jedi'},
      { id: 7, title: 'The Force Awakens'}
    ];

    mockDataset = {
      id: 83,
      title: 'Number of Ewoks on Endor',
      text: 'The effect of having the Deathstar destroyed on the native Ewok population of Endor',
      chapter: 4,
      dataFile: 'some/file',
      imageFile: 'a/pretty/picture'
    };

    mockChapterService = {};
    mockDatasetService = {};
    mockNotificationService = { addError: function () {}, addInformation: function () {} };

    module('aera-edit');
    module('components/edit/edit.html');
    module(function ($provide) {
      $provide.factory('ChapterService', function () { return mockChapterService; });
      $provide.factory('DatasetService', function () { return mockDatasetService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
    });

    inject(function (_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    mockChapterService.query = function () {
      chaptersQuery = $q.defer();
      return chaptersQuery.promise;
    };

    mockDatasetService.get = function () {
      datasetQuery = $q.defer();
      return datasetQuery.promise;
    };
    mockDatasetService.save = mockDatasetService.get;
    mockDatasetService.delete = mockDatasetService.get;

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

  var getDatasetIdInput = function () {
    return directiveElement.find('input#datasetId');
  };
  var getNewDatasetButton = function () {
    return directiveElement.find('button#new-dataset');
  };
  var getFindDatasetButton = function () {
    return directiveElement.find('button#find-dataset');
  };
  var getChapterSelector = function () {
    return directiveElement.find('select#chapter');
  };
  var getSaveDatasetButton = function () {
    return directiveElement.find('button#save');
  };
  var getDeleteDatasetButton = function () {
    return directiveElement.find('button#delete');
  };

  it('populates a dropdown box with a list of chapters', function () {
    resolvePromise(chaptersQuery, mockChapters);
    $rootScope.$apply();
    expect(getChapterSelector().children().length).toBe(5);
    expect(getChapterSelector().children(':nth-child(2)').html()).toContain('A New Hope');
  });

  it('creates an error if the list of chapters can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(chaptersQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Could not retrieve list of chapters');
  });

  it('allows the user to create a new dataset', function () {
    expect(getNewDatasetButton().length).toBe(1);
    spyOn(editController, 'clearForm').and.callThrough();
    getNewDatasetButton().click();
    expect(editController.clearForm).toHaveBeenCalled();
    expect(editController.dataset).toEqual({});
  });

  it('allows the user to search for an existing dataset by ID', function () {
    expect(getDatasetIdInput().length).toBe(1);
    expect(getFindDatasetButton().length).toBe(1);

    spyOn(mockDatasetService, 'get').and.callThrough();
    editController.dataset.id = mockDataset.id;
    $rootScope.$apply();
    getFindDatasetButton().click();
    expect(mockDatasetService.get).toHaveBeenCalledWith(mockDataset.id);
    resolvePromise(datasetQuery, mockDataset);

    expect(getDatasetIdInput().val()).toBe(mockDataset.id + '');
    expect(directiveElement.find('input#title').val()).toBe(mockDataset.title);
    expect(directiveElement.find('textarea#text').val()).toBe(mockDataset.text);
  });

  it('creates an error message when the user tries to find a dataset that doesn\'t exist', function () {
    spyOn(mockNotificationService, 'addError');
    editController.dataset.id = 44;
    getFindDatasetButton().click();
    rejectPromise(datasetQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('No matching dataset found');
  });

  it('calls the Dataset service when a user saves', function () {
    spyOn(mockDatasetService, 'save').and.callThrough();
    editController.dataset = mockDataset;
    getSaveDatasetButton().click();
    expect(mockDatasetService.save).toHaveBeenCalledWith(mockDataset);
  });

  it('creates an error when the save fails', function () {
    spyOn(mockNotificationService, 'addError').and.callThrough();
    getSaveDatasetButton().click();
    rejectPromise(datasetQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to save dataset');
  });

  it('calls the Dataset service when a user deletes and notifies user of success', function () {
    spyOn(mockDatasetService, 'delete').and.callThrough();
    spyOn(mockNotificationService, 'addInformation');
    editController.dataset = mockDataset;
    getDeleteDatasetButton().click();
    resolvePromise(datasetQuery);
    expect(mockDatasetService.delete).toHaveBeenCalledWith(mockDataset.id);
    expect(mockNotificationService.addInformation).toHaveBeenCalledWith('Dataset deleted');
  });

  it('creates an error when delete fails', function () {
    spyOn(mockNotificationService, 'addError').and.callThrough();
    getDeleteDatasetButton().click();
    rejectPromise(datasetQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('Unable to delete dataset');
  });
});