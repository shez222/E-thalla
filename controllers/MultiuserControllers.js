
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const  { sendEmail } = require('../utils/sendmail')
const {forgotdata, otpdata} = require('../utils/otp&forgotmsg')


const MultiUser = require('../models/User');
// const { error } = require('console');


const MultiuserRegister = async (req, res) => {
    const { email, username, password, confirmpassword, role } = req.body;
    
    try {
        const user = await MultiUser.findOne({ where: { Email: email } });
        if (user) {
            const isEqual = await bcrypt.compare(password,user.password);
            if (!isEqual) {
                return res.json({ error: "Email already exist"})
            }
            const currentRoles = user.currentRole.map(roleObj => Object.keys(roleObj)[0]);
            
            if (currentRoles.includes(role)) {
                const error = new Error('Role already assigned to this email');
                error.status = 422;
                throw error;
            }

            const updateUser = await user.update({
                currentRole: user ? [...user.currentRole, { [role]: true }] : [{ [role]: true }]
            })
            return res.json({
                updateUser:updateUser,
                msg:`upgraded to role and role added ${role}`
            })
            
        }
        // console.log('check2');
        
                
        if (password !== confirmpassword) {
            const error = new Error('Password Not Matched');
            error.status = 422;
            throw error;
        }

        const hashedpw = await bcrypt.hash(password, 12);
        const newUser = await MultiUser.create({
            userName: username,
            password: hashedpw,
            Email: email,
            currentRole: [{ [role]: true }]
        });
        return res.json({
            user: newUser,
            msg:`Successfully created user with ${role}`
        });

    } catch (error) {
        // Handle errors
        if (!error.status) {
            error.status = 500;
        }
        res.status(error.status).json({ error: error.message });
    }
};


const MultiuserLogin = async (req, res, next) => {
    const { email, password, role } = req.body;

    try {
        const user = await MultiUser.findOne({
            where: {
                Email: email
            }
        });
        
        if (!user) {
            return res.status(422).json({ error: 'Not Registered' });
        }

        const currentRoles = user.currentRole.map(roleObj => Object.keys(roleObj)[0]);
        if (!currentRoles.includes(role)) {
            return res.status(422).json({error: 'not registered to this role'})
        }


        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(422).json({ error: 'Wrong Password' });
        }

        const otp = crypto.randomInt(100000,999999);

        const otpData = otpdata(otp);
        // console.log(otpData);
        

        await sendEmail(email,otpData.html,otpData.subject)
        const token = jwt.sign(
            {
                email: user.Email,
                userId: user.multiUserId.toString()
            },
            'somesupersecret', // Use environment variable
            {
                expiresIn: '1h'
            }
        );
        const updateUser = await user.update({
            otp: otp,
            otpExpiry: Date.now() + 10 * 60 * 1000,
            token: token
        })
        // console.log(updateUser);
        // await req.user.createCart()
        return res.json({ 
            token:token, 
            userId: updateUser,
            msg:'successfully login' 
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const matchOtp = async(req,res)=>{

    const { email,otp } = req.body;
    
    const user = await MultiUser.findOne({
        where:{
            Email:email
        }
    })
    // console.log(user);
    
    // console.log(user.otp,user.otpExpiry);
    

    if (!user || !user.otp || !user.otpExpiry) {
        return res.status(422).json({ error : 'user not allowed'})
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(422).json({ error : "Invalid OTP"})
    }
    req.user = user
    console.log(req.user);
    
    const updateuser = await user.update({
        otp:'',
        otpExpiry:''
    })
    console.log(updateuser);
    
    
    return res.json({ 
        userId: user.multiUserId,
        msg:'successfully login' 
    });

}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await MultiUser.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Generate a reset code (e.g., 6-digit code)
        const resetCode = crypto.randomInt(100000, 999999).toString();
        const hashedCode = await bcrypt.hash(resetCode, 12);
        const resetCodeExpiry = Date.now() + 900000; // 15 minutes

        // Save the hashed code and expiry to the user's record
 
        const forgotData = forgotdata(resetCode);
        await sendEmail(email, forgotData.html, forgotData.subject);
        
        const updateUser = await user.update({
            resetPasswordToken: hashedCode,
            resetPasswordExpires: resetCodeExpiry,
        })   
        console.log(updateUser);
        
        res.json({
            message: 'Reset code sent successfully',
            // resetCode, // For testing purposes, remove this in production
            email: email
        });
    } catch (error) {
        // console.log(error);
        
        res.status(500).json({
            message: 'An error occurred',
            error: error.message
        });
    }
}

const verifyForgetCode = async (req, res) => {
    const { email, resetCode } = req.body;

    try {
        // Find the user
        
        const user = await MultiUser.findOne({
            where: { email: email }
        });
        // console.log(user);
        
        if (!user || !user.resetPasswordToken) {
            return res.status(400).send('Invalid or expired password reset code');
        }

        // Check if the reset code is valid and not expired
        const isCodeValid = await bcrypt.compare(resetCode, user.resetPasswordToken);
        if (!isCodeValid || user.resetPasswordExpires < Date.now()) {
            return res.status(400).send('Invalid or expired password reset code');
        }

        // If valid, return a success message
        res.status(200).json({
            message: 'Reset code verified successfully',
            resetCodeValid: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error.message
        });
    }
}

const setNewPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find the user
        const user = await MultiUser.findOne({
            where: { email: email }
        });

        if (!user || !user.resetPasswordToken) {
            return res.status(400).send('Invalid request. Reset password process not initiated or token expired.');
        }

        // Update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        // Clear the reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).send({message:'Password has been reset successfully'});
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error.message
        });
    }
}
module.exports = {MultiuserRegister, MultiuserLogin, matchOtp, forgotPassword, verifyForgetCode, setNewPassword}

