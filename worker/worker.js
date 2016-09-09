var Client = require('node-rest-client').Client;
var client = new Client();
client.get("http://opendata.dbbahnpark.info/api/beta/stations", function (data, response) {
    // parsed response body as js object 
    console.log(data);
});
