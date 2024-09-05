const express = require('express');
const path = require('path');
const sequelize = require('./utils/db')
const MultiUseruserRoutes = require('./routes/multiUserROutes');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid')
// const MultiUser = require('./models/User');
const adminRoutes = require('./routes/admin'); //line no 7 or 8 ko agay peecha karna sa tab farq nahin para ga jab ham na middlware kasath method likha hua hoga agr method kijaga .use hua to 7 or 8 ki position change karna sa farq parenga
const shopRoutes = require('./routes/shop');




const Product = require('./models/product');
// const ServiceProviderDetail = require('./models/ServiseProviderDetails');
// const vendorDetails = require('./models/VendorDetails')
const Location = require('./models/Location')
const User = require('./models/User');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const { where } = require('sequelize');
const { sendEmail } = require('./utils/sendmail');

const app = express();
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        const uniqueFilename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
        cb(null, uniqueFilename);
    }
});
const fileFilter = (req,file,cb)=>{
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null,true)
    } else {
        cb(null,false)
    }
}

app.use(express.json());

app.use(multer({storage:fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')))


// app.use('/',(req,res)=>{
//     console.log('hello shehroz');
    
// })

// uncomment below when testing on postman
app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user) => {
        req.user = user;
        // req.user.createCart()
        next();
    }).catch((err) => {
        console.log(err);
    });
});
app.use('/E-Thalla',MultiUseruserRoutes)
app.use('/Vendors',adminRoutes); //filter at /admin
app.use('/Shop',shopRoutes);


Location.belongsTo(User,{onDelete:'CASCADE'});
Product.belongsTo(User,{constraints: true, onDelete:'CASCADE'}) // Adds 
Order.belongsTo(User); // Adds userId(as foreign key) to Order model

User.hasOne(Cart); // Adds userId to Cart model

User.hasMany(Product); //Adds userId to Product model
User.hasMany(Order);  //Adds userId to Order model
Cart.belongsToMany(Product , {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Product.belongsToMany(Order ,{through: OrderItem});
Order.belongsToMany(Product ,{through: OrderItem});



sequelize
// .sync({force:true})
.sync()
.then(()=>{
    // MultiUser.fin
    console.log("connected to db");
    app.listen(3000,()=>{
        console.log('listening at port 3000');
        
    })
})
.catch((error)=>{
   console.log(error);
   
    
})
