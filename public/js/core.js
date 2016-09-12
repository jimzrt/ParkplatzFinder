

var app = angular.module('MyApp', ["ngRoute", "ngMaterial", "nvd3","angular.filter",'ngMdIcons']);

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


app.config(function($mdThemingProvider) {
  var customBlueMap =       $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

