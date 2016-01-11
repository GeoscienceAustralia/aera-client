'use strict';

describe('Dataset Controller', function () {

  var $q, $rootScope, datasetController, datasetService, mockDataset;

  beforeEach(function () {

    /* Some jiggery pokery with setting up the mockDatasetService
      $provide can only be called from a module() callback, as it is setting up a provider for
      the injector (ie, it needs to be done before inject() is called).
      $q can't be called until after it has been injected.
      All calls to inject() have to come after all calls to module().
      As a result, DatasetService needs to be provided in a module() call, but have its get() method
      added after a call to inject().
     */

    var mockDatasetService = {
      downloadDataset: function () {}
    };

    mockDataset = {
      title: 'Test Title',
      imageUrl: 'http://pre12.deviantart.net/c3b4/th/pre/f/2012/214/7/c/futurama__bender_by_suzura-d59kq1p.png',
      text: '<p>Bender is great</p><p>And some other stuff</p>'
    };

    module('aera-dataset');
    module(function ($provide) {
      $provide.factory('DatasetService', function () { return mockDatasetService; });
      $provide.value('datasetId', 666);
    });

    inject(function (_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    var datasetQuery;
    mockDatasetService.get = function () {
      datasetQuery = $q.defer();
      return datasetQuery.promise;
    };

    inject(function ($controller, _DatasetService_) {
      datasetService = _DatasetService_;
      datasetController = $controller('DatasetController', {DatasetService: datasetService});
      datasetQuery.resolve(mockDataset);
    });

    $rootScope.$digest();
  });

  it('retrieves the dataset information from the dataset service', function () {
    expect(datasetController.title).toBe(mockDataset.title);
    expect(datasetController.imageUrl).toBe(mockDataset.imageUrl);
    expect(datasetController.text).toBe(mockDataset.text);
  });

  it('calls the download data service', function () {
    spyOn(datasetService, 'downloadDataset');
    datasetController.download();
    expect(datasetService.downloadDataset).toHaveBeenCalledWith(mockDataset.id);
  });

  it('displays an error if the dataset can\'t be retrieved', function () {

  });

  it('displays an error if the raw data can\'t be downloaded', function () {

  });

});