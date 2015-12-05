'use strict';

angular.module('pipedBeats').factory('playerStatus', function($rootScope) {
  var playerStatusService = {};

  playerStatusService.playing = false;
  playerStatusService.sourceList = {};
  playerStatusService.currentTrackIndex = 0;
  playerStatusService.playList = [];

  playerStatusService.isReady = function() {
    return (playerStatusService.sourceList.length > 0 && playerStatusService.playList[playerStatusService.currentTrackIndex] !== undefined);
  };

  playerStatusService.isPlaying = function() {
    return playerStatusService.playing;
  };

  playerStatusService.notifyChange = function() {
    return $rootScope.$broadcast('playerStatus.change');
  };

  playerStatusService.getCurrentTrack = function() {
    return playerStatusService.getTrack(0);
  };

  playerStatusService.getTrack = function(index) {
    index = index || 0;

    if (index < 0 || index > playerStatusService.playList.length-1) { return undefined; }

    return playerStatusService.playList[playerStatusService.currentTrackIndex - index];
  };

  return playerStatusService;
});
