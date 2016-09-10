google.load('visualization', '1', {
  packages: ['corechart']
});

google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['MyApp']);
});

angular.module('MyApp', []);
function mainController($scope, $http) {
	console.log("Hallo");
      $http.get('/api/sites/count')
		.success(function(data) {
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
    };







// var scotchTodo = angular.module('scotchTodo', []);

// function mainController($scope, $http) {
// 	$scope.formData = {};

// 	// when landing on the page, get all todos and show them
// 	$http.get('/api/sites')
// 		.success(function(data) {
// 			$scope.sites = data;
// 		})
// 		.error(function(data) {
// 			console.log('Error: ' + data);
// 		});



// }