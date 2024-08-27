// const path = require('path');

const express = require('express');

// const rootdir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');



//full url /admin/add-product but filtered in main
///admin/add-product=>using GET
// router.get('/add-product',adminController.getAddProducts);
///admin/products=>using GET
router.get('/products',adminController.getProducts);
///admin/add-product=>using POST
router.post('/add-product', adminController.postAddProducts);

router.get('/edit-product/:productId', adminController.getEditProducts);

router.post('/edit-product', adminController.postEditProducts);

router.post('/delete-product',adminController.postDeleteProduct)



// module.exports = router;
module.exports = router

//we can initialize same route to diff middleware but diff method