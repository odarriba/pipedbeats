'use strict';

var app = angular.module("pipedBeats", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('start', {
      url: "/",
      templateUrl: "views/start/start.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "views/about/about.html"
    });
});

$("#player-volume .slider").slider({
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  tooltip: 'show'
});
