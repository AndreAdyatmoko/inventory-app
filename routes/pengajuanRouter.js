const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verify')
const {pengajuanBarangController, getPengajuan} = require('../controllers/pengajuan/pengajuanBarang');
const { multerUpload } = require('../middlewares/multer');
const {getPengajuanProses, approvePengajuan, rejectedPengajuan} = require('../controllers/pengajuan/prosesHrd');



router.post('/pengajuan', multerUpload.single('gambar'),verifyToken, pengajuanBarangController);

router.get('/pengajuan', verifyToken, getPengajuan)

//ini routing untuk HRD

router.get('/proses', getPengajuanProses)
router.put('/approve/:pengjuanId', verifyToken, approvePengajuan)
router.put('/reject/:pengjuanId', verifyToken, rejectedPengajuan)



module.exports = router;