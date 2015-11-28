'use strict';

// Directive to add functionality to search forms
angular.module('pipedBeats').directive('ngSearchForm', function() {
  return {
    restrict: 'A',
    controller: ['$scope', '$state', function($scope, $state){
      $scope.searchTerms = '';
      $scope.searchGenre = 'all';

      $scope.doSearch = function() {
        if ($scope.searchTerms !== '') {
          $state.go('search', {genre: $scope.searchGenre, q: $scope.searchTerms});
          $scope.searchTerms = '';
        }
      };
    }],
    link: function(scope , element , attributes) {
      // Add novalidate to the form element.
      attributes.$set('novalidate' , 'novalidate');
      element.bind('submit', function(e) {
        e.preventDefault();
        scope.doSearch();
      });
    }
  };
});
