const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    penerima:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fullname: String,
    },
    judul:{
        type: String,
        required: true,  
    },
    isiPesan:{
        type: String,
        required: true,  
    },
    tipe:{
        type: String,
        required: true
        
    },
    tanggalDikirim:{
        type: Date,
        default: Date.now
    }

})

const Notifikasi = mongoose.model('Notifikasi', notificationSchema)

module.exports = Notifikasi