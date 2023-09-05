const pengajuanBarang = require('../../models/pengajuan/pengajuan');
const User = require('../../models/user/user');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

async function pengajuanBarangController(req, res) {
    try {
        const { namaBarang, deskripsi, jumlah, harga, jenisPengajuan, status, tanggalPengajuan } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        const decodedToken = jwt.verify(token, config.jwtSecret);
        
        const pengaju = await User.findById(decodedToken.userId);
        const newPengajuan = new pengajuanBarang({
            pengaju: {
                id: pengaju._id,
                fullname: pengaju.fullname
            },
            gambar: req.file.filename,
            namaBarang,
            deskripsi,
            jumlah,
            harga,
            jenisPengajuan,
            status,
            tanggalPengajuan
        });
        
        const pengajuan = await newPengajuan.save();
        
        res.status(200).json({ message: 'Pengajuan berhasil', pengajuan });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getPengajuan(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, config.jwtSecret);
        const pengajuan = await pengajuanBarang.find({ 'pengaju.id': decodedToken.userId });
        res.status(200).json({ message: 'Daftar Pengajuan', pengajuan });
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = {
    pengajuanBarangController,
    getPengajuan,
};
