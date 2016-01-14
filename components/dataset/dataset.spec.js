'use strict';

describe('Dataset Controller', function () {

  var $compile, $controller, $q, $rootScope,
      datasetController, datasetQuery, directiveElement, downloadPromise,
      mockDataset, mockDatasetService, mockNotificationService;
  var datasetId = 666;
  beforeEach(function () {

    /* Some jiggery pokery with setting up the mockDatasetService
      $provide can only be called from a module() callback, as it is setting up a provider for
      the injector (ie, it needs to be done before inject() is called).
      $q can't be called until after it has been injected.
      All calls to inject() have to come after all calls to module().
      As a result, DatasetService needs to be provided in a module() call, but have its get() method
      added after a call to inject().
     */

    mockDatasetService = {};

    mockNotificationService = {
      addError: function () {},
      addInformation: function () {}
    };

    mockDataset = {
      title: 'Test Title',
      imageUrl: 'http://pre12.deviantart.net/c3b4/th/pre/f/2012/214/7/c/futurama__bender_by_suzura-d59kq1p.png',
      text: 'Bender is great'
    };

    module('aera-dataset');
    module('components/dataset/dataset.html');
    module(function ($provide) {
      $provide.factory('DatasetService', function () { return mockDatasetService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
      $provide.value('datasetId', datasetId);
    });

    inject(function (_$compile_, _$controller_, _$q_, _$rootScope_) {
      $compile = _$compile_;
      $controller = _$controller_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    mockDatasetService.get = function () {
      datasetQuery = $q.defer();
      return datasetQuery.promise;
    };

    mockDatasetService.downloadDataset = function () {
      downloadPromise = $q.defer();
      return downloadPromise.promise;
    };

    directiveElement = $compile(angular.element('<aera-dataset></aera-dataset>'))($rootScope);
    $rootScope.$digest();

    datasetController = directiveElement.controller('aeraDataset');

  });

  var resolvePromise = function (promise, result) {
    promise.resolve(result);
    $rootScope.$digest();
  };
  var rejectPromise = function (promise, reason) {
    promise.reject(reason);
    $rootScope.$digest();
  };

  it('retrieves the dataset information from the dataset service', function () {
    resolvePromise(datasetQuery, mockDataset);
    expect(datasetController.title).toBe(mockDataset.title);
    expect(datasetController.imageUrl).toBe(mockDataset.imageUrl);
    expect(datasetController.text).toBe(mockDataset.text);
  });

  it('displays the dataset information and download button', function () {
    resolvePromise(datasetQuery, mockDataset);
    expect(directiveElement.find('h2').html()).toBe(mockDataset.title);
    expect(directiveElement.find('img').attr('src')).toBe(mockDataset.imageUrl);
    expect(directiveElement.find('div').html()).toContain(mockDataset.text);
    expect(directiveElement.find('button').html()).toBe('Download dataset as CSV');
  });

  it('calls the download data service when the button is clicked', function () {
    resolvePromise(datasetQuery, mockDataset);
    spyOn(mockDatasetService, 'downloadDataset').and.callThrough();
    directiveElement.find('button').click();
    expect(mockDatasetService.downloadDataset).toHaveBeenCalledWith(datasetId);
  });

  it('creates a notification if the dataset can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(datasetQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('The dataset could not be retrieved');
  });

  it('creates a notification that the data is downloading', function () {
    spyOn(mockNotificationService, 'addInformation');
    resolvePromise(datasetQuery, mockDataset);
    datasetController.download();
    resolvePromise(downloadPromise);

    expect(mockNotificationService.addInformation).toHaveBeenCalledWith('Dataset successfully downloaded')
  });

  it('creates a notification if the raw data can\'t be downloaded', function () {
    spyOn(mockNotificationService, 'addError');
    resolvePromise(datasetQuery, mockDataset);
    datasetController.download();
    rejectPromise(downloadPromise);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('The dataset could not be downloaded');
  });

});