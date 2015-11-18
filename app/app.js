'use strict';

var app = angular.module('pipedBeats', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('start', {
      url: "/",
      templateUrl: "../views/start/start.html"
    })
    .state('search', {
      url: "/search/:searchTerms",
      templateUrl: "../views/search/search.html",
      controller: 'searchController'
    })
    .state('about', {
      url: "/about",
      templateUrl: "../views/about/about.html"
    });
});

app.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.config = {
      soundCloud : {
        clientId : 'b1d604e6c71ffb73a022a80766d869f1'
      }
    };
  }
]);
