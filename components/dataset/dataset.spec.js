'use strict';

describe('A Dataset', function () {

  beforeEach(module('aera-dataset'));
  beforeEach(module(function ($provide) {
    var mockDatasetService = {
      downloadDataset: function () {}
    };

    $provide.value('DatasetService', mockDatasetService);

  }));

  it('displays its title', function () {
    var element = {};
    var expectedHtml = '<h2>Test Title</h2>';

    inject(function ($compile, $rootScope, $controller) {
      $controller('DatasetController', {});
      element = angular.element('<aera-dataset></aera-dataset>');
      element = $compile(element)($rootScope);

      $rootScope.$digest();
    });

    expect(element.html()).toContain(expectedHtml);
  });

  it('calls the download data service', function () {

    var dataset = {};

    var mockDatasetService = {
      downloadDataset: function () {}
    };

    inject(function (_$controller_) {
      dataset = _$controller_('DatasetController', {DatasetService: mockDatasetService});
    });

    spyOn(mockDatasetService, 'downloadDataset');
    dataset.download();
    expect(mockDatasetService.downloadDataset).toHaveBeenCalledWith(12345);
  });
});