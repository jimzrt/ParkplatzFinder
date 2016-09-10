// js/controllers/main.js
    
angular.module('MyApp').controller('sitesController', function($scope, $http, Sites) {

 Sites.getAll().success(function(data) {
console.log(data);

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
    }

    );






angular.module('MyApp').controller('chartsController', ['$scope', '$routeParams', 'Sites',
   function ($scope, $routeParams, Sites) {

   console.log($routeParams);

    Sites.get($routeParams.id).success(function(data) {


 $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time ',
                    tickFormat: function(d){
                        return d3.time.format("%d.%m.%y %H:%M")(new Date(d));
                    }
                   
                },
                yAxis: {
                    axisLabel: 'Preis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };


            var value = [];

              for(i = 0 ; i < data.length;i++) {

          value.push({ "x" : Date.parse(data[i].createdAt), "y" : data[i].price_1h});
        };


      $scope.data = [{
    key: data[0].name,
    values: value
}];



});

    }]);