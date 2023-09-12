const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/verify')
const {createBarangController, editPengajuan,getPengajuan, getPengajuanById, deletePengajuan, getPengajuanByUser} = require('../controllers/pengajuan/pengajuanBarang');
const { multerUpload } = require('../middlewares/multer');
const {getPengajuanProses, approvePengajuan, rejectedPengajuan} = require('../controllers/pengajuan/prosesHrd');
const {getPengajuanFinance, pengajuanApproveFinance, pengajuanRejectFinance} = require('../controllers/pengajuan/prosesFinance');


router.post('/pengajuan', multerUpload.array('gambar', 4),verifyToken, createBarangController);
router.put('/edit/:pengajuanId',multerUpload.array('gambar', 4),verifyToken, editPengajuan);

router.get('/pengajuan', verifyToken, getPengajuan)
router.get('/pengajuan/:pengajuanId', verifyToken, getPengajuanById)
router.delete('/pengajuan/:pengajuanId', verifyToken, deletePengajuan)
router.get('/pengajuan/user/:pengajuId', verifyToken, getPengajuanByUser)

//ini routing untuk HRD

router.get('/proses', getPengajuanProses)
router.put('/approve/:pengjuanId', verifyToken, approvePengajuan)
router.put('/reject/:pengjuanId', verifyToken, rejectedPengajuan)

// ini routing untuk Finance

router.get('/prosesFinance', verifyToken, getPengajuanFinance)
router.put('/approveFinance/:pengjuanId', verifyToken, pengajuanApproveFinance)
router.put('/rejectFinance/:pengjuanId', verifyToken, pengajuanRejectFinance)



module.exports = router;