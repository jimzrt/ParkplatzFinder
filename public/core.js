google.load('visualization', '1', {
  packages: ['corechart']
});


var app = angular.module('MyApp', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'sitesController'
    });

  $urlRouterProvider.otherwise('home');
}]);


