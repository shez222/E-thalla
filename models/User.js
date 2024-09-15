const Sequelize = require('sequelize');
const sequelizeDbConnect =require('../utils/db');

const MultiUser = sequelizeDbConnect.define('Users',{
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
    currentRole: {
        type: Sequelize.JSON, // Use JSON to store array-like data
        defaultValue: [], // Default value as an empty array
        allowNull: false
    },
    // servicProviderDetals: {
    //     type:Sequelize.INTEGER,
    //     references:{
    //         model:'ServicePovider',
    //         key: 'serviceProviderDetailsId'
    //     }
    // },
    // vendorDetals: {
    //     type:Sequelize.INTEGER,
    //     references:{
    //         model:'Vendor',
    //         key: 'vendorDetailsId'
    //     }
    // },
    cnic : {
        type:Sequelize.STRING,
        allowNull:true
    },
    profilePicture: {
        type:Sequelize.STRING,
        allowNull:true
    },
    mobileNumber:{
        type:Sequelize.STRING,
        allowNull:true
    },
    otp :{
        type:Sequelize.STRING,
        allowNull:true
    },
    otpExpiry:{
        type:Sequelize.STRING,
        allowNull:true
    },
    resetPasswordToken :{
        type:Sequelize.STRING,
        allowNull:true
    },
    resetPasswordExpires:{
        type:Sequelize.STRING,
        allowNull:true
    },
    token: {
        type:Sequelize.STRING,
        allowNull:true
    }
    // location:{
    //     type:Sequelize.INTEGER,
    //     references:{
    //         model: 'Location',
    //         key: 'locationId'
    //     }
    // }
})

module.exports = MultiUser;