'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$rootScope', '$state', '$stateParams', 'soundCloud',
  function($scope, $rootScope, $state, $stateParams, soundCloud) {
    $scope.searchTerms = $stateParams.q || '';
    $scope.searchGenre = $stateParams.genre || '';
    $scope.results = {};

    if ($scope.searchTerms === '' || $scope.searchGenre === '') {
      $state.go('start');
    }

    $scope.loading = true;

    soundCloud.get('/tracks', { q: $scope.searchTerms, limit: 100 }, function(tracks){
      // Assign results and disable laoding state
      $scope.$apply(function () {
        $scope.loading = false;
        $rootScope.$broadcast('player.loadPlaylist', tracks);
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
