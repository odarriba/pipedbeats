'use strict';

angular.module('pipedBeats').controller('playerController', ['$scope', 'soundCloud',
  function($scope, soundCloud) {
    $scope.playerObject = $('nav.navbar-player audio#player-object');
    $scope.playing = false;

    $scope.currentList = {};
    $scope.currentTrackIndex = 0;

    $scope.currentTime = "00:00";
    $scope.totalTime = "00:00";

    $scope.playerObject.on('timeupdate', function() { $scope.$apply(function () { $scope.updateTimes(); }); });
    $scope.playerObject.on('duration', function() { $scope.$apply(function () { $scope.updateTimes(); }); });

    $scope.playerReady = function() {
      return ($scope.currentList.length > 0 && $scope.currentList[$scope.currentTrackIndex] !== undefined);
    };

    $scope.getCurrentTrack = function() {
      if ($scope.currentList[$scope.currentTrackIndex] === undefined) {
        $scope.currentTrackIndex = 0;
      }
      return $scope.currentList[$scope.currentTrackIndex];
    };

    $scope.updatePlayerTrack = function() {
      $scope.playerObject.attr('src', soundCloud.getStreamingURL($scope.getCurrentTrack()));
      $scope.playerObject.currentTime = 0;

      $scope.updateTimes();

      if ($scope.playing === true){
        $scope.play();
      }
    };

    $scope.updateTimes = function() {
      var parseTime = function(seconds) {
        var mins = Math.floor(seconds/60),
            secs = Math.floor(seconds%60);

        if (mins < 10) { mins = "0"+mins; }
        if (secs < 10) { secs = "0"+secs; }

        if (isNaN(mins) || isNaN(secs)) {
          return "00:00";
        }

        return mins+":"+secs;
      };

      $scope.currentTime = parseTime($scope.playerObject[0].currentTime);
      $scope.totalTime = parseTime($scope.playerObject[0].duration);
    };

    $scope.play = function() {
      if ($scope.playerReady()){
        $scope.playing = true;
        $scope.playerObject[0].play();
      }
    };

    $scope.pause = function() {
      $scope.playing = false;
      $scope.playerObject[0].pause();
    };

    $scope.next = function() {
      $scope.currentTrackIndex++;

      if ($scope.currentTrackIndex >= $scope.currentList.length) {
        $scope.currentTrackIndex = 0;
      }

      $scope.updatePlayerTrack();
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
      $scope.play();
    });
  }
]);
