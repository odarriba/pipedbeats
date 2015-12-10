'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$rootScope', '$state', '$stateParams', 'playerStatus', 'soundCloud',
  function($scope, $rootScope, $state, $stateParams, playerStatus, soundCloud) {
    $scope.searchTerms = $stateParams.q || '';
    $scope.searchGenre = $stateParams.genre || '';
    $scope.recoverSearch = $stateParams.recoverSearch || false;
    $scope.results = {};

    $scope.currentTrackTitle = "";
    $scope.currentTrackAuthor = "";
    $scope.currentTrackAutorUrl = "";

    $scope.currentCover = "";
    $scope.lastCover = "";
    $scope.lastLastCover = "";

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

    // If there is no search params, return to the start.
    if ($scope.searchTerms === '' && $scope.searchGenre === '') {
      $state.go('start');
    }

    // Need to do the search or it's a recovery of the latest one?
    if ($scope.recoverSearch !== true) {
      $scope.loading = true;

      var callHash = { "limit" : 200 };

      if ($scope.searchTerms !== '') { callHash.q = $scope.searchTerms; }
      if ($scope.searchGenre !== '' && $scope.searchGenre !== 'all') { callHash.genres = $scope.searchGenre; }

      // Track the search
      dataLayer.push({
        "event" : "search",
        "searchGenre" : $scope.searchGenre,
        "searchKeywords" : $scope.searchTerms
      });

      soundCloud.get('/tracks', callHash, function(tracks){
        // Assign results and disable laoding state
        $scope.$apply(function () {
          $scope.loading = false;
          $rootScope.$broadcast('player.loadPlaylist', tracks);

          // Store as current search params
          $rootScope.currentSearch = {
            searchGenre : $scope.searchGenre,
            searchTerms : $scope.searchTerms
          };
        });
      });
    } else {
      // Track the search recovery
      dataLayer.push({
        "event" : "recoverSearch",
        "searchGenre" : $scope.searchGenre,
        "searchKeywords" : $scope.searchTerms
      });

      playerStatus.notifyChange();
    }
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
      controller: 'searchController as searchCtrl',
      params: {recoverSearch : false}
    });
  }
]);
