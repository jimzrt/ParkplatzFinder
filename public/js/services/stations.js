// js/services/todos.js
angular.module('MyApp')
    .factory('Stations', function($http) {
        
            var Stations = {};

            Stations.getAll = function() {
                return $http.get('/api/stations');
            };

             Stations.get = function(id) {
                return $http.get('/api/stations/'+id);
            };
        return Stations;
    });