'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', '$stateParams', 'soundCloud', function($scope, $state, $stateParams, soundCloud) {
  $scope.searchTerms = $stateParams.searchTerms;

  if ($scope.searchTerms === '') {
    $state.go('start');
  }

  soundCloud.get('/tracks', { q: $scope.searchTerms }, function(tracks){
    console.log(tracks);
  });
}]);
