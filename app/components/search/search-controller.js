'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
  $scope.searchTerms = $stateParams.searchTerms;

  if ($scope.searchTerms === '') {
    $state.go('start');
  }
}]);
