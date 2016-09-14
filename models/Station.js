'use strict';
 module.exports = function(sequelize, DataTypes) {
   var Station = sequelize.define('Station', {
     station_id: DataTypes.INTEGER,
     name: DataTypes.STRING,
     city: DataTypes.STRING
   }, {
     classMethods: {
       associate: function(models) {
         // associations can be defined here
       //  Station.hasMany(models.Site)
       }
     }, instanceMethods: {
      
       createSalt: function() {
        return 10;
      }
    }
   });
   return Station;
 };