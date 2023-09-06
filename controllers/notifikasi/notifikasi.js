// const Notifikasi = require('../../models/notification/notification');
// const PengajuanBarang = require('../../models/pengajuan/pengajuan')



// async function createNotifikasi(req, res){
//     try{
//         const pengajuanId = req.params.pengajuanId;
//         const pengajuan = await PengajuanBarang.findOne({_id: pengajuanId});
//         if(!pengajuan){
//             return res.status(404).json({message : "Data tidak ditemukan"})
//         }

//         const userId = pengajuan.pengaju.id;

//         const newNotifikasi = new Notifikasi({
//             penerima: {
//                 id: userId,
//                 fullname: pengajuan.pengaju.fullname
//             },
//             judul: 'Update Pengajuan',
//             isiPesan: 'Hai ' + pengajuan.pengaju.fullname + ', ada update tentang pengajuan mu, saat ini update pengajuan mu ' + pengajuan.status,
//             tipe: 'Pengajuan',
//             status: pengajuan.status,
//         })

//         const notifikasi = await newNotifikasi.save();
//         res.status(200).json({message: "Berhasil menambahkan notifikasi", notifikasi})


//     } catch(error){
//         console.error(error);
//         return res.status(500).json({message: "Ada kesalahan server"})
//     }
// }
//  async function getNotifikasibyId(req, res){
//     try{
//         const notifikasiId = req.params.notifikasiId;
//         const notifikasi = await Notifikasi.findOne({_id: notifikasiId});
//         console.log(notifikasi)
//         res.status(200).json({message: "Berhasil mendapatkan notifikasi", notifikasi})

//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({message: "Ada kesalahan server"})
//         }
//     }
// module.exports = {
//     createNotifikasi,
//     getNotifikasibyId
// }