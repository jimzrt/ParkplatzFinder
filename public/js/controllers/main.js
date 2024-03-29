// js/controllers/main.js

angular.module('MyApp').controller('AppCtrl', function($http, $scope, $rootScope, $location, $timeout, $mdSidenav, $log, $window, geolocationSvc, $mdToast, $mdDialog, uiGmapGoogleMapApi) {


    $rootScope.catToFree = function(category) {
        switch (category) {
            case 0:
                return "0";
                break;
            case 1:
                return "0 - 10";
                break;
            case 2:
                return "10 - 30";
                break;
            case 3:
                return "30 - 50";
                break;
            case 4:
                return "Mehr als 50";
                break;
            default:
                return "Unbekannt";
        }
    }

    //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    angular.extend($scope, {
        map: {
            center: {
                latitude: 51.3388,
                longitude: 6.5853
            },
            zoom: 11,
            markers: [],
            events: {
                click: function(map, eventName, originalEventArgs) {
                    $scope.map.markers.pop();
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),
                        lon = e.latLng.lng();
                    var marker = {
                        id: Date.now(),
                        coords: {
                            latitude: lat,
                            longitude: lon
                        }
                    };
                    $scope.map.markers.push(marker);
                    $scope.$apply();
                }
            }
        }
    });




    var alert;
    $scope.showAlert = showAlert;
    $scope.items = [1, 2, 3];

    // Internal method
    function showAlert() {
        alert = $mdDialog.alert({
            title: 'Attention',
            textContent: 'This is an example of how easy dialogs can be!',
            ok: 'Close'
        });

        $mdDialog
            .show(alert)
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
            if ($scope.map.markers.length > 0) {
                console.log($scope.map.markers);
                setLocationName($scope.map.markers[0].coords.latitude, $scope.map.markers[0].coords.longitude);
            } else {
                console.log("nope");
            }

            $mdDialog.hide();
        }
    };








    $rootScope.location = {};
    $rootScope.location.text = "";



    $rootScope.located = false;

    $scope.getCurrent = function() {
        geolocationSvc.getCurrentPosition().then(function(value) { setLocationName(value.coords.latitude, value.coords.longitude) }, function(reason) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(reason.message)
                .hideDelay(1000).position("top right")
            );

        });



    };


    function setLocationName(lat, long) {




        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + long + '&language=en').success(function(mapData) {
            $rootScope.location.text = mapData.results[1].formatted_address;
            $rootScope.location.lat = lat;
            $rootScope.location.long = long;

            console.log("get address")

            $rootScope.located = true;

        });




        // $scope.location = value.coords.latitude;
    };


    $scope.$back = function() {
        window.history.back();
    };


    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };


    $scope.toggleSidenavAndGoto = function(menuId, link) {

        if ($window.innerWidth < 1280) {
            $mdSidenav(menuId).toggle().then(function() { $location.url(link) });
        } else {
            $mdSidenav(menuId).toggle();
            $location.url(link);
        }


    };


    $scope.menu = [{
            link: '/',
            title: 'Home',
            icon: 'home',
        },
        // {
        //   link : '/stations',
        //   title: 'Bahnhöfe',
        //   icon: 'account_balance',
        // },
        {
            link: '/sites',
            title: 'Parkhäuser filtern',
            icon: 'local_parking',

        },
        // {
        //   link : '/list',
        //   title: 'Liste',
        //   icon: 'list',

        // }
    ];
    $scope.admin = [{
        link: '',
        title: 'Parkaus hinzufügen',
        icon: 'delete'
    }, {
        link: '',
        title: 'Parkhaus bewerten',
        icon: 'settings'
    }];


    $scope.isActive = function(item) {
        if (item.link == $location.path()) {
            return true;
        }
        return false;
    };


    $scope.getActive = function() {
        return $scope.menu.filter(function(obj) {

            return $scope.isActive(obj) == true;

        })[0];
    };







    $scope.result = ''
        //    $scope.details = ''
    $scope.options = {};

    $scope.options.watchEnter = true;


    //     $scope.options.types = '(cities)';




    $scope.$watch('details.geometry.location', function(newValue, oldValue) {
        if ($scope.details != undefined) {
            $scope.map.markers.pop();
            var lat = $scope.details.geometry.location.lat(),
                lon = $scope.details.geometry.location.lng();
            var marker = {
                id: Date.now(),
                coords: {
                    latitude: lat,
                    longitude: lon
                }
            };
            $scope.map.center = {
                    latitude: lat,
                    longitude: lon
                },
                $scope.map.markers.push(marker);
        }


        // console.log($scope.details.geometry.location.lat());
    });

    $scope.$watch('location.lat', function(newValue, oldValue) {
        if ($rootScope.location.lat != undefined) {
            $scope.map.markers.pop();
            var lat = $rootScope.location.lat,
                lon = $rootScope.location.long;
            var marker = {
                id: Date.now(),
                coords: {
                    latitude: lat,
                    longitude: lon
                }
            };
            $scope.map.center = {
                    latitude: lat,
                    longitude: lon
                },
                $scope.map.markers.push(marker);
        }




    });









});




