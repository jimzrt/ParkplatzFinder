

var app = angular.module('MyApp', ["ngRoute", "ngMaterial", "nvd3","angular.filter"]);

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
    .when("/list", {
        templateUrl : "list.htm",
         controller: "listController"
    });

     $locationProvider.html5Mode(true);
});




