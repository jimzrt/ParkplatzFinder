'use strict';
module.exports = function(sequelize, DataTypes) {
  var station = sequelize.define('station', {
    bahn_id: {type:DataTypes.INTEGER,primaryKey:true},
    name: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        station.hasMany(models.site)
      }
    }
  });
  return station;
};
