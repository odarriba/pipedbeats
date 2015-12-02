'use strict';

angular.module('pipedBeats').controller('playerController', ['$scope', 'soundCloud',
  function($scope, soundCloud) {
    $scope.playerObject = $('nav.navbar-player audio.player-object');
    $scope.playing = true;

    $scope.currentList = {};
    $scope.currentTrackIndex = 0;

    $scope.currentTime = "00:00";
    $scope.totalTime = "00:00";

    $scope.playerReady = function() {
      return ($scope.currentList.length > 0 && $scope.currentList[$scope.currentTrackIndex] !== undefined);
    };

    $scope.getCurrentTrack = function() {
      if ($scope.currentList[$scope.currentTrackIndex] !== undefined) {
        $scope.currentTrackIndex = 0;
      }
      return $scope.currentList[$scope.currentTrackIndex];
    };

    $scope.updatePlayerTrack = function() {
      $scope.playerObject.attr('src', soundCloud.getStreaming($scope.getCurrentTrack()));
      $scope.playerObject.currentTime = 0;

      $scope.updateTimes();

      if ($scope.playing === true){
        $scope.play();
      }
    };

    $scope.updateTimes = function() {
      var parseTime = function(seconds) {
        var mins = seconds%60,
            secs = seconds - mins*60;

        if (mins < 10) { mins = "0"+mins; }
        if (secs < 10) { secs = "0"+secs; }

        return mins+":"+secs;
      };

      $scope.currentTime = parseTime($scope.playerObject.played.end());
      $scope.totalTime = parseTime($scope.playerObject.seekable.end());
    };

    $scope.play = function() {
      if ($scope.playerReady()){
        $scope.playing = true;
        $scope.playerObject.play();
      }
    };

    $scope.pause = function() {
      $scope.playing = false;
      $scope.playerObject.pause();

      $scope.updateTimes();
    };

    $scope.$on('player.loadPlaylist', function (event, arg) {
      if (typeof arg !== Object) {
        $scope.currentList = arg || {};
      }
      else {
        $scope.currentList = {};
      }

      $scope.currentTrackIndex = 0;
      $scope.updatePlayerTrack();
    });
  }
]);
