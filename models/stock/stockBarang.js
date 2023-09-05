const mongoose = require('mongoose');

const stockBarangSchema = new mongoose.Schema({
  namaBarang: {
    type: String,
  },
  gambar: {
    type: String,
  },
  penanggungJawab: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullname: String,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  letakBarang: {
    type: String,
    required: true,
  },
  kondisi: {
    type: String,
  },
  merek: {
    type: String,
  },
  jenis: {
    type: String,
  },
  kategori: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KategoriStockBarang',
      required: true,
    },
    namaKategori: String,
  },
});

const StockBarang = mongoose.model('StockBarang', stockBarangSchema);

module.exports = StockBarang;