angular.module('MyApp').controller('listController', listController);

          function listController ($scope) {
             $scope.fruitNames = ['Apple', 'Banana', 'Orange'];
			 $scope.vegNames = ['Carrot', 'Potato', 'Cabbage'];
			 $scope.eateries = ['Milk', 'Bread'];
          }	  