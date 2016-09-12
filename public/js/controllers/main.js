// js/controllers/main.js
    
angular.module('MyApp').controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, geolocationSvc) {


  $scope.$back = function() { 
    window.history.back();
  };


    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })









angular.module('MyApp').controller('sitesController', function($scope, $http, Sites) {

 Sites.getAll().success(function(data) {
console.log(data);

$scope.sites = data;
        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', 'year/mon');
        data1.addColumn('number', 'avarage');
        for(i = 0 ; i < data.length;i++) {

          data1.addRow([data[i].createdAt, data[i].price_1h]);
        };
        var options = {
          'title':'Sample Title',
          'height':300
        };
        var chart = new google.visualization.LineChart(document.getElementById('chart_div1'));
        var formatter = new google.visualization.NumberFormat(
          {fractionDigits: 2}
        );
        formatter.format(data1, 1);
        chart.draw(data1, options);
      });
    }

    );






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

            Stations.getAll().success(function(dataStation) {
             Sites.getAll("?notEmpty=1").success(function(dataSite) {

           //     var stations = dataStation.map(function(a) {return a.name;}).filter(Boolean).sort();
            //    var sites = dataSite.map(function(a) {return a.name;}).filter(Boolean).sort();


             $scope.stations = dataStation;
             $scope.sites = dataSite;

             console.log(2);


             });
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