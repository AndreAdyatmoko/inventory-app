const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verify')
const {pengajuanBarangController, editPengajuan,getPengajuan, getPengajuanById, deletePengajuan} = require('../controllers/pengajuan/pengajuanBarang');
const { multerUpload } = require('../middlewares/multer');
const {getPengajuanProses, approvePengajuan, rejectedPengajuan} = require('../controllers/pengajuan/prosesHrd');




router.post('/pengajuan', multerUpload.array('gambar', 4),verifyToken, pengajuanBarangController);
router.put('/edit/:pengajuanId',multerUpload.array('gambar', 4),verifyToken, editPengajuan);

router.get('/pengajuan', verifyToken, getPengajuan)
router.get('/pengajuan/:pengajuanId', verifyToken, getPengajuanById)
router.delete('/pengajuan/:pengajuanId', verifyToken, deletePengajuan)

//ini routing untuk HRD

router.get('/proses', getPengajuanProses)
router.put('/approve/:pengjuanId', verifyToken, approvePengajuan)
router.put('/reject/:pengjuanId', verifyToken, rejectedPengajuan)



module.exports = router;