'use strict';

describe('A Dataset', function () {

  var datasetService, datasetController, mockDataset;

  beforeEach(function () {
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
      $provide.value('dataset', mockDataset);
    });

    inject(function ($controller, _DatasetService_) {
      datasetService = _DatasetService_;
      datasetController = $controller('DatasetController', {DatasetService: datasetService});
    })
  });

  it('retrieves the dataset information from the dataset service', function () {
    expect(datasetController.title).toBe(mockDataset.title);
    expect(datasetController.imageUrl).toBe(mockDataset.imageUrl);
    expect(datasetController.text).toBe(mockDataset.text);
  });

  it('calls the download data service', function () {
    spyOn(datasetService, 'downloadDataset');
    datasetController.download();
    expect(datasetService.downloadDataset).toHaveBeenCalledWith(12345);
  });
});