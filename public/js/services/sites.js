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
        return Sites;
    });