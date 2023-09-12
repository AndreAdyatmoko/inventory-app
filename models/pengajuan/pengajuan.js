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
        enum: ['diajukan', 'Review HRD', 'Approved HRD', 'Rejected HRD', 'Review Finance', 'Approved Finance', 'Rejected Finance', 'Approved HOD', 'Rejected HOD', 'Done'],
        default: 'diajukan'
    },

    tanggalPengajuan: {
        type: Date,
        default: Date.now
    }
});

const PengajuanBarang = mongoose.model('PengajuanBarang', pengajuanBarangSchema);

module.exports = PengajuanBarang;