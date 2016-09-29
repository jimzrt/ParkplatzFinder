var express = require('express');
var router = express.Router();
var models = require('../models/index');
var sequelize = require('sequelize');
var _ = require('lodash');
//var timeseries = require("timeseries-analysis");





router.get('/api/stations', function(req, res){
    models.Station.findAll().then(function(station){
        res.json(station);
    });
});

router.get('/api/sites/nearest', function(req, res){
    models.Site.findAll().then(function(sites){



 

      if(req.query.lat != null && req.query.long != null){

       for(var i=0; i < sites.length; i++){
        sites[i].dataValues.distance = distanceFromCurrent(req.query.lat, req.query.long, sites[i].dataValues.lat,sites[i].dataValues.long );

       }

     //  _.slice(array, [start=0], [end=array.length])
       sites = _.sortBy(sites, ['dataValues.distance']);
   //    sites = sites.splice[0,10];

      if(req.query.limit){
       sites =  _.slice(sites, 0, req.query.limit);
      }

      }





      
        res.json(sites);
      })
    });




// convert degrees to radians
Number.prototype.toRad = function() 
{ 
    return this * Math.PI / 180;
}
function distanceFromCurrent(lat1, lon1, lat2, lon2) 
{  
    var currLat = parseFloat(lat1);
    var currLon = parseFloat(lon1);

    var pointLat = parseFloat(lat2);
    var pointLon = parseFloat(lon2);

    var R = 6371;                   //Radius of the earth in Km             
    var dLat = (pointLat - currLat).toRad();    //delta (difference between) latitude in radians
    var dLon = (pointLon - currLon).toRad();    //delta (difference between) longitude in radians

    currLat = currLat.toRad();          //conversion to radians
    pointLat = pointLat.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(currLat) * Math.cos(pointLat);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));   //must use atan2 as simple arctan cannot differentiate 1/1 and -1/-1
    var distance = R * c;   //sets the distance

    distance = Math.round(distance*10)/10;      //rounds number to closest 0.1 km
    return distance;    //returns the distance
}
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
