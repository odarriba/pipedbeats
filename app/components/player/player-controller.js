'use strict';

angular.module('pipedBeats').controller('playerController', ['$scope', 'playerStatus', 'soundCloud',
  function($scope, playerStatus, soundCloud) {
    $scope.playerStatus = playerStatus;
    $scope.playerObject = $('nav.navbar-player audio#player-object');
    $scope.playerObject[0].volume = 0.5;

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
    $scope.playerObject.on('ended', function() { $scope.$apply(function () { $scope.next(); }); });

    // Function to update the track on the player
    $scope.updatePlayerTrack = function() {
      $scope.playerObject.attr('src', soundCloud.getStreamingURL(playerStatus.getCurrentTrack()));
      $scope.playerObject.currentTime = 0;

      $scope.updateTimes();

      if (playerStatus.isPlaying() === true){
        $scope.play();
      }
    };

    // Function to update the times on the $scope variables
    // to update the UI.
    $scope.updateTimes = function() {
      var parseTime = function(seconds) {
        var mins = Math.floor(seconds/60),
            secs = Math.floor(seconds%60);

        // Not valid number, return default value
        if (isNaN(mins) || isNaN(secs)) { return "00:00"; }

        if (mins < 10) { mins = "0"+mins; }
        if (secs < 10) { secs = "0"+secs; }

        return mins+":"+secs;
      };

      $scope.currentTime = parseTime($scope.playerObject[0].currentTime);
      $scope.totalTime = parseTime($scope.playerObject[0].duration);

      // Update slider time and max (if needed)
      $scope.progressSlider.slider('setValue', $scope.playerObject[0].currentTime);

      if ($scope.progressSlider.slider('getMax') !== $scope.playerObject[0].duration) {
        $scope.progressSlider.slider('setMax', $scope.playerObject[0].duration);
      }
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
      if (playerStatus.isReady()){
        playerStatus.playing = true;
        playerStatus.notifyChange();

        $scope.playerObject[0].play();
      }
    };

    // Button function to pause the beats
    $scope.pause = function() {
      playerStatus.playing = false;
      playerStatus.notifyChange();

      $scope.playerObject[0].pause();
    };

    // Button function to go for the next track.
    $scope.next = function() {
      var getNextTrack = function() {
        var possibleTrack = playerStatus.sourceList[Math.floor(Math.random()*playerStatus.sourceList.length)];

        // if there is no track yet, return the first coincidence
        if (playerStatus.playList.length === 0) {
          return possibleTrack;
        }

        // If there are more than 10 songs from the source, aplply the check on 10%
        if (playerStatus.sourceList.length >= 10) {
          // Only check the last X songs, where X is the 10% of the sourceList's length
          var lastPlayed = playerStatus.playList.slice(
            (playerStatus.playList.length - 1 - Math.ceil(playerStatus.sourceList.lenth*0.1)),
            (playerStatus.playList.length - 1) );

          if (lastPlayed.indexOf(possibleTrack) >= 0) {
            return getNextTrack();
          }
        } else {
          // There are between 1 and 10, check that is not directly repeated
          if (playerStatus.sourceList.length > 1) {
            if (playerStatus.playList[playerStatus.playList.length-1] === possibleTrack) {
              return getNextTrack();
            }
          }
        }

        // If everything goes well or there is only one song, return the match
        return possibleTrack;
      };

      // Go to the next song of the playlist
      playerStatus.currentTrackIndex++;

      // If we are pointing to a inexistent track,
      if (playerStatus.currentTrackIndex === playerStatus.playList.length) {
        playerStatus.playList.push(getNextTrack());
      }

      playerStatus.notifyChange();
      $scope.updatePlayerTrack();
    };

    // Button function to go for the next track.
    $scope.back = function() {
      if ($scope.playerObject[0].currentTime > 5 || playerStatus.currentTrackIndex <= 0) {
        $scope.playerObject[0].currentTime = 0;
      } else {
        playerStatus.currentTrackIndex--;
        $scope.updatePlayerTrack();
      }

      return true;
    };

    // Event handler to load a new playlist from other controllers
    $scope.$on('player.loadPlaylist', function (event, arg) {
      if (typeof arg !== Object) {
        playerStatus.sourceList = arg || {};
      }
      else {
        playerStatus.sourceList = {};
      }

      playerStatus.playList = [];
      playerStatus.currentTrackIndex = -1;

      $scope.next();
      $scope.play();
    });
  }
]);
