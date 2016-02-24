'use strict';

(function (angular) {

    var chapterServiceFunction = function ($http, apiEndpoint) {

        var chapterUrl = apiEndpoint + '/chapter/';

        this.getAll = function () {
            return $http.get(chapterUrl);
        };

        this.get = function (chapterId) {
            var requestUrl = chapterUrl + chapterId;
            return $http.get(requestUrl);
        };

        this.save = function (chapter) {
            var formData = new FormData();

            for (var property in chapter) {
                if (chapter.hasOwnProperty(property) && chapter[property]) {
                    formData.append(property, chapter[property]);
                }
            }

            var requestUrl = chapterUrl + 'save';
            return $http.post(requestUrl, formData, {
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
                if (page.hasOwnProperty(property) && page[property] && typeof page[property] !== 'object') {
                    formData.append(property, page[property]);
                }
            }

            return $http.post(url + 'save', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
    };

    var referenceServiceFunction = function ($http, apiEndpoint) {
        var url = apiEndpoint + '/reference/';

        this.get = function (pageId) {
            return $http.get(url + pageId);
        };

        this.save = function (pageId, references) {
            return $http.post(url + 'save', {
                pageId: pageId,
                references: references
            });
        }
    };

    angular.module('aera-resources', ['ngResource', 'aera-config'])
            .service('ChapterService', ['$http', 'apiEndpoint', chapterServiceFunction])
            .service('PageService', ['$http', 'apiEndpoint', pageServiceFunction])
            .service('ReferenceService', ['$http', 'apiEndpoint', referenceServiceFunction]);
})(angular);
