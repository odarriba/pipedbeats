'use strict';

angular.module('pipedBeats').factory('soundCloud', ['$rootScope', function($rootScope){
  $rootScope.soundCloud = $rootScope.soundCloud || {};

  return {
    // Function to store the clientId
    init : function(clientId) {
      clientId = clientId || false;
      if (clientId === false){ return false; }

      $rootScope.soundCloud.clientId = clientId;
      return clientId;
    },
    get : function(url, params, callback){
      // Include domain?
      if (url.indexOf("//api.soundcloud.com") <= -1) {
        url = "https://api.soundcloud.com"+url;
      }

      // Add the clientId
      if (url.indexOf("?") > -1) {
        url += "&client_id="+$rootScope.soundCloud.clientId;
      } else {
        url += "?client_id="+$rootScope.soundCloud.clientId;
      }

      // Do the magic
      $.getJSON(url, params)
        .success(callback)
        .error(function(e){
          console.log("[SoundCloud] Error calling to " + url);
          console.log(e);
        });
    }
  };
}]);
