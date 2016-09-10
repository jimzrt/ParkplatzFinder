var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');
var timeseries = require("timeseries-analysis");





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


// get single todo
router.get('/api/sites/:id', function(req, res) {
  models.Site.findAll({
    where: {
      site_id: req.params.id
    }
  }).then(function(site) {
    res.json(site);
  });
});




module.exports = router;
