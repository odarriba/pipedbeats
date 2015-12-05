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
    return playerStatusService.playList[playerStatusService.currentTrackIndex];
  };

  return playerStatusService;
});
