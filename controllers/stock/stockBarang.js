const StockBarang = require('../../models/stock/stockBarang');
const KategoriBarang = require('../../models/stock/kategoriStockBarang');
const User = require('../../models/user/user');

async function createStockBarang(req, res){
    try{
        const {
            namaBarang,
            penanggungJawab,
            jumlah,
            letakBarang,
            kondisi,
            merek,
            jenis,
            kategori
        } = req.body

        if(!namaBarang || !penanggungJawab || !jumlah || !letakBarang || !kondisi || !merek || !jenis || !kategori){
            return res.status(400).json({message: 'Mohon isi semua data'})
        }
    

        const user = await User.findOne({fullname: penanggungJawab}).populate('fullname')

        if(!user){
            return res.status(400).json({message: 'Penanggung jawab tidak ditemukan'})
        }

        const kategoriItem = await KategoriBarang.findOne({namaKategori: kategori})

        if(!kategoriItem){
            return res.status(400).json({message: 'Coba pilih Kategori yang benar'})
        }

        const newStockbarang = new StockBarang({
            namaBarang,
            gambar : req.file.filename,
            penanggungJawab:{
                id: user._id,
                fullname: user.fullname,
            },
            jumlah,
            letakBarang,
            kondisi,
            merek,
            jenis,
            kategori:{
                id: kategoriItem._id,
                namaKategori: kategoriItem.namaKategori
            },
        })

        await newStockbarang.save()
        
        return res.status(200).json({message: 'Barang berhasil dibuat', data: newStockbarang})
    }catch(error){
        console.error("terjadi kesalahan saat membuat barang", error);
        return res.status(500).json({message: "terjadi kesalahan saat membuat barang"});
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

  async function getStockByKategori(req,res){
    try{
      const {namaKategori} = req.query;
      const stockBarang = await StockBarang.find({ 'kategori.namaKategori': namaKategori });

      return res.status(200).json(stockBarang)

    }catch(error){
      console.log('Kesalahan saat melakukan sorting karena', error);
      return res.status(500).json({message: 'Terjadi kesalahan server'})
    }
  }
  
  module.exports = {
    createStockBarang,
    getStockBarang,
    getStockByKategori
  };