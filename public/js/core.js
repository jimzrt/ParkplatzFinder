

var app = angular.module('MyApp', ["ngRoute", "ngMaterial", "nvd3","angular.filter",'ngMdIcons', 'uiGmapgoogle-maps']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.htm",
        controller : "homeController"
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


app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue').dark();


    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('grey');
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});


