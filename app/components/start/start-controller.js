'use strict';

angular.module('pipedBeats').controller('startController', ['$scope', function($scope) {
  $scope.activeTab = 'genre';
  
  $scope.showTab = function(id) {
    $scope.activeTab = id;
    return id;
  };

  $scope.isTabActive = function(id) {
    return ($scope.activeTab === id);
  };
}]);
