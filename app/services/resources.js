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
        var url = apiEndpoint + '/page';

        this.get = function (pageId) {
            var requestUrl = url + pageId;
            return $http.get(requestUrl);
        };

        this.getCsvUrl = function (pageId) {
            var requestUrl = url + '/csv/' + pageId;
            return $http.get(requestUrl);
        };

        this.getImageUrl = function (pageId) {
            var requestUrl = url + '/image/' + pageId;
            return $http.get(requestUrl);
        };

        this.save = function (page) {
            var formData = new FormData();

            for (var property in page) {
                if (page.hasOwnProperty(property) && page[property]) {
                    formData.append(property, page[property]);
                }
            }

            return $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        this.saveAll = function (pages) {
            return $http.post(url + 'save/list', {pageList: pages});
        };
    };

    var sourcesServiceFunction = function ($http, apiEndpoint) {
        var url = apiEndpoint + '/source/';

        var transformSource = function (sources) {
            sources = angular.fromJson(sources);
            if (!sources.forEach)
                return sources;

            sources.forEach(function (source) {

                if (source.dateAccessed) {
                    source.dateAccessed = new Date(source.dateAccessed);
                }
            });

            return sources;
        };
    var sourcesServiceFunction = function ($http, apiEndpoint) {
        var url = apiEndpoint + '/source/';

        this.get = function (pageId) {
            return $http.get(url + 'page/' + pageId);
        };

        this.save = function (pageId, reference, referencePos) {
            var formData = new FormData();
            formData.append('pageId', pageId);
            for (var property in reference) {
                if (reference.hasOwnProperty(property) && reference[property] && typeof reference[property] !== 'object') {
                    formData.append(property, reference[property]);
                } else if (reference[property] instanceof Date) {
                    formData.append(property, moment(reference[property]).format('DD/MM/YYYY'));
                }
            }

            return $http.post(url + 'save', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined},
                referencePos: referencePos
            });
        };
    };

    var resourceServiceFunction = function ($http, apiEndpoint) {
        var url = apiEndpoint + '/resource/';

        this.get = function () {
            return $http.get(url);
        };
    };

    angular.module('aera-resources', ['ngResource', 'aera-config'])
        .service('ChapterService', ['$http', 'apiEndpoint', chapterServiceFunction])
        .service('PageService', ['$http', 'apiEndpoint', pageServiceFunction])
        .service('SourcesService', ['$http', 'apiEndpoint', sourcesServiceFunction])
        .service('ResourceService', ['$http', 'apiEndpoint', resourceServiceFunction]);
})(angular);
