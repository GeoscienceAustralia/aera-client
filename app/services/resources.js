'use strict';

(function (angular) {

    var chapterServiceFunction = function ($resource, $http, $q) {
        this.getAll = function () {
            var requestUrl = 'http://localhost:8080/api/chapter/';
            return $http.get(requestUrl);
        }

        this.get = function (chapterId) {
            var requestUrl = 'http://localhost:8080/api/chapter/' + chapterId;
            return $http.get(requestUrl);
        }

        this.save = function (chapter) {
            var formData = new FormData();

            if (chapter.chapterId) {
                formData.append('chapterId', chapter.chapterId);
            }

            if (chapter.title) {
                formData.append('title', chapter.title);
            }

            if (chapter.summary) {
                formData.append('summary', chapter.summary);
            }

            if (chapter.resourceId) {
                formData.append('resourceId', chapter.resourceId);
            }

            return $http.post('http://localhost:8080/api/chapter/save', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
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
