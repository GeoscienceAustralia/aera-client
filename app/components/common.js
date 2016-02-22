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
    }

    angular.module('aera-common', [])
        .service('AeraCommon', ['$interval', commonsFunction])
})(angular);