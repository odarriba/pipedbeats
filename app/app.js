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
      controller: "startController",
      templateUrl: "../views/start/start.html"
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
    $rootScope.gtm = {referrerSended : false};

    $rootScope.config = {
      soundCloud : {
        clientId : 'b1d604e6c71ffb73a022a80766d869f1'
      }
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var dataLayerView = {
        "event" : "pageView",
        "pageName" : event.currentScope.$state.href(toState, toParams)
      };

      if (event.currentScope.$root.gtm.referrerSended !== true) {
        dataLayerView.pageReferrer = document.referrer;
        event.currentScope.$root.gtm.referrerSended = true;
      }

      dataLayer.push(dataLayerView);
    });
  }
]);
