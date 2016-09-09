'use strict';
module.exports = function(sequelize, DataTypes) {
  var site = sequelize.define('site', {
    station_nr: DataTypes.INTEGER,
    info: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    long: DataTypes.DOUBLE,
    open_time: DataTypes.STRING,
    access: DataTypes.STRING,
    price_1h: DataTypes.DOUBLE,
    price_1d: DataTypes.DOUBLE,
    price_1w: DataTypes.DOUBLE,
    price_20m: DataTypes.DOUBLE,
    price_30m: DataTypes.DOUBLE,
    duration: DataTypes.STRING,
    name: DataTypes.STRING,
    bundesland: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        site.belongsTo(models.station);
      }
    }
  });
  return site;
};
