const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve products' });
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    
    try {
        const product = await Product.findByPk(prodId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve product details' });
    }
};

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve products for the index' });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        res.json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve cart products' });
    }
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;

    try {
        const cart = await req.user.getCart();
        fetchCart = cart;
        const products = await cart.getProducts({ where: { id: prodId } });

        let product;
        if (products.length > 0) {
            product = products[0];
        }

        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
        } else {
            product = await Product.findByPk(prodId);
        }

        await fetchCart.addProduct(product, { through: { quantity: newQuantity } });
        res.json({ message: 'Product added to cart' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

exports.postDeleteCartProduct = async (req, res, next) => {
    const prodId = req.body.productId;

    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts({ where: { id: prodId } });

        if (!products.length) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = products[0];
        await product.cartItem.destroy();
        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to remove product from cart' });
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();

        const order = await req.user.createOrder();
        await order.addProducts(
            products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            })
        );

        await cart.setProducts(null);
        res.json({ message: 'Order placed successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders({ include: ['products'] });
        res.json({ orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
};
