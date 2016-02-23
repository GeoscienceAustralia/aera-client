'use strict';

(function (angular) {

    var chapterServiceFunction = function ($http, apiEndpoint) {
        this.getAll = function () {
            var requestUrl = apiEndpoint + '/chapter/';
            return $http.get(requestUrl);
        };

        this.get = function (chapterId) {
            var requestUrl = apiEndpoint + '/chapter/' + chapterId;
            return $http.get(requestUrl);
        };

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
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
    };

    angular.module('aera-resources', ['ngResource', 'aera-config'])
        .service('ChapterService', ['$http', 'apiEndpoint', chapterServiceFunction])
        .service('PageService', ['$http', 'apiEndpoint', pageServiceFunction]
    );
})(angular);
