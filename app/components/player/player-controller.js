'use strict';

angular.module('pipedBeats').controller('playerController', ['$scope', 'soundCloud',
  function($scope, soundCloud) {
    $scope.playerObject = $('nav.navbar-player audio#player-object');
    $scope.playerObject[0].volume = 0.5;
    $scope.playing = false;

    $scope.currentList = {};
    $scope.currentTrackIndex = 0;

    $scope.currentTime = "00:00";
    $scope.totalTime = "00:00";

    // Initialize the volume slider
    $scope.volumeSlider = $("nav.navbar-player #player-volume .slider").slider({
      min: 0,
      max: 1,
      value: 0.5,
      step: 0.01,
      tooltip: 'show'
    }).on('slideStop', function(ev){ $scope.$apply(function () { $scope.updateVolume(ev.value); }); });

    $scope.progressSlider = $("nav.navbar-player #player-progress .slider").slider({
      min: 0,
      max: 100,
      value: 0,
      step: 1,
      tooltip: 'show'
    }).on('slideStop', function(ev){ $scope.$apply(function () { $scope.updatePosition(ev.value); }); });

    // Events of the player
    $scope.playerObject.on('timeupdate', function() { $scope.$apply(function () { $scope.updateTimes(); }); });
    $scope.playerObject.on('duration', function() { $scope.$apply(function () { $scope.updateTimes(); }); });


    // Function to ckeck if the player is ready to play
    $scope.playerReady = function() {
      return ($scope.currentList.length > 0 && $scope.currentList[$scope.currentTrackIndex] !== undefined);
    };

    // Function to obtain the information about current track
    $scope.getCurrentTrack = function() {
      if ($scope.currentList[$scope.currentTrackIndex] === undefined) {
        $scope.currentTrackIndex = 0;
      }
      return $scope.currentList[$scope.currentTrackIndex];
    };

    // Function to update the track on the player
    $scope.updatePlayerTrack = function() {
      $scope.playerObject.attr('src', soundCloud.getStreamingURL($scope.getCurrentTrack()));
      $scope.playerObject.currentTime = 0;

      $scope.updateTimes();

      if ($scope.playing === true){
        $scope.play();
      }
    };

    // Function to update the times on the $scope variables
    // to update the UI.
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

      // Update slider max if needed
      if ($scope.progressSlider.slider('getMax') !== $scope.playerObject[0].duration) {
        $scope.progressSlider.slider('setMax', $scope.playerObject[0].duration);
      }

      // Update slider time
      $scope.progressSlider.slider('setValue', $scope.playerObject[0].currentTime);
    };

    // Function to change the volume value
    $scope.updateVolume = function(value) {
      $scope.playerObject[0].volume = value;
    };

    // Function to change the position value
    $scope.updatePosition = function(value) {
      $scope.playerObject[0].currentTime = value;
    };

    // Button function to play the beats.
    $scope.play = function() {
      if ($scope.playerReady()){
        $scope.playing = true;
        $scope.playerObject[0].play();
      }
    };

    // Button function to pause the beats
    $scope.pause = function() {
      $scope.playing = false;
      $scope.playerObject[0].pause();
    };

    // Button function to go for the next track.
    // TODO: random selection fo tracks
    $scope.next = function() {
      $scope.currentTrackIndex++;

      if ($scope.currentTrackIndex >= $scope.currentList.length) {
        $scope.currentTrackIndex = 0;
      }

      $scope.updatePlayerTrack();
    };

    // Button function to go for the next track.
    // TODO: Use previous played tracks to navigate.
    $scope.back = function() {
      if ($scope.playerObject[0].currentTime > 5 || $scope.currentTrackIndex <= 0) {
        $scope.playerObject[0].currentTime = 0;
      } else {
        $scope.currentTrackIndex--;
        $scope.updatePlayerTrack();
      }

      return true;
    };

    // Event handler to load a new playlist from other controllers
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
