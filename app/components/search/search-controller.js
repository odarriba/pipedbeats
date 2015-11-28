'use strict';

angular.module('pipedBeats').controller('searchController', ['$scope', '$state', 'urlParams', 'soundCloud',
  function($scope, $state, urlParams, soundCloud) {
    $scope.searchTerms = urlParams.terms;
    $scope.results = {};
    $scope.loading = true;

    if ($scope.searchTerms === '') {
      $state.go('start');
    }

    soundCloud.get('/tracks', { q: $scope.searchTerms }, function(tracks){
      // Assign results and disable laoding state
      $scope.$apply(function () {
        $scope.results = tracks;
        $scope.loading = false;
      });
    });
  }
])
.config(['$stateProvider', '$urlMatcherFactoryProvider',
  function($stateProvider, $urlMatcherFactoryProvider){
    /*
     * Route configuration related to this controller
     */

    // Custom matcher to avoid url-encoding problems and filter by pattern
    $urlMatcherFactoryProvider.type('searchValidQueries', {
        name: 'searchValidQueries',
        encode: function(val) {return val !== null ? val.toString() : val;},
        decode: function(val) {return val !== null ? val.toString() : val;},
        is: function () { return true; },
        pattern: /\/[a-z0-9]+:.+/i
    });

    $stateProvider
    .state('search', {
      url: "/search{searchQuery:searchValidQueries}",
      resolve: {
        // Function to parse the encoded params from URL
        urlParams : function($stateParams) {
          var queries = $stateParams.searchQuery.substring(1).split('/'),
              cleanQueries = [],
              result = {};

          for (var i in queries) {
            if (queries[i].match(/[a-z0-9]+:.+/i)) {
              cleanQueries.push(queries[i]);
            } else {
              cleanQueries[cleanQueries.length-1] += "/"+queries[i];
            }
          }

          for(var i in cleanQueries) {
            var query = cleanQueries[i].split(':');
            if (query.length > 1) {
              result[query.shift()] = query.join(':');
            }
          }

          return result;
        }
      },
      templateUrl: "../views/search/search.html",
      controller: 'searchController as searchCtrl'
    });
  }
]);
