'use strict';

describe('A Dataset', function () {

  var datasetController, datasetService;

  beforeEach(function () {
    var mockDatasetService = {
      downloadDataset: function () {}
    };

    module('aera-dataset');
    module(function ($provide) {
      $provide.factory('DatasetService', function () { return mockDatasetService; });
    });

    inject(function ($controller, _DatasetService_) {
      datasetService = _DatasetService_;
      datasetController = $controller('DatasetController', {});
    })
  });

  it('displays its title', function () {
    var element = {};
    var expectedHtml = '<h2>Test Title</h2>';

    inject(function ($compile, $rootScope) {
      element = angular.element('<aera-dataset></aera-dataset>');
      element = $compile(element)($rootScope);

      $rootScope.$digest();
    });

    expect(element.html()).toContain(expectedHtml);
  });

  it('calls the download data service', function () {
    spyOn(datasetService, 'downloadDataset');
    datasetController.download();
    expect(datasetService.downloadDataset).toHaveBeenCalledWith(12345);
  });
});