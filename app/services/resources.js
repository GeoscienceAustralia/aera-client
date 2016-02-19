'use strict';

(function (angular) {

    var chapterServiceFunction = function ($resource) {
        var url = 'http://localhost:8080/api/chapter/:chapterId';
        return $resource(url, {chapterId: '@chapterId'});
    };

    var pageServiceFunction = function ($resource, $http, $q) {
        this.get = function (pageId) {
            var requestUrl = 'http://localhost:8080/api/page/' + pageId;
            return $http.get(requestUrl);
        }

        this.getCsvUrl = function (pageId) {
            var deferred = $q.defer();
            var requestUrl = 'http://localhost:8080/api/page/csv/' + pageId;
            return $http.get(requestUrl);
        }

        this.getImageUrl = function (pageId) {
            var deferred = $q.defer();
            var requestUrl = 'http://localhost:8080/api/page/image/' + pageId;
            return $http.get(requestUrl);
        }

        this.save = function (page) {
            var deferred = $q.defer();
            var formData = new FormData();

            if (page.pageId) {
                formData.append('pageId', page.pageId);
            }

            if (page.chapterId) {
                formData.append('chapterId', page.chapterId);
            }

            if (page.title) {
                formData.append('title', page.title);
            }

            if (page.summary) {
                formData.append('summary', page.summary);
            }

            if (page.imageFile) {
                formData.append('imageFile', page.imageFile);
            }

            if (page.csvFile) {
                formData.append('csvFile', page.csvFile);
            }

            $http.post('http://localhost:8080/api/page/save', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }
    };

    angular.module('aera-resources', ['ngResource'])
        .service('ChapterService', ['$resource', chapterServiceFunction])
        .service('PageService', ['$resource', '$http', '$q', pageServiceFunction]
    );
})(angular);
