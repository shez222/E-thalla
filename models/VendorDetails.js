const Sequelize = require('sequelize');
const sequelizeDbConnect = require('../utils/db');

const VendorDetail = sequelizeDbConnect.define('VendorDetails', {
    vendorId: {
        type: Sequelize.STRING, // ID can be a string or UUID
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company: {
        type: Sequelize.STRING,
        allowNull: false
    },
    experience: {
        type: Sequelize.STRING, // Years of experience as string
        allowNull: false
    },
    specialization: {
        type: Sequelize.STRING, // List of specializations stored as a comma-separated string
        allowNull: false
    },
    availability: {
        type: Sequelize.JSON, // Nested JSON for availability
        allowNull: false
    },
    previousWork: {
        type: Sequelize.JSON, // Array of previous work, each containing project details
        allowNull: true
    },
    certifications: {
        type: Sequelize.JSON, // Array of certifications, each containing details
        allowNull: true
    },
    contactInfo: {
        type: Sequelize.JSON, // Nested JSON for contact info (email, phone, address)
        allowNull: false
    }
});

module.exports = VendorDetail;
