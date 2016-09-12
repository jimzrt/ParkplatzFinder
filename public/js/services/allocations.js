// js/services/todos.js
angular.module('MyApp')
    .factory('Allocations', function($http) {
        
            var Allocations = {};

            Allocations.getAll = function() {
                return $http.get('/api/allocations');
            };

             Allocations.get = function(id) {
                return $http.get('/api/allocations/'+id);
            };
        return Allocations;
    });