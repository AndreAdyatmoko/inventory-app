const pengajuanBarang = require('../../models/pengajuan/pengajuan');
const User = require('../../models/user/user');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const fs = require('fs');
const path = require('path');



async function pengajuanBarangController(req, res) {
    try {
        const { namaBarang, deskripsi, jumlah, harga, jenisPengajuan, status, tanggalPengajuan } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        console.log("1");
        const decodedToken = jwt.verify(token, config.jwtSecret);
        console.log("1");
        const pengaju = await User.findById(decodedToken.userId);
        console.log("1");
        const newPengajuan = new pengajuanBarang({
            pengaju: {
                id: pengaju._id,
                fullname: pengaju.fullname
            },
            gambar: req.files[0].filename,
            namaBarang,
            deskripsi,
            jumlah,
            harga,
            jenisPengajuan,
            status,
            tanggalPengajuan
        });
        console.log("1");
        console.log(newPengajuan);
        
        const pengajuan = await newPengajuan.save();
        
        res.status(200).json({ message: 'Pengajuan berhasil', pengajuan });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function editPengajuan(req, res) {
    try{
        const {namaBarang, deskripsi, harga, jumlah, jenisPengajuan} = req.body;
        const pengajuanId = req.params.pengajuanId;
        const token = req.headers.authorization?.split(' ')[1];

        const decodedToken = jwt.verify(token, config.jwtSecret);

        const pengajuan = await pengajuanBarang.findById(pengajuanId);

        if(!pengajuan){
            return res.status(400).json({message: "Data tidak ditemukan"})
        }

        //Rubah semua id menjadi string untuk membandingkan
        if(decodedToken.userId.toString() !== pengajuan.pengaju.id.toString()){
            return res.status(401).json({message: "Anda tidak memiliki akses"})
        }
        
       // Move file deletion logic here
       if (req.file) {
           if (pengajuan.gambar) {
               const filePath = path.join(__dirname,'/public/uploads/', pengajuan.gambar);
               if(fs.existsSync(filePath)) {
                   fs.unlinkSync(filePath);
               }
           }
           pengajuan.gambar=req.file.filename;
       }
        pengajuan.namaBarang = namaBarang;
        pengajuan.deskripsi = deskripsi;
        pengajuan.jumlah = jumlah;
        pengajuan.harga = harga;
        pengajuan.jenisPengajuan = jenisPengajuan;

        await pengajuan.save();
        return res.status(200).json({message: "Berhasil merubah data pengajuan barang", pengajuan});


    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Ada kesalahan dari server"});
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

async function getPengajuanById(req, res){
    try{
        const pengajuanId = req.params.pengajuanId;
        const pengajuan = await pengajuanBarang.findOne({_id: pengajuanId});
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }
        res.status(200).json(pengajuan);

    }catch(error){
        console.log(error)
        return res.status(200).json({message: "Tidak bisa mendapatkan Barangnya"})
    }
}

async function deletePengajuan(req, res){
    try{
        const pengajuanId = req.params.pengajuanId;
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, config.jwtSecret);
        // console.log(decodedToken)
        const pengajuan = await pengajuanBarang.findOne({_id: pengajuanId});
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        // ubah ke string terlebih dahulu
        if(decodedToken.userId.toString() !== pengajuan.pengaju.id.toString()){
            return res.status(401).json({message: "Anda tidak memiliki akses"})
        }
        if(pengajuan.gambar){
            const filePath = path.join(__dirname,'/public/uploads/', pengajuan.gambar);
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        // console.log(decodedToken.userId.toString())
        // console.log(pengajuan.pengaju.id.toString())

        await pengajuanBarang.deleteOne({_id: pengajuanId});
        res.status(200).json({message: "Berhasil menghapus data", pengajuan});

    }catch(error){
        console.log(error)
        return res.status(404).json({message: "Ada kesalahan dari server sehingga tidak bisa menghapus data"})
    }
}


module.exports = {
    pengajuanBarangController,
    editPengajuan,
    getPengajuan,
    getPengajuanById,
    deletePengajuan
};
