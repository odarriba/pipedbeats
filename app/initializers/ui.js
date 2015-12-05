'use strict';

angular.module('pipedBeats').run(['$rootScope', function($rootScope){

  $rootScope.progressSlider = $("#player-progress .slider").slider({
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    tooltip: 'show'
  });
}]);
