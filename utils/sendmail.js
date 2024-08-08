const nodemailer = require('nodemailer');

const transproter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'bilal.shehroz420@gmail.com',
        pass:'plqx affv dlaf oxpj'
    }
});

const sendEmail = async(receiverMail,otp)=>{
    const mailOptions = {
        from:'bilal.shehroz420@gmail.com',
        to: receiverMail,
        subject: "OTP code",
        text:`your otp code is ${otp}`
    }

    try {
        await transproter.sendMail(mailOptions)
        console.log("Email Send SuccessFully");
        return otp;
    } catch (error) {
        console.log('error sending mail');
        throw new Error("Error Sentding Otp")
    }

}

module.exports = { sendEmail };