angular.module('MyApp').controller('stationsController', ['$rootScope', '$scope', '$http', 'Sites', function($rootScope, $scope, $http, Sites) {

    $scope.props = ["name", "bundesland", "free"];


    Sites.getAll().success(function(dataSite) {


        //     var stations = dataStation.map(function(a) {return a.name;}).filter(Boolean).sort();
        //    var sites = dataSite.map(function(a) {return a.name;}).filter(Boolean).sort();


        $scope.wines = dataSite;




    });


    // Variables - Public
    $scope.filter = {};
    /*  $scope.wines = [
        {name: 'Wine A', category: 'red'},
        {name: 'Wine B', category: 'red'},
        {name: 'Wine C', category: 'white'},
        {name: 'Wine D', category: 'red'},
        {name: 'Wine E', category: 'red'},
        {name: 'Wine F', category: 'white'},
        {name: 'Wine G', category: 'champagne'},
        {name: 'Wine H', category: 'champagne'}    
        ];*/

    // Functions - Public
    $scope.filterByProperties = filterByProperties;
    $scope.getValuesFor = getValuesFor;

    // Functions - Definitions
    function filterByProperties(wine) {
        var activeFilterProps = Object.
        keys($scope.filter).
        filter(function(prop) {
            return !noFilter($scope.filter[prop]); });

        // Use this snippet for matching with AND
        return activeFilterProps.
        every(function(prop) {
            return $scope.filter[prop][wine[prop]]; });
        // Use this snippet for matching with OR
        //return !activeFilterProps.length || activeFilterProps.
        //  some(function (prop) { return $scope.filter[prop][wine[prop]]; });
    }

    function getValuesFor(prop) {
        return ($scope.wines || []).
        map(function(wine) {
            return wine[prop]; }).
        filter(function(value, idx, arr) {
            return arr.indexOf(value) === idx; }).sort(function(a, b) {
            return a - b;
        });
    }

    function noFilter(filterObj) {
        return Object.
        keys(filterObj).
        every(function(key) {
            return !filterObj[key]; });
    }





}]);


