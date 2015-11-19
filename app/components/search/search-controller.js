'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', '$stateParams', 'soundCloud', function($scope, $state, $stateParams, soundCloud) {
  $scope.searchTerms = $stateParams.searchTerms;
  $scope.results = {};
  $scope.loading = true;

  if ($scope.searchTerms === '') {
    $state.go('start');
  }

  soundCloud.get('/tracks', { q: $scope.searchTerms }, function(tracks){
    // Assign results and disable laoding state
    $scope.$apply(function () {
      $scope.results = tracks;
      $scope.loading = false;
    });
  });
}]);
