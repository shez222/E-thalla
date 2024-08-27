const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Cart = sequelize.define('cart',{  //1st argument is model name & 2nd fields
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Cart;