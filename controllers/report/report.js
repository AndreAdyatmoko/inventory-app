const pengajuanBarang = require('../../models/pengajuan/pengajuan')

async function generalReport(req, res){
    try{
        const approvedPengajuan = await pengajuanBarang.find({status: 'approved'});

        let totalPengeluaran = 0

        for(let pengajuan of approvedPengajuan){
            totalPengeluaran += pengajuan.harga*pengajuan.jumlah
        }

        return res.status(200).json({totalPengeluaran})
    } catch(error){
        console.log(error)
        return res.status(404).json({message: "Ada kesalahan dari server sehingga tidak bisa mendapatkan data"})
    }
}

module.exports = {
    generalReport
}