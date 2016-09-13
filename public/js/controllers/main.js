// js/controllers/main.js
    
angular.module('MyApp').controller('AppCtrl', function ($http, $scope, $location, $timeout, $mdSidenav, $log,  $window, geolocationSvc, $mdToast, $mdDialog, uiGmapGoogleMapApi) {



//$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
angular.extend($scope, {
        map: {
            center: {
                latitude: 42.3349940452867,
                longitude:-71.0353168884369
            },
            zoom: 11,
            markers: [],
            events: {
            click: function (map, eventName, originalEventArgs) {
              $scope.map.markers.pop();
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                $scope.map.markers.push(marker);
                console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });




  var alert;
    $scope.showAlert = showAlert;
       $scope.showDialog = showDialog;
    $scope.items = [1, 2, 3];

    // Internal method
    function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'This is an example of how easy dialogs can be!',
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    }




    $scope.showPrerenderedDialog = function() {
  $mdDialog.show({
    contentElement: '#myStaticDialog',
    parent: angular.element(document.body)
  });

          $scope.closeDialog = function() {
          $mdDialog.hide();
        }
};

function showDialog($event) {
  console.log($scope.map);

   uiGmapGoogleMapApi.then(function(maps) {
        console.log('Google Maps loaded');


       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '  <md-dialog-content>'+
               '<ui-gmap-google-map ng-if="map.center" center="map.center" zoom="map.zoom" draggable="true" events="map.events">'+
        '<ui-gmap-marker ng-repeat="m in map.markers" coords="m.coords" icon="m.icon" idkey="m.id"></ui-gmap-marker>'+
    '</ui-gmap-google-map>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Close Dialog' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: $scope.items
         },
         controller: DialogController
      });
      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }

          });
    }
  

    


$scope.location = "";

$scope.located = false;

$scope.getCurrent = function(){
  geolocationSvc.getCurrentPosition().then(function(value){




$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + value.coords.latitude + '%2C' + value.coords.longitude + '&language=en').success(function(mapData) {
  $scope.location = mapData.results[0].address_components[2].long_name + ", " + mapData.results[0].address_components[6].long_name;
  $scope.located = true;

    });




 // $scope.location = value.coords.latitude;
}, function(reason) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(reason.message)
        .hideDelay(1000).position("top right")
    );
  
}



)};


  $scope.$back = function() { 
    window.history.back();
  };


$scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };


  $scope.toggleSidenavAndGoto = function(menuId, link) {

          if($window.innerWidth < 1280){
             $mdSidenav(menuId).toggle().then(function(){$location.url(link)});
           } else {   
            $mdSidenav(menuId).toggle();
            $location.url(link);
           }
         
    
  };


  $scope.menu = [
  {
      link : '/',
      title: 'Home',
      icon: 'home',
    },
    {
      link : '/stations',
      title: 'Bahnhöfe',
      icon: 'account_balance',
    },
    {
      link : '/sites',
      title: 'Parkhäuser',
      icon: 'local_parking',

    },
    {
      link : '/list',
      title: 'Liste',
      icon: 'list',

    }
  ];
  $scope.admin = [
    {
      link : '',
      title: 'Trash',
      icon: 'delete'
    },
    {
      link : '',
      title: 'Settings',
      icon: 'settings'
    }
  ];


    $scope.isActive = function(item) {
      if (item.link == $location.path()) {
        return true;
      }
      return false;
    };


    $scope.getActive = function() {
    return $scope.menu.filter(function( obj ) {

  return  $scope.isActive(obj) == true;

})[0];
    };






  });
 






angular.module('MyApp').controller('sitesController',['$scope', '$http', 'Sites', function($scope, $http, Sites) {



             Sites.getAll().success(function(dataSite) {

           //     var stations = dataStation.map(function(a) {return a.name;}).filter(Boolean).sort();
            //    var sites = dataSite.map(function(a) {return a.name;}).filter(Boolean).sort();


             $scope.items = dataSite;



            
  });

  

}]);



angular.module('MyApp').controller('homeController',['$scope', '$http', 'Sites', function($scope, $http, Sites) {




  

}]);




