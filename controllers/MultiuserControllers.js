
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const  { sendEmail } = require('../utils/sendmail')


const MultiUser = require('../models/User');
const { error } = require('console');


const MultiuserRegister = async (req, res) => {
    const { email, username, password, confirmpassword, role } = req.body;
    
    try {
        // Check if passwords match
        // console.log(typeof(password),typeof(confirmpassword));
        // Find the user by email
        const user = await MultiUser.findOne({ where: { Email: email } });
        // Check if user exists and the role is already assigned
        if (user) {
            // Convert currentRole JSON to array of role names
            const isEqual = await bcrypt.compare(password,user.password);
            if (!isEqual) {
                return res.json({ error: "Email already exist"})
            }
            const currentRoles = user.currentRole.map(roleObj => Object.keys(roleObj)[0]);
            console.log(currentRoles);
            
            // console.log("check 1");
            
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
        console.log('check2');
        
                
        if (password !== confirmpassword) {
            const error = new Error('Password Not Matched');
            error.status = 422;
            throw error;
        }

        // Hash the password
        const hashedpw = await bcrypt.hash(password, 12);

        // Create or update the user
        const newUser = await MultiUser.create({
            userName: username,
            password: hashedpw,
            Email: email,
            currentRole: [{ [role]: true }]
        });
        // console.log("check 3", newUser.Email);
        

        // Respond with success message
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

        await sendEmail(email,otp)
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
        console.log(updateUser);
        
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
    console.log(user);
    
    console.log(user.otp,user.otpExpiry);
    

    if (!user || !user.otp || !user.otpExpiry) {
        return res.status(422).json({ error : 'user not allowed'})
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(422).json({ error : "Invalid OTP"})
    }
    
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
module.exports = {MultiuserRegister, MultiuserLogin, matchOtp}

