// js/services/todos.js
angular.module('MyApp')
    .factory('Stations', function($http) {
        
            var Stations = {};

            Stations.getAll = function() {
                return $http.get('/api/stations', { cache: true});
            };

             Stations.get = function(id) {
                return $http.get('/api/stations/'+id, { cache: true});
            };
        return Stations;
    });