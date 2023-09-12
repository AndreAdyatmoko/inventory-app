const nodemailer = require('nodemailer')
const fs = require('fs').promises
const handlebars = require('handlebars')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config/config')
const User = require('../../models/user/user')
const path = require('path')
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendResetPasswordEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        return {message: "User tidak ditemukan"};
    }
    const token = jwt.sign({
        userId: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn: '1h'});
    user.resetPasswordToken = token;
    user.verifiedChangePassword = false;
    await user.save();
    await sendMail(email, token)
    
    return token;
}

const sendMail = async (email, token) => {
    const templeatePath = path.resolve(__dirname, '../../email/forgot.html')
    const isiEmail = await fs.readFile(templeatePath, 'utf-8');
    const template = handlebars.compile(isiEmail)
    const html = template({
        redirect: `http://localhost:3000/reset/${token}`
    });

    await transporter.sendMail({
        from: config.email,
        to: email,
        subject: 'Reset Password',
        html: html
    })
}

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {email} = req.body
    try{
        const token = await sendResetPasswordEmail(email)
        await sendMail(email, token)
        res.status(200).json({message: "Email berhasil dikirim"})
    } catch(error) {
        res.status(500).json({error})
    }
}

const resetPassword = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {password, confirmPassword} = req.body

    if(password !== confirmPassword){
        return res.status(400).json({message: "Password tidak sama"})
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!password.match(passwordRegex)) {
        return res.status(400).json({ message: 'Password harus berisi minimal 8 karakter, 1 huruf besar, 1 angka, 1 simbol' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const cekUser = await User.findById({
            _id: decoded.userId
        })
        if(!cekUser || cekUser.resetPasswordToken !== token || cekUser.verifiedChangePassword){
            return res.status(404).json({message: "User tidak ditemukan dan token tidak valid"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        cekUser.password = hashedPassword
        cekUser.verifiedChangePassword = true
        await cekUser.save()
         res.status(200).json({message: "Password berhasil diubah"})
        
    }catch(error) {
        res.status(500).json({error})
    }
}

module.exports = {
    forgotPassword,
    resetPassword
}