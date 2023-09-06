const express = require('express')
const router = express.Router()
const{createKategoriBarang, getKategoris, getKategoriByQuery} = require('../controllers/stock/kategoriBarang')
const {createStockBarang, getStockBarang, getStockByKategori, getStockByLokasi } = require('../controllers/stock/stockBarang')
const {multerUpload} = require('../middlewares/multer')


// ini untuk route buat create kategori

router.post('/create', createKategoriBarang)
router.get('/all', getKategoris)
router.get('/byone', getKategoriByQuery)


// ini untuk route buat create stock barang

router.post('/make', multerUpload.single('gambar'), createStockBarang)
router.get('/list', getStockBarang)
router.get('/cat', getStockByKategori)
router.get('/loc', getStockByLokasi)


module.exports = router;