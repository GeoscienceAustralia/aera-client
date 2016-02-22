'use strict';

(function (angular) {

  var pageControllerFunction = function (PageService, NotificationService) {
    var page = this;

    var pageRetrieved = function (result) {
      angular.extend(page, result.data);
    };
    var pageRetrievalFailed = function () {
      NotificationService.addError('The page could not be retrieved');
    };
    PageService.get(page.id).then(pageRetrieved, pageRetrievalFailed);
  };

  var pageDirectiveFunction = function () {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        id: '=pageId'
      },
      templateUrl: 'components/page/page.html',
      controller: 'PageController as page'
    };
  };

  angular.module('aera-page', [])
      .controller('PageController', ['PageService', 'NotificationService', pageControllerFunction])
      .directive('aeraPage', pageDirectiveFunction);


})(angular);