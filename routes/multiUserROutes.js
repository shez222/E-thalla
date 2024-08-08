const express = require('express')
const MultiUserController = require('../controllers/MultiuserControllers')


const router = express.Router()


router.post('/user/register',MultiUserController.MultiuserRegister);
router.post('/user/login',MultiUserController.MultiuserLogin)
router.post('/user/match-otp',MultiUserController.matchOtp)


module.exports = router;