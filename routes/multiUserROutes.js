const express = require('express')
const MultiUserController = require('../controllers/MultiuserControllers')


const route = express.Router()


route.post('/user/register',MultiUserController.MultiuserRegister);
route.post('/user/login',MultiUserController.MultiuserLogin)