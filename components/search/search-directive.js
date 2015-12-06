'use strict';

// Directive to add functionality to search forms
angular.module('pipedBeats').directive('ngSearchForm', function() {
  return {
    restrict: 'A',
    controller: ['$scope', '$state', function($scope, $state){
      $scope.searchTerms = '';
      $scope.searchGenre = 'all';

      $scope.doSearch = function(filter)  {
        var callHash = {};

        if (filter === 'keywords') {
          callHash.q = $scope.searchTerms;
          callHash.genre = 'all';
        } else {
          if (filter === 'genre') {
            callHash.genre = $scope.searchGenre;
          }
          else {
            callHash.q = $scope.searchTerms;
            callHash.genre = $scope.searchGenre;
          }
        }

        if (callHash !== {}) {
          $state.go('search', callHash);
          $scope.searchTerms = '';
          $scope.searchGenre = 'all';
        }
      };
    }],
    link: function(scope , element , attributes) {
      // Add novalidate to the form element.
      attributes.$set('novalidate' , 'novalidate');
    }
  };
});
