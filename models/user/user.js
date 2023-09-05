const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    fullname: String,
    basedsalary: Number,
    profilepicture: String,
    birtday: Date,
    role: String,
    phone: String,
    password: String,
    resetPasswordToken: String,
    verifiedChangePassword: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;