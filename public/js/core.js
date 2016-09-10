google.load('visualization', '1', {
  packages: ['corechart']
});



var app = angular.module('MyApp', ["ngRoute", "nvd3"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.htm"
    })
    .when("/sites", {
        templateUrl : "sites.htm",
        controller: "sitesController"

    })
    .when("/charts/:id", {
        templateUrl : "charts.htm",
        controller: "chartsController"
    })
    .when("/blue", {
        templateUrl : "blue.htm"
    });

     $locationProvider.html5Mode(true);
});