angular.module('MyApp').controller('chartsController', ['$scope', '$routeParams', 'Sites', 'Allocations',
   function ($scope, $routeParams, Sites, Allocations) {


    Sites.get($routeParams.id).success(function(data) {

Allocations.get($routeParams.id).success(function(data2) {

$scope.site = data[0]; 

 $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 40,
                    bottom: 40,
                    left: 75
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Zeit',
                    tickFormat: function(d){
                        return d3.time.format("%d.%m %H:%M")(new Date(d));
                    }
                   
                },
                yAxis: {
                    axisLabel: 'Freie Plätze',
                    tickFormat: d3.format("d"),
                    //axisLabelDistance: -10
                },
                forceY : [d3.min(data2, function (d) { return d.category; })-1,d3.max(data2, function (d) { return d.category; }) + 1],

                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            // title: {
            //     enable: true,
            //     text: 'Freie Plätze'
            // },
            // subtitle: {
            //     enable: true,
            //     text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            //     css: {
            //         'text-align': 'center',
            //         'margin': '10px 13px 0px 7px'
            //     }
            // },
            // caption: {
            //     enable: true,
            //     html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            //     css: {
            //         'text-align': 'justify',
            //         'margin': '10px 13px 0px 7px'
            //     }
            // }
        };


            var value = [];

              for(i = 0 ; i < data2.length;i++) {

          value.push({ "x" : Date.parse(data2[i].timestamp), "y" : data2[i].category});
        };


      $scope.data = [{
    key: data[0].name,
    values: value
}];

 
 });

});

    }]);




angular.module('MyApp').controller('instantSearchCtrl',function($scope,$http, Sites){
Sites.getAll().success(function(data) {
    $scope.items = data;
});


    $http.get('data.json').success(function(data, status, headers, config) {
        $scope.items = data.data;
    }).error(function(data, status, headers, config) {
        console.log("No data found..");
  });
});










 angular.module('MyApp').controller('DemoCtrl', DemoCtrl);

  function DemoCtrl ($timeout, $q, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var repos = [
        {
          'name'      : 'Angular 1',
          'url'       : 'https://github.com/angular/angular.js',
          'watchers'  : '3,623',
          'forks'     : '16,175',
        },
        {
          'name'      : 'Angular 2',
          'url'       : 'https://github.com/angular/angular',
          'watchers'  : '469',
          'forks'     : '760',
        },
        {
          'name'      : 'Angular Material',
          'url'       : 'https://github.com/angular/material',
          'watchers'  : '727',
          'forks'     : '1,241',
        },
        {
          'name'      : 'Bower Material',
          'url'       : 'https://github.com/angular/bower-material',
          'watchers'  : '42',
          'forks'     : '84',
        },
        {
          'name'      : 'Material Start',
          'url'       : 'https://github.com/angular/material-start',
          'watchers'  : '81',
          'forks'     : '303',
        }
      ];
      return repos.map( function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }



  angular.module('MyApp').controller('listController', listController);

          function listController ($scope, Stations, Sites, geolocationSvc) {

            $scope.stations = [];

            Stations.getAll().success(function(dataStation) {

                           $scope.stations = dataStation;

 });

                        $scope.sites = [];

             Sites.getAll("?notEmpty=1").success(function(dataSite) {

           //     var stations = dataStation.map(function(a) {return a.name;}).filter(Boolean).sort();
            //    var sites = dataSite.map(function(a) {return a.name;}).filter(Boolean).sort();


             $scope.sites = dataSite;



            
  });


          }   

// convert degrees to radians
Number.prototype.toRad = function() 
{ 
    return this * Math.PI / 180;
}


          function distanceFromCurrent(lat1, lon1, lat2, lon2) 
{  
    var currLat = lat1;
    var currLon = lon1;

    var pointLat = lat2;
    var pointLon = lon2;

    var R = 6371;                   //Radius of the earth in Km             
    var dLat = (pointLat - currLat).toRad();    //delta (difference between) latitude in radians
    var dLon = (pointLon - currLon).toRad();    //delta (difference between) longitude in radians

    currLat = currLat.toRad();          //conversion to radians
    pointLat = pointLat.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(currLat) * Math.cos(pointLat);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));   //must use atan2 as simple arctan cannot differentiate 1/1 and -1/-1
    var distance = R * c;   //sets the distance

    distance = Math.round(distance*10)/10;      //rounds number to closest 0.1 km
    return distance;    //returns the distance
}