const Sequelize = require('sequelize');

const sequelize = new Sequelize('constructionDb','root','bodyguard420',{
    dialect:'mysql',
    host:'localhost'
})


exports.module = sequelize