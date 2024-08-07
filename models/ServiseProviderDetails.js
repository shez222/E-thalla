const Sequelize = require('sequelize')
const sequelizeDbConnect = require('../utils/db')

const ServiceProviderDetail = sequelizeDbConnect.define('ServicePovider',{
    serviceProviderDetailsId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    

})