const express = require('express');
const sequelize = require('./utils/db')
const MultiUseruserRoutes = require('./routes/multiUserROutes');
const MultiUser = require('./models/User');

const app = express();

app.use(express.json());


app.use('/',(req,res)=>{
    console.log('hello shehroz');
    
})
app.use('/E-Thalla',MultiUseruserRoutes)


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
