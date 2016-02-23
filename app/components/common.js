'use strict';

(function (angular) {

    var commonsFunction = function ($interval) {
        this.setProgressBar = function (bar){
            var j = 0, counter = 0;
            bar.mode = 'query';
            bar.activated = true;
            bar.modes = [ ];

            $interval(function () {
                bar.determinateValue += 1;
                bar.determinateValue2 += 1.5;

                if (bar.determinateValue > 100) bar.determinateValue = 30;
                if (bar.determinateValue2 > 100) bar.determinateValue2 = 30;
                if ((j < 2) && !bar.modes[j] && bar.activated) {
                    bar.modes[j] = (j == 0) ? 'buffer' : 'query';
                }
                if (counter++ % 4 == 0) j++;
                if (j == 2) bar.contained = "indeterminate";
            }, 100, 0, true);
        }
    };

    var aeraReferenceFilterFunction = function ($filter) {
        return function (reference) {
            var author = reference.author ? reference.author + ' ' : '';
            var year = reference.publicationYear ? '(' + reference.publicationYear + '). ' : '';
            var title = reference.title ? reference.title + '. ' : '';
            var publication = reference.publication ? '<i>' + reference.publication + '</i>. ' : '';
            var dateAccessed = reference.dateAccessed ? 'Retrieved ' + $filter('date')(reference.dateAccessed, 'MMMM d, yyyy') + ', ' : '';
            var url = reference.url ? 'from ' + reference.url : '';
            return author + year + title + publication + dateAccessed + url;
        };
    };

  angular.module('aera-common', [])
        .service('AeraCommon', ['$interval', commonsFunction])
        .filter('aera-reference', ['$filter', aeraReferenceFilterFunction]);

})(angular);