'use strict';

describe('Page Controller', function () {

  var $compile, $q, $rootScope,
      pageController, pageQuery, directiveElement, downloadPromise,
      mockPage, stubPageService, mockNotificationService;
  var pageId = 666;
  beforeEach(function () {

    /* Some jiggery pokery with setting up the stubPageService
      $provide can only be called from a module() callback, as it is setting up a provider for
      the injector (ie, it needs to be done before inject() is called).
      $q can't be called until after it has been injected.
      All calls to inject() have to come after all calls to module().
      As a result, PageService needs to be provided in a module() call, but have its get() method
      added after a call to inject().
     */

    stubPageService = {};

    mockNotificationService = {
      addError: function () {},
      addInformation: function () {}
    };

    mockPage = {
      id: 666,
      title: 'Test Title',
      imageUrl: 'http://pre12.deviantart.net/c3b4/th/pre/f/2012/214/7/c/futurama__bender_by_suzura-d59kq1p.png',
      text: 'Bender is great'
    };

    module('aera-page');
    module('components/page/page.html');
    module(function ($provide) {
      $provide.factory('PageService', function () { return stubPageService; });
      $provide.factory('NotificationService', function () { return mockNotificationService; });
      $provide.value('pageId', pageId);
    });

    inject(function (_$compile_, _$q_, _$rootScope_) {
      $compile = _$compile_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    stubPageService.get = function () {
      pageQuery = $q.defer();
      return {$promise: pageQuery.promise};
    };

    stubPageService.downloadData = function () {
      downloadPromise = $q.defer();
      return {$promise: downloadPromise.promise};
    };

    directiveElement = $compile(angular.element('<aera-page page-id="666"></aera-page>'))($rootScope);
    $rootScope.$digest();

    pageController = directiveElement.controller('aeraPage');

  });

  var resolvePromise = function (promise, result) {
    promise.resolve(result);
    $rootScope.$digest();
  };
  var rejectPromise = function (promise, reason) {
    promise.reject(reason);
    $rootScope.$digest();
  };

  it('retrieves the page information from the page service', function () {
    resolvePromise(pageQuery, mockPage);
    expect(pageController.title).toBe(mockPage.title);
    expect(pageController.imageUrl).toBe(mockPage.imageUrl);
    expect(pageController.text).toBe(mockPage.text);
  });

  it('displays the page information and download button', function () {
    resolvePromise(pageQuery, mockPage);
    expect(directiveElement.find('header').html()).toBe(mockPage.title);
    expect(directiveElement.find('img').attr('src')).toBe(mockPage.imageUrl);
    expect(directiveElement.find('div.page-content__text').html()).toContain(mockPage.text);
    expect(directiveElement.find('md-button').html()).toBe('Download data as CSV');
  });

  it('calls the download data service when the button is clicked', function () {
    resolvePromise(pageQuery, mockPage);
    spyOn(stubPageService, 'downloadData').and.callThrough();
    directiveElement.find('md-button').click();
    expect(stubPageService.downloadData).toHaveBeenCalledWith({pageId: pageId});
  });

  it('creates a notification if the page can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(pageQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('The page could not be retrieved');
  });

  it('creates a notification that the data is downloading', function () {
    spyOn(mockNotificationService, 'addInformation');
    resolvePromise(pageQuery, mockPage);
    pageController.download();
    resolvePromise(downloadPromise);

    expect(mockNotificationService.addInformation).toHaveBeenCalledWith('Page successfully downloaded')
  });

  it('creates a notification if the raw data can\'t be downloaded', function () {
    spyOn(mockNotificationService, 'addError');
    resolvePromise(pageQuery, mockPage);
    pageController.download();
    rejectPromise(downloadPromise);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('The page could not be downloaded');
  });

});