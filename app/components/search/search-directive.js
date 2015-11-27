'use strict';

// Directive to add functionality to search forms
angular.module('pipedBeats').directive('ngSearchForm', function() {
  return {
    restrict: 'A',
    controller: ['$scope', '$state', function($scope, $state){
      $scope.searchTerms = '';

      $scope.doSearch = function() {
        if ($scope.searchTerms !== '') {
          $state.go('search', {searchQuery: $scope.buildSearchQuery()});
          $scope.searchTerms = '';
        }
      };

      $scope.buildSearchQuery = function() {
        var query = "";

        if ($scope.searchTerms !== undefined && $scope.searchTerms !== ""){
          query += "/terms:"+$scope.searchTerms;
        }
        if ($scope.searchGenre !== undefined && $scope.searchGenre !== ""){
          query += "/genre:"+$scope.searchGenre;
        }

        return query;
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
