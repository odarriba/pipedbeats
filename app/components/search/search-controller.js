'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', '$stateParams', 'soundCloud',
  function($scope, $state, $stateParams, soundCloud) {
    $scope.searchTerms = $stateParams.q || '';
    $scope.searchGenre = $stateParams.genre || '';
    $scope.results = {};
    $scope.loading = true;

    if ($scope.searchTerms === '' || $scope.searchGenre === '') {
      $state.go('start');
    }

    soundCloud.get('/tracks', { q: $scope.searchTerms }, function(tracks){
      // Assign results and disable laoding state
      $scope.$apply(function () {
        $scope.results = tracks;
        $scope.loading = false;
      });
    });
  }
])
.config(['$stateProvider', '$urlMatcherFactoryProvider',
  function($stateProvider, $urlMatcherFactoryProvider){
    /*
     * Route configuration related to this controller
     */
    $stateProvider
    .state('search', {
      url: "/search/:genre/?q",
      templateUrl: "../views/search/search.html",
      controller: 'searchController as searchCtrl'
    });
  }
]);
