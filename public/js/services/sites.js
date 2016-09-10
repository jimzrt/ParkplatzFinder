// js/services/todos.js
angular.module('MyApp')
    .factory('Sites', function($http) {
        
            var Sites = {};

            Sites.getAll = function() {
                return $http.get('/api/sites');
            };

             Sites.get = function(id) {
                return $http.get('/api/sites/'+id);
            };
        return Sites;
    });