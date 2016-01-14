'use strict';

(function (angular) {

  var pageControllerFunction = function (PageService, NotificationService) {
    var page = this;

    var pageRetrieved = function (result) {
      angular.extend(page, result);
    };
    var pageRetrievalFailed = function () {
      NotificationService.addError('The page could not be retrieved');
    };
    PageService.get(page.id, pageRetrieved, pageRetrievalFailed);

    var pageDownloaded = function () {
      NotificationService.addInformation('Page successfully downloaded');
    };
    var pageDownloadFailed = function () {
      NotificationService.addError('The page could not be downloaded');
    };
    page.download = function () {
      PageService.downloadPage(page.id, pageDownloaded, pageDownloadFailed);
    };
  };

  var pageDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        id: '='
      },
      templateUrl: 'components/page/page.html',
      controller: 'PageController as page'
    };
  };

  angular.module('aera-page', [])
      .controller('PageController', ['PageService', 'NotificationService', pageControllerFunction])
      .directive('aeraPage', pageDirectiveFunction);


})(angular);