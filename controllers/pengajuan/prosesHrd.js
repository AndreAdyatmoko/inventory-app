const pengajuanBarang = require('../../models/pengajuan/pengajuan');


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

        const pengajuan = await pengajuanBarang.findOne({_id: pengjuanId});

        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        pengajuan.status = 'approved';

        await pengajuan.save();
        return res.status(200).json({message: "Pengajuan berhasil diapprove", pengajuan})

    } catch (error){
        console.log(error);
        return res.status(500).json({message : "Ada kesalahan server"})
    }
}

async function rejectedPengajuan(req, res){
    try{
        const pengjuanId = req.params.pengjuanId;
        const pengajuan = await pengajuanBarang.findOne({_id: pengjuanId});
        console.log(pengajuan)
        if(!pengajuan){
            return res.status(404).json({message : "Data tidak ditemukan"})
        }

        pengajuan.status = 'rejected';
        await pengajuan.save();
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