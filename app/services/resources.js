'use strict';

(function (angular) {

    var chapterServiceFunction = function (aeraConfig, $resource) {
        var url = aeraConfig.apiEndpoint + '/chapter/:chapterId';
        return $resource(url, {chapterId: '@chapterId'});
    };

    var pageServiceFunction = function (aeraConfig, $http) {

        var url = aeraConfig.apiEndpoint + '/page/';

        this.get = function (pageId) {
            var requestUrl = url + pageId;
            return $http.get(requestUrl)
        };

        this.save = function (page) {
            var formData = new FormData();

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

            return $http.post(url + 'create', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
    };

    angular.module('aera-resources', ['ngResource', 'aera-config'])
        .service('ChapterService', ['aeraConfig', '$resource', chapterServiceFunction])
        .service('PageService', ['aeraConfig', '$http', pageServiceFunction]
    );
})(angular);
