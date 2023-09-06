const mongoose = require('mongoose');

const lokasiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
})

const Lokasi = mongoose.model('Lokasi', lokasiSchema);


module.exports = Lokasi