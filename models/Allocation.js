'use strict';
 module.exports = function(sequelize, DataTypes) {
   var Allocation = sequelize.define('Allocation', {
     site_id: DataTypes.INTEGER,
     category: DataTypes.INTEGER,
     timestamp: DataTypes.DATE     
   }, {
     classMethods: {
       associate: function(models) {
         // associations can be defined here
        // Allocation.belongsTo(models.Site);
       }
     }
   });
   return Allocation;
 };