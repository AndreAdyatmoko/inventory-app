const mongoose = require('mongoose');

const kategoriStockBarangSchema = new mongoose.Schema({
  namaKategori: {
    type: String,
    enum: ['HabisPakai', 'TidakHabisPakai', 'BarangProduksi'],
    required: true,
    unique: true,
  },
});

const KategoriStockBarang = mongoose.model('KategoriStockBarang', kategoriStockBarangSchema);

module.exports = KategoriStockBarang;
