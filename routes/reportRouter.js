const express = require('express');
const router = express.Router();
const {generalReport} = require('../controllers/report/report');


router.get('/general', generalReport);


module.exports = router