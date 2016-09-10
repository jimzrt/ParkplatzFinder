var geolib = require('geolib');
var models = require('../models/index');
var Client = require('node-rest-client').Client;
var client = new Client();
models.sequelize.sync().then(function(){


	setInterval(function() {
    // your code goes here...


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



  	  	console.log(
    distanceFromCurrent(parseFloat(data.results[key].parkraumGeoLatitude), parseFloat(data.results[key].parkraumGeoLongitude), 51.2277, 6.7735)
  ); 

  	  	console.log(
    distanceLib(parseFloat(data.results[key].parkraumGeoLatitude), parseFloat(data.results[key].parkraumGeoLongitude), 51.2277, 6.7735)
  ); 
  	models.Site.create({
  		    site_id: data.results[key].parkraumId,
    station_id: data.results[key].parkraumBahnhofNummer,
    info: data.results[key].parkraumBetreiber,
    lat: parseFloat(data.results[key].parkraumGeoLatitude),
    long: parseFloat(data.results[key].parkraumGeoLongitude),
    cos_lat : Math.cos(parseFloat(data.results[key].parkraumGeoLatitude) * Math.PI / 180),
sin_lat : Math.sin(parseFloat(data.results[key].parkraumGeoLatitude) * Math.PI / 180),
cos_long : Math.cos(parseFloat(data.results[key].parkraumGeoLongitude) * Math.PI / 180),
sin_long : Math.sin(parseFloat(data.results[key].parkraumGeoLongitude) * Math.PI / 180),
    open_time: data.results[key].parkraumOeffnungszeiten,
    access: data.results[key].parkraumZufahrt,
    price_1h: data.results[key].tarif1Std ? parseFloat(data.results[key].tarif1Std.replace(',', '.')) : null,
    price_1d: data.results[key].tarif1Tag ? parseFloat(data.results[key].tarif1Tag.replace(',', '.')) : null,
    price_1w: data.results[key].tarif1Woche ? parseFloat(data.results[key].tarif1Woche.replace(',', '.')) : null,
    price_20m: data.results[key].tarif20Min ? parseFloat(data.results[key].tarif20Min.replace(',', '.')) : null,
    price_30m: data.results[key].tarif30Min ? parseFloat(data.results[key].tarif30Min.replace(',', '.')) : null,
    duration: data.results[key].tarifParkdauer,
    name: data.results[key].parkraumDisplayName,
    bundesland: data.results[key].bundesland

			}).then(function(station){
				console.log("added site");
			});


    


    }

});


}, 10000); // 60 * 1000 milsec

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

