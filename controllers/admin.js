const Product = require('../models/product');


const postAddProducts = async (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    
    try {
        const result = await req.user.createProduct({
            title,
            price,
            imageUrl,
            description,
        });
        res.json({ message: 'Product added successfully', product: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to add product' });
    }
};

const getEditProducts = async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    try {
        const products = await req.user.getProducts({ where: { id: prodId } });
        const product = products[0];

        if (!product) {
            return res.redirect('/');
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve product for editing' });
    }
};

const postEditProducts = async (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;

        await product.save();
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

const postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;

    try {
        const product = await Product.findByPk(prodId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await req.user.getProducts();
        res.json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve products' });
    }
};

module.exports = { postAddProducts,   getEditProducts, postEditProducts, postDeleteProduct, getProducts }