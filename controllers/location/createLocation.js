const Lokasi = require('../../models/lokasi/lokasi');
const StockBarang = require('../../models/stock/stockBarang');

async function createLocation(req, res){
    try{
        const {name} = req.body;
        const newLocation = new Lokasi({
            name
        })
        const savedLocation = await newLocation.save();
        res.status(200).json({message: "Berhasi membuat lokasi ", savedLocation})

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Kesalahan saat membuat lokasi"})
    }
}

async function getStockByLokasi(req, res){
    try { 
        const { letakBarang } = req.body;
        const stockBarang = await StockBarang.find({ 'letakBarang.name': letakBarang })
        
        res.status(200).json({message: "Berhasil mengambil data", stockBarang});

    } catch(error){
        console.log(error)
        res.status(500).json({ message: "Ada kesalahan server" });
    }
}


async function updateLocationStock(req, res) {
    try {
        const { _id } = req.params;
        const { newLocation } = req.body;

        if (!newLocation) {
            return res.status(400).json({ message: 'Sesuaikan Lokasinya ya, Hanya ada |Lantai 1", "Lantai 2", "Lantai 3", "Lantai 4|' });
        }

        const updateStock = await StockBarang.findByIdAndUpdate(_id, { 'letakBarang.name': newLocation }, { new: true });

        if (!updateStock) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.status(200).json({ message: "Data berhasil diupdate", updateStock});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ada kesalahan server" });
    }
}

async function deleteStock(req, res){
    try{
        const { _id } = req.params; // ini untuk id barang yang akan dihapus
        const deleteStock = await StockBarang.deleteOne({_id});
        console.log(deleteStock);

        if(!deleteStock){
            return res.status(404).json({message: "Data tidak ditemukan"});
        }
        res.status(200).json({message: "Data berhasil dihapus", 
        deleteStock});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Ada kesalahan server"})
    }
}

async function movePenanggungJawab(req, res){
    try{
        const {_id } = req.params; // ini untuk id barang yang akan diupdate
        const { tanggungJawab } = req.body;
        const updatePenangungJawab = await StockBarang.findByIdAndUpdate(_id, { 'penanggungJawab': tanggungJawab }, { new: true });

        if(!updatePenangungJawab){
            return res.status(404).json({message: "Data tidak ditemukan"});
        }
        res.status(200).json({message: "Data berhasil diupdate", updatePenangungJawab});

    } catch(error){
        console.log(error)
        res.status(500).json({message: "Ada kesalahan server"})
    }
}

module.exports = {
    createLocation,
    getStockByLokasi,
    updateLocationStock,
    deleteStock,
    movePenanggungJawab
}