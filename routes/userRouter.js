const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/auth/register');
const {loginUser} = require('../controllers/auth/login');
const { forgotPassword, resetPassword } = require ('../controllers/auth/forgot')


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot', forgotPassword);
router.put('/reset', resetPassword);




module.exports = router