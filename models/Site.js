'use strict';
 module.exports = function(sequelize, DataTypes) {
   var Site = sequelize.define('Site', {
     station_id: DataTypes.INTEGER,
     site_id: DataTypes.INTEGER,
     info: DataTypes.STRING,
     lat: DataTypes.DOUBLE,
     long: DataTypes.DOUBLE,
     sin_lat: DataTypes.DOUBLE,
     sin_long: DataTypes.DOUBLE,
     cos_lat: DataTypes.DOUBLE,
     cos_long: DataTypes.DOUBLE,
     open_time: DataTypes.STRING,
     access: DataTypes.STRING,
     price_1h: DataTypes.DOUBLE,
     price_1d: DataTypes.DOUBLE,
     price_1w: DataTypes.DOUBLE,
     price_20m: DataTypes.DOUBLE,
     price_30m: DataTypes.DOUBLE,
     duration: DataTypes.STRING,
     name: DataTypes.STRING,
     bundesland: DataTypes.STRING,
     free: DataTypes.INTEGER
     }, {
     classMethods: {
       associate: function(models) {

        Site.hasMany(models.Allocation)

       }
     }
   });
   return Site;



 };