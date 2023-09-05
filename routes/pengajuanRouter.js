const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verify')
const {pengajuanBarangController, getPengajuan} = require('../controllers/pengajuan/pengajuanBarang');
const { multerUpload } = require('../middlewares/multer');


router.post('/pengajuan', multerUpload.single('gambar'),verifyToken, pengajuanBarangController);

router.get('/pengajuan', verifyToken, getPengajuan)

module.exports = router;