angular.module('MyApp').controller('sitesController', ['$rootScope', '$scope', '$http', 'Sites', function($rootScope, $scope, $http, Sites) {

    $scope.filter = {};
    $scope.quantity = 30;
    $scope.filterdata = {};
    $scope.filterdata.price = {};

    $scope.filterdata.price1hEnabled = false;
    $scope.filterdata.price1dEnabled = false;
    $scope.filterdata.price1wEnabled = false;


    $scope.filterdata.price.p1h = 2;
    $scope.filterdata.price.p1d = 10;
    $scope.filterdata.price.p1w= 20;


    $scope.filterdata.priceUnknown = false;

    $scope.price1hOptions = [{
        value: 0.5,
        name: '0,50€'
    }, {
        value: 1,
        name: '1€'
    }, {
        value: 2,
        name: '2€'
    }, {
        value: 3,
        name: '3€'
    }, {
        value: 5,
        name: '5€'
    }];

        $scope.price1dOptions = [{
        value: 2,
        name: '2€'
    }, {
        value: 5,
        name: '5€'
    }, {
        value: 10,
        name: '10€'
    }, {
        value: 15,
        name: '15€'
    }, {
        value: 20,
        name: '20€'
    }];

     $scope.price1wOptions = [{
        value: 10,
        name: '10€'
    }, {
        value: 20,
        name: '20€'
    }, {
        value: 30,
        name: '30€'
    }, {
        value: 40,
        name: '40€'
    }, {
        value: 50,
        name: '50€'
    }];

    $scope.filterdSites = {};



    $scope.priceFilter = function(criteria, category) {
        return function(item) {
            var result = true;
            if ($scope.filterdata.price1hEnabled) {
                result = item.price_1h <= criteria.p1h;
                if (item.price_1h == null) result = $scope.filterdata.priceUnknown;
                if(result == false)
                  return false;
            }
            if ($scope.filterdata.price1dEnabled) {
                result = item.price_1d <= criteria.p1d;
                if (item.price_1d == null) result = $scope.filterdata.priceUnknown;
                if(result == false)
                  return false;
            }
            if ($scope.filterdata.price1wEnabled) {
                result = item.price_1w <= criteria.p1w;
                if (item.price_1w == null) result = $scope.filterdata.priceUnknown;
                if(result == false)
                  return false;
            }


            return result;

        }

    };


    if (!$rootScope.located) {
        Sites.getAll().success(function(dataSite) {

            $scope.sites = dataSite;


        });


    }



    $rootScope.$watch('location.text', function(newValue, oldValue) {
        if (newValue) {


            $scope.sites = [{}];
            $scope.sites[0].name = "Lade........";

            Sites.getNearest($rootScope.location.lat, $rootScope.location.long, -1).success(function(dataSite) {
                $scope.sites = dataSite;
            });



        };
        // var someVar = [Do something with someVar];

        // angular copy will preserve the reference of $scope.someVar
        // so it will not trigger another digest 
        //    angular.copy(someVar, $scope.someVar);

    });













}]);



angular.module('MyApp').controller('homeController', ['$scope', '$rootScope', '$http', 'Sites', function($scope, $rootScope, $http, Sites) {

    console.log();

    $scope.nearest = [{}];
    $scope.nearest[0].name = "Bitte Standort festlegen...";

    $rootScope.$watch('location.text', function(newValue, oldValue) {
        if (newValue) {
            $scope.nearest = [{}];
            $scope.nearest[0].name = "Lade........";

            Sites.getNearest($rootScope.location.lat, $rootScope.location.long, 10).success(function(data) {
                $scope.nearest = data;
            });



        };
        // var someVar = [Do something with someVar];

        // angular copy will preserve the reference of $scope.someVar
        // so it will not trigger another digest 
        //    angular.copy(someVar, $scope.someVar);

    });

}]);




