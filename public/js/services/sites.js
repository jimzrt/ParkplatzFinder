// js/services/todos.js
angular.module('MyApp')
    .factory('Sites', function($http) {
        
            var Sites = {};

            Sites.getAll = function(query) {
                return $http.get('/api/sites' + (query || ""), { cache: true});
            };

             Sites.get = function(id) {
                return $http.get('/api/sites/'+id, { cache: true});
            };

            Sites.getNearest = function(lat, long, n){
                return $http.get('/api/sites/nearest?lat='+lat+'&long='+long, { cache: true});
            };
        return Sites;
    });