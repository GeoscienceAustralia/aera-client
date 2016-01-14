'use strict';

(function (angular) {

  var chapterServiceFunction = function ($resource) {
    var url = 'http://localhost:3000/chapter/:chapterId';
    return $resource(url, {chapterId: '@chapterId'});
  };

  var pageServiceFunction = function ($resource) {
    var url = 'http://localhost:3000/page/:pageId';
    return $resource(url, {pageId: '@pageId'});
  };

  angular.module('aera-resources', ['ngResource'])
      .service('ChapterService', ['$resource', chapterServiceFunction])
      .service('PageService', ['$resource', pageServiceFunction]);
})(angular);
