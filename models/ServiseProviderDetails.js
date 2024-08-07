const Sequelize = require('sequelize')
const sequelizeDbConnect = require('../utils/db')

const ServiceProviderDetail = sequelizeDbConnect.define('ServicePovider',{
    serviceProviderDetailsId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    serviceType:{
        type:Sequelize.ARRAY,
        allowNull:false,
        defaulValue:[]
    },
    teamSize:{
        type:Sequelize.INTEGER
    },
    teamMemberDetatils:{
        
    }


})