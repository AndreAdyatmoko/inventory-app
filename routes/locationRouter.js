const express = require('express');
const router = express.Router();
const {createLocation,getStockByLokasi,updateLocationStock,deleteStock, movePenanggungJawab} = require('../controllers/location/createLocation');


router.post('/create', createLocation);
router.get('/one', getStockByLokasi);
router.put('/update/:_id', updateLocationStock);
router.delete('/delete/:_id', deleteStock);
router.put('/move/:_id', movePenanggungJawab);

module.exports = router
