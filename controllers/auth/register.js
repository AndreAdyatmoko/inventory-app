const bcrypt = require('bcrypt');
const User = require('../../models/user/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const config = require('../../config/config');
const templatePath = path.resolve(__dirname, '../../email/changePass.html');
const emailContent = fs.readFileSync(templatePath, 'utf-8');
const template = handlebars.compile(emailContent);


async function registerUser(req, res) {
    try {
        const { email, fullname, birtday, role, phone, password } = req.body;

        // Validasi data yang harus diisi
        if (!email || !fullname|| !birtday || !role || !phone || !password) {
            return res.status(400).json({ message: 'Mohon isi semua data' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password.match(passwordRegex)) {
            return res.status(400).json({ message: 'Password harus terdiri minimal dari 8 karakter, 1 huruf besar, 1 angka, dan 1 simbol' });
        }

        const allowedRoles = ["HRD", "General Affair", "Head Of Division", "COO", "CEO", "Admin", "User"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            fullname,
            birtday,
            role,
            phone,
            password: hashedPassword
        });
        
        await newUser.save();

        const token = await sendResetPasswordMail(email);
        await sendMail(email, token);

        res.status(200).json({ message: 'Pendaftaran berhasil, silahkan cek Email untuk merubah password' });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function sendResetPasswordMail(email) {
    const user = await User.findOne({ email });
    if (!user) {
        return { message: "User tidak ditemukan" };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.verifiedChangePassword = false;
    await user.save();
    
    return token;
}

async function sendMail(email, token) {
    const html = template({ redirect: `http://localhost:3000/reset/${token}` });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: config.email,
        to: email,
        subject: 'Ubah Password',
        html
    });
}

module.exports = {
    registerUser
};
