const express = require('express');
const sequelize = require('./utils/db')
const MultiUseruserRoutes = require('./routes/multiUserROutes')

const app = express();

app.use(express.json());



app.use('/E-Thalla',MultiUseruserRoutes)


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
