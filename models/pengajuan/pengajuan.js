const mongoose = require('mongoose');

const pengajuanBarangSchema = new mongoose.Schema({
    pengaju: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true     
        },
        fullname: String
    },
    
    gambar: [{
        type: String
    }],

    namaBarang: {
        type: String,
        required: true
    },

    deskripsi: {
        type: String,
        required: true
    },

    jumlah: {
        type: Number,
        required: true
    },

    harga: {
        type: Number,
        required: true,
    },


    jenisPengajuan: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [ 'proses', 'approved', 'rejected'],
        default: 'proses'
    },

    tanggalPengajuan: {
        type: Date,
        default: Date.now
    }
})

const PengajuanBarang = mongoose.model('PengajuanBarang', pengajuanBarangSchema);



module.exports = PengajuanBarang