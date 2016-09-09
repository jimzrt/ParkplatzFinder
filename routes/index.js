var express = require('express');
var router = express.Router();
var models = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/station', function(req, res){
    models.station.create({
        bahn_id: req.body.bahn_id,
        name: req.body.name,
        city: req.body.city
    }).then(function(station){
        res.json(station);
    });
});

        

module.exports = router;
