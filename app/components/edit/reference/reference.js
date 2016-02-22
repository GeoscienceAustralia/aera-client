'use strict';

(function (angular) {

  var referenceControllerFunction = function ($filter) {
    var reference = this;

    reference.updateOutputString = function () {
      var author = reference.author ? reference.author + ' ' : '';
      var year = reference.publicationYear ? '(' + reference.publicationYear + '). ' : '';
      var title = reference.title ? reference.title + '. ' : '';
      var publication = reference.publication ? '<i>' + reference.publication + '</i>. ' : '';
      var dateAccessed = reference.dateAccessed ? 'Retrieved ' + $filter('date')(reference.dateAccessed, 'MMMM d, yyyy') + ', ' : '';
      var url = reference.url ? 'from ' + reference.url : '';

      reference.outputString = author + year + title + publication + dateAccessed + url;
    }
  };

  var referenceDirectiveFunction = function () {
    return {
      restrict: 'E',
      templateUrl: 'components/edit/reference/reference.html',
      controller: 'ReferenceController as reference'
    };
  };

  angular.module('aera-edit')
      .controller('ReferenceController', ['$filter', referenceControllerFunction])
      .directive('aeraReference', referenceDirectiveFunction);
})(angular);