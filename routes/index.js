var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');
//var timeseries = require("timeseries-analysis");





router.get('/api/stations', function(req, res){
    models.Station.findAll().then(function(station){
        res.json(station);
    });
});

// get all todos
router.get('/api/sites', function(req, res) {

  var filter = [];
  if(req.query.notEmpty != null){
    filter.push({name : {
      $ne: ""
    }})
  }
  models.Site.findAll({
    where: 
      filter
   //   site_id: req.params.id
    
  }).then(function(site){
        res.json(site);
    });
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



// get all todos
router.get('/api/allocations', function(req, res) {



  models.sequelize.query('SELECT * FROM allocations', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
  // SELECT query - use then
//   var t     = new timeseries.main(timeseries.adapter.fromDB(results, {
//     date:   'createdAt',     // Name of the property containing the Date (must be compatible with new Date(date) )
//     value:  'price_1h'     // Name of the property containign the value. here we'll use the "close" price.
// }));

    res.json(results);
  // console.log(t.mean());

  })



});


// get single todo
router.get('/api/allocations/:id', function(req, res) {


    console.log(req.query.userName);

  models.Allocation.findAll({
    where: {
      site_id: req.params.id
    }
  }).then(function(site) {
    res.json(site);
  });
});





module.exports = router;
