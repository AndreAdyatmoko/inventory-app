const mongoose = require('mongoose');

const lokasiSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4'],
        required: true,
    },
})

const Lokasi = mongoose.model('Lokasi', lokasiSchema);


module.exports = Lokasi