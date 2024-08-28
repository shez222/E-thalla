const Sequelize = require('sequelize');

const sequelize = new Sequelize('constructiondb','root','bodyguard420',{
    dialect:'mysql',
    host:'localhost'
})


module.exports = sequelize