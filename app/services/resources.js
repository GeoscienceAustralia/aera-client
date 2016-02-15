'use strict';

(function (angular) {

  var chapterServiceFunction = function ($resource, aeraConfig) {
    var url = aeraConfig.apiEndpoint + '/chapter/:chapterId';
    return $resource(url, {chapterId: '@chapterId'});
  };

  var pageServiceFunction = function ($resource, aeraConfig) {
    var url = aeraConfig.apiEndpoint + '/page/:pageId';
    return $resource(url, {pageId: '@pageId'});
  };

  angular.module('aera-resources', ['ngResource', 'aera-config'])
      .service('ChapterService', ['$resource', 'aeraConfig', chapterServiceFunction])
      .service('PageService', ['$resource', 'aeraConfig', pageServiceFunction]);
})(angular);
