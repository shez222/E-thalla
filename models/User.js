const Sequelize = require('sequelize');
const sequelizeDbConnect =require('../utils/db');

const MultiUser = sequelizeDbConnect.define('MultiUser',{
    multiUserId : {
        type:Sequelize.INTEGER,
        allowNull:true,
        autoIncrement: true,
        primaryKey:true
    },
    password : {
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    userName:{
        type: Sequelize.STRING,
        allowNull:false
    },
    vendor: {
        type: Sequelize.BOOLEAN,
        allowNull:false
    },
    serviceProvider:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    servicProviderDetals: {
        type:Sequelize.INTEGER,
        references:{
            model:'ServicePovider',
            key: 'serviceProviderDetailsId'
        }
    },
    visitor: {
        type:Sequelize.STRING,
        allowNull:false
    },
    vendorDetals: {
        type:Sequelize.INTEGER,
        references:{
            model:'Vendor',
            key: 'vendorDetailsId'
        }
    },
    cnic : {
        type:Sequelize.NUMBER,
        // allowNull:false
    },
    profilePicture: {
        type:Sequelize.STRING
    },
    mobileNumber:{
        type:Sequelize.NUMBER,
        // allowNull:false
    },
    location:{
        type:Sequelize.INTEGER,
        references:{
            model: 'Location',
            key: 'locationId'
        }
    }
    


})