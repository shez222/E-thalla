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

// Forgot Password Route for Mobile App



//--------------------------------------------------------
//belongsto 1:1 or M:1
// example
// Address.belongsTo(User); // Adds userId(as foreign key) to Address model
// getAssociatedModel() => user.getAddress();
// setAssociatedModel(instance)=> user.setAddress(addressInstance);
// createAssociatedModel(values)=> user.createAddress({ /* values */ });
// vendorDetails.belongsTo(User);
// ServiceProviderDetail.belongsTo(User);
Location.belongsTo(User,{onDelete:'CASCADE'});
Product.belongsTo(User,{constraints: true, onDelete:'CASCADE'}) // Adds userId(as foreign key) to Product model  //onDelete: when a user is deleted than products which offer or created by user will also deleted
Order.belongsTo(User); // Adds userId(as foreign key) to Order model
// Cart.belongsTo(User); // Adds userId(as foreign key) to Cart model
//--------------------------------------------------------------------
//hasone 1:1 
//belongsto and has many are same but there aloocation of foreign key is different
// example
// User.hasOne(Profile); // Adds userId to Profile model
// getAssociatedModel() => user.getProfile();
// setAssociatedModel(instance) => user.setProfile(profileInstance);
// createAssociatedModel(values) => user.createProfile({ /* values */ });
User.hasOne(Cart); // Adds userId to Cart model
//-------------------------------------------------------------
//hasMany 1:M
// example
//User.hasMany(Post);
// getAssociatedModels() => user.getPosts();
// setAssociatedModels(instances) => user.setPosts([postInstance1, postInstance2]);
// addAssociatedModel(instance, options) => user.addPost(postInstance, { through: { /* additional attributes */ } });
// removeAssociatedModel(instance)=> user.removePost(postInstance); 
// createAssociatedModel(values, options) => user.createPost({ /* values */ }, { /* options */ });
User.hasMany(Product); //Adds userId to Product model
User.hasMany(Order);  //Adds userId to Order model
//-----------------------------------------------------------
//N:M
//as we know that we add cart item as in b/w model in poduct and cart in many many rel thats why we are using through to to provide extra fied in cart item model
// example
// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });
// getAssociatedModels() =>  user.getProjects();
// setAssociatedModels(instances) => user.setProjects([projectInstance1, projectInstance2]);
// addAssociatedModel(instance, options) => user.addProject(projectInstance, { through: { role: 'admin' } });
// removeAssociatedModel(instance) => user.removeProject(projectInstance);
// createAssociatedModel(values, options) => user.createProject({ /* values */ }, { through: { role: 'member' } });
//add cartId and productId in cartItem
Cart.belongsToMany(Product , {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
//add orderId and productId in cartItem
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
