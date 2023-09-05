const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verify')
const {pengajuanBarangController, editPengajuan,getPengajuan} = require('../controllers/pengajuan/pengajuanBarang');
const { multerUpload } = require('../middlewares/multer');
const {getPengajuanProses, approvePengajuan, rejectedPengajuan} = require('../controllers/pengajuan/prosesHrd');
const multer = require('multer');



router.post('/pengajuan', multerUpload.single('gambar'),verifyToken, pengajuanBarangController);
router.put('/edit/:pengajuanId',multerUpload.single('gambar'),verifyToken, editPengajuan);

router.get('/pengajuan', verifyToken, getPengajuan)

//ini routing untuk HRD

router.get('/proses', getPengajuanProses)
router.put('/approve/:pengjuanId', verifyToken, approvePengajuan)
router.put('/reject/:pengjuanId', verifyToken, rejectedPengajuan)



module.exports = router;