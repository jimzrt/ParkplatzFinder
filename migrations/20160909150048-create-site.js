'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      station_nr: {
        type: Sequelize.INTEGER
      },
      info: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      long: {
        type: Sequelize.DOUBLE
      },
      open_time: {
        type: Sequelize.STRING
      },
      access: {
        type: Sequelize.STRING
      },
      price_1h: {
        type: Sequelize.DOUBLE
      },
      price_1d: {
        type: Sequelize.DOUBLE
      },
      price_1w: {
        type: Sequelize.DOUBLE
      },
      price_20m: {
        type: Sequelize.DOUBLE
      },
      price_30m: {
        type: Sequelize.DOUBLE
      },
      duration: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      bundesland: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('sites');
  }
};