var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');
var timeseries = require("timeseries-analysis");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/station', function(req, res){
    models.Station.create({
        station_id: req.body.station_id,
        name: req.body.name,
        city: req.body.city
    }).then(function(station){
        res.json(station);
    });
});

// get all todos
router.get('/api/sites', function(req, res) {



	models.sequelize.query('SELECT * FROM sites LIMIT 100', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
  // SELECT query - use then
  var t     = new timeseries.main(timeseries.adapter.fromDB(results, {
    date:   'createdAt',     // Name of the property containing the Date (must be compatible with new Date(date) )
    value:  'price_1h'     // Name of the property containign the value. here we'll use the "close" price.
}));

    res.json(results);
  console.log(t.mean());

  })



});


router.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
        

module.exports = router;
