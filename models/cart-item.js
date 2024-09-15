const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const CartItem = sequelize.define('CartItems',{  //1st argument is model name & 2nd fields
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER

})

module.exports = CartItem;