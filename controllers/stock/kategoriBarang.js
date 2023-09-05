const KategoriBarang = require('../../models/stock/kategoriStockBarang');

async function createKategoriBarang(req, res) {
  try {
    const { namaKategori } = req.body;
    const kategoriBaru = new KategoriBarang({ namaKategori });
    const savedKategori = await kategoriBaru.save();
    res.json(savedKategori);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getKategoris(req, res) {
  try {
    const kategoris = await KategoriBarang.find();
    res.json(kategoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getKategoriByQuery(req, res) {
    try {
      const { namaKategori } = req.query;
      const kategori = await KategoriBarang.findOne({ namaKategori });
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }
      res.json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {
  createKategoriBarang,
  getKategoris,
  getKategoriByQuery,
};
