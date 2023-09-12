const pengajuanBarang = require('../../models/pengajuan/pengajuan')
const Notifikasi = require('../../models/notification/notification')
const User = require('../../models/user/user')
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

async function getPengajuanFinance(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token tidak valid' });
        }
        const decodedToken = jwt.verify(token, config.jwtSecret);
        const userRole = await User.findOne({ _id: decodedToken.userId });
        if (!userRole || userRole.role !== 'Finance') {
            return res.status(401).json({ message: 'Anda tidak memiliki akses karena Anda bukan Finance' });
        }

        const pengajuan = await pengajuanBarang.find({ 'status': 'approved_HRD' });

        if (!pengajuan || pengajuan.length === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        return res.status(200).json({ message: "Ini adalah daftar pengajuan dengan status proses", pengajuan });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ada kesalahan pada server" });
    }
}

async function pengajuanApproveFinance(req, res){
    try{
        const pengajuanId = req.params.pengajuanId;

        const userRole = await User.findOne({role: 'Finance'})
        if(!userRole){
            return res.status(404).json({message: "Anda tidak memiliki akses karena Anda bukan Finance"})
        }

        const pengajuan = await pengajuanBarang.findOne({_id: pengajuanId});

        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        if(pengajuan.status === 'approved'){
            return res.status(400).json({message: "Pengajuan sudah diapprove sebelumnya"})
        }
        pengajuan.status = 'approved';

        await pengajuan.save();

        const notifikasi = new Notifikasi({
            penerima: {
                id: pengajuan.pengaju.id,
                fullname: pengajuan.pengaju.fullname
            },
            judul: 'Pengajuan Diterima',
            isiPesan: 'Hai ' + pengajuan.pengaju.fullname + ', pengajuan mu untuk ' + pengajuan.namaBarang + 'sudah diapprove',
            tipe: 'Pengajuan',
            status: 'approved',
        })

        await notifikasi.save();

        return res.status(200).json({message: "Pengajuan berhasil diapprove", pengajuan})

    }catch(error){
        console.log(error)
        return res.status(500).json({message : "Ada kesalahan pada server"})
    }
}

async function pengajuanRejectFinance(req, res){
    try{
        const pengajuanId = req.params.pengajuanId;
        const userRole = await User.findOne({role: 'Finance'})
        if(!userRole){
            return res.status(404).json({message: "Anda tidak memiliki akses karena Anda bukan Finance"})
        }

        const pengajuan = await pengajuanBarang.findOne({_id: pengajuanId});
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }
        if(pengajuan.status === 'rejected'){
            return res.status(400).json({message: "Pengajuan sudah direject sebelumnya"})
        }

        pengajuan.status = 'rejected';
        await pengajuan.save();

        const notification = new Notifikasi({
            penerima: {
                id: pengajuan.pengaju.id,
                fullname: pengajuan.pengaju.fullname
            },
            judul: 'Pengajuan Ditolak',
            isiPesan: 'Hai ' + pengajuan.pengaju.fullname + ', pengajuan mu untuk ' + pengajuan.namaBarang + 'sudah direject',
            tipe: 'Pengajuan',
            status: 'rejected',
        })

        notification.save();

        return res.status(200).json({message: "Pengajuan berhasil direject", pengajuan})

    } catch(error){
        console.log(error)
        return res.status(500).json({message : "Ada kesalahan pada server"})
    }
}


module.exports = {
    getPengajuanFinance,
    pengajuanApproveFinance,
    pengajuanRejectFinance
}