'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$rootScope', '$state', '$stateParams', 'playerStatus', 'soundCloud',
  function($scope, $rootScope, $state, $stateParams, playerStatus, soundCloud) {
    $scope.searchTerms = $stateParams.q || '';
    $scope.searchGenre = $stateParams.genre || '';
    $scope.results = {};

    $scope.currentTrackTitle = "";
    $scope.currentTrackAuthor = "";
    $scope.currentTrackAutorUrl = "";

    $scope.currentCover = "";
    $scope.lastCover = "";
    $scope.lastLastCover = "";

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

    $scope.$on('playerStatus.change', function() {
      $scope.currentTrackTitle = playerStatus.getCurrentTrack().title;
      $scope.currentTrackAuthor = playerStatus.getCurrentTrack().user.username;
      $scope.currentTrackAuthorUrl = playerStatus.getCurrentTrack().user.permalink_url;

      $scope.currentCover = "";
      $scope.currentCover = (playerStatus.getCurrentTrack().artwork_url || "").replace('large', 'crop');

      if (playerStatus.getTrack(1) !== undefined) {
        $scope.lastCover = (playerStatus.getTrack(1).artwork_url || "").replace('large', 'crop');

        if (playerStatus.getTrack(2) !== undefined) {
          $scope.lastLastCover = (playerStatus.getTrack(2).artwork_url || "").replace('large', 'crop');
        }
      }
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
