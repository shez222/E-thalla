const Sequelize = require('sequelize');
const sequelizeDbConnect = require('../utils/db');

const Location = sequelizeDbConnect.define('location', {
    locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    state: {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    },
    postalCode: {
        type: Sequelize.STRING,
        allowNull: true
    },
    latitude: {
        type: Sequelize.DECIMAL(9, 6), // Precision and scale for latitude
        allowNull: true
    },
    longitude: {
        type: Sequelize.DECIMAL(9, 6), // Precision and scale for longitude
        allowNull: true
    }
});

module.exports = Location;
