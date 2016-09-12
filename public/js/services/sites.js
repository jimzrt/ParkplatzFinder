// js/services/todos.js
angular.module('MyApp')
    .factory('Sites', function($http) {
        
            var Sites = {};

            Sites.getAll = function(query) {
                return $http.get('/api/sites' + query);
            };

             Sites.get = function(id) {
                return $http.get('/api/sites/'+id);
            };
        return Sites;
    });