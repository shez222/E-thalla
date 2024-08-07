const express = require('express');
const sequelize = require('./utils/db')

const app = express();




// sequelize
// .sync()
// .then(()=>{
//     console.log("connected to db");
    app.listen(3000,()=>{
        console.log('listening at port 3000');
        
    })
// })
// .catch((error)=>{

// })
