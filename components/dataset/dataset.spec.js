'use strict';

describe('A Dataset', function () {

  var datasetController, datasetService;

  beforeEach(module('aera-dataset'));
  beforeEach(module(function ($provide) {
    var mockDatasetService = {
      downloadDataset: function () {}
    };

    $provide.factory('DatasetService', function () { return mockDatasetService; });

  }));
  beforeEach(inject(function ($controller, _DatasetService_) {
    datasetService = _DatasetService_;
    datasetController = $controller('DatasetController', {});
  }));

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