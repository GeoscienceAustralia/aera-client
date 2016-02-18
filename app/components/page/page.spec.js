'use strict';

describe('Page Controller', function () {

  var $compile, $q, $rootScope,
      pageController, pageQuery, directiveElement,
      mockResult, stubPageService, mockNotificationService;
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

    mockResult = {
        data: {
            id: 666,
            title: 'Test Title',
            imageUrl: 'http://pre12.deviantart.net/c3b4/th/pre/f/2012/214/7/c/futurama__bender_by_suzura-d59kq1p.png',
            summary: 'Bender is great'
        }
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
      return pageQuery.promise;
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
    resolvePromise(pageQuery, mockResult);
    expect(pageController.title).toBe(mockResult.data.title);
    expect(pageController.imageUrl).toBe(mockResult.data.imageUrl);
    expect(pageController.summary).toBe(mockResult.data.summary);
  });

  it('displays the page information and download button', function () {
    resolvePromise(pageQuery, mockResult);
    expect(directiveElement.find('header').html()).toBe(mockResult.data.title);
    expect(directiveElement.find('img').attr('src')).toBe(mockResult.data.imageUrl);
    expect(directiveElement.find('div.page-content__text').html()).toContain(mockResult.data.summary);
    expect(directiveElement.find('md-button').html()).toBe('Download data as CSV');
  });

  it('creates a notification if the page can\'t be retrieved', function () {
    spyOn(mockNotificationService, 'addError');
    rejectPromise(pageQuery);
    expect(mockNotificationService.addError).toHaveBeenCalledWith('The page could not be retrieved');
  });

});