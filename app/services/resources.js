'use strict';

(function (angular) {

    var chapterServiceFunction = function ($resource, apiEndpoint) {
        var url = apiEndpoint + '/chapter/:chapterId';
        return $resource(url, {chapterId: '@chapterId'});
    };

    var pageServiceFunction = function ($http, apiEndpoint) {
        var url = apiEndpoint + '/page/';

        this.get = function (pageId) {
            var requestUrl = url + pageId;
            return $http.get(requestUrl);
        };

        this.getCsvUrl = function (pageId) {
            var requestUrl = url + 'csv/' + pageId;
            return $http.get(requestUrl);
        };

        this.getImageUrl = function (pageId) {
            var requestUrl = url + 'image/' + pageId;
            return $http.get(requestUrl);
        };

        this.save = function (page) {
            var formData = new FormData();

            for (var property in page) {
              if (page.hasOwnProperty(property) && page[property]) {
                formData.append(property, page[property]);
              }
            }

            return $http.post(url + 'save', formData, {
                transformRequest: angular.identity, // stop default transformRequest from serialising FormData object
                headers: {'Content-Type': undefined} // will be set to multipart/form-data by browser
            });
        }
    };

    angular.module('aera-resources', ['ngResource', 'aera-config'])
        .service('ChapterService', ['$resource', 'apiEndpoint', chapterServiceFunction])
        .service('PageService', ['$http', 'apiEndpoint', pageServiceFunction]
    );
})(angular);
