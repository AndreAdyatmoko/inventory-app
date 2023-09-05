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

async function editPengajuan(req, res){
    try {
        
        const {namaBarang, deskripsi, jumlah, harga, jenisPengajuan} = req.body;

        const pengajuanId = req.params.pengajuanId;

        const token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        const decodedToken = jwt.verify(token, config.jwtSecret);
        const pengajuan = await pengajuanBarang.findOne({_id: pengajuanId});
        console.log(pengajuan)
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        if(decodedToken.userId !== pengajuan.pengaju.id){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }
        console.log(decodedToken.userId)
        console.log(pengajuan.pengaju.id)

        if(req.file){
            if(pengajuan.gambar){
                const path = './public/uploads/' + pengajuan.gambar;
                fs.unlinkSync(path);
            }
            pengajuan.gambar = req.file.filename
        }

        pengajuan.namaBarang = namaBarang;
        pengajuan.deskripsi = deskripsi;
        pengajuan.jumlah = jumlah;
        pengajuan.harga = harga;
        pengajuan.jenisPengajuan = jenisPengajuan;
        await pengajuan.save();
        return res.status(200).json({message: "Pengajuan berhasil diupdate"})
    } catch (error){
        console.log(error);
        return res.status(500).json({message : "Ada kesalahan server"}, )
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
    editPengajuan,
    getPengajuan,
};
