'use strict';

angular.module('pipedBeats').controller('playerController', ['$scope', 'soundCloud',
  function($scope, soundCloud) {
    $scope.playerObject = $('nav.navbar-player audio#player-object');
    $scope.playerObject[0].volume = 0.5;
    $scope.playing = false;

    $scope.sourceList = {};
    $scope.currentTrackIndex = 0;
    $scope.playList = [];

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


    // Function to ckeck if the player is ready to play
    $scope.playerReady = function() {
      return ($scope.sourceList.length > 0 && $scope.playList[$scope.currentTrackIndex] !== undefined);
    };

    // Function to obtain the information about current track
    $scope.getCurrentTrack = function() {
      return $scope.playList[$scope.currentTrackIndex];
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
    $scope.next = function() {
      var getNextTrack = function() {
        var possibleTrack = $scope.sourceList[Math.floor(Math.random()*$scope.sourceList.length)];

        // if there is no track yet, return the first coincidence
        if ($scope.playList.length === 0) {
          return possibleTrack;
        }

        // If there are more than 10 songs from the source, aplply the check on 10%
        if ($scope.sourceList.length >= 10) {
          // Only check the last X songs, where X is the 10% of the sourceList's length
          var lastPlayed = $scope.playList.slice(
            ($scope.playList.length - 1 - Math.ceil($scope.sourceList.lenth*0.1)),
            ($scope.playList.length - 1) );

          if (lastPlayed.indexOf(possibleTrack) >= 0) {
            return getNextTrack();
          }
        } else {
          // There are between 1 and 10, check that is not directly repeated
          if ($scope.sourceList.length > 1) {
            if ($scope.playList[$scope.playList.length-1] === possibleTrack) {
              return getNextTrack();
            }
          }
        }

        // If everything goes well or there is only one song, return the match
        return possibleTrack;
      };

      // Go to the next song of the playlist
      $scope.currentTrackIndex++;

      // If we are pointing to a inexistent track,
      if ($scope.currentTrackIndex === $scope.playList.length) {
        $scope.playList.push(getNextTrack());
      }

      $scope.updatePlayerTrack();
    };

    // Button function to go for the next track.
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
        $scope.sourceList = arg || {};
      }
      else {
        $scope.sourceList = {};
      }

      $scope.playList = [];

      $scope.currentTrackIndex = -1;
      $scope.next();
      $scope.play();
    });
  }
]);
