import { where } from 'sequelize';

// import { where } from 'sequelize';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const MultiUser = require('../models/User');


export const MultiuserRegisterVisitor = async (req,res)=>{

    const {email,username,password,confirmpassword,role} = req.body
        
    if (password!==confirmpassword) {
        const error =new Error ('Pasword Not Matched');
        error.status = 422;
        throw error
    }
    const user = await MultiUser.findOne({where: {Email: email}})

    if (user && user.currentRole.includes(role)) {
        const error = new Error('Email already exists')
        error.status = 422;
        throw error
    }
    const hashedpw = await bcrypt.hash(password,12)

    const newUser = await MultiUser.create({
        userName: username,
        password: hashedpw,
        Email:email,
        currentRole:[...user.currentRole,role]
    })

    res.json({
        user:newUser,
        msg:'sucessfully created'
    })

}

export const MultiuserLogin = async (req,res)=>{

    const {email,password,role} = req.body
    try {
        const user = await MultiUser.findOne({where:{Email:email, currentRole:{ [Op.contains]:[role]}}})
        
        if (!user) {
            const error = new Error('Not Registered');
            error.status =422;
            throw error;
        }
        const isEqual = await bcrypt.compare(password,user.password)
        if (!isEqual) {
            const error = new Error ('Wrong Password')
            error.status = 422;
            throw error
        }
        const token = jwt.sign(
            {
                email:user.Email,
                userId:user.multiUserId.toString()
            },
            'somesupersecret',
            {
                expiresIn:'1h'
            }
        )
        res.json({token: token, userId:user.multiUserId.toString()})
    } catch (error) {
        if (!error.status) {
            error.status = 500
        }
        next(error)
    }

}