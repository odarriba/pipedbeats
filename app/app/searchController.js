'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', function($scope, $state) {
    $scope.searchTerms = '';

    $scope.doSearch = function() {
      if ($scope.searchTerms !== '') {
        $state.go('search', {searchTerms: $scope.searchTerms});
      }
    };
}]);
