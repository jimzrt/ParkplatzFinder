// var d3 = require('d3');
var models = require('../models/index');
var Client = require('node-rest-client').Client;
var client = new Client();
// var SegfaultHandler = require('segfault-handler');

// SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name


models.sequelize.sync().then(function(){

    client.get("http://opendata.dbbahnpark.info/api/beta/stations", function (data, response) {
  //console.log(data.results[0]);
    // parsed response body as js object 

  for (var key = 0; key < data.results.length; key++) {
      models.Station.find({
        where: {
          station_id: data.results[key].bahnhofsNummer
        }
      }).then(updateStations.bind(null, data.results[key]));


    }

});


        client.get("http://opendata.dbbahnpark.info/api/beta/sites", function (data, response) {
  //console.log(data.results[0]);
    // parsed response body as js object 



  for (var key = 0; key < data.results.length; key++) {
      models.Site.find({
        where: {
          site_id: data.results[key].parkraumId
        }
      }).then(updateSites.bind(null, data.results[key]));


    }


//     var landAvg = d3.mean(data.results, function(d) { return parseInt(d.parkraumStellplaetze); });
// console.log("AVG: " + landAvg);

});





	setInterval(function() {
    // your code goes here...






		client.get("http://opendata.dbbahnpark.info/api/beta/occupancy", function (data, response) {
	//console.log(data.results[0]);
    // parsed response body as js object 

  for (var key = 0; key < data.allocations.length; key++) {

     models.Allocation.find({
        where: {
          site_id:  data.allocations[key].site.siteId,
          timestamp: new Date(data.allocations[key].allocation.timeSegment)
        }
      }).then(updateAllocations.bind(null, data.allocations[key]));

      

  // 	  	console.log(
  //   distanceFromCurrent(parseFloat(data.parkraumGeoLatitude), parseFloat(data.parkraumGeoLongitude), 51.2277, 6.7735)
  // ); 

  // 	  	console.log(
  //   distanceLib(parseFloat(data.parkraumGeoLatitude), parseFloat(data.parkraumGeoLongitude), 51.2277, 6.7735)
  // ); 



  

    


    }

});




}, 60 * 1000); // 60 * 1000 milsec

});

function updateStations(data,stationExist) {
		if(stationExist){
			stationExist.updateAttributes({
				name: data.station,
				city: data.cityTitle
			}).then(function(station) {
				console.log("updated station");
			});
		}else {

			models.Station.create({
				station_id: data.bahnhofsNummer,
				name: data.station,
				city: data.cityTitle
			}).then(function(station){
				console.log("added station");
			});
		}
	}

function updateSites(data,siteExists) {
    if(siteExists){
      siteExists.updateAttributes({
       open_time: data.parkraumOeffnungszeiten,
    access: data.parkraumZufahrt,
    price_1h: data.tarif1Std ? parseFloat(data.tarif1Std.replace(',', '.')) : null,
    price_1d: data.tarif1Tag ? parseFloat(data.tarif1Tag.replace(',', '.')) : null,
    price_1w: data.tarif1Woche ? parseFloat(data.tarif1Woche.replace(',', '.')) : null,
    price_20m: data.tarif20Min ? parseFloat(data.tarif20Min.replace(',', '.')) : null,
    price_30m: data.tarif30Min ? parseFloat(data.tarif30Min.replace(',', '.')) : null,
    duration: data.tarifParkdauer,
    name: data.parkraumDisplayName,
    bundesland: data.bundesland
      }).then(function(station) {
        console.log("updated site");
      });
    }else {

models.Site.create({
          site_id: data.parkraumId,
    station_id: data.parkraumBahnhofNummer,
    info: data.parkraumBetreiber,
    lat: parseFloat(data.parkraumGeoLatitude),
    long: parseFloat(data.parkraumGeoLongitude),
    cos_lat : Math.cos(parseFloat(data.parkraumGeoLatitude) * Math.PI / 180),
sin_lat : Math.sin(parseFloat(data.parkraumGeoLatitude) * Math.PI / 180),
cos_long : Math.cos(parseFloat(data.parkraumGeoLongitude) * Math.PI / 180),
sin_long : Math.sin(parseFloat(data.parkraumGeoLongitude) * Math.PI / 180),
    open_time: data.parkraumOeffnungszeiten,
    access: data.parkraumZufahrt,
    price_1h: data.tarif1Std ? parseFloat(data.tarif1Std.replace(',', '.')) : null,
    price_1d: data.tarif1Tag ? parseFloat(data.tarif1Tag.replace(',', '.')) : null,
    price_1w: data.tarif1Woche ? parseFloat(data.tarif1Woche.replace(',', '.')) : null,
    price_20m: data.tarif20Min ? parseFloat(data.tarif20Min.replace(',', '.')) : null,
    price_30m: data.tarif30Min ? parseFloat(data.tarif30Min.replace(',', '.')) : null,
    duration: data.tarifParkdauer,
    name: data.parkraumDisplayName,
    bundesland: data.bundesland

      }).then(function(station){
        console.log("added site");
      });
    }
  }


function updateAllocations(data,allocationExist) {
    if(allocationExist){
      console.log("allocation already exists");
    }else {



      models.Site.find({
        where: {
          site_id:data.site.siteId
        }
      }).then(function(site){




  models.Allocation.create({
        site_id: data.site.siteId,
        category: data.allocation.category,
        timestamp: data.allocation.timeSegment
      }).then(function(allocation){


        console.log("added allocation");



        site.setAllocations(allocation).then(function() {
  console.log("saved!");
});

        site.updateAttributes({
        free: allocation.category
      }).then(function(station) {
        console.log("updated price");
      });
 


      });





      });




    }
  }






function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = toRad(lat2-lat1);  // Javascript functions in radians
  var dLon = toRad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function distance2(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

// convert degrees to radians
Number.prototype.toRad = function() 
{ 
    return this * Math.PI / 180;
}
function distanceFromCurrent(lat1, lon1, lat2, lon2) 
{  
    var currLat = lat1;
    var currLon = lon1;

    var pointLat = lat2;
    var pointLon = lon2;

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

function distanceLib(lat1, lon1, lat2, lon2)
{
	return geolib.getDistance(
    {latitude: lat1, longitude: lon1},
    {latitude: lat2, longitude: lon2}
);
}

/** Converts numeric degrees to radians */
  function toRad(n) {
    return n * Math.PI / 180;
  
}

