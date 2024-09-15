const Sequelize = require('sequelize');
const sequelizeDbConnect = require('../utils/db');

const ServiceProviderDetail = sequelizeDbConnect.define('ServiceProviderDetails', {
    serviceProviderDetailsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    experience: {
        type: Sequelize.STRING,
        allowNull: false
    },
    specialization: {
        type: Sequelize.STRING,
        allowNull: false
    },
    availability: {
        type: Sequelize.JSON, // Nested JSON structure for availability
        allowNull: false
    },
    previousWorkImages: {
        type: Sequelize.JSON, // Array of images stored as JSON
        allowNull: true
    },
    certificateImages: {
        type: Sequelize.JSON, // Array of certificates stored as JSON
        allowNull: true
    }
});

module.exports = ServiceProviderDetail;
