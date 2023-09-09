const express = require('express')
const router = express.Router()
const{createKategoriBarang, getKategoris, getKategoriByQuery} = require('../controllers/stock/kategoriBarang')
const {createStockBarang, getStockBarang, getStockByKategori,editStockBarang } = require('../controllers/stock/stockBarang')
const {multerUpload} = require('../middlewares/multer')


// ini untuk route buat create kategori

router.post('/create', createKategoriBarang)
router.get('/all', getKategoris)
router.get('/byone', getKategoriByQuery)


// ini untuk route buat create stock barang

router.post('/make', multerUpload.array('gambar', 4), createStockBarang)
router.put('/edit/:_id', multerUpload.array('gambar', 4), editStockBarang)
router.get('/list', getStockBarang)
router.get('/cat', getStockByKategori)


module.exports = router;