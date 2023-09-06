const pengajuanBarang = require('../../models/pengajuan/pengajuan');
const Notifikasi = require('../../models/notification/notification');
const User = require('../../models/user/user');


async function getPengajuanProses(req, res){
    try {
        const pengajuan = await pengajuanBarang.find({ 'status': 'proses' });
        
        if(!pengajuan || pengajuan.length === 0){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }


        return res.status(200).json({message: "Ini adalah daftar pengajuan dengan status proses", pengajuan})

    } catch (error){
        console.log(error);
        return res.status(500).json({message : "Ada kesalahan server"})
    }
}

async function approvePengajuan(req, res){
    try {
        const pengjuanId = req.params.pengjuanId;

        const userRole = await User.findOne({role : 'HRD'});
        if(userRole.role !== 'HRD'){
            return res.status(401).json({message: "Anda tidak memiliki akses karena Anda bukan HRD"})
        }

        const pengajuan = await pengajuanBarang.findOne({_id: pengjuanId});

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

    } catch (error){
        console.log(error);
        return res.status(500).json({message : "Ada kesalahan server"})
    }
}

async function rejectedPengajuan(req, res){
    try{
        const pengjuanId = req.params.pengjuanId;
        const userRole = await User.findOne({role : 'HRD'});
        if(userRole.role !== 'HRD'){
            return res.status(401).json({message: "Anda tidak memiliki akses karena Anda bukan HRD"})
        }
        const pengajuan = await pengajuanBarang.findOne({_id: pengjuanId});
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        if(pengajuan.status === 'rejected'){
            return res.status(400).json({message: "Pengajuan sudah direject sebelumnya"})
        }

        pengajuan.status = 'rejected';
        await pengajuan.save();

        const notifikasi = new Notifikasi({
            penerima: {
                id: pengajuan.pengaju.id,
                fullname: pengajuan.pengaju.fullname
            },
            judul: 'Pengajuan Ditolak',
            isiPesan: 'Hai ' + pengajuan.pengaju.fullname + ', pengajuan mu untuk' + pengajuan.namaBarang + 'sudah direject',
            tipe: 'Pengajuan',
            status: 'rejected',
        })
        await notifikasi.save();
        return res.status(200).json({message: "Pengajuan berhasil direject"})

    } catch(error){
        console.log(error);
        return res.status(500).json({message : "Ada kesalahan server"})
    }
}


module.exports = {
    getPengajuanProses,
    approvePengajuan,
    rejectedPengajuan
}