angular.module('MyApp').controller('chartsController', ['$scope', '$routeParams', 'Sites', 'Allocations',
    function($scope, $routeParams, Sites, Allocations) {


        Sites.get($routeParams.id).success(function(data) {

            Allocations.get($routeParams.id).success(function(data2) {

                $scope.site = data[0];

                $scope.options = {
                    chart: {
                        type: 'lineChart',
                        height: 450,
                        margin: {
                            top: 20,
                            right: 40,
                            bottom: 40,
                            left: 75
                        },
                        x: function(d) {
                            return d.x; },
                        y: function(d) {
                            return d.y; },
                        useInteractiveGuideline: true,
                        dispatch: {
                            stateChange: function(e) { console.log("stateChange"); },
                            changeState: function(e) { console.log("changeState"); },
                            tooltipShow: function(e) { console.log("tooltipShow"); },
                            tooltipHide: function(e) { console.log("tooltipHide"); }
                        },
                        xAxis: {
                            axisLabel: 'Zeit',
                            tickFormat: function(d) {
                                return d3.time.format("%d.%m %H:%M")(new Date(d));
                            }

                        },
                        yAxis: {
                            axisLabel: 'Freie Plätze',
                            tickFormat: d3.format("d"),
                            //axisLabelDistance: -10
                        },
                        forceY: [d3.min(data2, function(d) {
                            return d.category; }) - 1, d3.max(data2, function(d) {
                            return d.category; }) + 1],

                        callback: function(chart) {
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

                for (i = 0; i < data2.length; i++) {

                    value.push({ "x": Date.parse(data2[i].timestamp), "y": data2[i].category });
                };


                $scope.data = [{
                    key: data[0].name,
                    values: value
                }];


            });

        });

    }
]);




angular.module('MyApp').controller('instantSearchCtrl', function($scope, $http, Sites) {
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

function DemoCtrl($timeout, $q, $log) {
    var $scope = this;

    $scope.simulateQuery = false;
    $scope.isDisabled = false;

    $scope.repos = loadAll();
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos,
            deferred;
        if ($scope.simulateQuery) {
            deferred = $q.defer();
            $timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
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
        var repos = [{
            'name': 'Angular 1',
            'url': 'https://github.com/angular/angular.js',
            'watchers': '3,623',
            'forks': '16,175',
        }, {
            'name': 'Angular 2',
            'url': 'https://github.com/angular/angular',
            'watchers': '469',
            'forks': '760',
        }, {
            'name': 'Angular Material',
            'url': 'https://github.com/angular/material',
            'watchers': '727',
            'forks': '1,241',
        }, {
            'name': 'Bower Material',
            'url': 'https://github.com/angular/bower-material',
            'watchers': '42',
            'forks': '84',
        }, {
            'name': 'Material Start',
            'url': 'https://github.com/angular/material-start',
            'watchers': '81',
            'forks': '303',
        }];
        return repos.map(function(repo) {
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

function listController($scope, Stations, Sites, geolocationSvc) {

    //     $scope.stations = [];

    Stations.getAll().success(function(dataStation) {


        setTimeout(function() {
            $scope.stations = dataStation;
            $scope.$apply();

        }, 50);

    });

    //    $scope.sites = [];

    Sites.getAll("?notEmpty=1").success(function(dataSite) {

        //     var stations = dataStation.map(function(a) {return a.name;}).filter(Boolean).sort();
        //    var sites = dataSite.map(function(a) {return a.name;}).filter(Boolean).sort();
        //    $scope.sites = dataSite;

        setTimeout(function() {
            $scope.sites = dataSite;
            $scope.$apply();

        }, 50);





    });


}

// convert degrees to radians
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}


function distanceFromCurrent(lat1, lon1, lat2, lon2) {
    var currLat = lat1;
    var currLon = lon1;

    var pointLat = lat2;
    var pointLon = lon2;

    var R = 6371; //Radius of the earth in Km             
    var dLat = (pointLat - currLat).toRad(); //delta (difference between) latitude in radians
    var dLon = (pointLon - currLon).toRad(); //delta (difference between) longitude in radians

    currLat = currLat.toRad(); //conversion to radians
    pointLat = pointLat.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(currLat) * Math.cos(pointLat);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //must use atan2 as simple arctan cannot differentiate 1/1 and -1/-1
    var distance = R * c; //sets the distance

    distance = Math.round(distance * 10) / 10; //rounds number to closest 0.1 km
    return distance; //returns the distance
}
