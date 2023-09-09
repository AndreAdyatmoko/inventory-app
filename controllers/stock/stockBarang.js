const StockBarang = require('../../models/stock/stockBarang');
const User = require('../../models/user/user');
const KategoriBarang = require('../../models/stock/kategoriStockBarang');
const Lokasi = require('../../models/lokasi/lokasi');

async function createStockBarang(req, res) {
  try {
    const {
      namaBarang,
      penanggungJawab,
      jumlah,
      letakBarang,
      kondisi,
      merek,
      jenis,
      kategori
    } = req.body;

    if (!namaBarang || !penanggungJawab || !jumlah || !letakBarang || !kondisi || !merek || !jenis || !kategori) {
      return res.status(400).json({ message: 'Mohon isi semua data' });
    }

    // Cari user berdasarkan nama penanggung jawab
    const user = await User.findOne({ fullname: penanggungJawab });

    if (!user) {
      return res.status(400).json({ message: 'Penanggung jawab tidak ditemukan' });
    }

    // Cari kategori berdasarkan nama kategori
    const kategoriItem = await KategoriBarang.findOne({ namaKategori: kategori });

    if (!kategoriItem) {
      return res.status(400).json({ message: 'Coba pilih Kategori yang benar' });
    }

    // Cari Lokasi berdasarkan nama lokasi
    const lokasi = await Lokasi.findOne({ name: letakBarang });

    if (!lokasi) {
      return res.status(400).json({ message: 'Lokasi tidak ditemukan' });
    }

    const gambarUrls = [];

    req.files.forEach((file) => {
      gambarUrls.push(file.filename);
    })

    const newStockbarang = new StockBarang({
      namaBarang,
      gambar: gambarUrls,
      penanggungJawab: {
        id: user._id,
        fullname: user.fullname,
      },
      jumlah,
      letakBarang: {
        id: lokasi._id, 
        name: lokasi.name,
      },
      kondisi,
      merek,
      jenis,
      kategori: {
        id: kategoriItem._id,
        namaKategori: kategoriItem.namaKategori,
      },
    });

    await newStockbarang.save();

    return res.status(200).json({ message: 'Barang berhasil dibuat', data: newStockbarang });
  } catch (error) {
    console.error('Terjadi kesalahan saat membuat barang', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat membuat barang' });
  }
}

async function editStockBarang(req, res) {
  try {
    const stockBarangId = req.params._id;
    const stockBarang = await StockBarang.findOne({ _id: stockBarangId });
    
    if (!stockBarang) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    if (req.body.namaBarang) {
      stockBarang.namaBarang = req.body.namaBarang;
    }
    if (req.body.jumlah) {
      stockBarang.jumlah = req.body.jumlah;
    }
    if (req.body.kondisi) {
      stockBarang.kondisi = req.body.kondisi;
    }
    if (req.body.merek) {
      stockBarang.merek = req.body.merek;
    }
    if (req.body.jenis) {
      stockBarang.jenis = req.body.jenis;
    }
    
    if (req.body.penanggungJawab) {
      // Cari user berdasarkan nama penanggung jawab
      const user = await User.findOne({ fullname: req.body.penanggungJawab });

      if (!user) {
        return res.status(400).json({ message: 'Penanggung jawab tidak ditemukan' });
      }
      
      stockBarang.penanggungJawab = {
        id: user._id,
        fullname: user.fullname,
      };
    }
    
    if (req.body.kategori) {
      // Cari kategori berdasarkan nama kategori
      const kategoriItem = await KategoriBarang.findOne({ namaKategori: req.body.kategori });

      if (!kategoriItem) {
        return res.status(400).json({ message: 'Coba pilih Kategori yang benar' });
      }

      stockBarang.kategori = {
        id: kategoriItem._id,
        namaKategori: kategoriItem.namaKategori,
      };
    }

    if (req.file) {
      if (stockBarang.gambar) {
        const filePath = path.join(__dirname, '/public/uploads/', stockBarang.gambar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      stockBarang.gambar = req.file.filename;
    }

    await stockBarang.save();
    return res.status(200).json({ message: "Data berhasil diubah", stockBarang });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ada kesalahan server" });
  }
}


async function getStockBarang(req, res) {
  try {
    const stockBarang = await StockBarang.find()
      .populate('penanggungJawab')
      .populate('kategori')
      .exec();
    return res.status(200).json(stockBarang);
  } catch (error) {
    console.error('Kesalahan saat mengambil stok item', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

async function getStockByKategori(req, res) {
  try {
    const { namaKategori } = req.query;
    const stockBarang = await StockBarang.find({ 'kategori.namaKategori': namaKategori });
    return res.status(200).json(stockBarang);
  } catch (error) {
    console.error('Kesalahan saat melakukan sorting karena', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

  
  module.exports = {
    createStockBarang,
    editStockBarang,
    getStockBarang,
    getStockByKategori,
  };