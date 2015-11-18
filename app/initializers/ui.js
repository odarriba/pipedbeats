'use strict';

angular.module('pipedBeats').run(function(){
  $("#player-volume .slider").slider({
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    tooltip: 'show'
  });
});
