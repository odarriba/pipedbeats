'use strict';

angular.module('pipedBeats').run(['$rootScope', 'soundCloud', function($rootScope, soundCloud){
  soundCloud.init($rootScope.config.soundCloud.clientId);
}]);
