// const path = require('path')

const express = require('express');

// const rootdir = require('../util/path');

// const adminData = require('./admin')

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProduct) //dynamic path or route variable after semicolon is dynmamic data (/products/:productId) productId is dynamic

// router.get('/products/delete') //if we have  static(/products/delete') and dynamic rouute(/products/:productId') whose initiating characters are same then static route should be return first then dynamic 

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.post('/cart-delete-item',shopController.postDeleteCartProduct)

router.post('/create-order',shopController.postOrder)
router.get('/orders',shopController.getOrders);



module.exports = router;